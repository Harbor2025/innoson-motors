"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 2000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    >
      <Image
        src="/images/logo-header.png"
        alt="Innoson Vehicle Manufacturing"
        width={207}
        height={121}
        priority
        className="h-auto w-[160px] sm:w-[207px]"
      />
    </div>
  );
}
