"use client";

import React from "react";
import { ActivityData, HeatmapGrid } from "./HeatmapGrid";
import { TrackerItem } from "./Sidebar";
import { Layers, Plus } from "lucide-react";

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
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-emerald-400" />
          <h2 className="font-mono text-sm font-bold tracking-wide text-gray-200 uppercase">
            Annual Activity Grids ({trackers.length})
          </h2>
        </div>
        <button
          onClick={onOpenCreateTracker}
          className="flex items-center space-x-1.5 rounded-xl border border-gray-800 bg-gray-900 px-3 py-1.5 font-mono text-xs text-gray-200 transition hover:bg-gray-800"
        >
          <Plus className="h-3.5 w-3.5 text-emerald-400" />
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
