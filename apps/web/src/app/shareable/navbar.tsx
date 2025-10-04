"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { PenTool } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const openCreateCanvasForm = () => {};

  return (
    <header className="bg-background border-b border-border shadow-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          {/* Left side */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
              <PenTool className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent text-foreground">
              DrawWithMe
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Signed out */}
            <SignedOut>
              <SignInButton forceRedirectUrl={"/dashboard"}>
                <button className="border border-border hover:border-primary text-foreground px-6 py-2 rounded-xl font-semibold text-base transition-all backdrop-blur-sm bg-muted">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full border border-border hover:scale-110 transition"
            >
              {theme === "dark" ? <PenTool className="w-5 h-5 text-yellow-400" /> : <PenTool className="w-5 h-5 text-gray-900" />}
            </button>

            {/* Signed in */}
            <SignedIn>
              <button
                className="md:hidden border border-border hover:border-primary text-foreground px-4 py-2 rounded-lg text-sm transition-all bg-muted backdrop-blur-sm flex items-center gap-2"
                onClick={openCreateCanvasForm}
              >
                <span className="whitespace-nowrap">Create</span>
              </button>

              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 border border-border rounded-full",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
