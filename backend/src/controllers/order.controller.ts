import { Request, Response } from 'express';
import { Order } from '../models/Order'; // Adjust the path based on your project structure
import mongoose from 'mongoose';

// Create a new order
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      products,
      totalAmount,
      discountAmount,
      finalAmount,
      couponCode,
      shippingAddress,
      paymentMethod,
      transactionId,
    } = req.body;

    const userId = req.user?.id; // Make sure you're attaching user in authenticateJWT middleware

    const newOrder = new Order({
      user: userId,
      products,
      totalAmount,
      discountAmount,
      finalAmount,
      couponCode,
      shippingAddress,
      paymentMethod,
      transactionId,
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// Get all orders (admin)
export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'title price');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Get orders for current user
export const getMyOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const orders = await Order.find({ user: userId }).populate('products.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your orders', error });
  }
};

// Get order by ID
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('products.product');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = new Date();

    const updated = await order.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};

// Delete order (admin)
export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};
