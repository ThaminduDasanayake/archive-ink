"use client";

import React, { useState } from "react";
import { X, Sparkles, Tag, Palette } from "lucide-react";

interface CreateTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTracker: (data: {
    title: string;
    tag?: string;
    colorScheme: string;
    metricType: string;
  }) => Promise<void>;
}

const COLOR_OPTIONS = [
  { id: "emerald", label: "Emerald Green", bg: "bg-emerald-500" },
  { id: "violet", label: "Violet Purple", bg: "bg-violet-500" },
  { id: "amber", label: "Amber Warm", bg: "bg-amber-500" },
  { id: "sky", label: "Sky Blue", bg: "bg-sky-500" },
  { id: "rose", label: "Rose Crimson", bg: "bg-rose-500" },
];

export function CreateTrackerModal({
  isOpen,
  onClose,
  onCreateTracker,
}: CreateTrackerModalProps) {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [colorScheme, setColorScheme] = useState("violet");
  const [metricType, setMetricType] = useState("AUTO_NOTE");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onCreateTracker({
        title: title.trim(),
        tag: tag.trim() || undefined,
        colorScheme,
        metricType,
      });
      setTitle("");
      setTag("");
      setColorScheme("violet");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f1524] border border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 p-1 rounded-lg hover:bg-gray-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              Add Activity Heatmap
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Track custom habits, specific note tags, or writing routines.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">
              Tracker Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Morning Pages, Code Journal, Gym Log"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Optional Tag Filter */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              Auto-Link Hashtag (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. morning-pages (auto-tracks notes with #morning-pages)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Leave blank if you want a manual click tile habit tracker.
            </p>
          </div>

          {/* Color Scheme Picker */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-2 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-violet-400" />
              Heatmap Color Theme
            </label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColorScheme(c.id)}
                  title={c.label}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${c.bg} ${
                    colorScheme === c.id
                      ? "ring-2 ring-white border-white scale-110"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-emerald-600 hover:bg-emerald-500 text-black transition shadow-lg disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Heatmap"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
