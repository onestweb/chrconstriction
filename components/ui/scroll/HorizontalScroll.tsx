"use client";

/* ==================================================================
   HORIZONTAL SCROLL (a pinned row that moves sideways as you scroll)
   ------------------------------------------------------------------
   The section pins for as long as the row takes to travel; the
   page's own vertical scroll moves the cards left. A sideways
   trackpad swipe, a drag or a flick also move it, and a release
   snaps to the nearest card. An optional rail names each card and
   fills as you go; its buttons jump straight to a card.

     import HorizontalScroll from "@/components/ui/scroll/HorizontalScroll";
     <HorizontalScroll labels={["Plan", "Build", "Finish"]} label="Our process">
       {STEPS.map((s) => <li key={s.title}>...card...</li>)}
     </HorizontalScroll>

   Props:
     labels     one short name per card, for the rail (optional)
     label      aria-label for the list
     children   the <li> cards; their width comes from cardWidth
     cardWidth  Tailwind auto-cols classes (default: 84vw / 72vw / 56rem)

   Under reduced motion the cards still move with the scroll (it is
   the reader's own scroll), and the snap after a swipe is instant.

   Sections in this file:
     1. HOOK      the scroll-linked track and swiping
     2. SECTION   the tall track, the sticky stage, the rail
   ================================================================== */

import { useEffect, useRef, useState, type ReactNode } from "react";

// Lines the row up with the site's max-w-360 container, and lets it run off the edge.
const EDGE = "px-5 sm:px-8 lg:px-[max(3rem,calc((100vw-90rem)/2+3rem))]";

/** Where a release at this velocity would come to rest (px), as iOS scrolling decelerates. */
const project = (velocity: number, rate = 0.998) => ((velocity / 1000) * rate) / (1 - rate);

/* ==================================================================
   1. HOOK
   ================================================================== */

function useHorizontalScroll(count: number) {
  const track = useRef<HTMLDivElement | null>(null);
  const row = useRef<HTMLOListElement | null>(null);
  const fill = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);
  const distance = useRef(0);

  const bounds = () => {
    const t = track.current!;
    return { top: t.getBoundingClientRect().top + window.scrollY, range: t.offsetHeight - window.innerHeight };
  };

  // Page position at which card i sits at the start of the row.
  const stopFor = (i: number) => {
    const r = row.current;
    const card = r?.children[i] as HTMLElement | undefined;
    const first = r?.children[0] as HTMLElement | undefined;
    const { top, range } = bounds();
    if (!card || !first || distance.current <= 0) return top;
    return top + Math.min(1, (card.offsetLeft - first.offsetLeft) / distance.current) * range;
  };

  useEffect(() => {
    const t = track.current;
    const r = row.current;
    if (!t || !r) return;
    const area = r.parentElement!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    // The track is one screen tall plus the sideways distance to travel.
    const measure = () => {
      distance.current = Math.max(0, r.scrollWidth - area.clientWidth);
      t.style.height = `${window.innerHeight + distance.current}px`;
    };

    // Per frame: written straight to the DOM; only the active card goes through state.
    const update = () => {
      raf = 0;
      const box = t.getBoundingClientRect();
      const range = box.height - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -box.top / range)) : 0;
      r.style.transform = `translate3d(${-p * distance.current}px, 0, 0)`;
      const step = p * (count - 1);
      if (fill.current) fill.current.style.transform = `scaleX(${(step + 1) / count})`;
      setActive(Math.round(step));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      schedule();
    };

    const pinned = () => {
      const b = t.getBoundingClientRect();
      return b.top <= 1 && b.bottom >= window.innerHeight - 1;
    };
    const clamp = (y: number) => {
      const { top, range } = bounds();
      return Math.min(top + Math.max(0, range), Math.max(top, y));
    };
    const jump = (y: number) => window.scrollTo({ top: y, behavior: "instant" });

    // Touchpad: a sideways two-finger swipe arrives as horizontal wheel deltas.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || !pinned()) return;
      const target = clamp(window.scrollY + e.deltaX * (e.deltaMode === 1 ? 16 : 1));
      if (Math.abs(target - window.scrollY) < 0.5) return; // at an end: leave it to the browser
      e.preventDefault();
      jump(target);
    };

    // Touch and mouse: decide the direction after 10px, then track 1:1.
    type Drag = { id: number; x: number; y: number; start: number; intent: "h" | "v" | null; history: { t: number; x: number }[] };
    let drag: Drag | null = null;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (!pinned() || (e.target as HTMLElement).closest("button, a")) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, start: window.scrollY, intent: null, history: [{ t: e.timeStamp, x: e.clientX }] };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (!drag.intent) {
        if (Math.hypot(dx, dy) < 10) return;
        drag.intent = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
        if (drag.intent === "v") {
          drag = null; // a vertical pan: the page scrolls as normal
          return;
        }
        t.setPointerCapture(e.pointerId);
        t.dataset.dragging = "";
      }
      e.preventDefault();
      jump(clamp(drag.start - dx));
      drag.history.push({ t: e.timeStamp, x: e.clientX });
      while (drag.history.length > 2 && e.timeStamp - drag.history[0].t > 100) drag.history.shift();
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag;
      drag = null;
      delete t.dataset.dragging;
      if (d.intent !== "h") return;
      // Release velocity over the last ~100ms, projected forward, then snap to the nearest card.
      const first = d.history[0];
      const last = d.history[d.history.length - 1];
      const velocity = last.t > first.t ? ((last.x - first.x) / (last.t - first.t)) * 1000 : 0;
      const resting = window.scrollY - project(velocity);
      let best = 0;
      for (let i = 1; i < count; i++) {
        if (Math.abs(stopFor(i) - resting) < Math.abs(stopFor(best) - resting)) best = i;
      }
      window.scrollTo({ top: stopFor(best), behavior: still.matches ? "instant" : "smooth" });
    };

    measure();
    schedule();
    document.fonts?.ready.then(onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(area);
    ro.observe(r);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    t.addEventListener("wheel", onWheel, { passive: false });
    t.addEventListener("pointerdown", onDown);
    t.addEventListener("pointermove", onMove);
    t.addEventListener("pointerup", onUp);
    t.addEventListener("pointercancel", onUp);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      t.removeEventListener("wheel", onWheel);
      t.removeEventListener("pointerdown", onDown);
      t.removeEventListener("pointermove", onMove);
      t.removeEventListener("pointerup", onUp);
      t.removeEventListener("pointercancel", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const goTo = (i: number) => window.scrollTo({ top: stopFor(i), behavior: "instant" });

  return [track, row, fill, active, goTo] as const;
}

/* ==================================================================
   2. SECTION
   ================================================================== */

type Props = {
  children: ReactNode[];
  labels?: string[];
  label: string;
  cardWidth?: string;
};

export default function HorizontalScroll({
  children,
  labels,
  label,
  cardWidth = "auto-cols-[84vw] sm:auto-cols-[72vw] lg:auto-cols-[min(58vw,56rem)]",
}: Props) {
  const [track, row, fill, active, goTo] = useHorizontalScroll(children.length);

  return (
    <div ref={track} className="relative" style={{ height: "300svh" }}>
      {/* touch-action pan-y: the browser keeps vertical pans, sideways swipes come to the hook */}
      <div className="hscroll-stage sticky top-0 flex h-svh touch-pan-y flex-col overflow-hidden pb-8 pt-24 select-none">
        {labels && (
          <div className="mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-12">
            <div className="relative h-[3px] overflow-hidden rounded-full bg-current/10">
              <span ref={fill} className="absolute inset-0 origin-left rounded-full bg-brand" style={{ transform: `scaleX(${1 / labels.length})` }} />
            </div>
            <div className="mt-3 grid gap-2 sm:gap-4" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
              {labels.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? "step" : undefined}
                  className={`truncate rounded-sm text-left text-[13px] font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring sm:text-[14px] ${
                    i === active ? "opacity-100" : "opacity-45 hover:opacity-75"
                  }`}
                >
                  <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> {name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex min-h-0 flex-1 flex-col justify-center sm:mt-8">
          <ol ref={row} aria-label={label} className={`grid w-max grid-flow-col items-start gap-x-3 will-change-transform sm:gap-x-5 lg:gap-x-6 ${cardWidth} ${EDGE}`}>
            {children}
          </ol>
        </div>
      </div>
      <style>{`
        @media (pointer: fine) { .hscroll-stage ol { cursor: grab; } [data-dragging] .hscroll-stage ol { cursor: grabbing; } }
      `}</style>
    </div>
  );
}
