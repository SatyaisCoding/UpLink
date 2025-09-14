"use client";
import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

const Appbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isSignedIn } = useUser(); // check user signed in

  useEffect(() => setMounted(true), []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#121212] border-b border-green-600 flex items-center justify-between px-6 z-50 transition-colors duration-300">
      <h1 className="font-bold text-lg text-black dark:text-green-400">UpLink</h1>

      <div className="flex items-center gap-4">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded hover:bg-green-700 transition"
        >
          {mounted ? (
            darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-400" />
            )
          ) : (
            <span className="w-5 h-5 inline-block" />
          )}
        </button>

        {mounted && !isSignedIn ? (
          <>
            {/* SignIn/SignUp buttons using modal mode to avoid SSR mismatch */}
            <SignInButton mode="modal">
              <button className="px-3 py-1 border border-green-600 rounded hover:bg-green-700 transition">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="px-3 py-1 bg-green-700 rounded hover:bg-green-600 transition">
                Sign Up
              </button>
            </SignUpButton>
          </>
        ) : null}

        {mounted && isSignedIn && <UserButton />}
      </div>
    </header>
  );
};

export default Appbar;
