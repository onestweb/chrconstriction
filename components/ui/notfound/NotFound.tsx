/* ==================================================================
   404 (any address that doesn't exist)
   ------------------------------------------------------------------
   Rendered by app/not-found.tsx.

   One of CHR's own photographs (the excavated column base, steel
   cage waiting for concrete) fills a rounded frame like the other
   heroes, with one line of wit: the page you wanted hasn't been
   built. Two buttons, then the site's pages as large links.

   Sections in this file:
     1. CONTENT
     2. PAGE
   ================================================================== */

import Image from "next/image";
import Link from "next/link";
import Button, { ArrowGlyph } from "@/components/buttons/Button";
import { getProject } from "@/components/projects/projects";
import { NAV_LINKS } from "@/components/ui/site";

/* ==================================================================
   1. CONTENT
   ================================================================== */

const PHOTO = getProject("steel-structure").photos[4];
const TITLE = "This page hasn't been built yet.";
const TEXT = "The address may have changed, or the link was mistyped. Everything we do is one step away.";

/* ==================================================================
   2. PAGE
   ================================================================== */

export default function NotFound() {
  const links = NAV_LINKS.map((l) => ({ ...l, href: l.href === "#contact" ? "/#contact" : l.href }));
  return (
    <section id="hero" aria-labelledby="notfound-heading" className="px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="relative mx-auto flex min-h-[78svh] wide-portrait:min-h-[min(78svh,max(56vw,620px))] max-w-360 items-end overflow-hidden rounded-frame bg-header-background">
        <Image src={PHOTO.src} alt={PHOTO.alt} fill priority sizes="100vw" className="object-cover opacity-55" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/60 to-transparent" />
        <div className="relative w-full px-6 pb-10 pt-40 text-white sm:px-10 lg:px-14 lg:pb-14">
          <p className="text-[15px] font-semibold text-white/80">Error 404</p>
          <h1 id="notfound-heading" className="mt-3 max-w-3xl text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.98]">
            {TITLE}
          </h1>
          <p className="mt-5 max-w-lg text-[18px] leading-relaxed text-white/80">{TEXT}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/" arrow>
              Back to home
            </Button>
            <Button href="/#contact" variant="outline-light">
              Request a Quote
            </Button>
          </div>
        </div>
      </div>
      <nav aria-label="Main pages" className="mx-auto mt-3 grid max-w-360 gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group flex min-h-24 items-center justify-between rounded-[22px] bg-white px-6 f-head text-[26px] font-semibold tracking-[-0.02em] transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-focus-ring"
          >
            {l.label}
            <span className="grid size-10 place-items-center rounded-full bg-background text-foreground transition-colors group-hover:bg-accent group-hover:text-white">
              <ArrowGlyph />
            </span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
