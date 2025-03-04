import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter  = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'BDT',
});