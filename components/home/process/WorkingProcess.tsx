"use client";

/* ==================================================================
   06 WORKING PROCESS  (home, and /services)
   ------------------------------------------------------------------
   Where it sits and how it is used:

     import WorkingProcess from "@/components/home/process/WorkingProcess";
     <WorkingProcess />                     // "From Initial Idea to Finished Project."
     <WorkingProcess variant="services" />  // "A Clear Approach to Every Project."

   Four stages in a horizontal row on desktop and a vertical column on
   phones. A red line runs through the four markers and fills as the
   section scrolls through the screen, like a roof ridge being laid;
   each marker turns red as the line reaches it.

   Sections in this file:
     1. CONTENT
     2. SECTION
   ================================================================== */

import { useRef } from "react";
import { PROCESS } from "@/components/services/services";
import { gsap, useGsap } from "@/components/ui/motion/motion";
import SectionHeading, { Muted } from "@/components/ui/sectionheading/SectionHeading";

/* ==================================================================
   1. CONTENT
   ================================================================== */

const COPY = {
  home: {
    eyebrow: "How we work",
    title: (
      <>
        From initial idea <Muted>to finished project.</Muted>
      </>
    ),
    description: "A simple, general process we follow on every job, large or small.",
  },
  services: {
    eyebrow: "Our working process",
    title: (
      <>
        A clear approach <Muted>to every project.</Muted>
      </>
    ),
    description: "Four stages, so you know where your project stands.",
  },
};

/* ==================================================================
   2. SECTION
   ================================================================== */

export default function WorkingProcess({ variant = "home" }: { variant?: "home" | "services" }) {
  const c = COPY[variant];
  const root = useRef<HTMLElement | null>(null);

  useGsap(root, () => {
    const st = { trigger: "[data-steps]", start: "top 75%", end: "bottom 55%", scrub: 0.4 };
    gsap.fromTo("[data-fill-x]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: st });
    gsap.fromTo("[data-fill-y]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: st });
    gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step, i) => {
      gsap.from(step, { autoAlpha: 0, y: 30, duration: 0.9, ease: "expo.out", delay: i * 0.08, scrollTrigger: { trigger: "[data-steps]", start: "top 80%" } });
      gsap.fromTo(
        step.querySelector("[data-dot]"),
        { backgroundColor: "#e3e6eb", color: "#17191e" },
        { backgroundColor: "#dd2730", color: "#ffffff", duration: 0.3, scrollTrigger: { trigger: step, start: "top 65%", toggleActions: "play none none reverse" } },
      );
    });
  });

  return (
    <section ref={root} id={`process${variant === "home" ? "" : "-services"}`} aria-labelledby={`process-heading-${variant}`} className="mx-auto max-w-360 px-5 pt-28 sm:px-8 lg:px-12 lg:pt-40">
      <SectionHeading id={`process-heading-${variant}`} eyebrow={c.eyebrow} title={c.title} description={c.description} layout="split" />

      <div data-steps className="relative mt-16">
        {/* The ridge line: across on desktop, down on phones */}
        <div aria-hidden="true" className="absolute left-0 right-0 top-[22px] hidden h-[3px] overflow-hidden rounded-full bg-border lg:block">
          <div data-fill-x className="h-full origin-left bg-accent" />
        </div>
        <div aria-hidden="true" className="absolute bottom-6 left-[22px] top-2 w-[3px] overflow-hidden rounded-full bg-border lg:hidden">
          <div data-fill-y className="h-full origin-top bg-accent" />
        </div>

        <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
          {PROCESS.map((s, i) => (
            <li key={s.title} data-step className="grid grid-cols-[46px_1fr] gap-5 lg:block">
              <span data-dot className="grid size-[46px] place-items-center rounded-full bg-accent f-head text-[16px] font-semibold tabular-nums text-white ring-8 ring-background">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="lg:mt-8 lg:pr-6">
                <h3 className="text-[clamp(1.6rem,2.2vw,2.1rem)] leading-tight">{s.title}</h3>
                <p className="mt-3 max-w-xs text-[17px] leading-relaxed text-muted">{variant === "home" ? s.home : s.services}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
