"use client";

import { useEffect, useState } from "react";

export default function LiveVisitors({ initialVisitors }: { initialVisitors: number | null }) {
  const [visitors, setVisitors] = useState(initialVisitors ?? 0);
  const [totalVisitors, setTotalVisitors] = useState<number | null>(null);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        if (!sessionStorage.getItem("viralme_tracked")) {
          sessionStorage.setItem("viralme_tracked", "1");
          const res = await fetch("/api/visit", { method: "POST" });
          if (res.ok) {
            const data = await res.json();
            setTotalVisitors(data.totalVisitors);
          }
        } else {
          const res = await fetch("/api/visit");
          if (res.ok) {
             const data = await res.json();
             setTotalVisitors(data.totalVisitors);
          }
        }
      } catch (err) {}
    };
    
    trackVisit();

    const fetchVisitors = async () => {
      try {
        const res = await fetch("/api/live-visitors");
        if (res.ok) {
          const data = await res.json();
          if (data.visitors !== null) {
            setVisitors(data.visitors);
          }
        }
      } catch (err) {}
    };

    const interval = setInterval(fetchVisitors, 30000);
    return () => clearInterval(interval);
  }, []);

  if (visitors === 0 && totalVisitors === null) return <div className="hidden sm:block"></div>;

  return (
    <div className="hidden sm:flex items-center gap-3 text-sm font-medium text-muted-foreground/80 bg-muted/20 px-3 py-1.5 rounded-full w-fit">
      {visitors > 0 && (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          {visitors} live
        </div>
      )}
      
      {visitors > 0 && totalVisitors !== null && (
        <span className="opacity-40">|</span>
      )}

      {totalVisitors !== null && (
        <div className="flex items-center gap-1.5">
          <span>👀</span>
          {totalVisitors.toLocaleString()} total
        </div>
      )}
    </div>
  );
}
