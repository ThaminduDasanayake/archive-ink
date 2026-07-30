"use client";

import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Tag,
  Calendar,
  Layers,
  Sparkles,
  Flame,
  CheckCircle,
  Trash2,
} from "lucide-react";

export interface TrackerItem {
  id: string;
  title: string;
  tag?: string | null;
  colorScheme: string;
  isDefault: boolean;
}

interface SidebarProps {
  activeView: "dashboard" | "editor" | "notes";
  setActiveView: (view: "dashboard" | "editor" | "notes") => void;
  trackers: TrackerItem[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  allTags: string[];
  onOpenCreateTracker: () => void;
  onDeleteTracker: (id: string) => void;
  currentStreak: number;
}

export function Sidebar({
  activeView,
  setActiveView,
  trackers,
  selectedTag,
  setSelectedTag,
  selectedDate,
  setSelectedDate,
  allTags,
  onOpenCreateTracker,
  onDeleteTracker,
  currentStreak,
}: SidebarProps) {
  return (
    <aside className="flex h-[calc(100vh-4rem)] w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-gray-800/80 bg-[#0d121f] p-4">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <span className="mb-2 block font-mono text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            Workspace Views
          </span>
          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveView("dashboard");
                setSelectedDate(null);
              }}
              className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 font-mono text-xs transition ${
                activeView === "dashboard" && !selectedDate
                  ? "border border-emerald-500/30 bg-emerald-500/10 font-semibold text-emerald-400"
                  : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Habit Dashboard</span>
            </button>

            <button
              onClick={() => setActiveView("notes")}
              className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 font-mono text-xs transition ${
                activeView === "notes"
                  ? "border border-emerald-500/30 bg-emerald-500/10 font-semibold text-emerald-400"
                  : "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>All Journal Entries</span>
            </button>
          </nav>
        </div>

        {/* Date Filter Indicator if Active */}
        {selectedDate && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-800/60 bg-emerald-950/40 p-2.5">
            <div className="flex items-center space-x-2 font-mono text-xs text-emerald-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>Filtered: {selectedDate}</span>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="font-mono text-[10px] text-gray-400 underline hover:text-white"
            >
              Reset
            </button>
          </div>
        )}

        {/* Trackers Heatmap Boards */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1 font-mono text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              <Layers className="h-3 w-3 text-emerald-400" />
              Heatmap Trackers ({trackers.length})
            </span>
            <button
              onClick={onOpenCreateTracker}
              title="Add Custom Tracker Heatmap"
              className="rounded-lg p-1 text-emerald-400 transition hover:bg-gray-800 hover:text-emerald-300"
            >
              <PlusCircle className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            {trackers.map((t) => (
              <div
                key={t.id}
                className="group flex items-center justify-between rounded-xl border border-gray-800/60 bg-gray-900/60 px-3 py-2 font-mono text-xs text-gray-300 transition hover:border-gray-700"
              >
                <div className="flex items-center space-x-2 truncate">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      t.colorScheme === "violet"
                        ? "bg-violet-400"
                        : t.colorScheme === "amber"
                          ? "bg-amber-400"
                          : t.colorScheme === "sky"
                            ? "bg-sky-400"
                            : t.colorScheme === "rose"
                              ? "bg-rose-400"
                              : "bg-emerald-400"
                    }`}
                  />
                  <span className="truncate">{t.title}</span>
                  {t.tag && <span className="text-[9px] text-gray-400">#{t.tag}</span>}
                </div>

                {!t.isDefault && (
                  <button
                    onClick={() => onDeleteTracker(t.id)}
                    className="p-0.5 text-gray-500 opacity-0 transition group-hover:opacity-100 hover:text-rose-400"
                    title="Delete Tracker"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tag Filters */}
        <div>
          <span className="mb-2 flex items-center gap-1 font-mono text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            <Tag className="h-3 w-3 text-emerald-400" />
            Hashtag Filters
          </span>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedTag(null)}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] transition ${
                selectedTag === null
                  ? "border border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                  : "border border-gray-800 bg-gray-900 text-gray-400 hover:text-gray-200"
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] transition ${
                  selectedTag === tag
                    ? "border border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                    : "border border-gray-800 bg-gray-900 text-gray-400 hover:text-gray-200"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Streak Badge Footer */}
      <div className="border-t border-gray-800/80 pt-4">
        <div className="flex items-center space-x-3 rounded-xl border border-amber-800/40 bg-gradient-to-r from-amber-950/30 to-orange-950/30 p-3">
          <div className="rounded-xl bg-amber-500/20 p-2 text-amber-400">
            <Flame className="h-5 w-5 fill-amber-400/30" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-amber-300">
              {currentStreak} Day Streak
            </div>
            <div className="font-mono text-[10px] text-gray-400">
              {currentStreak > 0 ? "Keep writing daily!" : "Write a note today"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
