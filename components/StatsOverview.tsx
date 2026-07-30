"use client";

import React from "react";
import { Flame, Trophy, FileText, CalendarCheck, Zap } from "lucide-react";

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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
      {/* Current Streak */}
      <div className="bg-[#0f1524] border border-gray-800/80 hover:border-amber-500/50 rounded-2xl p-4 transition-all duration-200 shadow-lg group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 font-mono">Current Streak</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
            <Flame className="w-4 h-4 fill-amber-400/20" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold text-white font-mono">{currentStreak}</span>
          <span className="text-xs text-amber-400 font-medium font-mono">days</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 font-mono">
          {currentStreak > 0 ? "🔥 Keep the fire burning!" : "Write today to start!"}
        </p>
      </div>

      {/* Longest Streak */}
      <div className="bg-[#0f1524] border border-gray-800/80 hover:border-violet-500/50 rounded-2xl p-4 transition-all duration-200 shadow-lg group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 font-mono">Best Streak</span>
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold text-white font-mono">{longestStreak}</span>
          <span className="text-xs text-violet-400 font-medium font-mono">days</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 font-mono">Personal record</p>
      </div>

      {/* Total Words */}
      <div className="bg-[#0f1524] border border-gray-800/80 hover:border-emerald-500/50 rounded-2xl p-4 transition-all duration-200 shadow-lg group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 font-mono">Total Ink</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold text-white font-mono">
            {totalWords.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-400 font-medium font-mono">words</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 font-mono">Written in journal</p>
      </div>

      {/* Active Days */}
      <div className="bg-[#0f1524] border border-gray-800/80 hover:border-sky-500/50 rounded-2xl p-4 transition-all duration-200 shadow-lg group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-400 font-mono">Active Days</span>
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold text-white font-mono">{activeDaysCount}</span>
          <span className="text-xs text-sky-400 font-medium font-mono">days</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 font-mono">Days recorded</p>
      </div>
    </div>
  );
}
