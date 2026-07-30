"use client";

import React from "react";
import { ArrowRight, BookOpen, Calendar, Trash2 } from "lucide-react";
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
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="mb-1 font-mono text-base font-bold text-slate-900">No Journal Entries Found</h3>
        <p className="mx-auto mb-4 max-w-sm font-mono text-xs text-slate-500">
          {selectedTag
            ? `No notes tagged with #${selectedTag}`
            : selectedDate
              ? `No notes recorded for ${selectedDate}`
              : "Start your daily journaling habit by creating your first entry!"}
        </p>
        <button
          onClick={onNewNote}
          className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-500"
        >
          <span>Write First Entry</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-slate-500 uppercase">
          <BookOpen className="h-4 w-4 text-emerald-600" />
          Recent Entries ({notes.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note)}
            className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/60 hover:shadow-md"
          >
            <div>
              {/* Header Info */}
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1 font-mono text-[11px] font-medium text-emerald-600">
                  <Calendar className="h-3 w-3" />
                  {formatDate(note.date)}
                </span>
                <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600">
                  {note.wordCount} words
                </span>
              </div>

              {/* Title */}
              <h4 className="mb-1.5 line-clamp-1 font-mono text-sm font-bold text-slate-900 transition group-hover:text-emerald-700">
                {note.title}
              </h4>

              {/* Snippet */}
              <p className="font-handwritten mb-3 line-clamp-2 text-xs leading-relaxed text-slate-600">
                {note.content || "Empty note content..."}
              </p>
            </div>

            {/* Tags & Actions */}
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-2 font-mono text-[11px]">
              <div className="flex flex-wrap gap-1">
                {note.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600"
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
                className="p-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-rose-600"
                title="Delete Entry"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
