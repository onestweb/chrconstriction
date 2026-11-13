"use client";

/* ==================================================================
   05 WHY CHOOSE CHR  (home, and a shorter version on /services)
   ------------------------------------------------------------------
   Where it sits and how it is used:

     import WhyChooseCHR from "@/components/home/why/WhyChooseCHR";
     <WhyChooseCHR />                       // home
     <WhyChooseCHR variant="services" />    // /services, "Why Work With CHR?"

   A charcoal frame, after the dark highlighted card in the client's
   reference. Left: a tall CHR photo (the timber trusses of the braai
   area) with the start year set over it. Right: the four strengths as
   large sentence-case lines, each with one plain sentence, appearing
   one after another. Nothing is claimed beyond what CHR publishes.

   Sections in this file:
     1. CONTENT
     2. SECTION
   ================================================================== */

import Image from "next/image";
import { getProject } from "@/components/projects/projects";
import { useInView } from "@/components/ui/motion/motion";
import SectionHeading, { Muted, RoofMark } from "@/components/ui/sectionheading/SectionHeading";
import { SITE } from "@/components/ui/site";

/* ==================================================================
   1. CONTENT
   ================================================================== */

const COPY = {
  home: {
    eyebrow: "Why choose CHR",
    title: (
      <>
        Built on quality. <Muted>Driven by commitment.</Muted>
      </>
    ),
    points: [
      { title: "Experience", text: `Running since ${SITE.since}, with a team that has taken on civil, structural and residential work across the ${SITE.region}.` },
      { title: "Quality workmanship", text: "A commitment to sound construction and clean finishes, from foundations and steelwork to tiling and paving." },
      { title: "Diverse capabilities", text: "Roads, slabs, steel structures, roofs, bathrooms and braai areas: one team for different kinds of construction." },
      { title: "Professional approach", text: "Attention to each project's requirements, a clear quotation and communication you can follow at every phase." },
    ],
  },
  services: {
    eyebrow: "Why CHR",
    title: (
      <>
        Why work <Muted>with CHR?</Muted>
      </>
    ),
    points: [
      { title: "Established experience", text: `In operation since ${SITE.since}.` },
      { title: "Quality workmanship", text: "Care over the details that make a job last." },
      { title: "Diverse capabilities", text: "Civil, structural, renovation and outdoor work." },
      { title: "Attention to requirements", text: "The work is planned around what you need." },
    ],
  },
};

const PHOTO = getProject("braai-area").photos[4];

/* ==================================================================
   2. SECTION
   ================================================================== */

export default function WhyChooseCHR({ variant = "home" }: { variant?: "home" | "services" }) {
  const c = COPY[variant];
  const [ref, shown] = useInView<HTMLUListElement>(0.2);
  const compact = variant === "services";

  return (
    <section id="why" aria-labelledby={`why-heading-${variant}`} className="px-3 pt-28 sm:px-5 lg:pt-40">
      <div className="mx-auto grid max-w-360 gap-12 overflow-hidden rounded-frame bg-header-background px-6 py-14 text-white sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-14 lg:py-20">
        {!compact && (
          <figure className="relative min-h-[360px] overflow-hidden rounded-media lg:col-span-5 lg:min-h-0">
            <Image src={PHOTO.src} alt={PHOTO.alt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 to-transparent" />
            <figcaption className="absolute bottom-6 left-6 right-6">
              <span className="block f-head text-[clamp(4rem,8vw,7rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums">{SITE.since}</span>
              <span className="mt-2 block text-[16px] text-white/85">The year CHR Construction started working</span>
            </figcaption>
          </figure>
        )}

        <div className={compact ? "lg:col-span-12" : "lg:col-span-7"}>
          <SectionHeading
            id={`why-heading-${variant}`}
            eyebrow={c.eyebrow}
            title={c.title}
            tone="light"
            layout={compact ? "split" : "stacked"}
            description={compact ? "Concise, and backed by the work on our Projects page." : undefined}
          />
          <ul ref={ref} data-shown={shown} className={`mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 ${compact ? "lg:grid-cols-4" : ""}`}>
            {c.points.map((pt, i) => (
              <li key={pt.title} className="reveal-up" style={{ ["--d" as string]: i + 1 }}>
                <RoofMark className="h-4 text-accent" />
                <p className="mt-4 f-head text-[26px] font-semibold leading-tight tracking-[-0.02em]">{pt.title}</p>
                <p className="mt-2 max-w-sm text-[16px] leading-relaxed text-white/75">{pt.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
