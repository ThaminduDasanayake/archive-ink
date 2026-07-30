"use client";

import React, { useState } from "react";
import { Palette, Sparkles, Tag, X } from "lucide-react";

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

export function CreateTrackerModal({ isOpen, onClose, onCreateTracker }: CreateTrackerModalProps) {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [colorScheme, setColorScheme] = useState("violet");
  const [metricType] = useState("AUTO_NOTE");
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
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-xs duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center space-x-2">
          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-mono text-base font-bold text-slate-900">Add Activity Heatmap</h3>
            <p className="font-mono text-xs text-slate-500">
              Track custom habits, specific note tags, or writing routines.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1 block font-mono text-xs text-slate-700">Tracker Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Morning Pages, Code Journal, Gym Log"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Optional Tag Filter */}
          <div>
            <label className="mb-1 block flex items-center gap-1 font-mono text-xs text-slate-700">
              <Tag className="h-3.5 w-3.5 text-emerald-600" />
              Auto-Link Hashtag (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. morning-pages (auto-tracks notes with #morning-pages)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              Leave blank if you want a manual click tile habit tracker.
            </p>
          </div>

          {/* Color Scheme Picker */}
          <div>
            <label className="mb-2 block flex items-center gap-1 font-mono text-xs text-slate-700">
              <Palette className="h-3.5 w-3.5 text-violet-600" />
              Heatmap Color Theme
            </label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColorScheme(c.id)}
                  title={c.label}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${c.bg} ${
                    colorScheme === c.id
                      ? "scale-110 border-slate-900 ring-2 ring-slate-400"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 border-t border-slate-200/80 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 font-mono text-xs text-slate-500 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="rounded-xl bg-emerald-600 px-4 py-2 font-mono text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Heatmap"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
