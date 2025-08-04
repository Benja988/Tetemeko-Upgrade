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
exports.deleteCategory = exports.updateCategory = exports.getCategoryBySlug = exports.getAllCategories = exports.createCategory = void 0;
const Category_1 = require("../models/Category");
const slugify_1 = __importDefault(require("slugify"));
// import { AuthenticatedRequest } from "../middlewares/auth.middleware";
// CREATE CATEGORY
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, categoryType, description, seoTitle, seoDescription } = req.body;
        if (!name || !categoryType) {
            res.status(400).json({ error: "Name and categoryType are required." });
            return;
        }
        const slug = (0, slugify_1.default)(name, { lower: true });
        const existing = yield Category_1.Category.findOne({ slug });
        if (existing) {
            res.status(400).json({ error: "Category with this name already exists." });
            return;
        }
        const category = new Category_1.Category({
            name,
            slug,
            categoryType,
            description,
            seoTitle,
            seoDescription,
            createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        });
        yield category.save();
        res.status(201).json({ message: "Category created successfully", category });
    }
    catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createCategory = createCategory;
// GET ALL CATEGORIES
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query;
        const filter = {};
        if (type)
            filter.categoryType = type;
        const categories = yield Category_1.Category.find(filter).sort({ createdAt: -1 });
        res.status(200).json(categories);
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllCategories = getAllCategories;
// GET CATEGORY BY SLUG
const getCategoryBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const category = yield Category_1.Category.findOne({ slug });
        if (!category) {
            res.status(404).json({ error: "Category not found" });
            return;
        }
        res.status(200).json(category);
    }
    catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getCategoryBySlug = getCategoryBySlug;
// UPDATE CATEGORY
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const updates = req.body;
        if (updates.name) {
            updates.slug = (0, slugify_1.default)(updates.name, { lower: true });
        }
        const updatedCategory = yield Category_1.Category.findOneAndUpdate({ slug }, { $set: updates }, { new: true });
        if (!updatedCategory) {
            res.status(404).json({ error: "Category not found" });
            return;
        }
        res.status(200).json({ message: "Category updated", category: updatedCategory });
    }
    catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateCategory = updateCategory;
// DELETE CATEGORY
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const deleted = yield Category_1.Category.findOneAndDelete({ slug });
        if (!deleted) {
            res.status(404).json({ error: "Category not found" });
            return;
        }
        res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteCategory = deleteCategory;
