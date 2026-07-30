"use client";

import React from "react";
import {
  BookOpen,
  Calendar,
  Flame,
  Layers,
  LayoutDashboard,
  PlusCircle,
  Tag,
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
    <aside className="flex h-[calc(100vh-4rem)] w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-slate-200/80 bg-white p-4">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <span className="mb-2 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
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
                  ? "border border-emerald-500/30 bg-emerald-50 font-semibold text-emerald-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Habit Dashboard</span>
            </button>

            <button
              onClick={() => setActiveView("notes")}
              className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2 font-mono text-xs transition ${
                activeView === "notes"
                  ? "border border-emerald-500/30 bg-emerald-50 font-semibold text-emerald-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>All Journal Entries</span>
            </button>
          </nav>
        </div>

        {/* Date Filter Indicator if Active */}
        {selectedDate && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 p-2.5">
            <div className="flex items-center space-x-2 font-mono text-xs text-emerald-700">
              <Calendar className="h-3.5 w-3.5" />
              <span>Filtered: {selectedDate}</span>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="font-mono text-[10px] text-slate-500 underline hover:text-slate-800"
            >
              Reset
            </button>
          </div>
        )}

        {/* Trackers Heatmap Boards */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <Layers className="h-3 w-3 text-emerald-600" />
              Heatmap Trackers ({trackers.length})
            </span>
            <button
              onClick={onOpenCreateTracker}
              title="Add Custom Tracker Heatmap"
              className="rounded-lg p-1 text-emerald-600 transition hover:bg-slate-100 hover:text-emerald-700"
            >
              <PlusCircle className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            {trackers.map((t) => (
              <div
                key={t.id}
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 font-mono text-xs text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                <div className="flex items-center space-x-2 truncate">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      t.colorScheme === "violet"
                        ? "bg-violet-500"
                        : t.colorScheme === "amber"
                          ? "bg-amber-500"
                          : t.colorScheme === "sky"
                            ? "bg-sky-500"
                            : t.colorScheme === "rose"
                              ? "bg-rose-500"
                              : "bg-emerald-500"
                    }`}
                  />
                  <span className="truncate">{t.title}</span>
                  {t.tag && <span className="text-[9px] text-slate-400">#{t.tag}</span>}
                </div>

                {!t.isDefault && (
                  <button
                    onClick={() => onDeleteTracker(t.id)}
                    className="p-0.5 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-rose-600"
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
          <span className="mb-2 flex items-center gap-1 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            <Tag className="h-3 w-3 text-emerald-600" />
            Hashtag Filters
          </span>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedTag(null)}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] transition ${
                selectedTag === null
                  ? "border border-emerald-500/40 bg-emerald-100/70 font-semibold text-emerald-700"
                  : "border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
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
                    ? "border border-emerald-500/40 bg-emerald-100/70 font-semibold text-emerald-700"
                    : "border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Streak Badge Footer */}
      <div className="border-t border-slate-200/80 pt-4">
        <div className="flex items-center space-x-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3 shadow-2xs">
          <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
            <Flame className="h-5 w-5 fill-amber-500/30" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-amber-900">
              {currentStreak} Day Streak
            </div>
            <div className="font-mono text-[10px] text-slate-500">
              {currentStreak > 0 ? "Keep writing daily!" : "Write a note today"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
