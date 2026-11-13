"use client";

/* ==================================================================
   FLOATING WHATSAPP BUTTON
   ------------------------------------------------------------------
   A round WhatsApp button, bottom right, on every page. It is placed
   once in app/layout.tsx, after the footer:

     import WhatsAppButton from "@/components/ui/whatsapp/WhatsAppButton";
     ...
     <Footer />
     <WhatsAppButton />

   When it shows:
     - On every site, always: it is part of the kit. Fill
       SITE.whatsapp.number (site.ts); until then it opens WhatsApp
       with the greeting but no chat picked.
     - Only once you have scrolled past the page's hero: the element
       with id="hero" (home, 404), or else the first section of the
       page.
     - It steps aside while the contact section is on screen, because
       that section has its own WhatsApp button.
     - It checks again on every page change.

   Tapping it opens WhatsApp (the app on phones, WhatsApp Web on
   desktop) with a short greeting already typed.

   "Live" look: a soft green glow breathes behind the button, two
   rings ripple out from it in turn, and a small online dot pings in
   the corner, so it reads as someone ready to chat now. Only
   transform and opacity are animated (smooth on phones), and all of
   it stops under reduced motion, leaving a still glow.

   Sections in this file:
     1. CONTENT        the link (number and greeting live in site.ts)
     2. HOOK           past the hero? contact on screen?
     3. BUTTON
     4. ICON
     5. STYLES         the glow, ripple and online-dot animations
   ================================================================== */

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE, whatsappHref } from "@/components/ui/site";

/* ==================================================================
   1. CONTENT  (number and greeting: SITE.whatsapp in components/ui/site.ts)
   ================================================================== */

const HREF = whatsappHref();

/* ==================================================================
   2. HOOK
   ================================================================== */

/** true once the hero has scrolled off the top, and the contact section isn't on screen. */
function useShowButton() {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [contactOnScreen, setContactOnScreen] = useState(false);

  useEffect(() => {
    // The hero: #hero, or else the page's first section.
    const hero = document.getElementById("hero") ?? document.querySelector("main > section");
    const contact = document.getElementById("contact");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) setPastHero(!e.isIntersecting && e.boundingClientRect.bottom <= 0);
        if (e.target === contact) setContactOnScreen(e.isIntersecting);
      });
    });
    if (hero) observer.observe(hero);
    if (contact) observer.observe(contact);

    return () => {
      observer.disconnect();
      setPastHero(false);
      setContactOnScreen(false);
    };
  }, [pathname]);

  return pastHero && !contactOnScreen;
}

/* ==================================================================
   3. BUTTON
   ================================================================== */

export default function WhatsAppButton() {
  const show = useShowButton();

  return (
    <div
      inert={!show}
      className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-opacity sm:bottom-8 sm:right-8 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href={HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${SITE.name} on WhatsApp (opens WhatsApp)`}
        className="group relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgb(37_211_102/0.65)] transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring active:scale-95 motion-reduce:transition-none sm:size-16"
      >
        {/* Breathing glow behind the button */}
        <span aria-hidden="true" className="wa-glow pointer-events-none absolute -inset-3 -z-10 rounded-full bg-[#25D366] blur-xl" />
        {/* Two ripples, half a beat apart */}
        <span aria-hidden="true" className="wa-ring pointer-events-none absolute inset-0 rounded-full border-2 border-[#25D366]" />
        <span aria-hidden="true" className="wa-ring wa-ring-late pointer-events-none absolute inset-0 rounded-full border-2 border-[#25D366]" />

        {/* A light sheen on the button itself */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgb(255_255_255/0.35),transparent_55%)]" />

        <span className="relative">
          <WhatsAppIcon />
        </span>

        {/* Online dot */}
        <span aria-hidden="true" className="absolute right-0 top-0 flex size-4 sm:right-0.5 sm:top-0.5">
          <span className="wa-dot-ping absolute inset-0 rounded-full bg-white" />
          <span className="relative size-4 rounded-full border-[3px] border-[#25D366] bg-white" />
        </span>

        {/* Label beside the button, on hover or keyboard focus (desktop) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-header-background px-4 py-2 text-[14px] font-semibold text-white opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block sm:translate-x-1"
        >
          Chat on WhatsApp
        </span>
      </a>
      <WhatsAppStyles />
    </div>
  );
}

/* ==================================================================
   4. ICON  (the WhatsApp mark)
   ================================================================== */

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7 drop-shadow-[0_0_6px_rgb(255_255_255/0.65)] sm:size-8" fill="currentColor">
      <path d="M16.04 3C8.86 3 3.02 8.83 3.02 16c0 2.3.6 4.54 1.75 6.51L3 29l6.65-1.74A13.03 13.03 0 0 0 16.04 29C23.2 29 29.05 23.17 29.05 16S23.2 3 16.04 3Zm0 23.8c-2 0-3.95-.54-5.65-1.55l-.4-.24-3.95 1.03 1.05-3.84-.26-.4A10.76 10.76 0 0 1 5.2 16c0-5.97 4.86-10.82 10.84-10.82 5.97 0 10.83 4.85 10.83 10.82 0 5.96-4.86 10.8-10.83 10.8Zm5.94-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.74.17-.21.32-.84 1.06-1.03 1.27-.19.22-.38.25-.7.08-.33-.16-1.38-.5-2.62-1.6-.97-.87-1.62-1.93-1.81-2.26-.19-.32-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.32.33-.54.1-.22.05-.4-.03-.57-.08-.16-.74-1.77-1.01-2.43-.27-.63-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.4-.3.33-1.14 1.12-1.14 2.72s1.17 3.15 1.33 3.37c.16.22 2.3 3.5 5.56 4.91.78.33 1.39.53 1.86.68.78.25 1.5.21 2.06.13.63-.09 1.93-.79 2.2-1.55.28-.76.28-1.41.2-1.55-.08-.13-.3-.21-.62-.38Z" />
    </svg>
  );
}

/* ==================================================================
   5. STYLES
   ================================================================== */

function WhatsAppStyles() {
  return (
    <style>{`
      .wa-glow { opacity: .45; animation: wa-glow 2.4s ease-in-out infinite; }
      @keyframes wa-glow { 0%, 100% { opacity: .35; transform: scale(.92); } 50% { opacity: .75; transform: scale(1.08); } }

      .wa-ring { opacity: 0; animation: wa-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
      .wa-ring-late { animation-delay: 1.2s; }
      @keyframes wa-ring { 0% { opacity: .7; transform: scale(1); } 100% { opacity: 0; transform: scale(1.75); } }

      .wa-dot-ping { animation: wa-dot 1.6s cubic-bezier(0, 0, 0.2, 1) infinite; }
      @keyframes wa-dot { 0% { opacity: .8; transform: scale(1); } 75%, 100% { opacity: 0; transform: scale(2.2); } }

      @media (prefers-reduced-motion: reduce) {
        .wa-glow { animation: none; opacity: .5; }
        .wa-ring, .wa-dot-ping { animation: none; display: none; }
      }
    `}</style>
  );
}
