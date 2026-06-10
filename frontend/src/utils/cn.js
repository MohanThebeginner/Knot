import { clsx } from 'clsx'

/**
 * Merge class names conditionally.
 * Thin wrapper around clsx — keeps imports clean across the codebase.
 */
export function cn(...inputs) {
  return clsx(...inputs)
}
