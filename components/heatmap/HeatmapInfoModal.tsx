import React from "react";
import { SparkleIcon, XIcon } from "@phosphor-icons/react";
import { ContributionLevel, ThemeOption, Tracker } from "./types";

interface HeatmapInfoModalProps {
  showInfoModal: boolean;
  setShowInfoModal: (show: boolean) => void;
  tracker: Tracker;
  currentThemeObj: ThemeOption;
}

export function HeatmapInfoModal({
  showInfoModal,
  setShowInfoModal,
  tracker,
  currentThemeObj,
}: HeatmapInfoModalProps) {
  if (!showInfoModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-xl border border-[#30363d] bg-[#161b22] p-6 text-slate-100 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-[#30363d] pb-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[#f0f6fc]">
            <SparkleIcon className="h-5 w-5 text-emerald-400" />
            Tracker: {tracker.title}
          </h3>
          <button
            onClick={() => setShowInfoModal(false)}
            className="text-[#8b949e] hover:text-white"
          >
            <XIcon weight="bold" />
          </button>
        </div>
        <div className="space-y-3 text-xs leading-relaxed text-[#c9d1d9]">
          <p>
            Click any cell on the grid to log activity for that day. Left click cycles through
            intensity levels (0 &rarr; 1 &rarr; 2 &rarr; 3 &rarr; 4).
          </p>
          <div className="mt-4 rounded-lg border border-[#30363d] bg-[#0d1117] p-3 text-[11px]">
            <span className="font-semibold text-emerald-400">Custom Level Definitions:</span>
            <div className="mt-2 space-y-1 text-[#8b949e]">
              {([0, 1, 2, 3, 4] as ContributionLevel[]).map((lvl) => (
                <div key={lvl} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-[1px] ${currentThemeObj.levels[lvl]}`}
                    />
                    <span>Level {lvl}:</span>
                  </span>
                  <span className="font-medium text-[#f0f6fc]">
                    {tracker.levelDefs[lvl]?.label || "N/A"} (
                    {tracker.levelDefs[lvl]?.count ?? lvl} {tracker.unitName})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowInfoModal(false)}
            className="rounded-md bg-[#238636] px-4 py-2 text-xs font-medium text-white hover:bg-[#2ea043]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
