"use client";

import React from "react";
import { HeatmapGrid, ActivityData } from "./HeatmapGrid";
import { TrackerItem } from "./Sidebar";
import { Plus, Sparkles, Layers } from "lucide-react";

interface MultiTrackerBoardProps {
  trackers: TrackerItem[];
  activitiesMap: Record<string, ActivityData[]>; // trackerId -> ActivityData[]
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onCellClickToggle?: (trackerId: string, date: string) => void;
  onOpenCreateTracker: () => void;
}

export function MultiTrackerBoard({
  trackers,
  activitiesMap,
  selectedDate,
  onSelectDate,
  onCellClickToggle,
  onOpenCreateTracker,
}: MultiTrackerBoardProps) {
  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-gray-200 font-mono tracking-wide uppercase">
            Annual Activity Grids ({trackers.length})
          </h2>
        </div>
        <button
          onClick={onOpenCreateTracker}
          className="flex items-center space-x-1.5 bg-gray-900 hover:bg-gray-800 text-gray-200 text-xs px-3 py-1.5 rounded-xl border border-gray-800 transition font-mono"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Add Custom Heatmap</span>
        </button>
      </div>

      <div className="space-y-4">
        {trackers.map((tracker) => (
          <HeatmapGrid
            key={tracker.id}
            title={tracker.title}
            colorScheme={tracker.colorScheme}
            activities={activitiesMap[tracker.id] || []}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            onCellClickToggle={
              onCellClickToggle ? (date) => onCellClickToggle(tracker.id, date) : undefined
            }
            tag={tracker.tag}
            isDefault={tracker.isDefault}
          />
        ))}
      </div>
    </div>
  );
}
