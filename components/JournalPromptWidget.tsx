"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw, PlusCircle } from "lucide-react";

const JOURNAL_PROMPTS = [
  "What is one small win or moment of gratitude from your day?",
  "Describe a challenge you faced today and what it taught you.",
  "What intention or mindset do you want to cultivate tomorrow?",
  "What made you pause, smile, or feel at peace recently?",
  "Write about a key decision you're contemplating right now.",
  "If today were a chapter in a book, what would its title be?",
  "What is something you learned or realized this week?",
  "Describe your ideal morning routine and how you felt today.",
];

interface JournalPromptWidgetProps {
  onInsertPrompt: (promptText: string) => void;
}

export function JournalPromptWidget({ onInsertPrompt }: JournalPromptWidgetProps) {
  const [promptIndex, setPromptIndex] = useState(0);

  const currentPrompt = JOURNAL_PROMPTS[promptIndex];

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % JOURNAL_PROMPTS.length);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-800/40 bg-linear-to-r from-violet-950/40 via-purple-950/20 to-[#0f1524] p-3.5 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="rounded-xl bg-violet-500/10 p-2 text-violet-400">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <span className="block font-mono text-[10px] font-bold tracking-wider text-violet-400 uppercase">
            Daily Journal Inspiration
          </span>
          <p className="font-handwritten text-xs text-violet-100 italic">
            &quot;{currentPrompt}&quot;
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handleNextPrompt}
          className="flex items-center gap-1 rounded-xl p-1.5 font-mono text-xs text-violet-300 transition hover:bg-violet-900/50 hover:text-white"
          title="Shuffle Prompt"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Shuffle</span>
        </button>

        <button
          type="button"
          onClick={() => onInsertPrompt(currentPrompt)}
          className="flex items-center space-x-1.5 rounded-xl bg-violet-600 px-3 py-1.5 font-mono text-xs text-white shadow transition hover:bg-violet-500"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Use Prompt</span>
        </button>
      </div>
    </div>
  );
}
