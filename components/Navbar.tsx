"use client";

import React from "react";
import { PenTool, Plus, Search, LogIn, LogOut, User as UserIcon, Sparkles } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewNote: () => void;
}

export function Navbar({ searchQuery, setSearchQuery, onNewNote }: NavbarProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b border-gray-800/80 bg-[#0d121f]/90 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-lg">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-950/40">
          <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
            <PenTool className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
        <div>
          <span className="text-lg font-bold tracking-wider text-white font-mono flex items-center gap-1.5">
            ARCHIVE <span className="text-emerald-400">INK</span>
          </span>
          <p className="text-[10px] text-gray-400 font-mono hidden sm:block">
            Journaling & Habit Tracker
          </p>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md mx-4 sm:mx-8">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries, tags, or thoughts... (e.g. #reflection)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/90 border border-gray-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/40 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        {/* New Entry Button */}
        <button
          onClick={onNewNote}
          className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold text-xs px-3.5 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/30 hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">New Entry</span>
        </button>

        {/* User Auth Profile */}
        {session?.user ? (
          <div className="flex items-center space-x-2 pl-2 border-l border-gray-800">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-8 h-8 rounded-full border border-emerald-500/40"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                <UserIcon className="w-4 h-4 text-gray-300" />
              </div>
            )}
            <button
              onClick={() => signOut()}
              title="Sign out"
              className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-gray-800/80 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="flex items-center space-x-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs px-3 py-2 rounded-xl transition border border-gray-700"
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
