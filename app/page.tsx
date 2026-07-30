"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar, TrackerItem } from "@/components/Sidebar";
import { MultiTrackerBoard } from "@/components/MultiTrackerBoard";
import { StatsOverview } from "@/components/StatsOverview";
import { NoteList, NoteItem } from "@/components/NoteList";
import { PaperEditor, NoteData } from "@/components/PaperEditor";
import { CreateTrackerModal } from "@/components/CreateTrackerModal";
import { ActivityData } from "@/components/HeatmapGrid";
import { getTodayDateString } from "@/lib/utils";

export default function Home() {
  const [activeView, setActiveView] = useState<"dashboard" | "editor" | "notes">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<NoteData | null>(null);
  const [isCreateTrackerOpen, setIsCreateTrackerOpen] = useState(false);

  // State data
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [trackers, setTrackers] = useState<TrackerItem[]>([]);
  const [activitiesMap, setActivitiesMap] = useState<Record<string, ActivityData[]>>({});
  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalWords: 0,
    activeDaysCount: 0,
  });

  // Fetch Trackers
  const fetchTrackers = useCallback(async () => {
    try {
      const res = await fetch("/api/trackers");
      if (res.ok) {
        const data = await res.json();
        setTrackers(data);
        // Fetch activity counts for each tracker
        for (const t of data) {
          fetchTrackerActivities(t.id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch trackers", err);
    }
  }, []);

  // Fetch Activities for a specific tracker
  const fetchTrackerActivities = async (trackerId: string) => {
    try {
      const res = await fetch(`/api/activities?trackerId=${trackerId}`);
      if (res.ok) {
        const data = await res.json();
        setActivitiesMap((prev) => ({ ...prev, [trackerId]: data }));
      }
    } catch (err) {
      console.error("Failed to fetch activities", err);
    }
  };

  // Fetch Notes
  const fetchNotes = useCallback(async () => {
    try {
      let url = "/api/notes";
      const params = new URLSearchParams();
      if (selectedTag) params.set("tag", selectedTag);
      if (selectedDate) params.set("date", selectedDate);
      if (searchQuery) params.set("search", searchQuery);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  }, [selectedTag, selectedDate, searchQuery]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  }, []);

  useEffect(() => {
    fetchTrackers();
    fetchStats();
  }, [fetchTrackers, fetchStats]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [notes]);

  // Actions
  const handleNewNote = () => {
    setEditingNote({
      title: "",
      content: "",
      date: selectedDate || getTodayDateString(),
      tags: [],
      wordCount: 0,
    });
    setActiveView("editor");
  };

  const handleSaveNote = async (data: {
    id?: string;
    title: string;
    content: string;
    date: string;
  }) => {
    try {
      const isUpdate = !!data.id;
      const url = isUpdate ? `/api/notes/${data.id}` : "/api/notes";
      const method = isUpdate ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const saved = await res.json();
        setEditingNote(saved);
        fetchNotes();
        fetchTrackers();
        fetchStats();
      }
    } catch (err) {
      console.error("Save note failed", err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchNotes();
        fetchTrackers();
        fetchStats();
        if (editingNote?.id === id) {
          setEditingNote(null);
          setActiveView("dashboard");
        }
      }
    } catch (err) {
      console.error("Delete note failed", err);
    }
  };

  const handleCreateTracker = async (data: {
    title: string;
    tag?: string;
    colorScheme: string;
    metricType: string;
  }) => {
    try {
      const res = await fetch("/api/trackers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchTrackers();
      }
    } catch (err) {
      console.error("Create tracker failed", err);
    }
  };

  const handleDeleteTracker = async (id: string) => {
    if (confirm("Delete this activity heatmap tracker?")) {
      try {
        const res = await fetch(`/api/trackers/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchTrackers();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCellClickToggle = async (trackerId: string, date: string) => {
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackerId, date }),
      });
      if (res.ok) {
        fetchTrackerActivities(trackerId);
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0f19] font-sans">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onNewNote={handleNewNote} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          trackers={trackers}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          allTags={allTags}
          onOpenCreateTracker={() => setIsCreateTrackerOpen(true)}
          onDeleteTracker={handleDeleteTracker}
          currentStreak={stats.currentStreak}
        />

        {/* Main Content Area */}
        <main className="mx-auto w-full max-w-7xl flex-1 overflow-y-auto p-4 sm:p-6">
          {activeView === "editor" ? (
            <PaperEditor
              note={editingNote}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onClose={() => setActiveView("dashboard")}
            />
          ) : (
            <>
              {/* Habit Streak Stats Overview */}
              <StatsOverview
                currentStreak={stats.currentStreak}
                longestStreak={stats.longestStreak}
                totalWords={stats.totalWords}
                activeDaysCount={stats.activeDaysCount}
              />

              {/* Annual Multi-Tracker Heatmap Boards */}
              <MultiTrackerBoard
                trackers={trackers}
                activitiesMap={activitiesMap}
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setActiveView("notes");
                }}
                onCellClickToggle={handleCellClickToggle}
                onOpenCreateTracker={() => setIsCreateTrackerOpen(true)}
              />

              {/* Recent Notes Section */}
              <NoteList
                notes={notes}
                onSelectNote={(note) => {
                  setEditingNote(note);
                  setActiveView("editor");
                }}
                onDeleteNote={handleDeleteNote}
                onNewNote={handleNewNote}
                selectedTag={selectedTag}
                selectedDate={selectedDate}
              />
            </>
          )}
        </main>
      </div>

      {/* Modal for creating custom activity heatmap */}
      <CreateTrackerModal
        isOpen={isCreateTrackerOpen}
        onClose={() => setIsCreateTrackerOpen(false)}
        onCreateTracker={handleCreateTracker}
      />
    </div>
  );
}
