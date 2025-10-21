"use client";

import React, { useEffect, useState } from "react";
import {
  Palette,
  Users,
  Zap,
  Shield,
  ArrowRight,
  PenTool,
  Share2,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Navbar from "./shareable/navbar";
import { useTheme } from "next-themes";

export default function App() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // avoid hydration mismatch
  }, []);

  if (!mounted) return null;

  const handleRedirect = () => router.push(`/dashboard`);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-40 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Sketch Anything. Anywhere. Together.
          </h1>
          <p className="text-lg lg:text-xl max-w-2xl mx-auto mb-10 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Reimagining collaboration — real-time drawing for teams, educators & creatives.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <SignedIn>
              <button
                onClick={handleRedirect}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-80 transition"
              >
                <span>Start Drawing</span>
                <ArrowRight className="ml-2 inline-block" />
              </button>
            </SignedIn>

            <SignedOut>
              <SignInButton forceRedirectUrl="/">
                <span className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-80 transition cursor-pointer">
                  Start Drawing <ArrowRight className="ml-2 inline-block" />
                </span>
              </SignInButton>
            </SignedOut>

            <button className="border border-border px-8 py-4 rounded-xl font-semibold text-lg hover:bg-muted transition">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Built to Power Visual Collaboration
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Feature-rich, blazing fast, and beautifully dark.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: <Users />, title: "Real-time Collaboration", desc: "Draw with your team live — no lag, just clarity." },
              { icon: <Palette />, title: "Pro Drawing Tools", desc: "Smooth pens, sharp shapes, and pixel-perfect design." },
              { icon: <Zap />, title: "Lightning Fast", desc: "Optimized for performance. Everything just flows." },
              { icon: <Shield />, title: "Secure by Default", desc: "Encryption built-in. Share with confidence." },
              { icon: <Share2 />, title: "Instant Sharing", desc: "One click. One link. Collaborate in seconds." },
              { icon: <Download />, title: "Flexible Exports", desc: "Export as PNG, SVG or PDF — perfect for anything." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-8 hover:shadow transition-all">
                <div className="mb-4 text-foreground">{icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DrawWithMe</span>
          </div>
          <div className="flex space-x-6 text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
        <div className="text-center text-sm py-4 text-muted-foreground border-t border-border">
          &copy; 2025 DrawWithMe. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
