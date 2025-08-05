import mongoose from 'mongoose';
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User, UserRole } from '../models/User.js';
import { sanitize } from 'sanitize-html';
import logger from '../utils/logger.js';

// Custom error class for better error handling
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Predefined valid values
const VALID_METHODS = Object.values(PaymentMethod);
const VALID_ORDER_STATUSES = Object.values(OrderStatus);
const VALID_PAYMENT_STATUSES = Object.values(PaymentStatus);
const ITEMS_PER_PAGE = 20;

// Check permissions for admin or manager actions
const checkAdminPermissions = (user) => {
  if (!user || ![UserRole.ADMIN, UserRole.MANAGER].includes(user.role)) {
    throw new APIError('Unauthorized: Only admins or managers can perform this action', 403);
  }
};

// Validate order fields
const validateOrderFields = ({ products, totalAmount, discountAmount, finalAmount, paymentMethod, transactionId, couponCode, shippingAddress, orderStatus, paymentStatus }) => {
  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new APIError('Products array is required and must not be empty', 400);
  }
  if (products.some(p => !mongoose.isValidObjectId(p.product) || typeof p.quantity !== 'number' || p.quantity <= 0)) {
    throw new APIError('Each product must have a valid ID and positive quantity', 400);
  }
  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    throw new APIError('Total amount must be a positive number', 400);
  }
  if (discountAmount !== undefined && (typeof discountAmount !== 'number' || discountAmount < 0)) {
    throw new APIError('Discount amount must be a non-negative number', 400);
  }
  if (typeof finalAmount !== 'number' || finalAmount <= 0) {
    throw new APIError('Final amount must be a positive number', 400);
  }
  if (paymentMethod && !VALID_METHODS.includes(paymentMethod)) {
    throw new APIError(`Invalid payment method. Must be one of: ${VALID_METHODS.join(', ')}`, 400);
  }
  if (transactionId && typeof transactionId !== 'string') {
    throw new APIError('Transaction ID must be a string', 400);
  }
  if (couponCode && typeof couponCode !== 'string') {
    throw new APIError('Coupon code must be a string', 400);
  }
  if (!shippingAddress || typeof shippingAddress !== 'object') {
    throw new APIError('Shipping address is required and must be an object', 400);
  }
  if (orderStatus && !VALID_ORDER_STATUSES.includes(orderStatus)) {
    throw new APIError(`Invalid order status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}`, 400);
  }
  if (paymentStatus && !VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
    throw new APIError(`Invalid payment status. Must be one of: ${VALID_PAYMENT_STATUSES.join(', ')}`, 400);
  }
};

/**
 * Create a new order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createOrder = async (req, res) => {
  try {
    if (!req.user?.id) {
      throw new APIError('Unauthorized', 401);
    }

    const { products, totalAmount, discountAmount, finalAmount, couponCode, shippingAddress, paymentMethod, transactionId } = req.body;

    validateOrderFields({ products, totalAmount, discountAmount, finalAmount, couponCode, shippingAddress, paymentMethod, transactionId });

    const sanitizedData = {
      products: products.map(p => ({
        product: sanitize(p.product, { allowedTags: [] }),
        quantity: p.quantity
      })),
      totalAmount,
      discountAmount: discountAmount || 0,
      finalAmount,
      couponCode: couponCode ? sanitize(couponCode, { allowedTags: [] }) : undefined,
      shippingAddress: {
        street: sanitize(shippingAddress.street, { allowedTags: [] }),
        city: sanitize(shippingAddress.city, { allowedTags: [] }),
        state: sanitize(shippingAddress.state, { allowedTags: [] }),
        country: sanitize(shippingAddress.country, { allowedTags: [] }),
        postalCode: sanitize(shippingAddress.postalCode, { allowedTags: [] })
      },
      paymentMethod: paymentMethod ? sanitize(paymentMethod, { allowedTags: [] }) : undefined,
      transactionId: transactionId ? sanitize(transactionId, { allowedTags: [] }) : undefined
    };

    // Verify products exist and are active
    const productIds = sanitizedData.products.map(p => p.product);
    const productsExist = await Product.find({ _id: { $in: productIds }, isActive: true }).select('_id price');
    if (productsExist.length !== productIds.length) {
      throw new APIError('One or more products not found or inactive', 404);
    }

    // Verify totalAmount and finalAmount
    const calculatedTotal = sanitizedData.products.reduce((sum, p) => {
      const product = productsExist.find(prod => prod._id.toString() === p.product);
      return sum + (product?.price || 0) * p.quantity;
    }, 0);
    if (Math.abs(calculatedTotal - sanitizedData.totalAmount) > 0.01) {
      throw new APIError('Total amount does not match product prices', 400);
    }
    if (sanitizedData.finalAmount !== sanitizedData.totalAmount - (sanitizedData.discountAmount || 0)) {
      throw new APIError('Final amount does not match total amount minus discount', 400);
    }

    const newOrder = await Order.create({
      user: req.user.id,
      ...sanitizedData,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
      createdBy: req.user.id,
      isActive: true
    });

    const populatedOrder = await Order.findById(newOrder._id)
      .populate('user', 'name email')
      .populate('products.product', 'title price')
      .select('-__v')
      .lean();

    logger.info({
      message: 'Order created',
      orderId: newOrder._id,
      userId: req.user.id
    });

    return res.status(201).json({ message: 'Order created successfully', order: populatedOrder });
  } catch (error) {
    logger.error('Create order error:', { error: error.message, body: req.body, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Error creating order' });
  }
};

/**
 * Get all orders (admin)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllOrders = async (req, res) => {
  try {
    checkAdminPermissions(req.user);

    const { page = 1, user, orderStatus, paymentStatus, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = { isActive: true };

    if (user) {
      if (!mongoose.isValidObjectId(user)) {
        throw new APIError('Invalid user ID', 400);
      }
      filter.user = sanitize(user, { allowedTags: [] });
    }

    if (orderStatus && !VALID_ORDER_STATUSES.includes(orderStatus)) {
      throw new APIError(`Invalid order status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}`, 400);
    }
    if (orderStatus) filter.orderStatus = sanitize(orderStatus, { allowedTags: [] });

    if (paymentStatus && !VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
      throw new APIError(`Invalid payment status. Must be one of: ${VALID_PAYMENT_STATUSES.join(', ')}`, 400);
    }
    if (paymentStatus) filter.paymentStatus = sanitize(paymentStatus, { allowedTags: [] });

    const pageNum = Number(page);
    const skip = (pageNum - 1) * ITEMS_PER_PAGE;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .populate('products.product', 'title price')
        .select('-__v')
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .sort(sort)
        .lean(),
      Order.countDocuments(filter)
    ]);

    return res.status(200).json({
      orders,
      pagination: {
        page: pageNum,
        limit: ITEMS_PER_PAGE,
        total,
        pages: Math.ceil(total / ITEMS_PER_PAGE)
      }
    });
  } catch (error) {
    logger.error('Get orders error:', { error: error.message, query: req.query, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Error fetching orders' });
  }
};

/**
 * Get orders for current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user?.id) {
      throw new APIError('Unauthorized', 401);
    }

    const { page = 1, orderStatus, paymentStatus, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = { user: req.user.id, isActive: true };

    if (orderStatus && !VALID_ORDER_STATUSES.includes(orderStatus)) {
      throw new APIError(`Invalid order status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}`, 400);
    }
    if (orderStatus) filter.orderStatus = sanitize(orderStatus, { allowedTags: [] });

    if (paymentStatus && !VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
      throw new APIError(`Invalid payment status. Must be one of: ${VALID_PAYMENT_STATUSES.join(', ')}`, 400);
    }
    if (paymentStatus) filter.paymentStatus = sanitize(paymentStatus, { allowedTags: [] });

    const pageNum = Number(page);
    const skip = (pageNum - 1) * ITEMS_PER_PAGE;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('products.product', 'title price')
        .select('-__v')
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .sort(sort)
        .lean(),
      Order.countDocuments(filter)
    ]);

    return res.status(200).json({
      orders,
      pagination: {
        page: pageNum,
        limit: ITEMS_PER_PAGE,
        total,
        pages: Math.ceil(total / ITEMS_PER_PAGE)
      }
    });
  } catch (error) {
    logger.error('Get my orders error:', { error: error.message, query: req.query, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Error fetching your orders' });
  }
};

/**
 * Get order by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getOrderById = async (req, res) => {
  try {
    if (!req.user?.id) {
      throw new APIError('Unauthorized', 401);
    }

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid order ID', 400);
    }

    const order = await Order.findOne({ _id: id, isActive: true })
      .populate('user', 'name email')
      .populate('products.product', 'title price')
      .select('-__v')
      .lean();

    if (!order) {
      throw new APIError('Order not found', 404);
    }

    // Only owner or admin/manager can view order
    if (order.user.toString() !== req.user.id && ![UserRole.ADMIN, UserRole.MANAGER].includes(req.user.role)) {
      throw new APIError('Forbidden: You do not have permission to view this order', 403);
    }

    return res.status(200).json({ order });
  } catch (error) {
    logger.error('Get order error:', { error: error.message, orderId: req.params.id, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Error fetching order' });
  }
};

/**
 * Update order status (admin)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateOrderStatus = async (req, res) => {
  try {
    checkAdminPermissions(req.user);

    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid order ID', 400);
    }

    if (!orderStatus && !paymentStatus) {
      throw new APIError('At least one of orderStatus or paymentStatus is required', 400);
    }

    validateOrderFields({ orderStatus, paymentStatus });

    const sanitizedData = {
      orderStatus: orderStatus ? sanitize(orderStatus, { allowedTags: [] }) : undefined,
      paymentStatus: paymentStatus ? sanitize(paymentStatus, { allowedTags: [] }) : undefined
    };

    const updates = Object.fromEntries(
      Object.entries(sanitizedData).filter(([_, v]) => v !== undefined)
    );

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, isActive: true },
      { ...updates, updatedBy: req.user?.id, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('products.product', 'title price')
      .select('-__v');

    if (!updatedOrder) {
      throw new APIError('Order not found', 404);
    }

    logger.info({
      message: 'Order status updated',
      orderId: id,
      orderStatus: sanitizedData.orderStatus,
      paymentStatus: sanitizedData.paymentStatus,
      userId: req.user?.id
    });

    return res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    logger.error('Update order status error:', { error: error.message, orderId: req.params.id, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Error updating order' });
  }
};

/**
 * Delete order (admin)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteOrder = async (req, res) => {
  try {
    checkAdminPermissions(req.user);

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw new APIError('Invalid order ID', 400);
    }

    const deletedOrder = await Order.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false, deletedBy: req.user?.id, deletedAt: new Date() },
      { new: true }
    );

    if (!deletedOrder) {
      throw new APIError('Order not found', 404);
    }

    logger.info({
      message: 'Order deleted',
      orderId: id,
      userId: req.user?.id
    });

    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    logger.error('Delete order error:', { error: error.message, orderId: req.params.id, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Error deleting order' });
  }
};