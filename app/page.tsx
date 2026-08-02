"use client";

import React, { useState } from "react";
import {
  HeatmapGrid,
  Tracker,
  DEFAULT_LEVEL_DEFS,
  generateSampleContributions,
} from "@/components/HeatmapGrid";
import { Plus, SquaresFour } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

// Pre-populate sample trackers for multi-tracker demonstration
const INITIAL_TRACKERS: Tracker[] = [
  {
    id: "tracker-1",
    title: "GitHub Contributions 2026",
    unitName: "contributions",
    colorTheme: "github",
    levelDefs: {
      0: { label: "No activity", count: 0 },
      1: { label: "1-3 commits", count: 1 },
      2: { label: "4-6 commits", count: 3 },
      3: { label: "7-9 commits", count: 6 },
      4: { label: "10+ commits", count: 10 },
    },
    contributions: generateSampleContributions(2026),
  },
  {
    id: "tracker-2",
    title: "Gym & Fitness Workouts",
    unitName: "sessions",
    colorTheme: "emerald",
    levelDefs: {
      0: { label: "Rest Day", count: 0 },
      1: { label: "Light Walk / Cardio", count: 1 },
      2: { label: "30 Min Workout", count: 2 },
      3: { label: "1 Hour Strength Training", count: 3 },
      4: { label: "Heavy Workout + Cardio", count: 5 },
    },
    contributions: generateSampleContributions(2026),
  },
  {
    id: "tracker-3",
    title: "Daily Reading Habit",
    unitName: "pages",
    colorTheme: "cyberpunk",
    levelDefs: {
      0: { label: "No reading", count: 0 },
      1: { label: "5-10 pages", count: 5 },
      2: { label: "15-25 pages", count: 15 },
      3: { label: "30-50 pages", count: 30 },
      4: { label: "50+ pages / 1 Chapter", count: 50 },
    },
    contributions: generateSampleContributions(2026),
  },
];

export default function Home() {
  const [trackers, setTrackers] = useState<Tracker[]>(INITIAL_TRACKERS);

  // Add new blank or custom tracker
  const handleAddTracker = () => {
    const newId = `tracker-${Date.now()}`;
    const newTracker: Tracker = {
      id: newId,
      title: `Custom Tracker ${trackers.length + 1}`,
      unitName: "units",
      colorTheme: "ocean",
      levelDefs: { ...DEFAULT_LEVEL_DEFS },
      contributions: {},
    };
    setTrackers((prev) => [...prev, newTracker]);
  };

  // Update a single tracker by ID
  const handleUpdateTracker = (updated: Tracker) => {
    setTrackers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // Delete a tracker by ID
  const handleDeleteTracker = (id: string) => {
    setTrackers((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#0d1117] px-4 py-10 font-sans selection:bg-emerald-500 selection:text-white sm:px-6">
      <div className="w-full max-w-5xl space-y-8">
        {/* Main Dashboard Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-[#30363d] pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#30363d] bg-[#161b22] text-emerald-400 shadow-xl">
              <SquaresFour className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-[#f0f6fc] text-2xl sm:text-3xl">
                Multi-Tracker Activity Hub
              </h1>
              <p className="text-xs text-[#8b949e] sm:text-sm">
                Track anything offline with customizable contribution heatmaps placed one after another.
              </p>
            </div>
          </div>

          <Button
            onClick={handleAddTracker}
            className="flex items-center gap-2 bg-[#238636] font-medium text-xs text-white shadow-lg hover:bg-[#2ea043] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Tracker</span>
          </Button>
        </div>

        {/* List of Trackers Placed One After Another */}
        {trackers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#30363d] bg-[#161b22]/40 p-12 text-center">
            <p className="font-medium text-[#8b949e]">No active trackers.</p>
            <Button
              onClick={handleAddTracker}
              className="mt-4 flex items-center gap-2 bg-[#238636] font-medium text-xs text-white hover:bg-[#2ea043]"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Tracker</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {trackers.map((tracker) => (
              <HeatmapGrid
                key={tracker.id}
                tracker={tracker}
                onUpdateTracker={handleUpdateTracker}
                onDeleteTracker={handleDeleteTracker}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
