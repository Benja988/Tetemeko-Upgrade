import { Request, Response } from "express";
import { Category } from "../models/Category";
import slugify from "slugify";
// import { AuthenticatedRequest } from "../middlewares/auth.middleware";

// CREATE CATEGORY
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, categoryType, description, seoTitle, seoDescription } = req.body;

    if (!name || !categoryType) {
      res.status(400).json({ error: "Name and categoryType are required." });
      return;
    }

    const slug = slugify(name, { lower: true });

    const existing = await Category.findOne({ slug });
    if (existing) {
      res.status(400).json({ error: "Category with this name already exists." });
      return;
    }

    const category = new Category({
      name,
      slug,
      categoryType,
      description,
      seoTitle,
      seoDescription,
      createdBy: req.user?.id,
    });

    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET ALL CATEGORIES
export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type } = req.query;

    const filter: any = {};
    if (type) filter.categoryType = type;

    const categories = await Category.find(filter).sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET CATEGORY BY SLUG
export const getCategoryBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;
    const updates = req.body;

    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { slug },
      { $set: updates },
      { new: true }
    );

    if (!updatedCategory) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    res.status(200).json({ message: "Category updated", category: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    const deleted = await Category.findOneAndDelete({ slug });
    if (!deleted) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
