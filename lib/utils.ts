import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateWordCount(text: string): number {
  if (!text || !text.trim()) return 0;
  // Remove markdown headers, code blocks, html tags for accurate word count
  const cleanText = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/#+\s+/g, "")
    .replace(/<[^>]*>/g, "")
    .trim();
  return cleanText.split(/\s+/).filter(Boolean).length;
}

export function extractTags(text: string): string[] {
  if (!text) return [];
  const tagRegex = /#([a-zA-Z0-9_-]+)/g;
  const matches = text.match(tagRegex);
  if (!matches) return [];
  return Array.from(new Set(matches.map((tag) => tag.substring(1).toLowerCase())));
}
