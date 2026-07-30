"use client";

import React from "react";
import { LogIn, LogOut, PenTool, Plus, Search, User as UserIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewNote: () => void;
}

export function Navbar({ searchQuery, setSearchQuery, onNewNote }: NavbarProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-800/80 bg-[#0d121f]/90 px-4 shadow-lg backdrop-blur-md md:px-6">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-950/40">
          <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0b0f19]">
            <PenTool className="h-5 w-5 text-emerald-400" />
          </div>
        </div>
        <div>
          <span className="flex items-center gap-1.5 font-mono text-lg font-bold tracking-wider text-white">
            ARCHIVE <span className="text-emerald-400">INK</span>
          </span>
          <p className="hidden font-mono text-[10px] text-gray-400 sm:block">
            Journaling & Habit Tracker
          </p>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="mx-4 max-w-md flex-1 sm:mx-8">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries, tags, or thoughts... (e.g. #reflection)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-gray-900/90 py-1.5 pr-4 pl-9 text-xs text-gray-200 placeholder-gray-500 transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/40 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300"
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
          className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-black shadow-lg shadow-emerald-900/30 transition-all duration-200 hover:scale-105 hover:bg-emerald-500 active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span className="hidden sm:inline">New Entry</span>
        </button>

        {/* User Auth Profile */}
        {session?.user ? (
          <div className="flex items-center space-x-2 border-l border-gray-800 pl-2">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-8 w-8 rounded-full border border-emerald-500/40"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 bg-gray-800">
                <UserIcon className="h-4 w-4 text-gray-300" />
              </div>
            )}
            <button
              onClick={() => signOut()}
              title="Sign out"
              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-800/80 hover:text-rose-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="flex items-center space-x-1.5 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-xs text-gray-200 transition hover:bg-gray-700"
          >
            <LogIn className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
