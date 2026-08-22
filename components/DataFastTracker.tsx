"use client";

import { useEffect, useRef } from "react";
import { initDataFast } from "datafast";
import { usePathname } from "next/navigation";

export default function DataFastTracker() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    async function initTracker() {
      if (!initialized.current) {
        try {
          await initDataFast({ 
            websiteId: "dfid_vXi6O2z6DLnvmkHjoQF26", 
            cookieless: true, 
          });
          initialized.current = true;
        } catch (err) {
          console.error("DataFast initialization error:", err);
        }
      }
    }
    initTracker();
  }, [pathname]); 

  return null;
}
