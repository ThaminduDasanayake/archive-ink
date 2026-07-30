"use client";

import React, { useState } from "react";
import {
  Bold,
  Calendar,
  CheckCircle,
  Download,
  Heading1,
  Heading2,
  Italic,
  List,
  Quote,
  Save,
  Tag as TagIcon,
  Trash2,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { calculateWordCount, extractTags, getTodayDateString } from "@/lib/utils";
import { JournalPromptWidget } from "./JournalPromptWidget";

export interface NoteData {
  id?: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  wordCount: number;
}

interface PaperEditorProps {
  note: NoteData | null;
  onSaveNote: (data: {
    id?: string;
    title: string;
    content: string;
    date: string;
  }) => Promise<void>;
  onDeleteNote?: (id: string) => Promise<void>;
  onClose: () => void;
}

export function PaperEditor({ note, onSaveNote, onDeleteNote, onClose }: PaperEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [date, setDate] = useState(note?.date || getTodayDateString());
  const [fontStyle, setFontStyle] = useState<"caveat" | "architects" | "sans">("caveat");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const wordCount = calculateWordCount(content);
  const tags = extractTags(content + " " + title);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    setIsSaving(true);
    try {
      await onSaveNote({
        id: note?.id,
        title: title.trim() || "Untitled Journal Entry",
        content,
        date,
      });
      setSaveSuccess(true);
      // Trigger subtle celebratory confetti burst
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#10b981", "#8b5cf6", "#f59e0b"],
        });
      } catch {
        // Fallback if canvas-confetti environment is quiet
      }
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const filename = `${(title.trim() || "journal-entry").toLowerCase().replace(/[^a-z0-9]/g, "-")}.md`;
    const markdownContent = `# ${title.trim() || "Journal Entry"}\n*Date: ${date}*\n\n${content}`;
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleInsertPrompt = (promptText: string) => {
    setContent((prev) => {
      const prefix = prev.trim() ? `${prev}\n\n` : "";
      return `${prefix}> **Journal Prompt**: *${promptText}*\n\n`;
    });
  };

  const insertFormatting = (syntax: string) => {
    setContent((prev) => prev + syntax);
  };

  const fontClass =
    fontStyle === "caveat"
      ? "font-handwritten text-2xl tracking-wide leading-relaxed"
      : fontStyle === "architects"
        ? "font-architects text-xl leading-relaxed"
        : "font-sans text-base leading-relaxed";

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-2xl border border-gray-800/80 bg-[#0f1524] shadow-2xl">
      {/* Top Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-gray-800/80 bg-[#0d121f] px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-white"
            title="Back to Dashboard"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-gray-800 bg-gray-900 px-2.5 py-1 font-mono text-xs text-gray-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Font Switcher & Formatting Controls */}
        <div className="flex items-center space-x-2">
          {/* Font Selector */}
          <div className="flex items-center rounded-xl border border-gray-800 bg-gray-900 p-0.5 font-mono text-xs">
            <button
              onClick={() => setFontStyle("caveat")}
              className={`rounded-lg px-2.5 py-1 transition ${
                fontStyle === "caveat"
                  ? "bg-emerald-500/20 font-bold text-emerald-400"
                  : "text-gray-400"
              }`}
            >
              Script
            </button>
            <button
              onClick={() => setFontStyle("architects")}
              className={`rounded-lg px-2.5 py-1 transition ${
                fontStyle === "architects"
                  ? "bg-emerald-500/20 font-bold text-emerald-400"
                  : "text-gray-400"
              }`}
            >
              Analog
            </button>
            <button
              onClick={() => setFontStyle("sans")}
              className={`rounded-lg px-2.5 py-1 transition ${
                fontStyle === "sans"
                  ? "bg-emerald-500/20 font-bold text-emerald-400"
                  : "text-gray-400"
              }`}
            >
              Clean
            </button>
          </div>

          {/* Formatting buttons */}
          <div className="hidden items-center space-x-1 rounded-xl border border-gray-800 bg-gray-900 p-1 text-gray-400 sm:flex">
            <button
              onClick={() => insertFormatting("\n# ")}
              className="rounded p-1 hover:bg-gray-800 hover:text-white"
              title="Heading 1"
            >
              <Heading1 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("\n## ")}
              className="rounded p-1 hover:bg-gray-800 hover:text-white"
              title="Heading 2"
            >
              <Heading2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("**bold text**")}
              className="rounded p-1 hover:bg-gray-800 hover:text-white"
              title="Bold"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("*italic text*")}
              className="rounded p-1 hover:bg-gray-800 hover:text-white"
              title="Italic"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("\n- ")}
              className="rounded p-1 hover:bg-gray-800 hover:text-white"
              title="Bullet List"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("\n> ")}
              className="rounded p-1 hover:bg-gray-800 hover:text-white"
              title="Quote"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Download Markdown */}
          <button
            onClick={handleDownloadMarkdown}
            className="rounded-xl p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-emerald-400"
            title="Download Entry as .md File"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Save Action */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-black shadow-lg transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving..." : "Save Entry"}</span>
              </>
            )}
          </button>

          {/* Delete Action */}
          {note?.id && onDeleteNote && (
            <button
              onClick={async () => {
                if (confirm("Are you sure you want to delete this journal entry?")) {
                  await onDeleteNote(note.id!);
                  onClose();
                }
              }}
              className="rounded-xl p-1.5 text-gray-500 transition hover:bg-gray-800 hover:text-rose-400"
              title="Delete Note"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body with Prompt Widget */}
      <div className="paper-lined-dark relative flex-1 overflow-y-auto p-4 text-gray-200 sm:p-8">
        {/* Daily Inspiration Prompt Widget */}
        <JournalPromptWidget onInsertPrompt={handleInsertPrompt} />

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title of your journal entry..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-6 w-full border-b border-gray-800/80 bg-transparent pb-3 font-mono text-2xl font-bold text-white placeholder-gray-600 transition focus:border-emerald-500 focus:outline-none"
        />

        {/* Note Content Textarea */}
        <textarea
          placeholder="Write your daily thoughts, reflections, code snippets, or notes... (Use #hashtags to tag your entries)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`min-h-[380px] w-full resize-none bg-transparent text-emerald-100 placeholder-gray-600 focus:outline-none ${fontClass}`}
        />
      </div>

      {/* Editor Footer */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-gray-800/80 bg-[#0d121f] px-6 py-2.5 font-mono text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <div>
            Word Count: <span className="font-bold text-emerald-400">{wordCount}</span> words
          </div>
          {tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <TagIcon className="h-3.5 w-3.5 text-emerald-400" />
              <div className="flex gap-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-emerald-800/40 bg-emerald-950/60 px-1.5 py-0.5 text-[10px] text-emerald-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-[11px] text-gray-500">
          Markdown supported (# headers, - lists, *italics*, **bold**)
        </div>
      </div>
    </div>
  );
}
