"use client";

/* ==================================================================
   02-04 PROJECTS EXPLORER  (/projects)
   ------------------------------------------------------------------
   Where it sits and how it is used:

     import ProjectsExplorer from "@/components/projects/explorer/ProjectsExplorer";
     <PageHero ... />
     <ProjectsExplorer />
     <BeforeAfter />

   Three sections that share one filter and one lightbox:
     02 "Explore Our Work."  the category filters, with a count each.
     03 "Featured Project."  the bathroom and walk-in closet job as a
        case study: a large photo, an asymmetric text column and three
        more photos below.
     04 "Our Projects."      the portfolio as an editorial grid of
        varied sizes. The filter bar sticks above it. Choosing a
        filter rearranges the grid in place (tiles slide to their new
        spots, leaving ones fade out); no new page, no new URL.

   Any link to "#p-<slug>" (here, on the home page, in the hero cards)
   opens that project's lightbox; the gallery reads it on arrival too.

   Sections in this file:
     1. CONTENT
     2. EXPLORER
     3. FILTERS
     4. FEATURED
     5. GALLERY
   ================================================================== */

import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Button, { ArrowGlyph } from "@/components/buttons/Button";
import ProjectLightbox from "@/components/projects/lightbox/ProjectLightbox";
import { CATEGORIES, FEATURED_SLUG, getProject, PROJECTS, type CategoryId, type Project } from "@/components/projects/projects";
import { scrollToSection, useInView } from "@/components/ui/motion/motion";
import { Icon } from "@/components/ui/pagehero/PageHero";
import SectionHeading, { Muted, RoofMark } from "@/components/ui/sectionheading/SectionHeading";

gsap.registerPlugin(Flip);

/* ==================================================================
   1. CONTENT
   ================================================================== */

type Filter = "all" | CategoryId;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All Projects" },
  ...(Object.keys(CATEGORIES) as CategoryId[]).map((id) => ({ id, label: CATEGORIES[id].label })),
];

const count = (f: Filter) => (f === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length);

// The grid's rhythm: slot classes applied by position in the filtered list.
const SLOTS = [
  { cls: "sm:col-span-2 lg:col-span-7", aspect: "aspect-[4/3]", sizes: "(min-width:1024px) 55vw, 100vw" },
  { cls: "lg:col-span-5 lg:mt-24", aspect: "aspect-[4/5]", sizes: "(min-width:1024px) 40vw, 50vw" },
  { cls: "lg:col-span-4", aspect: "aspect-[3/4]", sizes: "(min-width:1024px) 30vw, 50vw" },
  { cls: "lg:col-span-4 lg:mt-16", aspect: "aspect-[3/4]", sizes: "(min-width:1024px) 30vw, 50vw" },
  { cls: "lg:col-span-4", aspect: "aspect-[3/4]", sizes: "(min-width:1024px) 30vw, 50vw" },
  { cls: "lg:col-span-5 lg:col-start-2", aspect: "aspect-[4/5]", sizes: "(min-width:1024px) 40vw, 50vw" },
  { cls: "lg:col-span-6 lg:mt-20", aspect: "aspect-[4/3]", sizes: "(min-width:1024px) 50vw, 50vw" },
];
const SOLO = { cls: "sm:col-span-2 lg:col-span-8 lg:col-start-3", aspect: "aspect-[16/10]", sizes: "(min-width:1024px) 66vw, 100vw" };

const FEATURED = getProject(FEATURED_SLUG);

/* ==================================================================
   2. EXPLORER
   ================================================================== */

export default function ProjectsExplorer() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<{ project: Project; start: number } | null>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const openProject = useCallback((slug: string, start = 0) => {
    const project = PROJECTS.find((p) => p.slug === slug);
    if (!project) return;
    setOpen({ project, start });
    history.replaceState(null, "", `#p-${slug}`);
  }, []);

  const close = useCallback(() => {
    setOpen(null);
    history.replaceState(null, "", window.location.pathname);
  }, []);

  // Arrived with #p-<slug>, or a "#p-" link was clicked anywhere on the page.
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#p-(.+)$/);
      if (m) openProject(m[1]);
    };
    const frame = requestAnimationFrame(fromHash);
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href*='#p-']");
      if (!a || a.pathname !== window.location.pathname) return;
      e.preventDefault();
      e.stopPropagation();
      openProject(a.hash.slice(3));
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", fromHash);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [openProject]);

  const choose = (f: Filter, jump = false) => {
    if (f === filter) {
      if (jump) glideToGallery();
      return;
    }
    flipState.current = Flip.getState("[data-gtile]");
    setFilter(f);
    if (jump) glideToGallery();
  };

  // After the grid re-renders: slide tiles from where they were.
  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    Flip.from(state, {
      targets: "[data-gtile]",
      duration: 0.75,
      ease: "expo.out",
      absolute: true,
      nested: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.6, delay: 0.15, ease: "expo.out" }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.3 }),
    });
  }, [filter]);

  return (
    <>
      <FiltersSection filter={filter} onChoose={(f) => choose(f, true)} />
      <Featured onOpen={openProject} />
      <Gallery filter={filter} onChoose={(f) => choose(f)} onOpen={openProject} />
      <ProjectLightbox project={open?.project ?? null} start={open?.start} onClose={close} />
    </>
  );
}

function glideToGallery() {
  requestAnimationFrame(() => {
    const el = document.getElementById("work");
    if (el) scrollToSection(el);
  });
}

/* ==================================================================
   3. FILTERS
   ================================================================== */

function FilterBar({ filter, onChoose, label }: { filter: Filter; onChoose: (f: Filter) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
      {FILTERS.map((f) => {
        const on = filter === f.id;
        return (
          <button
            key={f.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChoose(f.id)}
            className={`flex h-12 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full px-5 text-[15px] font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
              on ? "bg-brand text-white" : "bg-white text-foreground hover:bg-surface-hover"
            }`}
          >
            {f.label}
            <span className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[12px] tabular-nums ${on ? "bg-white/20 text-white" : "bg-background text-muted"}`}>{count(f.id)}</span>
          </button>
        );
      })}
    </div>
  );
}

function FiltersSection({ filter, onChoose }: { filter: Filter; onChoose: (f: Filter) => void }) {
  return (
    <section id="explore" aria-labelledby="explore-heading" className="mx-auto max-w-360 scroll-mt-24 px-5 pt-24 sm:px-8 lg:px-12 lg:pt-32">
      <SectionHeading
        id="explore-heading"
        eyebrow="Portfolio"
        title={
          <>
            Explore <Muted>our work.</Muted>
          </>
        }
        description="Choose a category to see only that kind of work in the gallery below. Every photograph is from a CHR site."
        layout="split"
      />
      <div className="mt-10">
        <FilterBar filter={filter} onChoose={onChoose} label="Filter projects by category" />
      </div>
    </section>
  );
}

/* ==================================================================
   4. FEATURED
   ================================================================== */

function Featured({ onOpen }: { onOpen: (slug: string, start?: number) => void }) {
  const [ref, shown] = useInView<HTMLDivElement>(0.15);
  const f = FEATURED;
  const extra = [f.photos[2], f.photos[5], f.photos[4]];
  const extraIndex = [2, 5, 4];

  return (
    <section id="featured" aria-labelledby="featured-heading" className="mx-auto max-w-360 px-5 pt-24 sm:px-8 lg:px-12 lg:pt-32">
      <div ref={ref} data-shown={shown} className="grid gap-10 lg:grid-cols-12 lg:gap-x-12">
        <button
          type="button"
          onClick={() => onOpen(f.slug, 0)}
          className="reveal-up group relative aspect-[4/3] overflow-hidden rounded-frame bg-border text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring lg:col-span-8 lg:aspect-auto lg:min-h-[560px]"
          aria-label={`Open ${f.title}`}
        >
          <Image src={f.photos[0].src} alt={f.photos[0].alt} fill sizes="(min-width:1024px) 66vw, 100vw" className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]" />
          <span className="absolute left-5 top-5 rounded-full bg-accent px-4 py-2 text-[14px] font-semibold text-white">Featured project</span>
          <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-1.5 text-[14px] font-semibold text-foreground">
            View all {f.photos.length + (f.before?.length ?? 0)} photos
            <span className="grid size-7 place-items-center rounded-full bg-accent text-white">
              <ArrowGlyph className="size-3.5" />
            </span>
          </span>
        </button>

        <div className="lg:col-span-4 lg:pt-6">
          <p className="reveal-up flex items-center gap-2.5 text-[15px] font-semibold">
            <RoofMark className="text-accent" />
            Featured project
          </p>
          <h2 id="featured-heading" className="reveal-up mt-4 text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[1.02]" style={{ ["--d" as string]: 1 }}>
            {f.title}
          </h2>
          <dl className="reveal-up mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-white p-5 text-[15px]" style={{ ["--d" as string]: 2 }}>
            <div>
              <dt className="text-muted">Category</dt>
              <dd className="mt-1 font-semibold">{CATEGORIES[f.category].label}</dd>
            </div>
            {f.date && (
              <div>
                <dt className="text-muted">Completed</dt>
                <dd className="mt-1 font-semibold">{f.date}</dd>
              </div>
            )}
            {f.location && (
              <div>
                <dt className="text-muted">Location</dt>
                <dd className="mt-1 font-semibold">{f.location}</dd>
              </div>
            )}
          </dl>
          <p className="reveal-up mt-6 text-[17px] leading-relaxed text-foreground/85" style={{ ["--d" as string]: 3 }}>
            {f.summary}
          </p>
          <div className="reveal-up mt-8" style={{ ["--d" as string]: 4 }}>
            <Button onClick={() => onOpen(f.slug, 0)} variant="secondary" arrow>
              View the project
            </Button>
          </div>
        </div>

        <ul className="grid grid-cols-3 gap-3 lg:col-span-8 lg:gap-5" aria-label="More photos of this project">
          {extra.map((ph, k) => (
            <li key={ph.src} className="reveal-up" style={{ ["--d" as string]: k + 2 }}>
              <button
                type="button"
                onClick={() => onOpen(f.slug, extraIndex[k])}
                aria-label={`Open photo: ${ph.caption}`}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-media bg-border focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
              >
                <Image src={ph.src} alt={ph.alt} fill sizes="22vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ==================================================================
   5. GALLERY
   ================================================================== */

function Gallery({ filter, onChoose, onOpen }: { filter: Filter; onChoose: (f: Filter) => void; onOpen: (slug: string) => void }) {
  const visible = PROJECTS.filter((p) => filter === "all" || p.category === filter);
  const slotOf = (slug: string) => {
    const i = visible.findIndex((p) => p.slug === slug);
    if (i < 0) return SLOTS[0];
    return visible.length === 1 ? SOLO : SLOTS[i % SLOTS.length];
  };

  return (
    <section id="work" aria-labelledby="work-heading" className="mx-auto max-w-360 scroll-mt-28 px-5 pt-24 sm:px-8 lg:px-12 lg:pt-36">
      <SectionHeading
        id="work-heading"
        eyebrow="All work"
        title={
          <>
            Our <Muted>projects.</Muted>
          </>
        }
        description="Open any project to see every photo, the category and what was done."
        layout="split"
      />

      <div className="sticky top-[84px] z-20 -mx-5 mt-10 bg-background/90 px-5 py-2 backdrop-blur-md sm:-mx-2 sm:rounded-full sm:px-2">
        <FilterBar filter={filter} onChoose={onChoose} label="Filter the gallery" />
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {filter !== "all" ? ` in ${CATEGORIES[filter].label}` : ""}
      </p>

      <ul className="mt-8 grid items-start gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-16">
        {PROJECTS.map((p) => {
          const shown = filter === "all" || p.category === filter;
          const slot = slotOf(p.slug);
          return (
            <li key={p.slug} id={`tile-${p.slug}`} data-gtile data-flip-id={p.slug} className={`${slot.cls} ${shown ? "" : "hidden"}`}>
              <button
                type="button"
                onClick={() => onOpen(p.slug)}
                className="group block w-full rounded-media text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
              >
                <span className={`relative block w-full overflow-hidden rounded-media bg-border ${slot.aspect}`}>
                  <Image src={p.photos[0].src} alt={p.photos[0].alt} fill sizes={slot.sizes} className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 py-1.5 pl-2 pr-3.5 text-[13px] font-semibold text-foreground backdrop-blur">
                    <span className="grid size-6 place-items-center rounded-full bg-header-background text-white">
                      <Icon name={p.category} className="size-3.5" />
                    </span>
                    {CATEGORIES[p.category].short}
                  </span>
                  <span className="absolute bottom-4 right-4 inline-flex translate-y-1 items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-1.5 text-[14px] font-semibold text-foreground opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
                    View Project
                    <span className="grid size-7 place-items-center rounded-full bg-accent text-white">
                      <ArrowGlyph className="size-3.5" />
                    </span>
                  </span>
                </span>
                <span className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="f-head text-[22px] font-semibold leading-tight tracking-[-0.02em] sm:text-[24px]">{p.title}</span>
                  <span className="shrink-0 text-[14px] text-muted">
                    {p.photos.length + (p.before?.length ?? 0)} {p.photos.length + (p.before?.length ?? 0) === 1 ? "photo" : "photos"}
                  </span>
                </span>
                <span className="mt-1 block text-[15px] text-muted">{CATEGORIES[p.category].label}{p.location ? `, ${p.location}` : ""}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
