import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./shareable/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Draw With Me",
  description: "Let's draw together 🎉",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAllowedDevice, setIsAllowedDevice] = useState(true);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // Simple check for mobile or tablet devices
    const isMobileOrTablet = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(
      userAgent
    );

    setIsAllowedDevice(!isMobileOrTablet);
  }, []);

    if (!isAllowedDevice) {
    return (
      <html lang="en">
        <body className="bg-black text-white flex items-center justify-center h-screen text-center p-5">
          <div>
            <h1 className="text-3xl font-bold mb-4">🚫 Access Restricted</h1>
            <p className="text-lg">We are only accessible on Laptop or Desktop 💻</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} afterSignOutUrl={'/'}>
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
            {children}
            <Toaster position="top-center"/>
            </TooltipProvider>
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
