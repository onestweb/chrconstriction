"use client";

/* ==================================================================
   03-06 SERVICE SECTION  (/services, once per category)
   ------------------------------------------------------------------
   Where it sits and how it is used:

     import ServiceSection from "@/components/services/section/ServiceSection";
     {SERVICES.map((s, i) => <ServiceSection key={s.id} service={s} flip={i % 2 === 1} />)}

   A large image-and-content block, alternating sides. The photo side
   holds the main photograph, opening from an inset window as it
   scrolls in, with a second, smaller CHR photo overlapping its lower
   corner. The text side carries a big category number, the heading,
   the description, the list of services in two columns (each led by
   the red roofline), Request a Quote, and a link to this category's
   projects.

   Sections in this file:
     1. SECTION
   ================================================================== */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Button from "@/components/buttons/Button";
import type { Service } from "@/components/services/services";
import { gsap, useGsap } from "@/components/ui/motion/motion";
import { RoofMark } from "@/components/ui/sectionheading/SectionHeading";

/* ==================================================================
   1. SECTION
   ================================================================== */

export default function ServiceSection({ service: s, flip }: { service: Service; flip: boolean }) {
  const root = useRef<HTMLElement | null>(null);

  useGsap(root, () => {
    gsap.fromTo(
      "[data-clip]",
      { clipPath: "inset(8% 6% 8% 6% round 18px)" },
      { clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "none", scrollTrigger: { trigger: "[data-clip]", start: "top 92%", end: "top 35%", scrub: true } },
    );
    gsap.fromTo("[data-clip] img", { scale: 1.14 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-clip]", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from("[data-detail]", { yPercent: 25, ease: "none", scrollTrigger: { trigger: "[data-clip]", start: "top 80%", end: "bottom 40%", scrub: true } });
    gsap.from("[data-copy] > *", { autoAlpha: 0, y: 28, duration: 0.9, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: "[data-copy]", start: "top 80%" } });
  });

  return (
    <section ref={root} id={s.id} aria-labelledby={`${s.id}-heading`} className="mx-auto max-w-360 scroll-mt-40 px-5 pt-24 sm:px-8 lg:px-12 lg:pt-36">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-x-16">
        {/* ---- Photographs ---- */}
        <div className={`relative lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
          <figure data-clip className="relative aspect-[5/4] overflow-hidden rounded-media bg-border">
            <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
            <figcaption className={`absolute top-4 rounded-full bg-white/90 px-4 py-2 text-[14px] font-semibold backdrop-blur ${flip ? "left-4" : "right-4"}`}>
              {s.photo.caption}
            </figcaption>
          </figure>
          <figure
            data-detail
            className={`absolute -bottom-12 hidden aspect-[4/3] w-[42%] overflow-hidden rounded-media ring-8 ring-background sm:block ${flip ? "-right-4 lg:-right-10" : "-left-4 lg:-left-10"}`}
          >
            <Image src={s.detail.src} alt={s.detail.alt} fill sizes="25vw" className="object-cover" />
          </figure>
        </div>

        {/* ---- Copy ---- */}
        <div data-copy className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
          <p aria-hidden="true" className="f-head text-[clamp(4rem,7vw,6.5rem)] font-semibold leading-[0.8] tracking-[-0.05em] text-brand/15 tabular-nums">
            {s.number}
          </p>
          <p className="mt-4 text-[15px] font-semibold text-accent">Category {s.number}</p>
          <h2 id={`${s.id}-heading`} className="mt-2 text-[clamp(2.1rem,3.6vw,3.4rem)] leading-[1.02]">
            {s.title}.
          </h2>
          <p className="mt-5 text-[18px] leading-relaxed text-foreground/80">{s.description}</p>
          <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {s.items.map((it) => (
              <li key={it} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-[16px] font-medium">
                <RoofMark className="text-accent" />
                {it}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href="#contact" arrow>
              Request a Quote
            </Button>
            <Link
              href="/projects#work"
              className="inline-flex min-h-11 items-center rounded-md text-[16px] font-semibold text-brand underline decoration-brand/30 underline-offset-[6px] transition-colors hover:decoration-brand focus-visible:outline-2 focus-visible:outline-focus-ring"
            >
              See our projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
