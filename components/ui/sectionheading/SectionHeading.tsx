"use client";

/* ==================================================================
   SECTION HEADING
   ------------------------------------------------------------------
   Usage:

     import SectionHeading, { Muted } from "@/components/ui/sectionheading/SectionHeading";
     <SectionHeading id="services-heading" eyebrow="What we do"
       title={<>Construction solutions <Muted>for every project.</Muted></>}
       description="..." layout="split" />

   CHR's heading: a short sentence-case label led by the red roofline
   from the logo (RoofMark), then a large semi-condensed sentence-case
   title. With layout="split" the description sits beside the title
   from lg, aligned to its baseline, like the client's reference
   sections. The words rise once when the heading first comes into view.

   Props:
     id           on the heading, for the section's aria-labelledby
     eyebrow      the small label (optional)
     title        the heading (string or nodes; <Muted> softens a part)
     description  supporting sentence (optional)
     layout       "stacked" | "split"
     tone         "dark" (dark text) | "light" (on dark/photo) | "brand" (on navy)
     as           "h1" | "h2" | "h3"
     className

   Sections in this file:
     1. ROOF MARK
     2. HEADING
   ================================================================== */

import type { ReactNode } from "react";
import { useInView } from "@/components/ui/motion/motion";

/* ==================================================================
   1. ROOF MARK  (the logo's roofline, as a small brand device)
   ================================================================== */

export function RoofMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 16" fill="none" aria-hidden="true" className={`h-[0.8em] w-auto shrink-0 ${className}`}>
      <path d="M2 14 14 3l12 11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.5 4.5v3.6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ==================================================================
   2. HEADING
   ================================================================== */

type Tone = "dark" | "light" | "brand";

const TONES: Record<Tone, { title: string; text: string; eyebrow: string; mark: string; muted: string }> = {
  dark: { title: "text-foreground", text: "text-muted", eyebrow: "text-foreground", mark: "text-accent", muted: "[--muted-ink:#626a78]" },
  light: { title: "text-white", text: "text-white/75", eyebrow: "text-white", mark: "text-accent", muted: "[--muted-ink:rgb(255_255_255/0.6)]" },
  brand: { title: "text-white", text: "text-white/80", eyebrow: "text-white", mark: "text-white", muted: "[--muted-ink:rgb(255_255_255/0.66)]" },
};

/** A softer part of a title (the second half of a sentence). */
export function Muted({ children }: { children: ReactNode }) {
  return <span className="text-(--muted-ink)">{children}</span>;
}

type Props = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  layout?: "stacked" | "split";
  tone?: Tone;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export default function SectionHeading({ id, eyebrow, title, description, layout = "stacked", tone = "dark", as: Tag = "h2", className = "" }: Props) {
  const [ref, shown] = useInView<HTMLDivElement>(0.3);
  const t = TONES[tone];
  const split = layout === "split";

  return (
    <div
      ref={ref}
      data-shown={shown}
      className={`${t.muted} ${split ? "grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-12" : ""} ${className}`}
    >
      <div className={split ? "lg:col-span-7" : ""}>
        {eyebrow && (
          <p className={`reveal-up mb-5 flex items-center gap-2.5 text-[15px] font-semibold ${t.eyebrow}`}>
            <RoofMark className={t.mark} />
            {eyebrow}
          </p>
        )}
        <Tag
          id={id}
          className={`reveal-up text-[clamp(2.1rem,4.6vw,4.25rem)] leading-[1.02] ${t.title}`}
          style={{ ["--d" as string]: 1 }}
        >
          {title}
        </Tag>
      </div>
      {description && (
        <div
          className={`reveal-up text-[17px] leading-relaxed sm:text-[18px] ${t.text} ${split ? "max-w-xl lg:col-span-5 lg:pb-2" : "mt-6 max-w-2xl"}`}
          style={{ ["--d" as string]: 2 }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
