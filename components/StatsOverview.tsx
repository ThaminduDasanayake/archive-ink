"use client";

import React from "react";
import { CalendarCheck, FileText, Flame, Trophy } from "lucide-react";

interface StatsProps {
  currentStreak: number;
  longestStreak: number;
  totalWords: number;
  activeDaysCount: number;
}

export function StatsOverview({
  currentStreak,
  longestStreak,
  totalWords,
  activeDaysCount,
}: StatsProps) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
      {/* Current Streak */}
      <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-amber-400 hover:shadow-md">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-slate-500">Current Streak</span>
          <div className="rounded-xl bg-amber-50 p-2 text-amber-600 transition-transform group-hover:scale-110">
            <Flame className="h-4 w-4 fill-amber-500/20" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-mono text-2xl font-bold text-slate-900">{currentStreak}</span>
          <span className="font-mono text-xs font-medium text-amber-600">days</span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-slate-500">
          {currentStreak > 0 ? "🔥 Keep the fire burning!" : "Write today to start!"}
        </p>
      </div>

      {/* Longest Streak */}
      <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-violet-400 hover:shadow-md">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-slate-500">Best Streak</span>
          <div className="rounded-xl bg-violet-50 p-2 text-violet-600 transition-transform group-hover:scale-110">
            <Trophy className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-mono text-2xl font-bold text-slate-900">{longestStreak}</span>
          <span className="font-mono text-xs font-medium text-violet-600">days</span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-slate-500">Personal record</p>
      </div>

      {/* Total Words */}
      <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-emerald-400 hover:shadow-md">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-slate-500">Total Ink</span>
          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 transition-transform group-hover:scale-110">
            <FileText className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-mono text-2xl font-bold text-slate-900">
            {totalWords.toLocaleString()}
          </span>
          <span className="font-mono text-xs font-medium text-emerald-600">words</span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-slate-500">Written in journal</p>
      </div>

      {/* Active Days */}
      <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-sky-400 hover:shadow-md">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-slate-500">Active Days</span>
          <div className="rounded-xl bg-sky-50 p-2 text-sky-600 transition-transform group-hover:scale-110">
            <CalendarCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-mono text-2xl font-bold text-slate-900">{activeDaysCount}</span>
          <span className="font-mono text-xs font-medium text-sky-600">days</span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-slate-500">Days recorded</p>
      </div>
    </div>
  );
}
