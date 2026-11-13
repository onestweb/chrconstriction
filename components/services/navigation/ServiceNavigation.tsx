"use client";

/* ==================================================================
   02 SERVICE NAVIGATION  (/services)
   ------------------------------------------------------------------
   Where it sits and how it is used:

     import ServiceNavigation from "@/components/services/navigation/ServiceNavigation";
     <PageHero ... />
     <ServiceNavigation>
       <ServiceSection ... /> x4
     </ServiceNavigation>

   "Explore Our Services." with a row of four category buttons. The
   row then sticks under the navbar while the four service sections
   scroll past, and the button of the section in the middle of the
   screen fills in (with its number). Clicking glides to the section.
   On phones the row scrolls sideways and keeps the active button in
   view.

   Sections in this file:
     1. SECTION
   ================================================================== */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SERVICES } from "@/components/services/services";
import { scrollToSection } from "@/components/ui/motion/motion";
import { Icon } from "@/components/ui/pagehero/PageHero";
import SectionHeading, { Muted } from "@/components/ui/sectionheading/SectionHeading";

/* ==================================================================
   1. SECTION
   ================================================================== */

export default function ServiceNavigation({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  const chips = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Which service section crosses the middle of the screen.
  useEffect(() => {
    const els = SERVICES.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const showing = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? showing.add(e.target.id) : showing.delete(e.target.id)));
        setActive(SERVICES.find((s) => showing.has(s.id))?.id ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Keep the active chip in view on phones.
  useEffect(() => {
    if (active) chips.current[active]?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  return (
    <>
      <section id="explore" aria-labelledby="explore-heading" className="mx-auto max-w-360 scroll-mt-24 px-5 pt-24 sm:px-8 lg:px-12 lg:pt-32">
        <SectionHeading
          id="explore-heading"
          eyebrow="Services"
          title={
            <>
              Explore <Muted>our services.</Muted>
            </>
          }
          description="Four areas of work. Jump straight to the one your project needs, or read through them all."
          layout="split"
        />
      </section>

      {/* The bar sticks only while the service sections (children) scroll past. */}
      <div className="relative">
      <nav aria-label="Service categories" className="sticky top-[84px] z-30 mt-10 px-3 sm:px-5">
        <ul className="no-scrollbar mx-auto flex max-w-360 gap-2 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_8px_30px_-16px_rgb(23_25_30/0.35)] lg:grid lg:grid-cols-4">
          {SERVICES.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id} className="shrink-0">
                <a
                  ref={(el) => {
                    chips.current[s.id] = el;
                  }}
                  href={`#${s.id}`}
                  aria-current={on ? "location" : undefined}
                  onClick={(e) => {
                    const el = document.getElementById(s.id);
                    if (!el) return;
                    e.preventDefault();
                    scrollToSection(el);
                  }}
                  className={`flex h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-5 text-[15px] font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                    on ? "bg-brand text-white" : "text-foreground hover:bg-background"
                  }`}
                >
                  <span className={`tabular-nums ${on ? "text-white/70" : "text-accent"}`}>{s.number}</span>
                  <Icon name={s.id} className="size-[18px]" />
                  {s.short}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      {children}
      </div>
    </>
  );
}
