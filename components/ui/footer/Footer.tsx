"use client";

/* ==================================================================
   FOOTER
   ------------------------------------------------------------------
   Rendered once in app/layout.tsx, after every page's contact section.

   A charcoal frame with the same rounded corners as the heroes: a
   closing line that repeats the hero's promise next to the white
   logo, then four compact columns (about, explore, services,
   contact), then the copyright row with back to top. The red
   roofline from the logo is drawn once along the top edge and lifts
   into place when the footer comes into view.

   Sections in this file:
     1. CONTENT
     2. FOOTER
   ================================================================== */

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { copyright, scrollToTop, useYear } from "@/components/ui/footer/footerTools";
import { useInView } from "@/components/ui/motion/motion";
import { onSectionClick } from "@/components/ui/navbar/sections";
import { RoofMark } from "@/components/ui/sectionheading/SectionHeading";
import { FOOTER_LINKS, SERVICE_LINKS, SITE, whatsappHref } from "@/components/ui/site";

/* ==================================================================
   1. CONTENT
   ================================================================== */

const CLOSING = "Building with purpose. Delivering with excellence.";
const ABOUT =
  "A Free State construction company working since 2016 across civil works, building and structural construction, residential renovations and outdoor improvements.";

/* ==================================================================
   2. FOOTER
   ================================================================== */

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const year = useYear();
  const [ref, shown] = useInView<HTMLDivElement>(0.15);

  const linkClass =
    "inline-flex min-h-11 items-center rounded-md text-[16px] text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

  return (
    <footer aria-labelledby="footer-heading" className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div ref={ref} data-shown={shown} className="relative mx-auto max-w-360 overflow-hidden rounded-frame bg-header-background px-6 pb-6 pt-14 text-white sm:px-10 lg:px-14 lg:pt-20">
        {/* ---- Closing line + logo ---- */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <h2 id="footer-heading" className="reveal-up text-[clamp(2.2rem,5vw,4.5rem)] leading-[1] lg:col-span-8">
            {CLOSING}
          </h2>
          <div className="reveal-up lg:col-span-4 lg:justify-self-end" style={{ ["--d" as string]: 1 }}>
            <Link href="/" aria-label={`${SITE.name} home`} className="relative block h-14 w-[210px] rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring">
              <Image src={SITE.logo.white} alt="" fill sizes="210px" className="object-contain object-left lg:object-right" />
            </Link>
          </div>
        </div>

        <div aria-hidden="true" className="mt-12 flex items-center gap-4 text-accent">
          <RoofMark className="h-5" />
          <span className="h-[3px] flex-1 origin-left rounded-full bg-white/10" />
        </div>

        {/* ---- Columns ---- */}
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <p className="text-[16px] leading-relaxed text-white/75 lg:col-span-4 lg:pr-10">{ABOUT}</p>

          <nav aria-label="Footer" className="lg:col-span-2">
            <p className="mb-2 text-[15px] font-semibold text-white">Explore</p>
            <ul>
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={(e) => onSectionClick(e, l.href, pathname, router)} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="mb-2 text-[15px] font-semibold text-white">Services</p>
            <ul>
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="mb-2 text-[15px] font-semibold text-white">Contact</p>
            <ul>
              {SITE.phone.tel && (
                <li>
                  <a href={`tel:${SITE.phone.tel}`} className={`${linkClass} tabular-nums`}>
                    {SITE.phone.display}
                  </a>
                </li>
              )}
              <li>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp
                </a>
              </li>
              {SITE.email && (
                <li>
                  <a href={`mailto:${SITE.email}`} className={`${linkClass} break-all`}>
                    {SITE.email}
                  </a>
                </li>
              )}
              {SITE.facebook && (
                <li>
                  <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Facebook
                  </a>
                </li>
              )}
              <li className="flex min-h-11 items-center text-[16px] text-white/75">{SITE.region}, South Africa</li>
            </ul>
          </div>
        </div>

        {/* ---- Copyright row ---- */}
        <div className="mt-12 flex flex-col gap-3 rounded-2xl bg-white/5 px-5 py-3 text-[14px] text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p suppressHydrationWarning>{copyright(year)}. All rights reserved.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full px-2 font-semibold text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-focus-ring sm:self-auto"
          >
            Back to top
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
