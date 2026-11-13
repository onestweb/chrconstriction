"use client";

/* ==================================================================
   PAGE HERO (Services and Projects)
   ------------------------------------------------------------------
   Usage:

     import PageHero from "@/components/ui/pagehero/PageHero";
     <PageHero title="..." text="..." note="..." photo={photo}
       buttons={[{ label, href }]} cards={[{ title, text, href, icon }]} />

   After the client's "roofing" reference: a rounded frame inset from
   the page edges holds one of CHR's photographs, the headline at the
   top left, a short note on the right and the buttons at the bottom
   left. Its bottom-right corner is cut away by a notch in the page
   colour (concave corners on both ends), and dark cards sit in that
   notch, overlapping the frame's lower edge. A small statement sits
   below the frame on the left.

   The same frame on both pages keeps the site consistent; each page
   brings its own photograph, words and cards.

   Motion: the photo opens from a slight zoom while the headline rises
   word by word, then the note, buttons and cards follow. Reduced
   motion: everything in place.

   Props:
     title, text, note?, statement?, photo, buttons, cards, cardsLabel

   Sections in this file:
     1. TYPES
     2. HERO
     3. CARD
     4. ICONS
   ================================================================== */

import Image from "next/image";
import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import Button, { ArrowGlyph } from "@/components/buttons/Button";
import { EASE_OUT, gsap, revealWords, scrollToSection, SplitWords, useGsap } from "@/components/ui/motion/motion";
import type { Photo } from "@/components/ui/photoviewer/PhotoViewer";

/* ==================================================================
   1. TYPES
   ================================================================== */

export type HeroCard = { title: string; text: string; href: string; icon?: IconName; image?: Photo };
type HeroButton = { label: string; href: string };

type Props = {
  title: string;
  text: string;
  note?: string;
  statement?: string;
  photo: Photo;
  photoPosition?: string;
  buttons: HeroButton[];
  cards: HeroCard[];
  cardsLabel: string;
};

/** Same-page "#section" links glide with Lenis. */
function glide(e: MouseEvent, href: string) {
  if (!href.startsWith("#") || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const el = document.getElementById(href.slice(1));
  if (!el) return;
  e.preventDefault();
  scrollToSection(el);
}

/* ==================================================================
   2. HERO
   ================================================================== */

export default function PageHero({ title, text, note, statement, photo, photoPosition, buttons, cards, cardsLabel }: Props) {
  const root = useRef<HTMLElement | null>(null);

  useGsap(root, (el) => {
    const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
    tl.fromTo("[data-photo]", { scale: 1.16 }, { scale: 1, duration: 1.8 }, 0)
      .add(revealWords(el.querySelectorAll("[data-word]")), 0.2)
      .from("[data-rise]", { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08 }, 0.55)
      .from("[data-hcard]", { autoAlpha: 0, y: 40, duration: 1, stagger: 0.08 }, 0.7);
    gsap.to("[data-photo]", { yPercent: 8, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
  });

  return (
    <section ref={root} id="hero" aria-labelledby="hero-heading" className="px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="mx-auto max-w-360">
        {/* ---- The frame ---- */}
        <div className="relative isolate flex min-h-[600px] flex-col overflow-hidden rounded-frame bg-header-background text-white lg:h-[min(84svh,820px)] lg:min-h-[640px]">
          <div data-photo className="absolute inset-0 -z-10 will-change-transform">
            <Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" className="object-cover" style={{ objectPosition: photoPosition ?? "50% 50%" }} />
          </div>
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#0d0f14]/45" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-black/55 to-transparent" />
          <div aria-hidden="true" className="absolute inset-y-0 left-0 -z-10 w-2/3 bg-linear-to-r from-[#0d0f14]/60 to-transparent" />

          <div className="flex flex-1 flex-col px-6 pb-8 pt-32 sm:px-10 lg:px-14 lg:pb-14 lg:pt-40">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <h1 id="hero-heading" className="max-w-4xl text-[clamp(2.4rem,4.8vw,4.9rem)] leading-[1] tracking-[-0.035em]">
                <SplitWords>{title}</SplitWords>
              </h1>
            </div>
            <p data-rise className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/85 sm:text-[18px]">
              {text}
            </p>

            <div className="mt-auto flex flex-col gap-8 pt-10 lg:flex-row lg:items-end lg:justify-between">
              <div data-rise className="flex flex-wrap gap-3">
                {buttons.map((b, i) => (
                  <Button key={b.href} href={b.href} onClick={(e) => glide(e, b.href)} variant={i === 0 ? "primary" : "outline-light"} size="lg" arrow={i === 0}>
                    {b.label}
                  </Button>
                ))}
              </div>
              {note && (
                <p data-rise className="max-w-[16rem] text-[16px] font-medium leading-snug text-white/85 lg:mb-[min(22svh,220px)] lg:text-right">
                  {note}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ---- Below the frame: statement left, cards in the notch right ---- */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 pt-5 lg:grid-cols-12 lg:gap-x-6 lg:pt-0">
          {statement && <p className="order-2 max-w-sm text-[16px] leading-relaxed text-muted lg:order-1 lg:col-span-4 lg:pt-8">{statement}</p>}

          <div className={`relative order-1 lg:order-2 lg:-mt-[150px] ${statement ? "lg:col-span-8" : "lg:col-span-8 lg:col-start-5"}`}>
            {/* The notch: page-coloured block with concave corners at both ends */}
            <div aria-hidden="true" className="absolute inset-0 hidden rounded-tl-[28px] bg-background lg:block" />
            <span aria-hidden="true" className="absolute -left-7 top-[122px] hidden size-7 lg:block" style={{ background: "radial-gradient(circle at 0 0, transparent 27.5px, var(--background) 28px)" }} />
            <span aria-hidden="true" className="absolute -top-7 right-0 hidden size-7 lg:block" style={{ background: "radial-gradient(circle at 0 0, transparent 27.5px, var(--background) 28px)" }} />

            <ul
              aria-label={cardsLabel}
              className="no-scrollbar relative -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 sm:-mx-5 sm:px-5 lg:mx-0 lg:grid lg:snap-none lg:gap-4 lg:overflow-visible lg:px-0 lg:pl-5 lg:pt-5"
              style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` }}
            >
              {cards.map((c, i) => (
                <Card key={c.href} card={c} highlight={i === 0} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   3. CARD
   ================================================================== */

function Card({ card, highlight }: { card: HeroCard; highlight: boolean }) {
  return (
    <li data-hcard className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-auto">
      <Link
        href={card.href}
        onClick={(e) => glide(e, card.href)}
        className="group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-[20px] bg-header-background p-5 text-white transition-colors hover:bg-[#23262d] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
      >
        {card.image && (
          <>
            <Image src={card.image.src} alt="" fill sizes="(min-width:1024px) 20vw, 70vw" className="object-cover opacity-35 transition-opacity duration-500 group-hover:opacity-50" />
            <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-header-background via-header-background/60 to-transparent" />
          </>
        )}
        <span className="relative flex items-start justify-between">
          {card.icon ? (
            <span className="grid size-10 place-items-center rounded-full bg-white text-foreground">
              <Icon name={card.icon} />
            </span>
          ) : (
            <span />
          )}
          <span
            aria-hidden="true"
            className={`grid size-9 place-items-center rounded-full transition-[background-color,transform] duration-500 group-hover:rotate-45 ${highlight ? "bg-accent" : "bg-white/10 group-hover:bg-accent"}`}
          >
            <ArrowGlyph className="size-3.5" />
          </span>
        </span>
        <span className="relative mt-auto block pt-8 f-head text-[19px] font-semibold leading-tight">{card.title}</span>
        <span className="relative mt-2 block text-[14px] leading-snug text-white/70">{card.text}</span>
      </Link>
    </li>
  );
}

/* ==================================================================
   4. ICONS  (simple line icons for the four kinds of work)
   ================================================================== */

export type IconName = "civil" | "building" | "residential" | "outdoor";

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const common = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {name === "civil" && (
        <>
          <path d="M5 21 9 3h6l4 18" {...common} />
          <path d="M12 6v2M12 11v3M12 17v3" {...common} />
        </>
      )}
      {name === "building" && (
        <>
          <path d="M4 21V9l8-5 8 5v12" {...common} />
          <path d="M4 21h16M9 21v-6h6v6M9 11h6" {...common} />
        </>
      )}
      {name === "residential" && (
        <>
          <path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3Z" {...common} />
          <path d="M6 12V6a2 2 0 0 1 4 0M8 20l-1 2M16 20l1 2" {...common} />
        </>
      )}
      {name === "outdoor" && (
        <>
          <path d="M3 11 12 4l9 7" {...common} />
          <path d="M6 9.5V20M18 9.5V20M4 20h16M10 20v-4h4v4" {...common} />
        </>
      )}
    </svg>
  );
}
