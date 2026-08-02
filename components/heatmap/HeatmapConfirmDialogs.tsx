import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tracker } from "./types";

interface HeatmapConfirmDialogsProps {
  tracker: Tracker;
  draftTitle: string;
  setDraftTitle: (title: string) => void;
  draftUnitName: string;
  setDraftUnitName: (unitName: string) => void;
  showConfirmDetailsDialog: boolean;
  setShowConfirmDetailsDialog: (show: boolean) => void;
  showClearAllDialog: boolean;
  setShowClearAllDialog: (show: boolean) => void;
  showDeleteTrackerDialog: boolean;
  setShowDeleteTrackerDialog: (show: boolean) => void;
  onUpdateTracker: (updated: Tracker) => void;
  onDeleteTracker?: (id: string) => void;
  onConfirmClearAll: () => void;
}

export function HeatmapConfirmDialogs({
  tracker,
  draftTitle,
  setDraftTitle,
  draftUnitName,
  setDraftUnitName,
  showConfirmDetailsDialog,
  setShowConfirmDetailsDialog,
  showClearAllDialog,
  setShowClearAllDialog,
  showDeleteTrackerDialog,
  setShowDeleteTrackerDialog,
  onUpdateTracker,
  onDeleteTracker,
  onConfirmClearAll,
}: HeatmapConfirmDialogsProps) {
  return (
    <>
      {/* 1. Title & Unit Name Change Confirmation Dialog */}
      <AlertDialog open={showConfirmDetailsDialog} onOpenChange={setShowConfirmDetailsDialog}>
        <AlertDialogContent className="border-[#30363d] bg-[#161b22] text-[#c9d1d9]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f0f6fc]">
              Confirm Details Update
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b949e]">
              Are you sure you want to update the details for this tracker?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-2 space-y-2 rounded-lg border border-[#30363d] bg-[#0d1117] p-3 text-xs text-[#c9d1d9]">
            {draftTitle !== tracker.title && (
              <div>
                <span className="font-medium text-[#8b949e]">Title: </span>
                <span className="line-through text-[#8b949e]">{tracker.title}</span> &rarr;{" "}
                <span className="font-semibold text-emerald-400">{draftTitle}</span>
              </div>
            )}
            {draftUnitName !== tracker.unitName && (
              <div>
                <span className="font-medium text-[#8b949e]">Unit Name: </span>
                <span className="line-through text-[#8b949e]">{tracker.unitName}</span> &rarr;{" "}
                <span className="font-semibold text-emerald-400">{draftUnitName}</span>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDraftTitle(tracker.title);
                setDraftUnitName(tracker.unitName);
                setShowConfirmDetailsDialog(false);
              }}
              className="border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onUpdateTracker({
                  ...tracker,
                  title: draftTitle.trim() || tracker.title,
                  unitName: draftUnitName.trim(),
                });
                setShowConfirmDetailsDialog(false);
              }}
              className="bg-[#238636] text-white hover:bg-[#2ea043]"
            >
              Confirm Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2. Clear All Cells Confirmation Dialog */}
      <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <AlertDialogContent className="border-[#30363d] bg-[#161b22] text-[#c9d1d9]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f0f6fc]">Clear All Activity?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b949e]">
              Are you sure you want to clear all logged contributions for{" "}
              <span className="font-semibold text-[#f0f6fc]">"{tracker.title}"</span>? This will reset all grid cells back to level 0.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowClearAllDialog(false)}
              className="border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onConfirmClearAll();
                setShowClearAllDialog(false);
              }}
              className="bg-[#da3633] text-white hover:bg-[#f85149]"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 3. Delete Tracker Confirmation Dialog */}
      <AlertDialog open={showDeleteTrackerDialog} onOpenChange={setShowDeleteTrackerDialog}>
        <AlertDialogContent className="border-[#30363d] bg-[#161b22] text-[#c9d1d9]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f0f6fc]">Delete Tracker?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b949e]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#f0f6fc]">"{tracker.title}"</span>? This tracker and all its historical records will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowDeleteTrackerDialog(false)}
              className="border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (onDeleteTracker) {
                  onDeleteTracker(tracker.id);
                }
                setShowDeleteTrackerDialog(false);
              }}
              className="bg-[#da3633] text-white hover:bg-[#f85149]"
            >
              Delete Tracker
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
