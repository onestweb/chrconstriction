"use client";

/* ==================================================================
   MARQUEE (a looping strip with real physics)
   ------------------------------------------------------------------
   A full-width strip that cruises sideways forever, edge to edge.
     - Hover, focus or tap: eases smoothly to a stop (and back again).
     - Drag it: it follows the finger 1:1; let go and it keeps the
       flick's speed, then settles back to its cruise.
     - Runs only while on screen.
     - Reduced motion: no travel; the items sit still and wrap.

     import Marquee from "@/components/ui/scroll/Marquee";
     <Marquee label="Our clients" className="bg-brand py-10 text-white">
       {LOGOS.map((l) => <li key={l.name} className="px-10">...</li>)}
     </Marquee>

   Props:
     label      aria-label for the strip
     children   the <li> items (rendered twice for a seamless loop)
     speed      cruise speed in px per second (default 48)
     className  classes on the section (background, padding, colour)

   Sections in this file:
     1. MOTION   a small rAF loop: position, velocity, target velocity
     2. STRIP
   ================================================================== */

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

const EASE = 4; // how quickly the speed changes (per second). Higher = snappier.

/* ==================================================================
   1. MOTION
   ================================================================== */

function useLoopingTrack(trackRef: RefObject<HTMLDivElement | null>, sectionRef: RefObject<HTMLElement | null>, speed: number) {
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0; // offset (px, negative = moved left)
    let v = -speed; // velocity (px/s)
    let copyWidth = track.scrollWidth / 2; // the list is rendered twice
    let last = performance.now();
    let frame = 0;
    let onScreen = true;
    let hovering = false;
    let dragging = false;
    let pointerId = -1;
    let startX = 0;
    let lastPointerX = 0;
    let moved = 0;
    const history: { x: number; t: number }[] = [];

    // Keep the offset inside one copy so the loop never shows a seam.
    const wrap = () => {
      if (copyWidth <= 0) return;
      while (x <= -copyWidth) x += copyWidth;
      while (x > 0) x -= copyWidth;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging) {
        const target = pausedRef.current || hovering ? 0 : -speed;
        v += (target - v) * (1 - Math.exp(-EASE * dt));
        x += v * dt;
      }
      wrap();
      track.style.transform = `translate3d(${x}px,0,0)`;
      if (onScreen) frame = requestAnimationFrame(tick);
    };

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (onScreen) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    });
    visibility.observe(section);
    const resize = new ResizeObserver(() => {
      copyWidth = track.scrollWidth / 2;
    });
    resize.observe(track);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      pointerId = e.pointerId;
      startX = lastPointerX = e.clientX;
      moved = 0;
      history.length = 0;
      history.push({ x: e.clientX, t: e.timeStamp });
      section.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      x += e.clientX - lastPointerX;
      lastPointerX = e.clientX;
      moved = Math.max(moved, Math.abs(e.clientX - startX));
      history.push({ x: e.clientX, t: e.timeStamp });
      while (history.length > 1 && e.timeStamp - history[0].t > 100) history.shift();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      if (moved < 6) {
        setPaused((p) => !p); // a tap toggles the hold
        return;
      }
      const first = history[0];
      const lastPoint = history[history.length - 1];
      const dt = (lastPoint.t - first.t) / 1000;
      v = dt > 0 ? (lastPoint.x - first.x) / dt : 0;
      setPaused(false);
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };

    section.addEventListener("pointerdown", onDown);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerup", onUp);
    section.addEventListener("pointercancel", onUp);
    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      resize.disconnect();
      section.removeEventListener("pointerdown", onDown);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerup", onUp);
      section.removeEventListener("pointercancel", onUp);
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [trackRef, sectionRef, speed]);

  return { paused, setPaused };
}

/* ==================================================================
   2. STRIP
   ================================================================== */

export default function Marquee({ label, children, speed = 48, className = "" }: { label: string; children: ReactNode; speed?: number; className?: string }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { paused, setPaused } = useLoopingTrack(trackRef, sectionRef, speed);

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      aria-roledescription="moving strip"
      tabIndex={0}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          setPaused((p) => !p);
        }
      }}
      className={`relative w-full cursor-grab touch-pan-y select-none overflow-hidden outline-none active:cursor-grabbing focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white/70 ${className}`}
    >
      <span className="sr-only" aria-live="polite">
        {paused ? "Paused" : ""}
      </span>
      <div ref={trackRef} className="flex w-max will-change-transform motion-reduce:w-full motion-reduce:!transform-none">
        <ul className="flex shrink-0 items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-8">{children}</ul>
        {/* Second copy so the loop never runs out, hidden from screen readers */}
        <ul aria-hidden="true" className="flex shrink-0 items-center motion-reduce:hidden">
          {children}
        </ul>
      </div>
    </section>
  );
}
