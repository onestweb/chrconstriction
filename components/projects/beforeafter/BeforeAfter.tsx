"use client";

/* ==================================================================
   05 BEFORE AND AFTER  (/projects)
   ------------------------------------------------------------------
   Where it sits and how it is used:

     import BeforeAfter from "@/components/projects/beforeafter/BeforeAfter";
     <ProjectsExplorer />
     <BeforeAfter />
     <CompanyCapabilities />

   "See the Transformation." Only genuine pairs from CHR's own posts:
   the same wall and the same nook of the bathroom job, photographed
   before and after from the same spot (BEFORE_AFTER in projects.ts).
   Drag the handle (or use the arrow keys: it is a real range input)
   to wipe between the two. A wide pair and a tall pair sit side by
   side on desktop.

   Sections in this file:
     1. SECTION
     2. SLIDER
   ================================================================== */

import Image from "next/image";
import { useId, useState } from "react";
import { BEFORE_AFTER } from "@/components/projects/projects";
import SectionHeading, { Muted } from "@/components/ui/sectionheading/SectionHeading";
import type { Photo } from "@/components/ui/photoviewer/PhotoViewer";

/* ==================================================================
   1. SECTION
   ================================================================== */

export default function BeforeAfter() {
  if (BEFORE_AFTER.length === 0) return null; // the brief: leave it out without real pairs
  return (
    <section id="transformation" aria-labelledby="transformation-heading" className="mx-auto max-w-360 px-5 pt-28 sm:px-8 lg:px-12 lg:pt-40">
      <SectionHeading
        id="transformation-heading"
        eyebrow="Before and after"
        title={
          <>
            See the <Muted>transformation.</Muted>
          </>
        }
        description="The open-plan bathroom job, photographed by CHR from the same spots before and after. Drag the handle to compare."
        layout="split"
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        {BEFORE_AFTER.map((pair, i) => (
          <figure key={pair.title} className={i === 0 ? "lg:col-span-8" : "lg:col-span-4"}>
            <Slider before={pair.before} after={pair.after} label={pair.title} tall={pair.after.height > pair.after.width} />
            <figcaption className="mt-4 flex items-baseline justify-between gap-4">
              <span className="f-head text-[22px] font-semibold tracking-[-0.02em]">{pair.title}</span>
              <span className="text-[14px] text-muted">Open-plan bathroom & walk-in closet</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ==================================================================
   2. SLIDER
   ================================================================== */

function Slider({ before, after, label, tall }: { before: Photo; after: Photo; label: string; tall: boolean }) {
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <div className={`relative w-full select-none overflow-hidden rounded-media bg-border ${tall ? "aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[420px]" : "aspect-[16/9] lg:aspect-[16/8]"}`}>
      <Image src={after.src} alt={after.alt} fill sizes={tall ? "(min-width:1024px) 30vw, 100vw" : "(min-width:1024px) 60vw, 100vw"} className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes={tall ? "(min-width:1024px) 30vw, 100vw" : "(min-width:1024px) 60vw, 100vw"} className="object-cover" />
      </div>

      <span aria-hidden="true" className="absolute left-4 top-4 rounded-full bg-header-background/85 px-3.5 py-1.5 text-[13px] font-semibold text-white">
        Before
      </span>
      <span aria-hidden="true" className="absolute right-4 top-4 rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white">
        After
      </span>

      {/* Handle */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-foreground shadow-[0_6px_20px_rgb(0_0_0/0.25)]">
          <svg viewBox="0 0 24 24" fill="none" className="size-5">
            <path d="M9 6 3 12l6 6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <label htmlFor={id} className="sr-only">
        {label}: compare before and after
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-valuetext={`${pos}% before`}
        className="peer absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-media ring-0 ring-focus-ring peer-focus-visible:ring-4" />
    </div>
  );
}
