"use client";

/* ==================================================================
   02 COMPANY INTRODUCTION
   ------------------------------------------------------------------
   Where it sits and how it is used:

     import CompanyIntroduction from "@/components/home/intro/CompanyIntroduction";
     <Hero />
     <CompanyIntroduction />
     <ServicesOverview />

   Opens with a row of four plain facts under the hero (the reference
   puts its figures there); only facts CHR has published: running
   since 2016, based in the Free State, four kinds of work. The years
   figure counts up once. Then a two-column editorial block: the
   introduction on the left, and on the right a tall photograph of a
   CHR house build with a smaller steelwork photo overlapping its
   corner. The tall photo opens from an inset window as it scrolls in.

   Sections in this file:
     1. CONTENT
     2. SECTION
     3. COUNT
   ================================================================== */

import Image from "next/image";
import { useRef } from "react";
import Button from "@/components/buttons/Button";
import { getProject } from "@/components/projects/projects";
import { gsap, ScrollTrigger, useGsap } from "@/components/ui/motion/motion";
import SectionHeading, { Muted } from "@/components/ui/sectionheading/SectionHeading";
import { SITE } from "@/components/ui/site";

/* ==================================================================
   1. CONTENT
   ================================================================== */

// Years in operation, from the published start year ("running since 2016").
// Fixed rather than computed so the page can be prerendered: update each year.
const YEARS = 10;

const FACTS = [
  { value: String(YEARS), unit: "years", text: `In operation since ${SITE.since}`, count: true },
  { value: "Free State", unit: "", text: "Where we're based and where we work" },
  { value: "4", unit: "disciplines", text: "Civil, building, renovation and outdoor work", count: true },
  { value: "Start to finish", unit: "", text: "From planning and quotation to completion" },
];

const HEADING = {
  eyebrow: "About CHR Construction",
  title: (
    <>
      Construction built <Muted>on experience.</Muted>
    </>
  ),
};

const BODY = [
  `CHR Construction is a ${SITE.region} construction company that has been running since ${SITE.since}. We take on work for homes, businesses and commercial sites, from road repairs and foundations to new buildings, renovated bathrooms and outdoor braai areas.`,
  "Each project is handled by an experienced team with care and attention to detail. Tell us what you need, and we'll plan it, quote it and build it with quality workmanship and clear communication at every phase.",
];

const PHOTO_MAIN = getProject("house-build").photos[1];
const PHOTO_SMALL = getProject("steel-structure").photos[2];

/* ==================================================================
   2. SECTION
   ================================================================== */

export default function CompanyIntroduction() {
  const root = useRef<HTMLElement | null>(null);

  useGsap(root, () => {
    gsap.fromTo(
      "[data-clip]",
      { clipPath: "inset(10% 8% 10% 8% round 18px)" },
      { clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "none", scrollTrigger: { trigger: "[data-clip]", start: "top 95%", end: "top 40%", scrub: true } },
    );
    gsap.fromTo("[data-clip] img", { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-clip]", start: "top 95%", end: "bottom top", scrub: true } });
    gsap.from("[data-small]", { yPercent: 30, ease: "none", scrollTrigger: { trigger: "[data-clip]", start: "top 80%", end: "bottom 30%", scrub: true } });
    gsap.from("[data-fact]", { autoAlpha: 0, y: 24, duration: 0.9, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: "[data-facts]", start: "top 88%" } });

    // Count the numeric facts up once.
    root.current?.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count);
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          const n = { v: 0 };
          gsap.to(n, { v: end, duration: 1.6, ease: "expo.out", onUpdate: () => (el.textContent = String(Math.round(n.v))) });
        },
      });
    });
  });

  return (
    <section ref={root} id="about" aria-labelledby="about-heading" className="mx-auto max-w-360 px-5 pt-24 sm:px-8 lg:px-12 lg:pt-28">
      {/* ---- Facts row ---- */}
      <dl data-facts className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-0">
        {FACTS.map((f, i) => (
          <div key={f.text} data-fact className={`lg:px-8 ${i > 0 ? "lg:border-l lg:border-border" : "lg:pl-0"}`}>
            <dt className="sr-only">{f.text}</dt>
            <dd>
              <p className="f-head text-[clamp(2.1rem,3.6vw,3.4rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums">
                {f.count ? <Count value={f.value} /> : f.value}
                {f.unit && <span className="ml-2 text-[0.42em] font-semibold tracking-normal text-muted">{f.unit}</span>}
              </p>
              <p className="mt-3 max-w-[16rem] text-[15px] leading-snug text-muted">{f.text}</p>
            </dd>
          </div>
        ))}
      </dl>

      {/* ---- Editorial two columns ---- */}
      <div className="mt-24 grid gap-14 lg:mt-36 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-6 lg:pt-10">
          <SectionHeading id="about-heading" eyebrow={HEADING.eyebrow} title={HEADING.title} />
          <div className="mt-8 grid max-w-xl gap-5 text-[18px] leading-relaxed text-foreground/85">
            {BODY.map((b) => (
              <p key={b.slice(0, 20)}>{b}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/services" variant="secondary" arrow>
              Our services
            </Button>
            <Button href="#contact" variant="outline-dark">
              Talk to us
            </Button>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <figure data-clip className="relative aspect-[4/5] overflow-hidden rounded-media bg-border">
            <Image src={PHOTO_MAIN.src} alt={PHOTO_MAIN.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            <figcaption className="absolute bottom-4 right-4 rounded-full bg-white/90 px-4 py-2 text-[14px] font-semibold text-foreground backdrop-blur">
              A CHR house build, on site
            </figcaption>
          </figure>
          <figure
            data-small
            className="absolute -bottom-10 -left-6 hidden aspect-[3/4] w-[38%] overflow-hidden rounded-media ring-8 ring-background sm:block lg:-left-16"
          >
            <Image src={PHOTO_SMALL.src} alt={PHOTO_SMALL.alt} fill sizes="20vw" className="object-cover" />
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   3. COUNT  (renders the final number; the effect counts it up)
   ================================================================== */

function Count({ value }: { value: string }) {
  return <span data-count={value}>{value}</span>;
}
