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
    <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
      Sketch Anything. Anywhere. Together.
    </h1>
    
    <p className="text-lg lg:text-xl max-w-2xl mx-auto mb-10">
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

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px] md:auto-rows-[250px]">
      {/* Item 1 - Large */}
      <div className="md:col-span-2 bg-card border border-border rounded-2xl p-8 flex flex-col justify-between hover:shadow transition-all">
        <div className="text-foreground text-3xl"><Users /></div>
        <div>
          <h3 className="text-2xl font-semibold mb-2">Real-time Collaboration</h3>
          <p className="text-muted-foreground text-sm">Draw live with teammates — no lag.</p>
        </div>
      </div>

      {/* Item 2 */}
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col justify-between hover:shadow transition-all">
        <div className="text-foreground text-3xl"><Palette /></div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Pro Drawing Tools</h3>
          <p className="text-muted-foreground text-sm">Precision pens, shapes & more.</p>
        </div>
      </div>

      {/* Item 3 */}
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col justify-between hover:shadow transition-all">
        <div className="text-foreground text-3xl"><Zap /></div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
          <p className="text-muted-foreground text-sm">Optimized for instant response.</p>
        </div>
      </div>

      {/* Item 4 - Tall */}
      <div className="md:row-span-2 bg-card border border-border rounded-2xl p-8 flex flex-col justify-between hover:shadow transition-all">
        <div className="text-foreground text-3xl"><Shield /></div>
        <div>
          <h3 className="text-2xl font-semibold mb-2">Secure by Default</h3>
          <p className="text-muted-foreground text-sm">Encrypted and privacy focused.</p>
        </div>
      </div>

      {/* Item 5 */}
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col justify-between hover:shadow transition-all">
        <div className="text-foreground text-3xl"><Share2 /></div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Instant Sharing</h3>
          <p className="text-muted-foreground text-sm">One link. Zero friction.</p>
        </div>
      </div>

      {/* Item 6 */}
      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col justify-between hover:shadow transition-all">
        <div className="text-foreground text-3xl"><Download /></div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Flexible Exports</h3>
          <p className="text-muted-foreground text-sm">PNG, SVG, or PDF — ready to ship.</p>
        </div>
      </div>
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
