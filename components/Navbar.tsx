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
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 shadow-xs backdrop-blur-md md:px-6">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-md shadow-emerald-200/60">
          <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white">
            <PenTool className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
        <div>
          <span className="flex items-center gap-1.5 font-mono text-lg font-bold tracking-wider text-slate-900">
            ARCHIVE <span className="text-emerald-600">INK</span>
          </span>
          <p className="hidden font-mono text-[10px] text-slate-500 sm:block">
            Journaling & Habit Tracker
          </p>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="mx-4 max-w-md flex-1 sm:mx-8">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search entries, tags, or thoughts... (e.g. #reflection)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-100/80 py-1.5 pr-4 pl-9 text-xs text-slate-800 placeholder-slate-400 transition focus:border-emerald-500/60 focus:bg-white focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
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
          className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all duration-200 hover:scale-105 hover:bg-emerald-500 active:scale-95"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span className="hidden sm:inline">New Entry</span>
        </button>

        {/* User Auth Profile */}
        {session?.user ? (
          <div className="flex items-center space-x-2 border-l border-slate-200 pl-2">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-8 w-8 rounded-full border border-emerald-500/40"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
                <UserIcon className="h-4 w-4 text-slate-600" />
              </div>
            )}
            <button
              onClick={() => signOut()}
              title="Sign out"
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
          >
            <LogIn className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
