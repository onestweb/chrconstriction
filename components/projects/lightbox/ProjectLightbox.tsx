"use client";

/* ==================================================================
   PROJECT LIGHTBOX  (/projects)
   ------------------------------------------------------------------
   Usage:

     import ProjectLightbox from "@/components/projects/lightbox/ProjectLightbox";
     <ProjectLightbox project={open} start={0} onClose={() => setOpen(null)} />

   A full-screen overlay for one project, so the visitor never leaves
   the gallery. The photo is shown large on the left (arrows, swipe,
   arrow keys); the panel on the right gives the category, title,
   location when CHR has published it, the short description, the
   current photo's caption and thumbnails of every photo, the
   genuine "before" photos included and labelled. Esc or the close
   button returns focus to the tile that opened it. On phones the
   panel sits under the photo and scrolls.

   Sections in this file:
     1. LIGHTBOX
     2. ICONS
   ================================================================== */

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Button from "@/components/buttons/Button";
import { CATEGORIES, type Project } from "@/components/projects/projects";
import { RoofMark } from "@/components/ui/sectionheading/SectionHeading";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

/* ==================================================================
   1. LIGHTBOX
   ================================================================== */

export default function ProjectLightbox({ project, start = 0, onClose }: { project: Project | null; start?: number; onClose: () => void }) {
  if (!project) return null;
  return <Dialog key={project.slug} project={project} start={start} onClose={onClose} />;
}

function Dialog({ project, start, onClose }: { project: Project; start: number; onClose: () => void }) {
  const photos = useMemo(() => [...project.photos, ...(project.before ?? [])], [project]);
  const [i, setI] = useState(Math.min(start, photos.length - 1));
  const n = photos.length;
  const p = photos[i];
  const isBefore = i >= project.photos.length;
  const dialog = useRef<HTMLDivElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.documentElement.style.overflow = prev;
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialog.current) {
        const items = dialog.current.querySelectorAll<HTMLElement>("button, a[href]");
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

  const onDown = (e: ReactPointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: ReactPointerEvent) => {
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
      aria-labelledby="lightbox-title"
      data-lenis-prevent
      className="lb-in fixed inset-0 z-[60] flex flex-col bg-[#0d0f14] text-white lg:flex-row"
    >
      {/* ---- Photo ---- */}
      <div className="relative min-h-[46svh] flex-1 touch-pan-y select-none lg:min-h-0" onPointerDown={onDown} onPointerUp={onUp}>
        <Image key={p.src} src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 70vw, 100vw" className="lb-photo object-contain p-3 sm:p-8 lg:p-14" />
        {isBefore && <span className="absolute left-5 top-5 rounded-full bg-accent px-4 py-1.5 text-[14px] font-semibold">Before</span>}
        {n > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 lg:bottom-8">
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={NAV_BTN}>
              <Chevron dir="left" />
            </button>
            <p className="grid min-w-20 place-items-center rounded-full bg-white/10 px-4 text-[14px] font-semibold tabular-nums">
              {i + 1} / {n}
            </p>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className={NAV_BTN}>
              <Chevron dir="right" />
            </button>
          </div>
        )}
      </div>

      {/* ---- Panel ---- */}
      <aside className="flex max-h-[54svh] flex-col overflow-y-auto bg-[#17191e] lg:max-h-none lg:w-[400px] lg:shrink-0 xl:w-[440px]">
        <div className="flex items-center justify-between gap-4 px-6 pb-2 pt-5 lg:px-8 lg:pt-7">
          <p className="flex items-center gap-2 text-[14px] font-semibold text-white/75">
            <RoofMark className="text-accent" />
            {CATEGORIES[project.category].label}
          </p>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close project"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
              <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-8 lg:px-8">
          <h2 id="lightbox-title" className="text-[clamp(1.8rem,2.6vw,2.4rem)] leading-[1.05]">
            {project.title}
          </h2>
          {(project.location || project.date) && (
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[15px]">
              {project.location && (
                <div className="flex gap-2">
                  <dt className="text-white/55">Location</dt>
                  <dd>{project.location}</dd>
                </div>
              )}
              {project.date && (
                <div className="flex gap-2">
                  <dt className="text-white/55">Posted</dt>
                  <dd>{project.date}</dd>
                </div>
              )}
            </dl>
          )}
          <p className="mt-5 text-[16px] leading-relaxed text-white/80">{project.summary}</p>

          <p key={p.src} className="lb-in mt-6 rounded-xl bg-white/5 px-4 py-3 text-[15px] font-medium" aria-live="polite">
            {p.caption}
          </p>

          {n > 1 && (
            <ul className="mt-5 grid grid-cols-4 gap-2" aria-label="Photos">
              {photos.map((t, k) => (
                <li key={t.src}>
                  <button
                    type="button"
                    onClick={() => setI(k)}
                    aria-label={`Show photo ${k + 1}: ${t.caption}`}
                    aria-current={k === i}
                    className={`relative block aspect-square w-full overflow-hidden rounded-lg transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${k === i ? "opacity-100 ring-2 ring-accent" : "opacity-50 hover:opacity-85"}`}
                  >
                    <Image src={t.src} alt="" fill sizes="90px" className="object-cover" />
                    {k >= project.photos.length && <span className="absolute inset-x-0 bottom-0 bg-accent py-0.5 text-center text-[11px] font-semibold">Before</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8">
            <Button href="#contact" onClick={onClose} arrow>
              Start a similar project
            </Button>
          </div>
        </div>
      </aside>

      <style>{`
        @keyframes lb-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lb-photo { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: none; } }
        .lb-in { animation: lb-in 300ms ${EASE} both; }
        .lb-photo { animation: lb-photo 500ms ${EASE} both; }
        @media (prefers-reduced-motion: reduce) { .lb-in, .lb-photo { animation: none; } }
      `}</style>
    </div>
  );
}

/* ==================================================================
   2. ICONS
   ================================================================== */

const NAV_BTN =
  "grid size-12 place-items-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
      <path d={dir === "left" ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
