"use client";

/* ==================================================================
   03 SERVICES OVERVIEW
   ------------------------------------------------------------------
   Where it sits and how it is used:

     import ServicesOverview from "@/components/home/services/ServicesOverview";
     <CompanyIntroduction />
     <ServicesOverview />
     <FeaturedProjects />

   Built on the structure and motion of the client's reference video:
     1. The section pins. A CHR photograph fills the whole screen with
        the section's title over it.
     2. Scrolling, the photo draws in from full bleed to a framed
        window on the right; the title leaves, and the first service
        appears on the left (number, name, short text, its main kinds
        of work, Explore Service).
     3. Each further scroll step wipes the next service's photo up
        from the bottom of the window while its text replaces the last.
     4. After the fourth service the page moves on.
   A slim progress rail names the four services and can be clicked.

   Phones, tablets and reduced motion: no pin. The four services are
   listed one after another, each with its photo, in the same order.

   Uses SERVICES from components/services/services.ts.

   Sections in this file:
     1. CONTENT
     2. SECTION
     3. PINNED STAGE (desktop)
     4. LIST (phones, tablets, reduced motion)
   ================================================================== */

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import Button from "@/components/buttons/Button";
import { SERVICES } from "@/components/services/services";
import { getLenis, gsap, useGsap, type ScrollTrigger } from "@/components/ui/motion/motion";
import SectionHeading, { Muted, RoofMark } from "@/components/ui/sectionheading/SectionHeading";

/* ==================================================================
   1. CONTENT
   ================================================================== */

const HEADING = {
  eyebrow: "What we do",
  title: "Construction Solutions for Every Project.",
  intro: "Four kinds of work, one team. From the road outside to the bathroom inside, this is what CHR Construction builds.",
};

/* ==================================================================
   2. SECTION
   ================================================================== */

export default function ServicesOverview() {
  return (
    <section id="services" aria-labelledby="services-heading" className="pt-28 lg:pt-40">
      <h2 id="services-heading" className="sr-only">
        {HEADING.title}
      </h2>
      <PinnedStage />
      <List />
    </section>
  );
}

/* ==================================================================
   3. PINNED STAGE (desktop)
   ================================================================== */

function PinnedStage() {
  const root = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(-1);
  const trigger = useRef<ScrollTrigger | null>(null);
  const n = SERVICES.length;

  useGsap(root, (el) => {
    const mm = gsap.matchMedia();
    // Landscape only: on a tall wide screen (tablet upright, "Desktop site"
    // on a phone) the plain list shows instead of the pinned stage.
    mm.add("(min-width: 1024px) and (min-aspect-ratio: 10001/10000) and (prefers-reduced-motion: no-preference)", () => {
      const win = el.querySelector<HTMLElement>("[data-window]")!;
      const rectInset = () => {
        const s = el.getBoundingClientRect();
        const w = win.getBoundingClientRect();
        return `inset(${w.top - s.top}px ${s.right - w.right}px ${s.bottom - w.bottom}px ${w.left - s.left}px round 24px)`;
      };

      gsap.set("[data-panel]", { autoAlpha: 0, y: 28 });
      gsap.set("[data-side]", { autoAlpha: 0 });
      gsap.set("[data-layer]", { clipPath: "inset(100% 0% 0% 0%)" });

      let last = -1;
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${n * window.innerHeight * 0.9}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          snap: { snapTo: "labels", duration: { min: 0.25, max: 0.7 }, ease: "power2.inOut", delay: 0.05 },
          onUpdate: (st) => {
            // Timeline time: 0-1 the window draws in, then one unit per service.
            const t = st.progress * (n + 0.15);
            const next = t < 0.6 ? -1 : Math.min(n - 1, Math.max(0, Math.floor(t - 0.5)));
            if (next !== last) {
              last = next;
              setActive(next);
            }
          },
        },
      });
      trigger.current = tl.scrollTrigger ?? null;

      tl.addLabel("intro", 0)
        .fromTo("[data-media]", { clipPath: "inset(0px 0px 0px 0px round 0px)" }, { clipPath: rectInset, duration: 1 }, 0)
        .to("[data-intro]", { autoAlpha: 0, y: -40, duration: 0.45 }, 0)
        .to("[data-side]", { autoAlpha: 1, duration: 0.4 }, 0.55)
        .to("[data-panel='0']", { autoAlpha: 1, y: 0, duration: 0.4 }, 0.6)
        .addLabel("s0", 1);

      for (let k = 1; k < n; k++) {
        const at = k;
        tl.to(`[data-panel='${k - 1}']`, { autoAlpha: 0, y: -28, duration: 0.35 }, at + 0.05)
          .to(`[data-layer='${k}']`, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8 }, at)
          .to(`[data-panel='${k}']`, { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.45)
          .addLabel(`s${k}`, at + 1);
      }
      tl.to({}, { duration: 0.15 }); // a short hold on the last service before the page moves on

      return () => {
        trigger.current = null;
      };
    });
    return () => mm.revert();
  });

  // The rail jumps to a service.
  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    const y = st.start + ((i + 1) / (n + 0.15)) * (st.end - st.start);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const first = SERVICES[0];

  return (
    <div ref={root} className="relative hidden h-svh min-h-[680px] overflow-hidden bg-background lg:block motion-reduce:lg:hidden wide-portrait:hidden!">
      {/* ---- Full-bleed photograph that becomes the window ---- */}
      <div data-media className="absolute inset-0 z-0 overflow-hidden bg-header-background">
        <Image src={first.photo.src} alt={first.photo.alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: "50% 60%" }} />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#0d0f14]/85 via-[#0d0f14]/30 to-[#0d0f14]/20" />
        <div data-intro className="absolute inset-x-0 bottom-0 mx-auto max-w-360 px-12 pb-16 text-white">
          <p className="flex items-center gap-2.5 text-[15px] font-semibold">
            <RoofMark className="text-accent" />
            {HEADING.eyebrow}
          </p>
          <p aria-hidden="true" className="mt-5 max-w-4xl f-head text-[clamp(2.6rem,5.6vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
            {HEADING.title}
          </p>
          <div className="mt-6 flex items-end justify-between gap-10">
            <p className="max-w-xl text-[18px] leading-relaxed text-white/85">{HEADING.intro}</p>
            <p className="flex items-center gap-3 text-[15px] font-semibold text-white/80">
              Scroll to explore
              <span aria-hidden="true" className="relative block h-10 w-6 rounded-full ring-2 ring-white/60">
                <span className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 animate-bounce rounded-full bg-white" />
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ---- Grid: text on the left, the window on the right ---- */}
      <div className="relative z-10 mx-auto grid h-full max-w-360 grid-cols-12 gap-x-16 px-12 pb-12 pt-28">
        <div className="col-span-5 flex flex-col">
          <div data-side>
            <p className="flex items-center gap-2.5 text-[15px] font-semibold">
              <RoofMark className="text-accent" />
              {HEADING.eyebrow}
            </p>
            <p aria-hidden="true" className="mt-4 max-w-md f-head text-[clamp(1.8rem,2.6vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              Construction solutions <span className="text-muted">for every project.</span>
            </p>
          </div>

          <div className="relative mt-auto min-h-[300px]">
            {SERVICES.map((s, i) => (
              <article key={s.id} data-panel={i} aria-labelledby={`svc-${s.id}`} className="invisible absolute inset-x-0 bottom-0 opacity-0">
                <p className="f-head text-[18px] font-semibold tabular-nums text-accent">{s.number}</p>
                <h3 id={`svc-${s.id}`} className="mt-2 text-[clamp(2.2rem,3.4vw,3.4rem)] leading-[1]">
                  {s.title}
                </h3>
                <p className="mt-4 max-w-md text-[17px] leading-relaxed text-foreground/80">{s.teaser}</p>
                <ul className="mt-5 flex max-w-md flex-wrap gap-2">
                  {s.items.slice(0, 4).map((it) => (
                    <li key={it} className="rounded-full bg-white px-3.5 py-1.5 text-[14px] font-medium text-foreground">
                      {it}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Button href={`/services#${s.id}`} variant="secondary" arrow>
                    Explore Service
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Rail */}
          <ol data-side aria-label="Services" className="mt-10 grid grid-cols-4 gap-3">
            {SERVICES.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? "step" : undefined}
                  className="group block w-full rounded-md pt-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring"
                >
                  <span className="block h-[3px] overflow-hidden rounded-full bg-foreground/10">
                    <span className={`block h-full origin-left rounded-full bg-accent transition-transform duration-500 ${i <= active ? "scale-x-100" : "scale-x-0"}`} />
                  </span>
                  <span className={`mt-2 block truncate text-[13px] font-semibold transition-colors ${i === active ? "text-foreground" : "text-muted group-hover:text-foreground"}`}>
                    {s.short}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* The window: later services wipe up inside it */}
        <div data-window className="relative col-span-7 overflow-hidden rounded-[24px]">
          {SERVICES.map((s, i) =>
            i === 0 ? null : (
              <div key={s.id} data-layer={i} className="absolute inset-0" style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
                <Image src={s.photo.src} alt={s.photo.alt} fill sizes="55vw" className="object-cover" />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-[14px] font-semibold backdrop-blur">{s.photo.caption}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/* ==================================================================
   4. LIST (phones, tablets, reduced motion)
   ================================================================== */

function List() {
  return (
    <div className="mx-auto max-w-360 px-5 sm:px-8 lg:hidden motion-reduce:lg:block wide-portrait:block! lg:px-12">
      <SectionHeading eyebrow={HEADING.eyebrow} as="h3" title={<>Construction solutions <Muted>for every project.</Muted></>} description={HEADING.intro} layout="split" />
      <ul className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <li key={s.id}>
            <Link href={`/services#${s.id}`} className="group block rounded-media focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring">
              <div className="relative aspect-[4/3] overflow-hidden rounded-media bg-border">
                <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <p className="mt-5 f-head text-[16px] font-semibold tabular-nums text-accent">{s.number}</p>
              <p className="mt-1 f-head text-[28px] font-semibold leading-tight tracking-[-0.02em]">{s.title}</p>
              <p className="mt-2 text-[16px] leading-relaxed text-muted">{s.teaser}</p>
              <p className="mt-4 inline-flex items-center gap-2 text-[16px] font-semibold text-brand">
                Explore Service
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
