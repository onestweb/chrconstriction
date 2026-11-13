"use client";

/* ==================================================================
   PHOTO VIEWER
   ------------------------------------------------------------------
   The full-screen viewer for a set of photographs (a gallery, a
   project's stages). How it works:
     - arrow keys, swipe, or the buttons move through the set
     - Esc or the close button exits, and focus returns to the photo
       that opened it
     - the page behind is locked (smooth scrolling is paused too)

   Usage:

     const viewer = usePhotoViewer();
     <button onClick={(e) => viewer.open(i, e.currentTarget)}>...</button>
     <PhotoViewer photos={photos} title="Project name" {...viewer.props} />

   Sections in this file:
     1. HOOK        open / close state, focus return
     2. VIEWER      the dialog: top bar, photo, caption + thumbnails
     3. ICONS
   ================================================================== */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Short caption, shown under the photo. */
  caption: string;
  /** Which part to keep when the photo is cropped (CSS object-position). */
  position?: string;
};

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

/* ==================================================================
   1. HOOK
   ================================================================== */

export function usePhotoViewer() {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback((i: number, from?: HTMLElement | null) => {
    opener.current = from ?? null;
    setIndex(i);
  }, []);

  const close = useCallback(() => {
    setIndex(null);
    opener.current?.focus(); // back to the photo that opened it
  }, []);

  return { open, props: { index, onIndex: setIndex, onClose: close } };
}

/* ==================================================================
   2. VIEWER
   ------------------------------------------------------------------
   labels: an optional line per photo above its caption (e.g. the
   stage or room it belongs to).
   ================================================================== */

type ViewerProps = {
  photos: Photo[];
  title: string;
  labels?: string[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
};

export default function PhotoViewer({ index, ...rest }: ViewerProps) {
  if (index === null) return null;
  return <Dialog index={index} {...rest} />;
}

function Dialog({ photos, title, labels, index, onIndex, onClose }: ViewerProps & { index: number }) {
  const n = photos.length;
  const p = photos[index];
  const dialog = useRef<HTMLDivElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback((d: number) => onIndex((index + d + n) % n), [index, n, onIndex]);

  // Keyboard: arrows move, Esc closes, Tab stays inside the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialog.current) {
        const items = dialog.current.querySelectorAll<HTMLElement>("button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Lock the page behind and move focus in (smooth scrolling pauses on its own).
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(dx < 0 ? 1 : -1);
  };

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`${title}: ${p.caption}, photo ${index + 1} of ${n}`}
      data-lenis-prevent
      className="viewer-in fixed inset-0 z-[60] flex flex-col bg-[#0d0e14] text-white"
    >
      {/* ---- Lit by its own photograph ---- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[12%] opacity-40" style={{ filter: "blur(64px) saturate(1.3)" }}>
          <div key={p.src} className="viewer-in absolute inset-0">
            <Image src={p.src} alt="" fill sizes="320px" className="object-cover" />
          </div>
        </div>
        <div className="absolute inset-0 bg-[#0d0e14]/55" />
      </div>

      {/* ---- 2a. Top bar: title, count and close ---- */}
      <div className="relative flex items-center justify-between gap-4 px-5 pb-3 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8">
        <p className="min-w-0 truncate text-[15px] font-semibold text-white/75">
          {title}
          <span className="ml-3 tabular-nums text-white/45">
            {index + 1} of {n}
          </span>
        </p>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <CloseIcon />
        </button>
      </div>

      {/* ---- 2b. The photo (swipe area) ---- */}
      <div className="relative min-h-0 flex-1 touch-pan-y select-none" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <Image key={p.src} src={p.src} alt={p.alt} fill sizes="100vw" className="viewer-photo object-contain px-3 sm:px-20" />
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white sm:grid"
            >
              <ChevronIcon dir="left" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white sm:grid"
            >
              <ChevronIcon dir="right" />
            </button>
          </>
        )}
      </div>

      {/* ---- 2c. Caption + thumbnails ---- */}
      <div className="relative px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-8 sm:pb-8">
        <div key={p.src} className="viewer-in">
          {labels?.[index] && (
            <p className="flex items-center gap-3 f-head text-[12px] font-semibold uppercase tracking-[0.22em] text-white/70">
              <span aria-hidden="true" className="h-0.5 w-6 bg-accent" />
              {labels[index]}
            </p>
          )}
          <p className="mt-1.5 f-head text-[clamp(1.25rem,2.2vw,1.85rem)] font-bold leading-tight tracking-[-0.02em]">{p.caption}</p>
        </div>
        {n > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {photos.map((t, i) => (
              <button
                key={t.src}
                type="button"
                onClick={() => onIndex(i)}
                aria-label={`Show photo ${i + 1}: ${t.caption}`}
                aria-current={i === index}
                className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-14 sm:w-20 ${
                  i === index ? "opacity-100" : "opacity-40 hover:opacity-75"
                }`}
              >
                <Image src={t.src} alt="" fill sizes="80px" className="object-cover" style={{ objectPosition: t.position ?? "50% 50%" }} />
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes viewer-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes viewer-photo { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: none; } }
        .viewer-in { animation: viewer-in 300ms ${EASE} both; }
        .viewer-photo { animation: viewer-photo 500ms ${EASE} both; }
        @media (prefers-reduced-motion: reduce) { .viewer-in, .viewer-photo { animation: none; } }
      `}</style>
    </div>
  );
}

/* ==================================================================
   3. ICONS
   ================================================================== */

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <path d={dir === "left" ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
