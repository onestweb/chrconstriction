"use client";

/* ==================================================================
   06 COMPANY CAPABILITIES  (/projects)
   ------------------------------------------------------------------
   Where it sits and how it is used:

     import CompanyCapabilities from "@/components/projects/capabilities/CompanyCapabilities";
     <BeforeAfter />
     <CompanyCapabilities />
     <ContactCTA ... />

   "Different Projects. One Commitment to Quality." A compact strip,
   not another services section: four white tiles in one row, each
   with its icon, the kind of work, one line and how many projects of
   that kind are in the gallery above, linking to the matching
   service on the Services page.

   Sections in this file:
     1. CONTENT
     2. SECTION
   ================================================================== */

import Link from "next/link";
import { ArrowGlyph } from "@/components/buttons/Button";
import { PROJECTS, type CategoryId } from "@/components/projects/projects";
import { useInView } from "@/components/ui/motion/motion";
import { Icon } from "@/components/ui/pagehero/PageHero";
import SectionHeading, { Muted } from "@/components/ui/sectionheading/SectionHeading";

/* ==================================================================
   1. CONTENT
   ================================================================== */

const ITEMS: { id: CategoryId; title: string; text: string }[] = [
  { id: "building", title: "Building", text: "Structural and general building projects." },
  { id: "civil", title: "Civil", text: "Infrastructure and civil construction projects." },
  { id: "residential", title: "Residential", text: "Renovations and residential improvements." },
  { id: "outdoor", title: "Outdoor", text: "Exterior and outdoor construction work." },
];

/* ==================================================================
   2. SECTION
   ================================================================== */

export default function CompanyCapabilities() {
  const [ref, shown] = useInView<HTMLUListElement>(0.2);
  return (
    <section id="capabilities" aria-labelledby="capabilities-heading" className="mx-auto max-w-360 px-5 pt-28 sm:px-8 lg:px-12 lg:pt-40">
      <SectionHeading
        id="capabilities-heading"
        eyebrow="Capabilities"
        title={
          <>
            Different projects. <Muted>One commitment to quality.</Muted>
          </>
        }
        layout="split"
        description="The same team and the same standards, whatever the size or kind of job."
      />
      <ul ref={ref} data-shown={shown} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {ITEMS.map((it, i) => {
          const n = PROJECTS.filter((p) => p.category === it.id).length;
          return (
            <li key={it.id} className="reveal-up" style={{ ["--d" as string]: i }}>
              <Link
                href={`/services#${it.id}`}
                className="group flex h-full min-h-[210px] flex-col rounded-[22px] bg-white p-6 transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
              >
                <span className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-full bg-background text-foreground transition-colors group-hover:bg-white/15 group-hover:text-white">
                    <Icon name={it.id} />
                  </span>
                  <span className="text-[14px] font-semibold tabular-nums text-muted transition-colors group-hover:text-white/75">
                    {n} {n === 1 ? "project" : "projects"}
                  </span>
                </span>
                <span className="mt-auto flex items-end justify-between gap-3 pt-10">
                  <span>
                    <span className="block f-head text-[28px] font-semibold tracking-[-0.02em]">{it.title}</span>
                    <span className="mt-1 block text-[15px] text-muted transition-colors group-hover:text-white/80">{it.text}</span>
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-white transition-transform duration-500 group-hover:rotate-45">
                    <ArrowGlyph className="size-3.5" />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
