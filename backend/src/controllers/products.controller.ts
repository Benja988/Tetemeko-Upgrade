import { Request, Response } from 'express';
import { Product } from '../models/Product'; // adjust path as needed
import slugify from 'slugify';
import mongoose from 'mongoose';

// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      images,
      price,
      discount,
      stock,
      category,
      tags,
      seller,
      status,
      isFeatured,
    } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    const product = await Product.create({
      title,
      slug,
      description,
      images,
      price,
      discount,
      stock,
      category,
      tags,
      seller,
      status,
      isFeatured,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product', error });
  }
};

// Get all products (with optional filters)
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: any = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.seller) filters.seller = req.query.seller;

    const products = await Product.find(filters).populate('category').populate('seller');
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error });
  }
};

// Get a single product by slug
export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug }).populate('category').populate('seller');

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product', error });
  }
};

// Update product by ID
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid product ID' });
      return;
    }

    const updates = req.body;

    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    const updated = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product', error });
  }
};

// Delete product by ID
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid product ID' });
      return;
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product', error });
  }
};

// Add or update a product rating
export const rateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { userId, rating, comment } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const existingRating = product.ratings.find(r => r.user.toString() === userId);

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
    } else {
      product.ratings.push({ user: userId, rating, comment });
    }

    product.averageRating =
      product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length;

    await product.save();

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to rate product', error });
  }
};
