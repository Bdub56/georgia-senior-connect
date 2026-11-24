import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { recordVisit } from "@/lib/server-fns";

// Reports one page load per browser visit so the owner hears about the first
// visit of each visitor's day. Failures stay silent: tracking must never
// interrupt the page.
export default function VisitTracker() {
  const record = useServerFn(recordVisit);

  useEffect(() => {
    record({
      data: { path: window.location.pathname, referrer: document.referrer || "" },
    }).catch(() => {});
  }, [record]);

  return null;
}