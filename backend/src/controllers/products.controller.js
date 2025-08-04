"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateProduct = exports.deleteProduct = exports.updateProduct = exports.getProductBySlug = exports.getAllProducts = exports.createProduct = void 0;
const Product_1 = require("../models/Product"); // adjust path as needed
const slugify_1 = __importDefault(require("slugify"));
const mongoose_1 = __importDefault(require("mongoose"));
// Create a new product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, images, price, discount, stock, category, tags, seller, status, isFeatured, } = req.body;
        const slug = (0, slugify_1.default)(title, { lower: true, strict: true });
        const product = yield Product_1.Product.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create product', error });
    }
});
exports.createProduct = createProduct;
// Get all products (with optional filters)
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = {};
        if (req.query.category)
            filters.category = req.query.category;
        if (req.query.status)
            filters.status = req.query.status;
        if (req.query.seller)
            filters.seller = req.query.seller;
        const products = yield Product_1.Product.find(filters).populate('category').populate('seller');
        res.status(200).json({ success: true, products });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch products', error });
    }
});
exports.getAllProducts = getAllProducts;
// Get a single product by slug
const getProductBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const product = yield Product_1.Product.findOne({ slug }).populate('category').populate('seller');
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch product', error });
    }
});
exports.getProductBySlug = getProductBySlug;
// Update product by ID
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: 'Invalid product ID' });
            return;
        }
        const updates = req.body;
        if (updates.title) {
            updates.slug = (0, slugify_1.default)(updates.title, { lower: true, strict: true });
        }
        const updated = yield Product_1.Product.findByIdAndUpdate(id, updates, { new: true });
        if (!updated) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, product: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update product', error });
    }
});
exports.updateProduct = updateProduct;
// Delete product by ID
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: 'Invalid product ID' });
            return;
        }
        const deleted = yield Product_1.Product.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete product', error });
    }
});
exports.deleteProduct = deleteProduct;
// Add or update a product rating
const rateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { userId, rating, comment } = req.body;
        const product = yield Product_1.Product.findById(productId);
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        const existingRating = product.ratings.find(r => r.user.toString() === userId);
        if (existingRating) {
            existingRating.rating = rating;
            existingRating.comment = comment;
        }
        else {
            product.ratings.push({ user: userId, rating, comment });
        }
        product.averageRating =
            product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length;
        yield product.save();
        res.status(200).json({ success: true, product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to rate product', error });
    }
});
exports.rateProduct = rateProduct;
