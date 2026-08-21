"use client";

import { useEffect, useState } from "react";
import { liveVisitorCount } from "@/lib/utils";

export default function LiveVisitors() {
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    setVisitors(liveVisitorCount());
    const interval = setInterval(() => {
      setVisitors(liveVisitorCount());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (visitors === 0) return <div className="hidden sm:block"></div>;

  return (
    <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground/80 bg-muted/20 px-3 py-1.5 rounded-full w-fit">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
      </span>
      {visitors} live visitors
    </div>
  );
}
