import React from "react";
import {
  ArrowCounterClockwiseIcon,
  CaretDownIcon,
  CheckIcon,
  GearSixIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContributionLevel, ThemeOption, Tracker } from "./types";
import { THEMES } from "./constants";

interface HeatmapSettingsPopoverProps {
  tracker: Tracker;
  showSettingsOpen: boolean;
  setShowSettingsOpen: (open: boolean) => void;
  draftTitle: string;
  setDraftTitle: (title: string) => void;
  draftUnitName: string;
  setDraftUnitName: (unitName: string) => void;
  onUpdateTracker: (updated: Tracker) => void;
  onDeleteTracker?: (id: string) => void;
  currentThemeObj: ThemeOption;
  onRequestConfirmDetails: () => void;
  onRequestClearAll: () => void;
  onRequestDeleteTracker: () => void;
  handleResetPattern: () => void;
}

export function HeatmapSettingsPopover({
  tracker,
  showSettingsOpen,
  setShowSettingsOpen,
  draftTitle,
  setDraftTitle,
  draftUnitName,
  setDraftUnitName,
  onUpdateTracker,
  onDeleteTracker,
  currentThemeObj,
  onRequestConfirmDetails,
  onRequestClearAll,
  onRequestDeleteTracker,
  handleResetPattern,
}: HeatmapSettingsPopoverProps) {
  return (
    <Popover open={showSettingsOpen} onOpenChange={setShowSettingsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:border-[#8b949e] hover:bg-[#30363d] hover:text-white"
        >
          <GearSixIcon className="h-4 w-4 text-[#8b949e]" />
          <span>Contribution settings</span>
          <CaretDownIcon className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 border-[#30363d] bg-[#161b22] p-4 text-xs text-[#c9d1d9] shadow-2xl"
      >
        <Tabs defaultValue="title" className="w-full">
          <TabsList className="mb-3 grid w-full grid-cols-3 border-b border-[#30363d] bg-transparent p-0">
            <TabsTrigger
              value="title"
              className="border-b-2 text-xs data-[state=active]:border-[#58a6ff] data-[state=active]:bg-transparent data-[state=active]:text-[#58a6ff]"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="levels"
              className="border-b-2 text-xs data-[state=active]:border-[#58a6ff] data-[state=active]:bg-transparent data-[state=active]:text-[#58a6ff]"
            >
              Levels
            </TabsTrigger>
            <TabsTrigger
              value="theme"
              className="border-b-2 text-xs data-[state=active]:border-[#58a6ff] data-[state=active]:bg-transparent data-[state=active]:text-[#58a6ff]"
            >
              Theme
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Tracker Details */}
          <TabsContent value="title" className="space-y-3 pt-1">
            <div>
              <label className="mb-1 block text-[10px] font-semibold tracking-wider uppercase text-[#8b949e]">
                Tracker Title
              </label>
              <Input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    (draftTitle !== tracker.title || draftUnitName !== tracker.unitName) &&
                    draftTitle.trim() !== ""
                  ) {
                    e.preventDefault();
                    onRequestConfirmDetails();
                  }
                }}
                placeholder="e.g. Gym Workouts 2026"
                className="border-[#30363d] bg-[#0d1117] text-xs text-[#f0f6fc] focus-visible:ring-[#58a6ff]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold tracking-wider uppercase text-[#8b949e]">
                Unit Name
              </label>
              <Input
                type="text"
                value={draftUnitName}
                onChange={(e) => setDraftUnitName(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    (draftTitle !== tracker.title || draftUnitName !== tracker.unitName) &&
                    draftTitle.trim() !== ""
                  ) {
                    e.preventDefault();
                    onRequestConfirmDetails();
                  }
                }}
                placeholder="e.g. contributions, workouts, hours"
                className="border-[#30363d] bg-[#0d1117] text-xs text-[#f0f6fc] focus-visible:ring-[#58a6ff]"
              />
            </div>
            <Button
              type="button"
              disabled={
                draftTitle.trim() === "" ||
                (draftTitle === tracker.title && draftUnitName === tracker.unitName)
              }
              onClick={onRequestConfirmDetails}
              className="w-full bg-[#238636] text-xs font-medium text-white hover:bg-[#2ea043] disabled:opacity-50"
            >
              Save Changes
            </Button>
          </TabsContent>

          {/* Tab 2: Customize Level Definitions */}
          <TabsContent value="levels" className="space-y-2 pt-1">
            <p className="mb-2 text-[11px] text-[#8b949e]">
              Define label & count for each level:
            </p>
            {([1, 2, 3, 4] as ContributionLevel[]).map((lvl) => (
              <div key={lvl} className="flex items-center gap-2">
                <span
                  className={`h-3 w-3 rounded-xs border ${currentThemeObj.levels[lvl]} ${currentThemeObj.borderLevels[lvl]}`}
                />
                <span className="w-9 font-medium text-[#c9d1d9]">Lvl {lvl}</span>
                <Input
                  type="text"
                  value={tracker.levelDefs[lvl]?.label || ""}
                  onChange={(e) => {
                    const newDefs = { ...tracker.levelDefs };
                    newDefs[lvl] = {
                      ...newDefs[lvl],
                      label: e.target.value,
                    };
                    onUpdateTracker({ ...tracker, levelDefs: newDefs });
                  }}
                  placeholder="Label"
                  className="h-7 flex-1 border-[#30363d] bg-[#0d1117] px-2 text-[11px] text-[#f0f6fc]"
                />
                <Input
                  type="number"
                  value={tracker.levelDefs[lvl]?.count ?? lvl}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    const newDefs = { ...tracker.levelDefs };
                    newDefs[lvl] = {
                      ...newDefs[lvl],
                      count: val,
                    };
                    onUpdateTracker({ ...tracker, levelDefs: newDefs });
                  }}
                  className="h-7 w-12 border-[#30363d] bg-[#0d1117] px-1 text-center text-[11px] text-[#f0f6fc]"
                />
              </div>
            ))}
          </TabsContent>

          {/* Tab 3: Themes */}
          <TabsContent value="theme" className="grid grid-cols-1 gap-1 pt-1">
            {Object.values(THEMES).map((theme) => (
              <button
                key={theme.id}
                onClick={() => onUpdateTracker({ ...tracker, colorTheme: theme.id })}
                className={`flex items-center justify-between rounded px-2.5 py-1.5 text-left transition-colors ${
                  tracker.colorTheme === theme.id
                    ? "bg-[#1f6feb]/20 text-[#58a6ff]"
                    : "text-[#c9d1d9] hover:bg-[#21262d]"
                }`}
              >
                <span className="font-medium">{theme.name}</span>
                <div className="flex items-center gap-1">
                  {theme.levels.slice(1).map((lvl, idx) => (
                    <span key={idx} className={`h-2.5 w-2.5 rounded-[1px] ${lvl}`} />
                  ))}
                  {tracker.colorTheme === theme.id && (
                    <CheckIcon className="ml-1.5 h-3.5 w-3.5" />
                  )}
                </div>
              </button>
            ))}
          </TabsContent>
        </Tabs>

        {/* Presets & Delete Actions */}
        <div className="mt-4 border-t border-[#30363d] pt-3">
          <div className="mb-2 text-[10px] font-semibold tracking-wider uppercase text-[#8b949e]">
            Presets & Actions
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={handleResetPattern}
              className="flex items-center gap-2 rounded px-2.5 py-1.5 text-[#c9d1d9] transition-colors hover:bg-[#21262d]"
            >
              <ArrowCounterClockwiseIcon className="h-3.5 w-3.5 text-[#3fb950]" />
              <span>Reset Sample Data</span>
            </button>
            <button
              onClick={onRequestClearAll}
              className="flex items-center gap-2 rounded px-2.5 py-1.5 text-[#c9d1d9] transition-colors hover:bg-[#21262d]"
            >
              <TrashIcon className="h-3.5 w-3.5 text-[#8b949e]" />
              <span>Clear All Cells</span>
            </button>

            {onDeleteTracker && (
              <button
                onClick={onRequestDeleteTracker}
                className="mt-1 flex items-center gap-2 rounded px-2.5 py-1.5 font-medium text-[#f85149] transition-colors hover:bg-[#f85149]/10"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                <span>Delete Tracker</span>
              </button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
