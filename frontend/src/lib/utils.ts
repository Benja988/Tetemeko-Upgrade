// src/lib/utils.ts

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date into a readable string.
 * Example: "2025-08-16T12:34:56Z" -> "Aug 16, 2025"
 */
export function formatDate(date: string | Date): string {
  try {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return "Invalid date"
  }
}

