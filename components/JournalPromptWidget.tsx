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
    <div className="bg-gradient-to-r from-violet-950/40 via-purple-950/20 to-[#0f1524] border border-violet-800/40 rounded-2xl p-3.5 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 font-bold block">
            Daily Journal Inspiration
          </span>
          <p className="text-xs font-handwritten text-lg text-violet-100 italic">
            "{currentPrompt}"
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handleNextPrompt}
          className="p-1.5 text-violet-300 hover:text-white hover:bg-violet-900/50 rounded-xl transition text-xs font-mono flex items-center gap-1"
          title="Shuffle Prompt"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Shuffle</span>
        </button>

        <button
          type="button"
          onClick={() => onInsertPrompt(currentPrompt)}
          className="flex items-center space-x-1.5 bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs px-3 py-1.5 rounded-xl transition shadow"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Use Prompt</span>
        </button>
      </div>
    </div>
  );
}
