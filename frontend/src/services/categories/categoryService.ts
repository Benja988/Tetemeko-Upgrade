import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { Category, CategoryInput } from "@/interfaces/Category";
import { News } from "@/interfaces/News";

/* ---------------------- Toast Wrapper ---------------------- */
const withToast = async <T>(
  fn: () => Promise<T>,
  successMsg: string,
  errorMsg: string
): Promise<T | null> => {
  try {
    const result = await fn();
    toast.success(successMsg);
    return result;
  } catch (e: any) {
    toast.error(e?.message || errorMsg);
    return null;
  }
};

/* ---------------------- Category Services ---------------------- */

// ✅ Get all categories
export const getCategories = async (
  type?: string
): Promise<Category[]> => {
  try {
    const query = type ? `?type=${type}` : "";
    return await apiRequest<Category[]>(`/categories${query}`);
  } catch (e: any) {
    return [];
  }
};

// ✅ Get category by slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    return await apiRequest<Category>(`/categories/${slug}`);
  } catch (e: any) {
    toast.error(e?.message || "Failed to fetch category.");
    return null;
  }
};

// ✅ Create category
export const createCategory = async (
  data: CategoryInput
): Promise<Category | null> =>
  withToast(
    () => apiRequest<Category>("/categories", "POST", data),
    "Category created successfully.",
    "Failed to create category."
  );

// ✅ Update category
export const updateCategory = async (
  slug: string,
  data: Partial<Omit<Category, "slug">>
): Promise<Category | null> =>
  withToast(
    () => apiRequest<Category>(`/categories/${slug}`, "PUT", data),
    "Category updated successfully.",
    "Failed to update category."
  );

// ✅ Delete category
export const deleteCategory = async (slug: string): Promise<boolean> => {
  try {
    const result = await withToast(
      async () => {
        await apiRequest(`/categories/${slug}`, "DELETE");
        return true;
      },
      "Category deleted successfully.",
      "Failed to delete category."
    );
    return result ?? false;
  } catch (err) {
    console.error("❌ Delete failed", err);
    return false;
  }
};


