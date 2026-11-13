"use client";

/* ==================================================================
   01 HERO (home)
   ------------------------------------------------------------------
   Where it sits and how it is used:

     import Hero from "@/components/home/hero/Hero";
     <Hero />
     <CompanyIntroduction />

   Full bleed, after the client's "industrial worker" reference: the
   construction film fills the whole first screen, muted and looping,
   with no play or pause control (the client's decision). The floating
   navbar sits over it. Bottom left: a small tag, the two-line
   headline, one sentence and two buttons. Bottom right: a card that
   cycles through three of CHR's real projects. Straddling the bottom
   edge: a round "Get in touch" badge whose lettering turns slowly.

   The opening: the film opens from a framed window to the full screen
   while it settles from a slight zoom, then the headline rises word by
   word and the copy, buttons and card follow. On scroll the film
   drifts down a little behind the content.

   Reduced motion: no intro, no drift, and the film rests on its first
   frame (the poster), so nothing moves on its own.

   Sections in this file:
     1. CONTENT
     2. SECTION
     3. RECENT WORK CARD
     4. GET IN TOUCH BADGE
   ================================================================== */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/buttons/Button";
import { CATEGORIES, getProject } from "@/components/projects/projects";
import { EASE_OUT, gsap, revealWords, scrollToSection, SplitWords, useGsap } from "@/components/ui/motion/motion";
import { RoofMark } from "@/components/ui/sectionheading/SectionHeading";

/* ==================================================================
   1. CONTENT
   ================================================================== */

const VIDEO = { src: "/hero/hero.mp4", poster: "/hero/poster.jpg" };
const POSTER_ALT = "A building rising on a cleared site: excavation, concrete columns, then a finished two-storey building";

const TAG = "Free State construction since 2016";
const HEADLINE = ["Building with Purpose.", "Delivering with Excellence."];
const TEXT =
  "From civil construction and structural building to residential renovations and outdoor improvements, CHR Construction delivers practical construction solutions with a commitment to quality workmanship.";
const PRIMARY = { label: "Explore Our Projects", href: "/projects" };
const SECONDARY = { label: "Request a Quote", href: "#contact" };

const RECENT = ["steel-structure", "braai-area", "bathroom-closet"].map(getProject);

/* ==================================================================
   2. SECTION
   ================================================================== */

export default function Hero() {
  const root = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);

  // Under reduced motion the film stays on its poster frame.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (still.matches) v.pause();
      else v.play().catch(() => {});
    };
    apply();
    still.addEventListener("change", apply);
    return () => still.removeEventListener("change", apply);
  }, []);

  useGsap(root, (el) => {
    const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
    tl.fromTo("[data-frame]", { clipPath: "inset(7% 5% 7% 5% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.6 }, 0)
      .fromTo("[data-film]", { scale: 1.18 }, { scale: 1, duration: 2 }, 0)
      .add(revealWords(el.querySelectorAll("[data-word]"), 0), 0.45)
      .from("[data-rise]", { autoAlpha: 0, y: 24, duration: 1, stagger: 0.09 }, 0.8)
      .from("[data-card]", { autoAlpha: 0, y: 32, duration: 1.1 }, 1.0)
      .from("[data-badge]", { autoAlpha: 0, scale: 0.6, rotate: -60, duration: 1.2 }, 1.1);

    gsap.to("[data-film]", {
      yPercent: 10,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to("[data-copy]", {
      y: -60,
      autoAlpha: 0.2,
      ease: "none",
      scrollTrigger: { trigger: el, start: "35% top", end: "bottom top", scrub: true },
    });
  });

  return (
    <div ref={root} className="relative">
      <section id="hero" aria-labelledby="hero-heading" className="relative isolate h-svh min-h-[640px] overflow-hidden wide-portrait:h-[min(100svh,max(64vw,720px))] bg-header-background text-white">
        {/* ---- The film ---- */}
        <div data-frame className="absolute inset-0 overflow-hidden">
          <div data-film className="absolute inset-0 will-change-transform">
            <Image src={VIDEO.poster} alt={POSTER_ALT} fill priority sizes="100vw" className="object-cover" />
            <video
              ref={video}
              className="absolute inset-0 size-full object-cover"
              src={VIDEO.src}
              poster={VIDEO.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              disablePictureInPicture
            />
          </div>
          {/* Scrims: top for the navbar, bottom-left for the headline */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/55 to-transparent" />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-[#0d0f14]/90 via-[#0d0f14]/35 to-transparent" />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-[#0d0f14]/55 via-transparent to-transparent" />
        </div>

        {/* ---- Copy ---- */}
        <div className="relative mx-auto flex h-full max-w-360 items-end px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-28">
          <div className="grid w-full gap-10 lg:grid-cols-12 lg:items-end">
            <div data-copy className="lg:col-span-8">
              <p
                data-rise
                className="inline-flex items-center gap-2.5 rounded-full bg-white/12 py-2 pl-3 pr-4 text-[14px] font-semibold text-white ring-1 ring-white/20 backdrop-blur-md"
              >
                <RoofMark className="h-3.5 text-accent" />
                {TAG}
              </p>
              <h1 id="hero-heading" className="mt-6 text-[clamp(2.5rem,4.8vw,5.1rem)] leading-[0.98] tracking-[-0.035em]">
                <SplitWords className="block">{HEADLINE[0]}</SplitWords>
                <SplitWords className="block text-white/80">{HEADLINE[1]}</SplitWords>
              </h1>
              <p data-rise className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/85 sm:text-[18px]">
                {TEXT}
              </p>
              <div data-rise className="mt-8 flex flex-wrap gap-3">
                <Button href={PRIMARY.href} size="lg" arrow>
                  {PRIMARY.label}
                </Button>
                <Button href={SECONDARY.href} variant="outline-light" size="lg">
                  {SECONDARY.label}
                </Button>
              </div>
            </div>

            <div data-card className="hidden justify-self-end lg:col-span-4 min-[1181px]:block">
              <RecentWork />
            </div>
          </div>
        </div>
      </section>

      <Badge />
    </div>
  );
}

/* ==================================================================
   3. RECENT WORK CARD
   ------------------------------------------------------------------
   Steps through three real projects every few seconds (paused while
   hovered or focused, and under reduced motion). Opens the project in
   the Projects page lightbox.
   ================================================================== */

function RecentWork() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (hold || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % RECENT.length), 4500);
    return () => window.clearInterval(t);
  }, [hold]);

  const p = RECENT[i];
  return (
    <Link
      href={`/projects#p-${p.slug}`}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      aria-label={`Recent work: ${p.title}. View project`}
      className="group flex w-[360px] items-stretch gap-4 rounded-[22px] bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/16 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1.5 pl-2">
        <p className="f-head text-[22px] font-semibold tabular-nums leading-none">
          /{String(i + 1).padStart(2, "0")}
          <span className="ml-1 text-[14px] font-medium text-white/60">of {String(RECENT.length).padStart(2, "0")}</span>
        </p>
        <div key={p.slug} className="hero-fade">
          <p className="text-[13px] text-white/65">{CATEGORIES[p.category].label}</p>
          <p className="mt-1 text-[15px] font-semibold leading-snug">{p.title}</p>
        </div>
      </div>
      <div className="relative h-[118px] w-[150px] shrink-0 overflow-hidden rounded-[14px]">
        {RECENT.map((r, n) => (
          <Image
            key={r.slug}
            src={r.photos[0].src}
            alt=""
            fill
            sizes="150px"
            className={`object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 ${n === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <span aria-hidden="true" className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full bg-accent text-white">
          <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
            <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <style>{`
        @keyframes hero-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .hero-fade { animation: hero-fade 600ms cubic-bezier(0.32,0.72,0,1) both; }
      `}</style>
    </Link>
  );
}

/* ==================================================================
   4. GET IN TOUCH BADGE
   ------------------------------------------------------------------
   A round link that sits across the hero's bottom edge. The ring of
   lettering turns slowly (stopped under reduced motion).
   ================================================================== */

function Badge() {
  return (
    <a
      href="#contact"
      data-badge
      aria-label="Get in touch"
      onClick={(e) => {
        const el = document.getElementById("contact");
        if (!el) return;
        e.preventDefault();
        scrollToSection(el);
      }}
      className="group absolute bottom-0 right-5 z-10 grid size-[112px] translate-y-1/2 place-items-center rounded-full bg-header-background text-white ring-[6px] ring-background transition-transform duration-500 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring sm:right-10 sm:size-[128px] min-[1181px]:left-[46%] min-[1181px]:right-auto"
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" className="badge-spin absolute inset-1.5">
        <defs>
          <path id="badge-ring" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-white text-[10px] font-semibold uppercase">
          <textPath href="#badge-ring" textLength="226" lengthAdjust="spacing">
            Get in touch · Get in touch ·
          </textPath>
        </text>
      </svg>
      <span className="grid size-11 place-items-center rounded-full bg-accent transition-transform duration-500 group-hover:rotate-45">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
          <path d="M8 3v10M3.5 8.5 8 13l4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <style>{`
        @keyframes badge-spin { to { transform: rotate(360deg); } }
        .badge-spin { animation: badge-spin 18s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .badge-spin { animation: none; } }
      `}</style>
    </a>
  );
}
