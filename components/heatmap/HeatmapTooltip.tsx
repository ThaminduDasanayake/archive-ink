import React from "react";
import { HoveredCellInfo } from "./types";

interface HeatmapTooltipProps {
  hoveredCell: HoveredCellInfo | null;
  unitName: string;
}

export function HeatmapTooltip({ hoveredCell, unitName }: HeatmapTooltipProps) {
  if (!hoveredCell) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: `${hoveredCell.x}px`,
        top: `${hoveredCell.y - 8}px`,
        transform: "translate(-50%, -100%)",
      }}
      className="animate-in fade-in zoom-in-95 pointer-events-none z-50 duration-100"
    >
      <div className="rounded-md border border-[#30363d] bg-[#161b22] px-2.5 py-1.5 text-center text-xs font-medium text-[#f0f6fc] shadow-2xl">
        <div>
          <span className="font-semibold text-emerald-400">{hoveredCell.definition.label}</span>{" "}
          <span className="text-[#8b949e]">on {hoveredCell.formattedDate}</span>
        </div>
        <div className="mt-0.5 text-[10px] text-[#8b949e]">
          Level {hoveredCell.level} ({hoveredCell.definition.count} {unitName || "units"}) • Click to cycle
        </div>
      </div>
      <div className="mx-auto -mt-px h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-[#30363d]" />
    </div>
  );
}
