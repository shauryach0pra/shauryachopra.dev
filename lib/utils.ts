import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * A utility function to conditionally join class names and merge Tailwind CSS classes.
 * @param {...ClassValue[]} inputs - A list of class names or objects with class names as keys and booleans as values.
 * @returns {string} The merged and optimized class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}