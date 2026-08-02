import { addDays, format, getDay, startOfYear } from "date-fns";
import { ContributionLevel, LevelDefinitionsMap, ThemeOption } from "./types";

export const DEFAULT_LEVEL_DEFS: LevelDefinitionsMap = {
  0: { label: "No activity", count: 0 },
  1: { label: "Low (1 unit)", count: 1 },
  2: { label: "Medium (3 units)", count: 3 },
  3: { label: "High (6 units)", count: 6 },
  4: { label: "Max (10 units)", count: 10 },
};

export const THEMES: Record<string, ThemeOption> = {
  github: {
    id: "github",
    name: "GitHub Classic",
    levels: ["bg-[#161b22]", "bg-[#0e4429]", "bg-[#006d32]", "bg-[#26a641]", "bg-[#39d353]"],
    borderLevels: [
      "border-[#272c34]",
      "border-[#0e4429]",
      "border-[#006d32]",
      "border-[#26a641]",
      "border-[#39d353]",
    ],
  },
  emerald: {
    id: "emerald",
    name: "Emerald Glow",
    levels: [
      "bg-slate-900",
      "bg-emerald-950",
      "bg-emerald-800",
      "bg-emerald-600",
      "bg-emerald-400",
    ],
    borderLevels: [
      "border-slate-800",
      "border-emerald-900",
      "border-emerald-700",
      "border-emerald-500",
      "border-emerald-300",
    ],
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyber Neon",
    levels: ["bg-zinc-900", "bg-fuchsia-950", "bg-fuchsia-800", "bg-fuchsia-600", "bg-pink-400"],
    borderLevels: [
      "border-zinc-800",
      "border-fuchsia-900",
      "border-fuchsia-700",
      "border-fuchsia-500",
      "border-pink-300",
    ],
  },
  ocean: {
    id: "ocean",
    name: "Oceanic Blue",
    levels: ["bg-slate-900", "bg-sky-950", "bg-sky-800", "bg-sky-600", "bg-sky-400"],
    borderLevels: [
      "border-slate-800",
      "border-sky-900",
      "border-sky-700",
      "border-sky-500",
      "border-sky-300",
    ],
  },
  solar: {
    id: "solar",
    name: "Solar Amber",
    levels: ["bg-stone-900", "bg-amber-950", "bg-amber-800", "bg-amber-600", "bg-amber-400"],
    borderLevels: [
      "border-stone-800",
      "border-amber-900",
      "border-amber-700",
      "border-amber-500",
      "border-amber-300",
    ],
  },
};

export function generateSampleContributions(
  year: number = 2026
): Record<string, ContributionLevel> {
  const data: Record<string, ContributionLevel> = {};
  const yearStart = startOfYear(new Date(year, 0, 1));
  const cutoffDate = new Date(year, 7, 2);

  let currentDate = yearStart;
  let seed = Math.floor(Math.random() * 1000) + 1;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (currentDate <= cutoffDate) {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    const rand = pseudoRandom();
    const dayOfWeek = getDay(currentDate);

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      if (rand > 0.65) data[dateStr] = 4;
      else if (rand > 0.45) data[dateStr] = 3;
      else if (rand > 0.3) data[dateStr] = 2;
      else if (rand > 0.15) data[dateStr] = 1;
    } else {
      if (rand > 0.8) data[dateStr] = 3;
      else if (rand > 0.6) data[dateStr] = 2;
      else if (rand > 0.4) data[dateStr] = 1;
    }
    currentDate = addDays(currentDate, 1);
  }
  return data;
}
