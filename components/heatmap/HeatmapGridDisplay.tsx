import React from "react";
import { format } from "date-fns";
import { InfoIcon } from "@phosphor-icons/react";
import { ContributionLevel, HoveredCellInfo, ThemeOption, Tracker } from "./types";
import { DEFAULT_LEVEL_DEFS } from "./constants";

interface HeatmapGridDisplayProps {
  weeks: { date: Date; dateStr: string; inYear: boolean }[][];
  monthHeaders: { month: string; colSpan: number }[];
  tracker: Tracker;
  currentThemeObj: ThemeOption;
  handleCellAction: (dateStr: string, isRightClick?: boolean) => void;
  handleMouseEnterCell: (dateStr: string) => void;
  setIsMouseDown: (down: boolean) => void;
  setHoveredCell: (cell: HoveredCellInfo | null) => void;
  setShowInfoModal: (show: boolean) => void;
}

export function HeatmapGridDisplay({
  weeks,
  monthHeaders,
  tracker,
  currentThemeObj,
  handleCellAction,
  handleMouseEnterCell,
  setIsMouseDown,
  setHoveredCell,
  setShowInfoModal,
}: HeatmapGridDisplayProps) {
  return (
    <div className="relative rounded-lg border border-[#30363d] bg-[#010409] p-4 sm:p-5">
      <div className="custom-scrollbar overflow-x-auto pb-3">
        <div className="inline-block select-none">
          {/* Grid Layout Container */}
          <div
            className="grid gap-x-0.75"
            style={{
              gridTemplateColumns: `auto repeat(${weeks.length}, minmax(10px, 1fr))`,
            }}
          >
            {/* Months Header */}
            <div className="text-[11px] text-[#8b949e]" />
            {monthHeaders.map((m, i) => (
              <div
                key={i}
                style={{ gridColumn: `span ${m.colSpan}` }}
                className="pr-1 text-left text-[11px] font-medium text-[#8b949e]"
              >
                {m.month}
              </div>
            ))}
            {/* Day Sidebar */}
            <div className="flex flex-col justify-between py-px pr-2 text-[10px] text-[#8b949e]">
              <span className="h-2.5 leading-2.5 sm:h-2.75" />
              <span className="h-2.5 leading-2.5 font-medium sm:h-2.75">Mon</span>
              <span className="h-2.5 leading-2.5 sm:h-2.75" />
              <span className="h-2.5 leading-2.5 font-medium sm:h-2.75">Wed</span>
              <span className="h-2.5 leading-2.5 sm:h-2.75" />
              <span className="h-2.5 leading-2.5 font-medium sm:h-2.75">Fri</span>
              <span className="h-2.5 leading-2.5 sm:h-2.75" />
            </div>
            {/* Week Columns */}
            {weeks.map((week, weekIdx) => (
              <div
                key={weekIdx}
                className="flex flex-col gap-0.75"
                onMouseDown={() => setIsMouseDown(true)}
                onMouseUp={() => setIsMouseDown(false)}
              >
                {week.map((day) => {
                  const level = (tracker.contributions[day.dateStr] || 0) as ContributionLevel;
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
  );
}
