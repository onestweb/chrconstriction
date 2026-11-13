"use client";

/* ==================================================================
   FOOTER TOOLS (shared by every footer design)
   ------------------------------------------------------------------
   The footer is designed per site; these pieces are not.

     const year = useYear();            // null on the server, then the year
     <button onClick={scrollToTop}>Back to top</button>

   copyright(year) gives "© 2001–2026 Name" when SITE.since is set.
   ================================================================== */

import { useEffect, useState } from "react";
import { getLenis } from "@/components/ui/motion/motion";
import { SITE } from "@/components/ui/site";

/** The visitor's current year, set after the page loads (no server/client mismatch). */
export function useYear() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setYear(new Date().getFullYear()));
    return () => cancelAnimationFrame(frame);
  }, []);
  return year;
}

export const copyright = (year: number | null) =>
  `© ${SITE.since && year ? `${SITE.since}–` : ""}${year ?? ""} ${SITE.name}`.replace("  ", " ");

/** Back to the top with the site's smooth scroll, then hand focus to the logo link. */
export function scrollToTop() {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  document.querySelector<HTMLElement>("header a[href='/']")?.focus({ preventScroll: true });
}
