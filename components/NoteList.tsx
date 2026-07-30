"use client";

import React from "react";
import { BookOpen, Calendar, FileText, Tag, Trash2, ArrowRight, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
  wordCount: number;
  tags: string[];
  createdAt: string;
}

interface NoteListProps {
  notes: NoteItem[];
  onSelectNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onNewNote: () => void;
  selectedTag: string | null;
  selectedDate: string | null;
}

export function NoteList({
  notes,
  onSelectNote,
  onDeleteNote,
  onNewNote,
  selectedTag,
  selectedDate,
}: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="bg-[#0f1524] border border-gray-800/80 rounded-2xl p-10 text-center shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white font-mono mb-1">
          No Journal Entries Found
        </h3>
        <p className="text-xs text-gray-400 font-mono max-w-sm mx-auto mb-4">
          {selectedTag
            ? `No notes tagged with #${selectedTag}`
            : selectedDate
            ? `No notes recorded for ${selectedDate}`
            : "Start your daily journaling habit by creating your first entry!"}
        </p>
        <button
          onClick={onNewNote}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-lg"
        >
          <span>Write First Entry</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          Recent Entries ({notes.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note)}
            className="bg-[#0f1524] border border-gray-800/80 hover:border-emerald-500/50 rounded-2xl p-4 transition-all duration-200 shadow-lg cursor-pointer group flex flex-col justify-between hover:-translate-y-0.5"
          >
            <div>
              {/* Header Info */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-emerald-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(note.date)}
                </span>
                <span className="text-[10px] font-mono text-gray-400 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-md">
                  {note.wordCount} words
                </span>
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-white font-mono group-hover:text-emerald-300 transition line-clamp-1 mb-1.5">
                {note.title}
              </h4>

              {/* Snippet */}
              <p className="text-xs text-gray-400 font-handwritten text-lg line-clamp-2 leading-relaxed mb-3">
                {note.content || "Empty note content..."}
              </p>
            </div>

            {/* Tags & Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800/60 text-[11px] font-mono">
              <div className="flex flex-wrap gap-1">
                {note.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] bg-gray-900 border border-gray-800 text-gray-300 px-1.5 py-0.5 rounded"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Delete this entry?")) {
                    onDeleteNote(note.id);
                  }
                }}
                className="text-gray-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition"
                title="Delete Entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
