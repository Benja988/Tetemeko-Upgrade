// utils/slugify.ts
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')   // Replace non-alphanumeric with hyphen
    .replace(/(^-|-$)+/g, '');     // Remove starting/ending hyphens
