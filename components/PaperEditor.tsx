"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Trash2,
  Calendar,
  Tag as TagIcon,
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Quote,
  CheckCircle,
  X,
  Download,
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
  onSaveNote: (data: { id?: string; title: string; content: string; date: string }) => Promise<void>;
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

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setDate(note?.date || getTodayDateString());
  }, [note]);

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
      } catch (e) {
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
    <div className="bg-[#0f1524] border border-gray-800/80 rounded-2xl shadow-2xl flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
      {/* Top Toolbar */}
      <div className="px-4 py-3 border-b border-gray-800/80 bg-[#0d121f] flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition"
            title="Back to Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-gray-900 border border-gray-800 text-xs font-mono text-gray-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Font Switcher & Formatting Controls */}
        <div className="flex items-center space-x-2">
          {/* Font Selector */}
          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-0.5 text-xs font-mono">
            <button
              onClick={() => setFontStyle("caveat")}
              className={`px-2.5 py-1 rounded-lg transition ${
                fontStyle === "caveat" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "text-gray-400"
              }`}
            >
              Script
            </button>
            <button
              onClick={() => setFontStyle("architects")}
              className={`px-2.5 py-1 rounded-lg transition ${
                fontStyle === "architects" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "text-gray-400"
              }`}
            >
              Analog
            </button>
            <button
              onClick={() => setFontStyle("sans")}
              className={`px-2.5 py-1 rounded-lg transition ${
                fontStyle === "sans" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "text-gray-400"
              }`}
            >
              Clean
            </button>
          </div>

          {/* Formatting buttons */}
          <div className="hidden sm:flex items-center space-x-1 bg-gray-900 border border-gray-800 rounded-xl p-1 text-gray-400">
            <button
              onClick={() => insertFormatting("\n# ")}
              className="p-1 hover:text-white hover:bg-gray-800 rounded"
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("\n## ")}
              className="p-1 hover:text-white hover:bg-gray-800 rounded"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("**bold text**")}
              className="p-1 hover:text-white hover:bg-gray-800 rounded"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("*italic text*")}
              className="p-1 hover:text-white hover:bg-gray-800 rounded"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("\n- ")}
              className="p-1 hover:text-white hover:bg-gray-800 rounded"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting("\n> ")}
              className="p-1 hover:text-white hover:bg-gray-800 rounded"
              title="Quote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download Markdown */}
          <button
            onClick={handleDownloadMarkdown}
            className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-gray-800 rounded-xl transition"
            title="Download Entry as .md File"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Save Action */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs px-3.5 py-1.5 rounded-xl transition shadow-lg disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
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
              className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-gray-800 rounded-xl transition"
              title="Delete Note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body with Prompt Widget */}
      <div className="flex-1 paper-lined-dark p-4 sm:p-8 overflow-y-auto relative text-gray-200">
        {/* Daily Inspiration Prompt Widget */}
        <JournalPromptWidget onInsertPrompt={handleInsertPrompt} />

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title of your journal entry..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent border-b border-gray-800/80 pb-3 mb-6 text-2xl font-bold font-mono text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
        />

        {/* Note Content Textarea */}
        <textarea
          placeholder="Write your daily thoughts, reflections, code snippets, or notes... (Use #hashtags to tag your entries)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`w-full min-h-[380px] bg-transparent resize-none focus:outline-none text-emerald-100 placeholder-gray-600 ${fontClass}`}
        />
      </div>

      {/* Editor Footer */}
      <div className="px-6 py-2.5 border-t border-gray-800/80 bg-[#0d121f] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-gray-400 shrink-0">
        <div className="flex items-center space-x-4">
          <div>
            Word Count: <span className="text-emerald-400 font-bold">{wordCount}</span> words
          </div>
          {tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <TagIcon className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex gap-1">
                {tags.map((t) => (
                  <span key={t} className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5 rounded">
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
