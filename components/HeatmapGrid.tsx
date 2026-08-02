"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { eachDayOfInterval, format, isSameYear, startOfWeek } from "date-fns";
import { CalendarBlankIcon } from "@phosphor-icons/react";

import { ContributionLevel, HeatmapGridProps, HoveredCellInfo } from "./heatmap/types";
import { generateSampleContributions, THEMES } from "./heatmap/constants";
import { HeatmapSettingsPopover } from "@/components/heatmap";
import { HeatmapGridDisplay } from "@/components/heatmap";
import { HeatmapTooltip } from "@/components/heatmap";
import { HeatmapInfoModal } from "@/components/heatmap";
import { HeatmapConfirmDialogs } from "@/components/heatmap";

// Re-export types and constants for backwards compatibility
export * from "./heatmap/types";
export * from "./heatmap/constants";

export function HeatmapGrid({
  tracker,
  onUpdateTracker,
  onDeleteTracker,
  year = 2026,
}: HeatmapGridProps) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [showSettingsOpen, setShowSettingsOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Draft inputs for Title & Unit Name
  const [draftTitle, setDraftTitle] = useState(tracker.title);
  const [draftUnitName, setDraftUnitName] = useState(tracker.unitName);

  // Sync draft inputs when tracker prop or popover visibility updates
  useEffect(() => {
    setDraftTitle(tracker.title);
    setDraftUnitName(tracker.unitName);
  }, [tracker.title, tracker.unitName, showSettingsOpen]);

  // Alert Dialog states
  const [showConfirmDetailsDialog, setShowConfirmDetailsDialog] = useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [showDeleteTrackerDialog, setShowDeleteTrackerDialog] = useState(false);

  const [hoveredCell, setHoveredCell] = useState<HoveredCellInfo | null>(null);

  // Generate week columns for year 2026
  const { weeks, monthHeaders } = useMemo(() => {
    const Jan1 = new Date(year, 0, 1);
    const Dec31 = new Date(year, 11, 31);
    const startDate = startOfWeek(Jan1, { weekStartsOn: 0 });

    const allDays = eachDayOfInterval({ start: startDate, end: Dec31 });

    const weeksList: { date: Date; dateStr: string; inYear: boolean }[][] = [];
    let currentWeek: { date: Date; dateStr: string; inYear: boolean }[] = [];

    allDays.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const inYear = isSameYear(day, Jan1);
      currentWeek.push({ date: day, dateStr, inYear });

      if (currentWeek.length === 7) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeksList.push(currentWeek);
    }

    const cols: { month: string; colSpan: number }[] = [];
    let currentMonthName = "";
    let currentSpan = 0;

    weeksList.forEach((week) => {
      const validDay = week.find((day) => day.inYear);
      if (!validDay) return;

      const monthName = format(validDay.date, "MMM");

      if (monthName !== currentMonthName) {
        if (currentSpan > 0) {
          cols.push({ month: currentMonthName, colSpan: currentSpan });
        }
        currentMonthName = monthName;
        currentSpan = 1;
      } else {
        currentSpan += 1;
      }
    });

    if (currentSpan > 0) {
      cols.push({ month: currentMonthName, colSpan: currentSpan });
    }

    return { weeks: weeksList, monthHeaders: cols };
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

          {/* Popover Settings */}
          <HeatmapSettingsPopover
            tracker={tracker}
            showSettingsOpen={showSettingsOpen}
            setShowSettingsOpen={setShowSettingsOpen}
            draftTitle={draftTitle}
            setDraftTitle={setDraftTitle}
            draftUnitName={draftUnitName}
            setDraftUnitName={setDraftUnitName}
            onUpdateTracker={onUpdateTracker}
            onDeleteTracker={onDeleteTracker}
            currentThemeObj={currentThemeObj}
            onRequestConfirmDetails={() => setShowConfirmDetailsDialog(true)}
            onRequestClearAll={() => setShowClearAllDialog(true)}
            onRequestDeleteTracker={() => setShowDeleteTrackerDialog(true)}
            handleResetPattern={handleResetPattern}
          />
        </div>

        {/* Heatmap Grid Layout Card */}
        <HeatmapGridDisplay
          weeks={weeks}
          monthHeaders={monthHeaders}
          tracker={tracker}
          currentThemeObj={currentThemeObj}
          handleCellAction={handleCellAction}
          handleMouseEnterCell={handleMouseEnterCell}
          setIsMouseDown={setIsMouseDown}
          setHoveredCell={setHoveredCell}
          setShowInfoModal={setShowInfoModal}
        />
      </div>

      {/* Floating Tooltip */}
      <HeatmapTooltip hoveredCell={hoveredCell} unitName={tracker.unitName} />

      {/* Info Modal */}
      <HeatmapInfoModal
        showInfoModal={showInfoModal}
        setShowInfoModal={setShowInfoModal}
        tracker={tracker}
        currentThemeObj={currentThemeObj}
      />

      {/* Confirmation Alert Dialogs */}
      <HeatmapConfirmDialogs
        tracker={tracker}
        draftTitle={draftTitle}
        setDraftTitle={setDraftTitle}
        draftUnitName={draftUnitName}
        setDraftUnitName={setDraftUnitName}
        showConfirmDetailsDialog={showConfirmDetailsDialog}
        setShowConfirmDetailsDialog={setShowConfirmDetailsDialog}
        showClearAllDialog={showClearAllDialog}
        setShowClearAllDialog={setShowClearAllDialog}
        showDeleteTrackerDialog={showDeleteTrackerDialog}
        setShowDeleteTrackerDialog={setShowDeleteTrackerDialog}
        onUpdateTracker={onUpdateTracker}
        onDeleteTracker={onDeleteTracker}
        onConfirmClearAll={handleClearAll}
      />
    </div>
  );
}
