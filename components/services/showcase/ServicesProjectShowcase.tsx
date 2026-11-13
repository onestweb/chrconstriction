"use client";

/* ==================================================================
   09 PROJECT SHOWCASE  (/services)
   ------------------------------------------------------------------
   Where it sits and how it is used:

     import ServicesProjectShowcase from "@/components/services/showcase/ServicesProjectShowcase";
     <WhyChooseCHR variant="services" />
     <ServicesProjectShowcase />
     <ContactCTA ... />

   After the client's roofing reference ("Six roofs we lay"): the
   heading and a short text on the left, and on the right a stepped
   stack of dark bands, each band a CHR project from a different
   category with its photograph showing through on the right. The
   bands step in and out of line, and each one lifts into place as it
   scrolls in. A band opens that project on the Projects page.

   Sections in this file:
     1. CONTENT
     2. SECTION
   ================================================================== */

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Button, { ArrowGlyph } from "@/components/buttons/Button";
import { CATEGORIES, getProject } from "@/components/projects/projects";
import { gsap, useGsap } from "@/components/ui/motion/motion";
import SectionHeading, { Muted } from "@/components/ui/sectionheading/SectionHeading";

/* ==================================================================
   1. CONTENT
   ================================================================== */

const SHOWCASE = [
  { slug: "slab-brickwork", photo: 2 },
  { slug: "roof", photo: 0 },
  { slug: "bathroom-closet", photo: 2 },
].map((s) => ({ project: getProject(s.slug), photo: getProject(s.slug).photos[s.photo] }));

/* ==================================================================
   2. SECTION
   ================================================================== */

export default function ServicesProjectShowcase() {
  const root = useRef<HTMLElement | null>(null);

  useGsap(root, () => {
    gsap.utils.toArray<HTMLElement>("[data-band]").forEach((b, i) => {
      gsap.from(b, { autoAlpha: 0, x: i % 2 ? 40 : -40, duration: 1, ease: "expo.out", scrollTrigger: { trigger: b, start: "top 90%" } });
    });
  });

  return (
    <section ref={root} id="showcase" aria-labelledby="showcase-heading" className="mx-auto max-w-360 overflow-x-clip px-5 pt-28 sm:px-8 lg:px-12 lg:pt-40">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-40">
            <SectionHeading
              id="showcase-heading"
              eyebrow="Recent work"
              title={
                <>
                  See our work <Muted>in action.</Muted>
                </>
              }
              description="Projects from across our services, photographed on site by the CHR team."
            />
            <div className="mt-8">
              <Button href="/projects" variant="secondary" arrow>
                Explore Our Projects
              </Button>
            </div>
          </div>
        </div>

        <ul className="grid gap-3 lg:col-span-8">
          {SHOWCASE.map(({ project, photo }, i) => (
            <li key={project.slug} data-band className={i % 2 ? "lg:ml-10" : "lg:mr-10"}>
              <Link
                href={`/projects#p-${project.slug}`}
                className="group relative flex min-h-[150px] items-stretch overflow-hidden rounded-[20px] bg-header-background text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring sm:min-h-[170px]"
              >
                <div className="relative z-10 flex flex-1 flex-col justify-center gap-2 p-6 sm:max-w-[58%] sm:p-7">
                  <p className="text-[14px] text-white/65">{CATEGORIES[project.category].label}</p>
                  <p className="f-head text-[24px] font-semibold leading-tight tracking-[-0.02em] sm:text-[28px]">{project.title}</p>
                  <p className="inline-flex items-center gap-2 text-[15px] font-semibold text-white/85">
                    View project
                    <span className="grid size-7 place-items-center rounded-full bg-accent transition-transform duration-500 group-hover:rotate-45">
                      <ArrowGlyph className="size-3.5" />
                    </span>
                  </p>
                </div>
                <div className="absolute inset-y-0 right-0 w-full sm:w-[55%]">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(min-width:1024px) 35vw, 100vw" className="object-cover opacity-40 transition-[opacity,transform] duration-700 group-hover:scale-105 group-hover:opacity-70 sm:opacity-80" />
                  <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-header-background via-header-background/40 to-transparent" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
