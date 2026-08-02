"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  format,
  startOfYear,
  eachDayOfInterval,
  getDay,
  startOfWeek,
  addDays,
  isSameYear,
} from "date-fns";
import {
  CalendarBlankIcon,
  GearSixIcon,
  CaretDownIcon,
  ArrowCounterClockwiseIcon,
  ShuffleIcon,
  TrashIcon,
  CheckIcon,
  InfoIcon,
  SparkleIcon,
} from "@phosphor-icons/react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface LevelDefinition {
  label: string;
  count: number;
}

export type LevelDefinitionsMap = Record<ContributionLevel, LevelDefinition>;

export const DEFAULT_LEVEL_DEFS: LevelDefinitionsMap = {
  0: { label: "No activity", count: 0 },
  1: { label: "Low (1 unit)", count: 1 },
  2: { label: "Medium (3 units)", count: 3 },
  3: { label: "High (6 units)", count: 6 },
  4: { label: "Max (10 units)", count: 10 },
};

export interface ThemeOption {
  id: string;
  name: string;
  levels: [string, string, string, string, string];
  borderLevels: [string, string, string, string, string];
}

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

export interface Tracker {
  id: string;
  title: string;
  unitName: string;
  colorTheme: string;
  levelDefs: LevelDefinitionsMap;
  contributions: Record<string, ContributionLevel>;
}

interface HeatmapGridProps {
  tracker: Tracker;
  onUpdateTracker: (updated: Tracker) => void;
  onDeleteTracker?: (id: string) => void;
  year?: number;
}

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

export function HeatmapGrid({
  tracker,
  onUpdateTracker,
  onDeleteTracker,
  year = 2026,
}: HeatmapGridProps) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [showSettingsOpen, setShowSettingsOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [hoveredCell, setHoveredCell] = useState<{
    dateStr: string;
    formattedDate: string;
    level: ContributionLevel;
    definition: LevelDefinition;
    x: number;
    y: number;
  } | null>(null);

  // Generate week columns for year 2026
  const { weeks, monthHeaders } = useMemo(() => {
    const Jan1 = new Date(year, 0, 1);
    const Dec31 = new Date(year, 11, 31);
    const startDate = startOfWeek(Jan1, { weekStartsOn: 0 });

    const allDays = eachDayOfInterval({ start: startDate, end: Dec31 });

    const weeksList: { date: Date; dateStr: string; inYear: boolean }[][] = [];
    let currentWeek: { date: Date; dateStr: string; inYear: boolean }[] = [];
    const monthCols: { month: string; colIndex: number }[] = [];
    let lastMonth = "";

    allDays.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const inYear = isSameYear(day, Jan1);
      currentWeek.push({ date: day, dateStr, inYear });

      if (currentWeek.length === 7) {
        const weekIndex = weeksList.length;
        const monthName = format(day, "MMM");
        if (monthName !== lastMonth && inYear) {
          monthCols.push({ month: monthName, colIndex: weekIndex });
          lastMonth = monthName;
        }
        weeksList.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeksList.push(currentWeek);
    }

    return { weeks: weeksList, monthHeaders: monthCols };
  }, [year]);

  // Compute total value based on tracker's level definitions
  const totalContributions = useMemo(() => {
    return Object.values(tracker.contributions).reduce((acc: number, level: ContributionLevel) => {
      const count = tracker.levelDefs[level]?.count ?? level;
      return acc + count;
    }, 0);
  }, [tracker.contributions, tracker.levelDefs]);

  // Handle cell click (Cycles 0 -> 1 -> 2 -> 3 -> 4 -> 0)
  const handleCellAction = useCallback(
    (dateStr: string, isRightClick = false) => {
      const currentLevel = tracker.contributions[dateStr] || 0;
      let nextLevel: ContributionLevel;

      if (isRightClick) {
        nextLevel = currentLevel > 0 ? ((currentLevel - 1) as ContributionLevel) : 0;
      } else {
        nextLevel = ((currentLevel + 1) % 5) as ContributionLevel;
      }

      const nextContribs = { ...tracker.contributions };
      if (nextLevel === 0) {
        delete nextContribs[dateStr];
      } else {
        nextContribs[dateStr] = nextLevel;
      }

      onUpdateTracker({
        ...tracker,
        contributions: nextContribs,
      });
    },
    [tracker, onUpdateTracker]
  );

  const handleMouseEnterCell = (dateStr: string) => {
    if (isMouseDown) {
      handleCellAction(dateStr);
    }
  };

  // Actions
  const handleClearAll = () => {
    onUpdateTracker({ ...tracker, contributions: {} });
    setShowSettingsOpen(false);
  };

  const handleRandomize = () => {
    const randomized: Record<string, ContributionLevel> = {};
    weeks.forEach((w) =>
      w.forEach((d) => {
        if (d.inYear && Math.random() > 0.35) {
          randomized[d.dateStr] = (Math.floor(Math.random() * 4) + 1) as ContributionLevel;
        }
      })
    );
    onUpdateTracker({ ...tracker, contributions: randomized });
    setShowSettingsOpen(false);
  };

  const handleResetPattern = () => {
    onUpdateTracker({
      ...tracker,
      contributions: generateSampleContributions(year),
    });
    setShowSettingsOpen(false);
  };

  const currentThemeObj = THEMES[tracker.colorTheme] || THEMES.github;

  return (
    <div
      className="mx-auto w-full font-sans text-slate-100 select-none"
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      {/* Outer Container matching GitHub Dark Card */}
      <div className="relative rounded-xl border border-[#30363d] bg-[#0d1117] p-5 shadow-2xl backdrop-blur-md sm:p-6">
        {/* Top Header Row */}
        <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#30363d] bg-[#161b22] text-emerald-400 shadow-inner">
              <CalendarBlankIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-[#f0f6fc] sm:text-xl">
                {totalContributions.toLocaleString()} {tracker.unitName || "contributions"} in{" "}
                {year}
              </h2>
              <p className="text-xs font-medium text-[#8b949e]">{tracker.title}</p>
            </div>
          </div>

          {/* Shadcn Popover for Contribution Settings */}
          <Popover open={showSettingsOpen} onOpenChange={setShowSettingsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:border-[#8b949e] hover:bg-[#30363d] hover:text-white"
              >
                <GearSixIcon className="h-4 w-4 text-[#8b949e]" />
                <span>Contribution settings</span>
                <CaretDownIcon className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-80 border-[#30363d] bg-[#161b22] p-4 text-xs text-[#c9d1d9] shadow-2xl"
            >
              {/* Shadcn Tabs inside Popover */}
              <Tabs defaultValue="title" className="w-full">
                <TabsList className="mb-3 grid w-full grid-cols-3 border-b border-[#30363d] bg-transparent p-0">
                  <TabsTrigger
                    value="title"
                    className="border-b-2 text-xs data-[state=active]:border-[#58a6ff] data-[state=active]:bg-transparent data-[state=active]:text-[#58a6ff]"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="levels"
                    className="border-b-2 text-xs data-[state=active]:border-[#58a6ff] data-[state=active]:bg-transparent data-[state=active]:text-[#58a6ff]"
                  >
                    Levels
                  </TabsTrigger>
                  <TabsTrigger
                    value="theme"
                    className="border-b-2 text-xs data-[state=active]:border-[#58a6ff] data-[state=active]:bg-transparent data-[state=active]:text-[#58a6ff]"
                  >
                    Theme
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Tracker Details */}
                <TabsContent value="title" className="space-y-3 pt-1">
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold tracking-wider text-[#8b949e] uppercase">
                      Tracker Title
                    </label>
                    <Input
                      type="text"
                      value={tracker.title}
                      onChange={(e) => onUpdateTracker({ ...tracker, title: e.target.value })}
                      placeholder="e.g. Gym Workouts 2026"
                      className="border-[#30363d] bg-[#0d1117] text-xs text-[#f0f6fc] focus-visible:ring-[#58a6ff]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold tracking-wider text-[#8b949e] uppercase">
                      Unit Name
                    </label>
                    <Input
                      type="text"
                      value={tracker.unitName}
                      onChange={(e) => onUpdateTracker({ ...tracker, unitName: e.target.value })}
                      placeholder="e.g. contributions, workouts, hours"
                      className="border-[#30363d] bg-[#0d1117] text-xs text-[#f0f6fc] focus-visible:ring-[#58a6ff]"
                    />
                  </div>
                </TabsContent>

                {/* Tab 2: Customize Level Definitions */}
                <TabsContent value="levels" className="space-y-2 pt-1">
                  <p className="mb-2 text-[11px] text-[#8b949e]">
                    Define label & count for each level:
                  </p>
                  {([1, 2, 3, 4] as ContributionLevel[]).map((lvl) => (
                    <div key={lvl} className="flex items-center gap-2">
                      <span
                        className={`h-3 w-3 rounded-xs border ${currentThemeObj.levels[lvl]} ${currentThemeObj.borderLevels[lvl]}`}
                      />
                      <span className="w-9 font-medium text-[#c9d1d9]">Lvl {lvl}</span>
                      <Input
                        type="text"
                        value={tracker.levelDefs[lvl]?.label || ""}
                        onChange={(e) => {
                          const newDefs = { ...tracker.levelDefs };
                          newDefs[lvl] = {
                            ...newDefs[lvl],
                            label: e.target.value,
                          };
                          onUpdateTracker({ ...tracker, levelDefs: newDefs });
                        }}
                        placeholder="Label"
                        className="h-7 flex-1 border-[#30363d] bg-[#0d1117] px-2 text-[11px] text-[#f0f6fc]"
                      />
                      <Input
                        type="number"
                        value={tracker.levelDefs[lvl]?.count ?? lvl}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          const newDefs = { ...tracker.levelDefs };
                          newDefs[lvl] = {
                            ...newDefs[lvl],
                            count: val,
                          };
                          onUpdateTracker({ ...tracker, levelDefs: newDefs });
                        }}
                        className="h-7 w-12 border-[#30363d] bg-[#0d1117] px-1 text-center text-[11px] text-[#f0f6fc]"
                      />
                    </div>
                  ))}
                </TabsContent>

                {/* Tab 3: Themes */}
                <TabsContent value="theme" className="grid grid-cols-1 gap-1 pt-1">
                  {Object.values(THEMES).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => onUpdateTracker({ ...tracker, colorTheme: theme.id })}
                      className={`flex items-center justify-between rounded px-2.5 py-1.5 text-left transition-colors ${
                        tracker.colorTheme === theme.id
                          ? "bg-[#1f6feb]/20 text-[#58a6ff]"
                          : "text-[#c9d1d9] hover:bg-[#21262d]"
                      }`}
                    >
                      <span className="font-medium">{theme.name}</span>
                      <div className="flex items-center gap-1">
                        {theme.levels.slice(1).map((lvl, idx) => (
                          <span key={idx} className={`h-2.5 w-2.5 rounded-[1px] ${lvl}`} />
                        ))}
                        {tracker.colorTheme === theme.id && (
                          <CheckIcon className="ml-1.5 h-3.5 w-3.5" />
                        )}
                      </div>
                    </button>
                  ))}
                </TabsContent>
              </Tabs>

              {/* Presets & Delete Actions */}
              <div className="mt-4 border-t border-[#30363d] pt-3">
                <div className="mb-2 text-[10px] font-semibold tracking-wider text-[#8b949e] uppercase">
                  Presets & Actions
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={handleResetPattern}
                    className="flex items-center gap-2 rounded px-2.5 py-1.5 text-[#c9d1d9] transition-colors hover:bg-[#21262d]"
                  >
                    <ArrowCounterClockwiseIcon className="h-3.5 w-3.5 text-[#3fb950]" />
                    <span>Reset Sample Data</span>
                  </button>
                  <button
                    onClick={handleRandomize}
                    className="flex items-center gap-2 rounded px-2.5 py-1.5 text-[#c9d1d9] transition-colors hover:bg-[#21262d]"
                  >
                    <ShuffleIcon className="h-3.5 w-3.5 text-[#d29922]" />
                    <span>Randomize Activity</span>
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 rounded px-2.5 py-1.5 text-[#c9d1d9] transition-colors hover:bg-[#21262d]"
                  >
                    <TrashIcon className="h-3.5 w-3.5 text-[#8b949e]" />
                    <span>Clear All Cells</span>
                  </button>

                  {onDeleteTracker && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${tracker.title}"?`)) {
                          onDeleteTracker(tracker.id);
                        }
                      }}
                      className="mt-1 flex items-center gap-2 rounded px-2.5 py-1.5 font-medium text-[#f85149] transition-colors hover:bg-[#f85149]/10"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                      <span>Delete Tracker</span>
                    </button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Heatmap Grid Layout Card */}
        <div className="relative rounded-lg border border-[#30363d] bg-[#010409] p-4 sm:p-5">
          <div className="custom-scrollbar overflow-x-auto pb-3">
            <div className="min-w-180 select-none">
              {/* Months Header Line */}
              <div className="relative mb-2 flex h-4 pl-8 text-[11px] text-[#8b949e]">
                {monthHeaders.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${m.colIndex * 13 + 32}px`,
                    }}
                    className="font-medium text-[#8b949e]"
                  >
                    {m.month}
                  </div>
                ))}
              </div>

              {/* Grid Body: Left Day Sidebar + Weeks Columns */}
              <div className="flex gap-1.5">
                <div className="flex flex-col justify-between py-px pr-2 text-[10px] text-[#8b949e]">
                  <span className="h-3 leading-3" />
                  <span className="h-3 leading-3 font-medium">Mon</span>
                  <span className="h-3 leading-3" />
                  <span className="h-3 leading-3 font-medium">Wed</span>
                  <span className="h-3 leading-3" />
                  <span className="h-3 leading-3 font-medium">Fri</span>
                  <span className="h-3 leading-3" />
                </div>

                <div
                  className="flex flex-1 gap-0.75"
                  onMouseDown={() => setIsMouseDown(true)}
                  onMouseUp={() => setIsMouseDown(false)}
                >
                  {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-0.75">
                      {week.map((day) => {
                        const level = (tracker.contributions[day.dateStr] ||
                          0) as ContributionLevel;
                        const levelClass = currentThemeObj.levels[level];
                        const borderClass = currentThemeObj.borderLevels[level];
                        const definition = tracker.levelDefs[level] || DEFAULT_LEVEL_DEFS[level];

                        return (
                          <button
                            key={day.dateStr}
                            disabled={!day.inYear}
                            onClick={() => day.inYear && handleCellAction(day.dateStr)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              if (day.inYear) handleCellAction(day.dateStr, true);
                            }}
                            onMouseEnter={(e) => {
                              if (day.inYear) {
                                handleMouseEnterCell(day.dateStr);
                                const rect = e.currentTarget.getBoundingClientRect();
                                setHoveredCell({
                                  dateStr: day.dateStr,
                                  formattedDate: format(day.date, "EEEE, MMMM d, yyyy"),
                                  level,
                                  definition,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top,
                                });
                              }
                            }}
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`h-2.5 w-2.5 rounded-xs border transition-all duration-100 sm:h-2.75 sm:w-2.75 ${
                              !day.inYear
                                ? "invisible"
                                : `${levelClass} ${borderClass} hover:z-20 hover:scale-125 hover:border-[#8b949e] hover:shadow-lg`
                            }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Row */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#21262d] pt-3 text-[11px] text-[#8b949e]">
            <button
              onClick={() => setShowInfoModal(true)}
              className="flex items-center gap-1.5 font-medium text-[#8b949e] transition-colors hover:text-[#58a6ff]"
            >
              <InfoIcon className="h-3.5 w-3.5" />
              <span>Learn how we count contributions</span>
            </button>

            <div className="flex items-center gap-1.5">
              <span className="mr-1 text-[11px] text-[#8b949e]">Less</span>
              {currentThemeObj.levels.map((lvlClass, idx) => {
                const def = tracker.levelDefs[idx as ContributionLevel];
                return (
                  <div
                    key={idx}
                    title={`Level ${idx}: ${def?.label || `Level ${idx}`}`}
                    className={`h-2.5 w-2.5 cursor-default rounded-xs border ${lvlClass} ${currentThemeObj.borderLevels[idx]}`}
                  />
                );
              })}
              <span className="ml-1 text-[11px] text-[#8b949e]">More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredCell && (
        <div
          style={{
            position: "fixed",
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y - 8}px`,
            transform: "translate(-50%, -100%)",
          }}
          className="animate-in fade-in zoom-in-95 pointer-events-none z-50 duration-100"
        >
          <div className="rounded-md border border-[#30363d] bg-[#161b22] px-2.5 py-1.5 text-center text-xs font-medium text-[#f0f6fc] shadow-2xl">
            <div>
              <span className="font-semibold text-emerald-400">{hoveredCell.definition.label}</span>{" "}
              <span className="text-[#8b949e]">on {hoveredCell.formattedDate}</span>
            </div>
            <div className="mt-0.5 text-[10px] text-[#8b949e]">
              Level {hoveredCell.level} ({hoveredCell.definition.count}{" "}
              {tracker.unitName || "units"}) • Click to cycle
            </div>
          </div>
          <div className="mx-auto -mt-px h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-[#30363d]" />
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-[#30363d] bg-[#161b22] p-6 text-slate-100 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-[#30363d] pb-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-[#f0f6fc]">
                <SparkleIcon className="h-5 w-5 text-emerald-400" />
                Tracker: {tracker.title}
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-[#8b949e] hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-[#c9d1d9]">
              <p>
                Click any cell on the grid to log activity for that day. Left click cycles through
                intensity levels ($0 \rightarrow 1 \rightarrow 2 \rightarrow 3 \rightarrow 4$).
              </p>
              <div className="mt-4 rounded-lg border border-[#30363d] bg-[#0d1117] p-3 text-[11px]">
                <span className="font-semibold text-emerald-400">Custom Level Definitions:</span>
                <div className="mt-2 space-y-1 text-[#8b949e]">
                  {([0, 1, 2, 3, 4] as ContributionLevel[]).map((lvl) => (
                    <div key={lvl} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-[1px] ${currentThemeObj.levels[lvl]}`}
                        />
                        <span>Level {lvl}:</span>
                      </span>
                      <span className="font-medium text-[#f0f6fc]">
                        {tracker.levelDefs[lvl]?.label || "N/A"} (
                        {tracker.levelDefs[lvl]?.count ?? lvl} {tracker.unitName})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="rounded-md bg-[#238636] px-4 py-2 text-xs font-medium text-white hover:bg-[#2ea043]"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
