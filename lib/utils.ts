import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date, short = false): string {
  const options: Intl.DateTimeFormatOptions = short
    ? { day: "numeric", month: "short" }
    : { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }

  return new Intl.DateTimeFormat("fr-FR", options).format(new Date(date))
}
