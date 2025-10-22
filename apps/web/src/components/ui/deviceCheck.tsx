"use client";
import { useEffect, useState, ReactNode } from "react";

export default function DeviceCheck({ children }: { children: ReactNode }) {
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isMobileOrTablet = /iphone|ipad|ipod|android|tablet/i.test(ua);
    setIsAllowed(!isMobileOrTablet);
  }, []);

  if (!isAllowed)
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <h1 className="text-3xl font-bold">
          🚫 We are only accessible on Laptop/Desktop
        </h1>
      </div>
    );

  return <>{children}</>;
}
