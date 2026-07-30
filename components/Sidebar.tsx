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
    <aside className="w-64 bg-[#0d121f] border-r border-gray-800/80 flex flex-col justify-between h-[calc(100vh-4rem)] p-4 shrink-0 overflow-y-auto">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-gray-400 mb-2 block">
            Workspace Views
          </span>
          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveView("dashboard");
                setSelectedDate(null);
              }}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-mono transition ${
                activeView === "dashboard" && !selectedDate
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Habit Dashboard</span>
            </button>

            <button
              onClick={() => setActiveView("notes")}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-mono transition ${
                activeView === "notes"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>All Journal Entries</span>
            </button>
          </nav>
        </div>

        {/* Date Filter Indicator if Active */}
        {selectedDate && (
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Filtered: {selectedDate}</span>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-[10px] text-gray-400 hover:text-white underline font-mono"
            >
              Reset
            </button>
          </div>
        )}

        {/* Trackers Heatmap Boards */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-400" />
              Heatmap Trackers ({trackers.length})
            </span>
            <button
              onClick={onOpenCreateTracker}
              title="Add Custom Tracker Heatmap"
              className="text-emerald-400 hover:text-emerald-300 p-1 hover:bg-gray-800 rounded-lg transition"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {trackers.map((t) => (
              <div
                key={t.id}
                className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-gray-300 bg-gray-900/60 border border-gray-800/60 hover:border-gray-700 transition"
              >
                <div className="flex items-center space-x-2 truncate">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
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
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-400 p-0.5 transition"
                    title="Delete Tracker"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tag Filters */}
        <div>
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1">
            <Tag className="w-3 h-3 text-emerald-400" />
            Hashtag Filters
          </span>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                selectedTag === null
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800"
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                  selectedTag === tag
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Streak Badge Footer */}
      <div className="pt-4 border-t border-gray-800/80">
        <div className="bg-gradient-to-r from-amber-950/30 to-orange-950/30 border border-amber-800/40 rounded-xl p-3 flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Flame className="w-5 h-5 fill-amber-400/30" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-amber-300">
              {currentStreak} Day Streak
            </div>
            <div className="text-[10px] font-mono text-gray-400">
              {currentStreak > 0 ? "Keep writing daily!" : "Write a note today"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
