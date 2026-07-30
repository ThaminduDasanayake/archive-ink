"use client";

import React, { useMemo } from "react";
import { addDays, format, startOfWeek, subDays } from "date-fns";
import { Sparkles } from "lucide-react";

export interface ActivityData {
  date: string; // YYYY-MM-DD
  count: number;
  entryCount?: number;
}

interface HeatmapGridProps {
  title: string;
  colorScheme?: string; // emerald | violet | amber | sky | rose
  activities: ActivityData[];
  selectedDate?: string | null;
  onSelectDate: (date: string) => void;
  onCellClickToggle?: (date: string) => void;
  tag?: string | null;
  isDefault?: boolean;
}

const COLOR_CLASSES: Record<string, string[]> = {
  emerald: [
    "bg-slate-100 border-slate-200/80",
    "bg-emerald-100 border-emerald-300 text-emerald-800",
    "bg-emerald-300 border-emerald-400 text-emerald-950",
    "bg-emerald-500 border-emerald-600 text-white",
    "bg-emerald-700 border-emerald-800 text-white shadow-xs",
  ],
  violet: [
    "bg-slate-100 border-slate-200/80",
    "bg-violet-100 border-violet-300 text-violet-800",
    "bg-violet-300 border-violet-400 text-violet-950",
    "bg-violet-500 border-violet-600 text-white",
    "bg-violet-700 border-violet-800 text-white shadow-xs",
  ],
  amber: [
    "bg-slate-100 border-slate-200/80",
    "bg-amber-100 border-amber-300 text-amber-800",
    "bg-amber-300 border-amber-400 text-amber-950",
    "bg-amber-500 border-amber-600 text-white",
    "bg-amber-700 border-amber-800 text-white shadow-xs",
  ],
  sky: [
    "bg-slate-100 border-slate-200/80",
    "bg-sky-100 border-sky-300 text-sky-800",
    "bg-sky-300 border-sky-400 text-sky-950",
    "bg-sky-500 border-sky-600 text-white",
    "bg-sky-700 border-sky-800 text-white shadow-xs",
  ],
  rose: [
    "bg-slate-100 border-slate-200/80",
    "bg-rose-100 border-rose-300 text-rose-800",
    "bg-rose-300 border-rose-400 text-rose-950",
    "bg-rose-500 border-rose-600 text-white",
    "bg-rose-700 border-rose-800 text-white shadow-xs",
  ],
};

const THEME_ACCENTS: Record<string, string> = {
  emerald: "text-emerald-700 border-emerald-300 bg-emerald-50",
  violet: "text-violet-700 border-violet-300 bg-violet-50",
  amber: "text-amber-700 border-amber-300 bg-amber-50",
  sky: "text-sky-700 border-sky-300 bg-sky-50",
  rose: "text-rose-700 border-rose-300 bg-rose-50",
};

export function HeatmapGrid({
  title,
  colorScheme = "emerald",
  activities,
  selectedDate,
  onSelectDate,
  onCellClickToggle,
  tag,
  isDefault,
}: HeatmapGridProps) {
  const scheme = COLOR_CLASSES[colorScheme] ? colorScheme : "emerald";
  const colors = COLOR_CLASSES[scheme];
  const accentClass = THEME_ACCENTS[scheme];

  // Map activities by date string YYYY-MM-DD
  const activityMap = useMemo(() => {
    const map = new Map<string, ActivityData>();
    for (const act of activities) {
      map.set(act.date, act);
    }
    return map;
  }, [activities]);

  // Generate 52 weeks (364 days) up to today
  const { weeks, monthHeaders } = useMemo(() => {
    const today = new Date();
    // Start 52 weeks ago from the beginning of that week
    const startDate = startOfWeek(subDays(today, 52 * 7 - 1), { weekStartsOn: 0 });

    const weeksList: { date: Date; dateStr: string; count: number; entryCount: number }[][] = [];
    const monthsMap: { month: string; colIndex: number }[] = [];

    let currentPointer = startDate;
    let lastMonth = "";

    for (let w = 0; w < 52; w++) {
      const weekDays = [];
      const monthName = format(currentPointer, "MMM");

      if (monthName !== lastMonth) {
        monthsMap.push({ month: monthName, colIndex: w });
        lastMonth = monthName;
      }

      for (let d = 0; d < 7; d++) {
        const dateStr = format(currentPointer, "yyyy-MM-dd");
        const act = activityMap.get(dateStr);
        weekDays.push({
          date: new Date(currentPointer),
          dateStr,
          count: act ? act.count : 0,
          entryCount: act ? act.entryCount || (act.count > 0 ? 1 : 0) : 0,
        });
        currentPointer = addDays(currentPointer, 1);
      }
      weeksList.push(weekDays);
    }

    return { weeks: weeksList, monthHeaders: monthsMap };
  }, [activityMap]);

  // Intensity calculation function (0 to 4)
  const getIntensityLevel = (count: number): number => {
    if (count <= 0) return 0;
    if (count <= 100) return 1;
    if (count <= 350) return 2;
    if (count <= 700) return 3;
    return 4;
  };

  const totalWords = useMemo(
    () => activities.reduce((acc, curr) => acc + curr.count, 0),
    [activities]
  );

  const activeDays = useMemo(() => activities.filter((a) => a.count > 0).length, [activities]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {/* Tracker Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold tracking-wider uppercase ${accentClass}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isDefault ? "Primary Track" : tag ? `#${tag}` : "Custom Track"}
          </div>
          <h3 className="font-mono text-sm font-bold tracking-wide text-slate-800">{title}</h3>
        </div>

        <div className="flex items-center space-x-4 font-mono text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-800">{activeDays}</span> active days
          </div>
          <div>
            <span className="font-bold text-slate-800">{totalWords.toLocaleString()}</span> total
            count
          </div>
        </div>
      </div>

      {/* Grid Container with Horizontal Scroll fallback */}
      <div className="scrollbar-thin overflow-x-auto pb-2">
        <div className="min-w-180 select-none">
          {/* Month Labels */}
          <div className="mb-1.5 flex pl-8 font-mono text-[10px] text-slate-500">
            {monthHeaders.map((m, idx) => (
              <div
                key={idx}
                style={{
                  gridColumnStart: m.colIndex + 1,
                  minWidth: `${(52 / monthHeaders.length) * 12}px`,
                }}
                className="text-left font-medium"
              >
                {m.month}
              </div>
            ))}
          </div>

          {/* Grid Layout (7 Rows x 52 Columns) */}
          <div className="flex gap-1">
            {/* Weekday Sidebar */}
            <div className="flex flex-col justify-between py-0.5 pr-2 font-mono text-[9px] text-slate-400">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* 52 Columns of Weeks */}
            <div className="flex flex-1 gap-1">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((day) => {
                    const level = getIntensityLevel(day.count);
                    const colorClass = colors[level];
                    const isSelected = selectedDate === day.dateStr;

                    return (
                      <button
                        key={day.dateStr}
                        onClick={() => {
                          onSelectDate(day.dateStr);
                          if (onCellClickToggle) {
                            onCellClickToggle(day.dateStr);
                          }
                        }}
                        title={`${format(day.date, "EEEE, MMM d, yyyy")}: ${day.count} words / activity (${day.entryCount} entries)`}
                        className={`group/tile relative h-3 w-3 rounded-[3px] border transition-all duration-150 sm:h-3.5 sm:w-3.5 ${colorClass} ${
                          isSelected
                            ? "z-10 scale-125 ring-2 ring-emerald-500"
                            : "hover:z-10 hover:scale-125 hover:border-slate-400"
                        }`}
                      >
                        {/* Tooltip on hover */}
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 group-hover/tile:block">
                          <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-[10px] whitespace-nowrap text-slate-800 shadow-xl">
                            <p className="font-semibold text-emerald-600">
                              {format(day.date, "MMM d, yyyy")}
                            </p>
                            <p className="text-slate-600">
                              {day.count} {day.count === 1 ? "word/unit" : "words/units"} •{" "}
                              {day.entryCount} {day.entryCount === 1 ? "entry" : "entries"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-200/80 pt-2 font-mono text-[11px] text-slate-500">
        <span className="text-[10px]">Click any cell to filter notes or log activity</span>
        <div className="flex items-center space-x-1.5">
          <span className="mr-1 text-[10px]">Less</span>
          {colors.map((c, i) => (
            <div key={i} className={`h-3 w-3 rounded-[2.5px] border ${c}`} />
          ))}
          <span className="ml-1 text-[10px]">More</span>
        </div>
      </div>
    </div>
  );
}
