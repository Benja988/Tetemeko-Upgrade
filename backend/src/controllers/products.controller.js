import mongoose from 'mongoose';
import { Product, ProductStatus } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { User, UserRole } from '../models/User.js';
import slugify from 'slugify';
import { sanitize } from 'sanitize-html';

// Custom error class for better error handling
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Predefined valid product statuses
const VALID_STATUSES = Object.values(ProductStatus);
const ITEMS_PER_PAGE = 20;

// Check permissions for admin or manager actions
const checkPermissions = (user) => {
  if (!user || ![UserRole.ADMIN, UserRole.MANAGER].includes(user.role)) {
    throw new APIError('Unauthorized: Only admins or managers can perform this action', 403);
  }
};

// Validate product fields
const validateProductFields = ({ price, discount, stock, status }) => {
  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    throw new APIError('Price must be a non-negative number', 400);
  }
  if (discount !== undefined && (typeof discount !== 'number' || discount < 0 || discount > 100)) {
    throw new APIError('Discount must be a number between 0 and 100', 400);
  }
  if (stock !== undefined && (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock))) {
    throw new APIError('Stock must be a non-negative integer', 400);
  }
  if (status && !VALID_STATUSES.includes(status)) {
    throw new APIError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
  }
};

/**
 * Create a new product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createProduct = async (req, res) => {
  try {
    checkPermissions(req.user);

    const { title, description, images, price, discount, stock, category, tags, seller, status, isFeatured } = req.body;

    if (!title || !price || !category || !seller) {
      throw new APIError('Missing required fields: title, price, category, seller', 400);
    }

    if (!mongoose.Types.ObjectId.isValid(category) || !mongoose.Types.ObjectId.isValid(seller)) {
      throw new APIError('Invalid category or seller ID', 400);
    }

    validateProductFields({ price, discount, stock, status });

    const sanitizedData = {
      title: sanitize(title, { allowedTags: [] }),
      description: description ? sanitize(description, { allowedTags: ['p', 'strong', 'em'] }) : '',
      images: images ? images.map(img => sanitize(img, { allowedTags: [] })) : [],
      price,
      discount,
      stock,
      category: sanitize(category, { allowedTags: [] }),
      tags: tags ? tags.map(tag => sanitize(tag, { allowedTags: [] })) : [],
      seller: sanitize(seller, { allowedTags: [] }),
      status: status || ProductStatus.ACTIVE,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false
    };

    // Verify category and seller exist
    const [categoryDoc, sellerDoc] = await Promise.all([
      Category.findOne({ _id: sanitizedData.category, isActive: true }),
      User.findOne({ _id: sanitizedData.seller, isActive: true })
    ]);

    if (!categoryDoc) {
      throw new APIError('Active category not found', 404);
    }
    if (!sellerDoc) {
      throw new APIError('Active seller not found', 404);
    }

    let slug = slugify(sanitizedData.title, { lower: true, strict: true });
    let slugCounter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${slugify(sanitizedData.title, { lower: true, strict: true })}-${slugCounter}`;
      slugCounter++;
    }

    const product = await Product.create({
      ...sanitizedData,
      slug,
      createdBy: req.user?.id
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name')
      .populate('seller', 'name email')
      .lean();

    return res.status(201).json({ message: 'Product created successfully', product: populatedProduct });
  } catch (error) {
    console.error('Create product error:', { error: error.message, body: req.body });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to create product' });
  }
};

/**
 * Get all products with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, category, status, seller, minPrice, maxPrice, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = { isActive: true };

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        throw new APIError('Invalid category ID', 400);
      }
      filter.category = sanitize(category, { allowedTags: [] });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      throw new APIError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
    }
    if (status) filter.status = sanitize(status, { allowedTags: [] });

    if (seller) {
      if (!mongoose.Types.ObjectId.isValid(seller)) {
        throw new APIError('Invalid seller ID', 400);
      }
      filter.seller = sanitize(seller, { allowedTags: [] });
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      const sanitizedSearch = sanitize(search, { allowedTags: [] });
      filter.$or = [
        { title: { $regex: sanitizedSearch, $options: 'i' } },
        { description: { $regex: sanitizedSearch, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * ITEMS_PER_PAGE;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .populate('seller', 'name email')
        .select('-__v')
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .sort(sort)
        .lean(),
      Product.countDocuments(filter)
    ]);

    return res.status(200).json({
      products,
      pagination: {
        page: Number(page),
        limit: ITEMS_PER_PAGE,
        total,
        pages: Math.ceil(total / ITEMS_PER_PAGE)
      }
    });
  } catch (error) {
    console.error('Get products error:', { error: error.message, query: req.query });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to fetch products' });
  }
};

/**
 * Get a single product by slug
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const sanitizedSlug = sanitize(slug, { allowedTags: [] });

    const product = await Product.findOne({ slug: sanitizedSlug, isActive: true })
      .populate('category', 'name')
      .populate('seller', 'name email')
      .select('-__v')
      .lean();

    if (!product) {
      throw new APIError('Product not found', 404);
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error('Get product error:', { error: error.message, slug: req.params.slug });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to fetch product' });
  }
};

/**
 * Update product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateProduct = async (req, res) => {
  try {
    checkPermissions(req.user);

    const { id } = req.params;
    const { title, description, images, price, discount, stock, category, tags, seller, status, isFeatured } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new APIError('Invalid product ID', 400);
    }

    validateProductFields({ price, discount, stock, status });

    const sanitizedData = {
      title: title ? sanitize(title, { allowedTags: [] }) : undefined,
      description: description ? sanitize(description, { allowedTags: ['p', 'strong', 'em'] }) : undefined,
      images: images ? images.map(img => sanitize(img, { allowedTags: [] })) : undefined,
      price,
      discount,
      stock,
      category: category ? sanitize(category, { allowedTags: [] }) : undefined,
      tags: tags ? tags.map(tag => sanitize(tag, { allowedTags: [] })) : undefined,
      seller: seller ? sanitize(seller, { allowedTags: [] }) : undefined,
      status,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined
    };

    if (sanitizedData.category && !mongoose.Types.ObjectId.isValid(sanitizedData.category)) {
      throw new APIError('Invalid category ID', 400);
    }

    if (sanitizedData.seller && !mongoose.Types.ObjectId.isValid(sanitizedData.seller)) {
      throw new APIError('Invalid seller ID', 400);
    }

    if (sanitizedData.category) {
      const categoryDoc = await Category.findOne({ _id: sanitizedData.category, isActive: true });
      if (!categoryDoc) {
        throw new APIError('Active category not found', 404);
      }
    }

    if (sanitizedData.seller) {
      const sellerDoc = await User.findOne({ _id: sanitizedData.seller, isActive: true });
      if (!sellerDoc) {
        throw new APIError('Active seller not found', 404);
      }
    }

    let slug = undefined;
    if (sanitizedData.title) {
      slug = slugify(sanitizedData.title, { lower: true, strict: true });
      let slugCounter = 1;
      while (await Product.findOne({ slug, _id: { $ne: id } })) {
        slug = `${slugify(sanitizedData.title, { lower: true, strict: true })}-${slugCounter}`;
        slugCounter++;
      }
    }

    const updates = Object.fromEntries(
      Object.entries({ ...sanitizedData, slug }).filter(([_, v]) => v !== undefined)
    );

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, isActive: true },
      { ...updates, updatedBy: req.user?.id },
      { new: true, runValidators: true }
    )
      .populate('category', 'name')
      .populate('seller', 'name email')
      .select('-__v');

    if (!updatedProduct) {
      throw new APIError('Product not found', 404);
    }

    return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', { error: error.message, productId: req.params.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to update product' });
  }
};

/**
 * Delete product by ID (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteProduct = async (req, res) => {
  try {
    checkPermissions(req.user);

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new APIError('Invalid product ID', 400);
    }

    const deletedProduct = await Product.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false, deletedBy: req.user?.id, deletedAt: new Date() },
      { new: true }
    );

    if (!deletedProduct) {
      throw new APIError('Product not found', 404);
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', { error: error.message, productId: req.params.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to delete product' });
  }
};

/**
 * Add or update a product rating
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const rateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new APIError('Invalid product or user ID', 400);
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      throw new APIError('Rating must be a number between 1 and 5', 400);
    }

    const sanitizedComment = comment ? sanitize(comment, { allowedTags: ['p', 'strong', 'em'] }) : undefined;

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      throw new APIError('Product not found', 404);
    }

    const user = await User.findOne({ _id: userId, isActive: true });
    if (!user) {
      throw new APIError('User not found', 404);
    }

    const existingRating = product.ratings.find(r => r.user.toString() === userId);
    if (existingRating) {
      existingRating.rating = rating;
      if (sanitizedComment) existingRating.comment = sanitizedComment;
    } else {
      product.ratings.push({ user: userId, rating, comment: sanitizedComment });
    }

    product.averageRating = product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length;
    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name')
      .populate('seller', 'name email')
      .select('-__v')
      .lean();

    return res.status(200).json({ message: 'Product rated successfully', product: populatedProduct });
  } catch (error) {
    console.error('Rate product error:', { error: error.message, productId: req.params.productId });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Failed to rate product' });
  }
};