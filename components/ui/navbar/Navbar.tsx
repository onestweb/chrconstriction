"use client";

/* ==================================================================
   NAVBAR (and its mobile menu)
   ------------------------------------------------------------------
   Rendered once in app/layout.tsx.

   Taken from the client's hero reference: a bar floating just inside
   the edges of the page. Over the hero video it is clear, with the
   white logo and the links gathered in one soft pill; once the page
   scrolls it becomes a solid white rounded bar with the colour logo.
   "Get a Quote" is the site Button. On phones the bar itself grows
   into the menu: a white card drops out of it with large links, the
   phone, WhatsApp and email.

   Behaviour (over the hero, compact, hides on scroll down, active
   link, menu lock) comes from useNavbar().

   Sections in this file:
     1. CONTENT
     2. NAVBAR
     3. MOBILE MENU
     4. ICONS
   ================================================================== */

import Image from "next/image";
import Link from "next/link";
import Button, { ArrowGlyph } from "@/components/buttons/Button";
import { NAV_LINKS, SITE, whatsappHref } from "@/components/ui/site";
import { useNavbar } from "./useNavbar";

/* ==================================================================
   1. CONTENT
   ================================================================== */

const PAGE_LINKS = NAV_LINKS.filter((l) => l.href !== "#contact");
const QUOTE = NAV_LINKS.find((l) => l.href === "#contact")!;

/* ==================================================================
   2. NAVBAR
   ================================================================== */

export default function Navbar() {
  const nav = useNavbar();
  const clear = nav.overHero && !nav.menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:px-5 sm:pt-4 motion-reduce:transition-none ${
        nav.hidden ? "-translate-y-[120%]" : "translate-y-0"
      }`}
    >
      <div
        className={`mx-auto max-w-360 rounded-[22px] transition-[background-color,box-shadow,padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          clear ? "bg-transparent" : "bg-white shadow-[0_8px_30px_-12px_rgb(23_25_30/0.25)]"
        }`}
      >
        <div className={`flex items-center justify-between gap-4 pl-4 pr-2 transition-[height] duration-500 sm:pl-5 ${nav.compact ? "h-16" : "h-[72px]"}`}>
          {/* Logo: white over the hero, colour on the bar */}
          <Link
            href="/"
            aria-label={`${SITE.name} home`}
            onClick={(e) => nav.go(e, "/")}
            className="relative block h-10 w-[128px] shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring sm:w-[150px]"
          >
            <Image
              src={SITE.logo.white}
              alt=""
              fill
              priority
              sizes="160px"
              className={`object-contain object-left transition-opacity duration-300 ${clear ? "opacity-100" : "opacity-0"}`}
            />
            <Image
              src={SITE.logo.colour}
              alt=""
              fill
              priority
              sizes="160px"
              className={`object-contain object-left transition-opacity duration-300 ${clear ? "opacity-0" : "opacity-100"}`}
            />
          </Link>

          {/* Desktop links in one pill */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul
              className={`flex items-center gap-1 rounded-full p-1 transition-colors duration-500 ${
                clear ? "bg-white/12 ring-1 ring-white/20 backdrop-blur-md" : "bg-background"
              }`}
            >
              {PAGE_LINKS.map((l) => {
                const active = nav.isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={(e) => nav.go(e, l.href)}
                      aria-current={nav.current(l.href)}
                      className={`relative flex h-10 items-center rounded-full px-5 text-[15px] font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                        active
                          ? clear
                            ? "bg-white text-foreground"
                            : "bg-white text-foreground shadow-[0_1px_2px_rgb(23_25_30/0.08)]"
                          : clear
                            ? "text-white/85 hover:text-white"
                            : "text-muted hover:text-foreground"
                      }`}
                    >
                      {l.label}
                      {active && <span aria-hidden="true" className="ml-2 size-1.5 rounded-full bg-accent" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {SITE.phone.tel && (
              <a
                href={`tel:${SITE.phone.tel}`}
                className={`hidden h-11 items-center gap-2 rounded-full px-4 text-[15px] font-semibold tabular-nums transition-colors xl:flex focus-visible:outline-2 focus-visible:outline-focus-ring ${
                  clear ? "text-white hover:bg-white/10" : "text-foreground hover:bg-background"
                }`}
              >
                <PhoneIcon />
                {SITE.phone.display}
              </a>
            )}
            <Button href={QUOTE.href} onClick={(e) => nav.go(e, QUOTE.href)} size="sm" arrow className="hidden sm:inline-flex">
              {QUOTE.label}
            </Button>

            {/* Menu button (below lg) */}
            <button
              type="button"
              onClick={nav.toggleMenu}
              aria-expanded={nav.menuOpen}
              aria-controls="mobile-menu"
              aria-label={nav.menuOpen ? "Close menu" : "Open menu"}
              className={`grid size-12 place-items-center rounded-full transition-colors lg:hidden focus-visible:outline-2 focus-visible:outline-focus-ring ${
                clear ? "bg-white/12 text-white ring-1 ring-white/25 backdrop-blur-md" : "bg-background text-foreground"
              }`}
            >
              <MenuIcon open={nav.menuOpen} />
            </button>
          </div>
        </div>

        <MobileMenu nav={nav} />
      </div>
    </header>
  );
}

/* ==================================================================
   3. MOBILE MENU
   ------------------------------------------------------------------
   The white bar grows into the panel: one shape, no second layer.
   Grid rows animate from 0fr to 1fr (a single, discrete change per
   tap); the links rise in a beat later.
   ================================================================== */

function MobileMenu({ nav }: { nav: ReturnType<typeof useNavbar> }) {
  const open = nav.menuOpen;
  return (
    <div
      id="mobile-menu"
      inert={!open}
      className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden motion-reduce:transition-none ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <div data-lenis-prevent className="max-h-[calc(100svh-6rem)] overflow-y-auto px-5 pb-5 pt-2">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-border">
              {NAV_LINKS.map((l, i) => {
                const active = nav.isActive(l.href);
                return (
                  <li
                    key={l.href}
                    className={`transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
                      open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                    style={{ transitionDelay: open ? `${120 + i * 50}ms` : "0ms" }}
                  >
                    <Link
                      href={l.href}
                      onClick={(e) => nav.go(e, l.href)}
                      aria-current={nav.current(l.href)}
                      className="group flex min-h-16 items-center justify-between rounded-lg py-3 f-head text-[30px] font-semibold tracking-[-0.02em] text-foreground focus-visible:outline-2 focus-visible:outline-focus-ring"
                    >
                      <span className="flex items-center gap-3">
                        {l.label}
                        {active && <span aria-hidden="true" className="size-2 rounded-full bg-accent" />}
                      </span>
                      <span className="grid size-10 place-items-center rounded-full bg-background text-foreground transition-colors group-hover:bg-accent group-hover:text-white">
                        <ArrowGlyph />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className={`mt-4 grid gap-2 rounded-2xl bg-background p-4 transition-opacity duration-500 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: open ? "320ms" : "0ms" }}
          >
            <p className="text-[14px] text-muted">Talk to us about your project</p>
            {SITE.phone.tel && (
              <a href={`tel:${SITE.phone.tel}`} className="flex min-h-11 items-center gap-3 text-[20px] font-semibold tabular-nums text-foreground">
                <PhoneIcon />
                {SITE.phone.display}
              </a>
            )}
            <div className="flex flex-wrap gap-2">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center gap-2 rounded-full bg-[#1f9e50] px-5 text-[15px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                WhatsApp us
              </a>
              {SITE.email && (
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex h-11 items-center rounded-full bg-white px-5 text-[15px] font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-focus-ring"
                >
                  Email us
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================================================================
   4. ICONS
   ================================================================== */

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-3.5 w-5">
      <span
        className={`absolute left-0 h-[2px] w-5 rounded-full bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
      />
      <span
        className={`absolute left-0 h-[2px] rounded-full bg-current transition-[transform,width] duration-300 ${open ? "top-1.5 w-5 -rotate-45" : "top-3 w-3.5"}`}
      />
    </span>
  );
}

export function PhoneIcon({ className = "size-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 3 6.2 2 2 0 0 1 5 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
