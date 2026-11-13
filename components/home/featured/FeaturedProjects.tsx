"use client";

/* ==================================================================
   04 FEATURED PROJECTS
   ------------------------------------------------------------------
   Where it sits and how it is used:

     import FeaturedProjects from "@/components/home/featured/FeaturedProjects";
     <ServicesOverview />
     <FeaturedProjects />
     <WhyChooseCHR />

   Four of CHR's strongest documented jobs in an editorial layout of
   different sizes: a tall steel structure on the left, a wide
   bathroom on the right, and below it the Goldfields Mall repair and
   the braai area set lower than their neighbour. Each tile shows its
   category and title; on hover the photo settles and a "View
   project" pill slides in. A tile opens that project's lightbox on
   the Projects page. Photos drift slightly against the scroll.

   Sections in this file:
     1. CONTENT
     2. SECTION
     3. TILE
   ================================================================== */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Button, { ArrowGlyph } from "@/components/buttons/Button";
import { CATEGORIES, getProject, type Project } from "@/components/projects/projects";
import { gsap, useGsap } from "@/components/ui/motion/motion";
import SectionHeading, { Muted } from "@/components/ui/sectionheading/SectionHeading";

/* ==================================================================
   1. CONTENT
   ================================================================== */

const HEADING = {
  eyebrow: "Featured projects",
  title: (
    <>
      Work that speaks <Muted>for itself.</Muted>
    </>
  ),
  description: "A few recent jobs from CHR's own photographs, across structural, civil, residential and outdoor work.",
};

// Slots: which project, which grid cell, which crop.
const TILES: { slug: string; photo: number; slot: string; aspect: string; sizes: string }[] = [
  { slug: "steel-structure", photo: 1, slot: "lg:col-span-5 lg:row-span-2", aspect: "aspect-[4/5] lg:aspect-auto lg:h-full", sizes: "(min-width:1024px) 40vw, 100vw" },
  { slug: "bathroom-closet", photo: 0, slot: "lg:col-span-7", aspect: "aspect-[16/9]", sizes: "(min-width:1024px) 55vw, 100vw" },
  { slug: "pothole-goldfields", photo: 0, slot: "lg:col-span-3 lg:mt-0", aspect: "aspect-[3/4]", sizes: "(min-width:1024px) 22vw, 100vw" },
  { slug: "braai-area", photo: 0, slot: "lg:col-span-4 lg:mt-16", aspect: "aspect-[4/5]", sizes: "(min-width:1024px) 30vw, 100vw" },
];

/* ==================================================================
   2. SECTION
   ================================================================== */

export default function FeaturedProjects() {
  const root = useRef<HTMLElement | null>(null);

  useGsap(root, () => {
    gsap.utils.toArray<HTMLElement>("[data-tile]").forEach((tile, i) => {
      gsap.from(tile, { autoAlpha: 0, y: 40, duration: 1, ease: "expo.out", delay: (i % 2) * 0.08, scrollTrigger: { trigger: tile, start: "top 88%" } });
      const img = tile.querySelector("img");
      if (img) gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });

  return (
    <section ref={root} id="projects" aria-labelledby="projects-heading" className="mx-auto max-w-360 px-5 pt-28 sm:px-8 lg:px-12 lg:pt-40">
      <SectionHeading id="projects-heading" eyebrow={HEADING.eyebrow} title={HEADING.title} description={HEADING.description} layout="split" />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        {TILES.map((t) => (
          <Tile key={t.slug} project={getProject(t.slug)} {...t} />
        ))}
      </ul>

      <div className="mt-14 flex justify-center">
        <Button href="/projects" variant="secondary" size="lg" arrow>
          Explore All Projects
        </Button>
      </div>
    </section>
  );
}

/* ==================================================================
   3. TILE
   ================================================================== */

function Tile({ project, photo, slot, aspect, sizes }: { project: Project; photo: number; slot: string; aspect: string; sizes: string }) {
  const ph = project.photos[photo];
  return (
    <li data-tile className={`${slot} ${slot.includes("row-span-2") ? "sm:col-span-2 lg:col-span-5" : ""}`}>
      <Link
        href={`/projects#p-${project.slug}`}
        className="group flex h-full flex-col rounded-media focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
      >
        <div className={`relative w-full flex-1 overflow-hidden rounded-media bg-border ${aspect}`}>
          <Image
            src={ph.src}
            alt={ph.alt}
            fill
            sizes={sizes}
            className="scale-110 object-cover transition-[filter] duration-700 group-hover:brightness-90"
            style={{ objectPosition: ph.position ?? "50% 50%" }}
          />
          <span className="absolute right-4 top-4 inline-flex translate-y-1 items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-1.5 text-[14px] font-semibold text-foreground opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
            View project
            <span className="grid size-7 place-items-center rounded-full bg-accent text-white">
              <ArrowGlyph className="size-3.5" />
            </span>
          </span>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <p className="f-head text-[22px] font-semibold leading-tight tracking-[-0.02em] sm:text-[24px]">{project.title}</p>
          <p className="shrink-0 text-[14px] font-medium text-muted">{CATEGORIES[project.category].short}</p>
        </div>
      </Link>
    </li>
  );
}
