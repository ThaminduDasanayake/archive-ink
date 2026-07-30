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
      <div className="group rounded-2xl border border-gray-800/80 bg-[#0f1524] p-4 shadow-lg transition-all duration-200 hover:border-amber-500/50">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-gray-400">Current Streak</span>
          <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400 transition-transform group-hover:scale-110">
            <Flame className="h-4 w-4 fill-amber-400/20" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-mono text-2xl font-bold text-white">{currentStreak}</span>
          <span className="font-mono text-xs font-medium text-amber-400">days</span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-gray-400">
          {currentStreak > 0 ? "🔥 Keep the fire burning!" : "Write today to start!"}
        </p>
      </div>

      {/* Longest Streak */}
      <div className="group rounded-2xl border border-gray-800/80 bg-[#0f1524] p-4 shadow-lg transition-all duration-200 hover:border-violet-500/50">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-gray-400">Best Streak</span>
          <div className="rounded-xl bg-violet-500/10 p-2 text-violet-400 transition-transform group-hover:scale-110">
            <Trophy className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-mono text-2xl font-bold text-white">{longestStreak}</span>
          <span className="font-mono text-xs font-medium text-violet-400">days</span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-gray-400">Personal record</p>
      </div>

      {/* Total Words */}
      <div className="group rounded-2xl border border-gray-800/80 bg-[#0f1524] p-4 shadow-lg transition-all duration-200 hover:border-emerald-500/50">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-gray-400">Total Ink</span>
          <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 transition-transform group-hover:scale-110">
            <FileText className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-mono text-2xl font-bold text-white">
            {totalWords.toLocaleString()}
          </span>
          <span className="font-mono text-xs font-medium text-emerald-400">words</span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-gray-400">Written in journal</p>
      </div>

      {/* Active Days */}
      <div className="group rounded-2xl border border-gray-800/80 bg-[#0f1524] p-4 shadow-lg transition-all duration-200 hover:border-sky-500/50">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-gray-400">Active Days</span>
          <div className="rounded-xl bg-sky-500/10 p-2 text-sky-400 transition-transform group-hover:scale-110">
            <CalendarCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="font-mono text-2xl font-bold text-white">{activeDaysCount}</span>
          <span className="font-mono text-xs font-medium text-sky-400">days</span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-gray-400">Days recorded</p>
      </div>
    </div>
  );
}
