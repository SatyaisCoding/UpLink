"use client";

import { useState } from "react";
import { Activity, Sun, Moon } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

interface AppbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function Appbar({ darkMode, setDarkMode }: AppbarProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-[#121212] text-green-400 font-mono border-b border-green-600">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 text-xl font-bold">
        <Activity className="w-6 h-6 text-green-400" />
        UpLink
      </div>

      {/* Right Side: Dark Mode + Auth Buttons */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-2 py-1 border border-green-600 rounded hover:bg-green-700 transition"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-yellow-400 inline" />
          ) : (
            <Moon className="w-4 h-4 inline" />
          )}
        </button>

        {/* Authentication Buttons */}
        <SignedOut>
          <SignInButton>
            <button className="px-3 py-1 border border-green-600 rounded hover:bg-green-700 transition">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="px-3 py-1 border border-green-600 rounded hover:bg-green-700 transition">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "w-8 h-8 border border-green-600 rounded-full",
                userButtonPopoverCard:
                  "bg-[#1a1a1a] text-green-400 font-mono",
              },
            }}
          />
        </SignedIn>
      </div>
    </div>
  );
}
