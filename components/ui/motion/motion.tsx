"use client";

/* ==================================================================
   MOTION (whole site)
   ------------------------------------------------------------------
   The motion toolkit. GSAP drives the animation; Lenis is the one
   smooth-scroll engine, started once in app/layout.tsx so every page
   scrolls the same way. It pauses by itself whenever something locks
   the page (the mobile menu, a full-screen photo viewer).

     import { SmoothScroll, useGsap, SplitWords, useInView, getLenis } from "@/components/ui/motion/motion";

   Sections in this file:
     1. SMOOTH SCROLL  Lenis, tied to GSAP's ticker and ScrollTrigger
     2. useGsap        runs a GSAP setup inside a scoped context, only
                       when the visitor has not asked for reduced motion,
                       and cleans it all up on unmount
     3. SplitWords     a heading's words for a staggered reveal, with
                       the whole sentence kept for screen readers
     4. useInView      true once an element has scrolled into view, for
                       CSS reveals in headings, footers and cards

   Reduced motion: Lenis is never started and no GSAP setup runs, so
   every element simply sits in its final place.
   ================================================================== */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState, type DependencyList, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Apple-style easing used across the site, as a GSAP curve. */
export const EASE_OUT = "expo.out";

const REDUCED = "(prefers-reduced-motion: reduce)";
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia(REDUCED).matches;

/* ==================================================================
   1. SMOOTH SCROLL
   ================================================================== */

let lenis: Lenis | null = null;

/** The running Lenis instance (null under reduced motion). Viewers stop it while open. */
export const getLenis = () => lenis;

/** Glide to a section (instant under reduced motion). Works while Lenis is paused, e.g. as the mobile menu closes. */
export function scrollToSection(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { force: true });
  else el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth" });
}

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReduced()) return;
    const instance = new Lenis({ lerp: 0.11, anchors: { offset: -96 }, autoRaf: false });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Re-measure once fonts and images have settled.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    // Pause while anything locks the page (overflow: hidden on <html> or
    // <body>), e.g. the mobile menu or a full-screen photo viewer.
    const html = document.documentElement;
    const sync = () => {
      const locked = html.style.overflow === "hidden" || document.body.style.overflow === "hidden";
      if (locked) instance.stop();
      else instance.start();
    };
    const locks = new MutationObserver(sync);
    locks.observe(html, { attributes: true, attributeFilter: ["style"] });
    locks.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
      locks.disconnect();
      instance.destroy();
      lenis = null;
    };
  }, []);

  // New page: drop any glide left over from the last one and re-measure.
  const pathname = usePathname();
  useEffect(() => {
    if (!lenis) return;
    lenis.stop();
    lenis.start();
    lenis.resize();
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <style>{`
      html.lenis, html.lenis body { height: auto; }
      .lenis.lenis-smooth { scroll-behavior: auto !important; }
      .lenis.lenis-stopped { overflow: clip; }
    `}</style>
  );
}

/* ==================================================================
   2. useGsap
   ------------------------------------------------------------------
   useGsap(ref, (root) => { gsap.from(...) }, [deps])
   Selector strings inside the setup are scoped to ref.current.
   ================================================================== */

export function useGsap<T extends HTMLElement>(
  scope: RefObject<T | null>,
  setup: (root: T) => void | (() => void),
  deps: DependencyList = [],
) {
  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    const root = scope.current;
    if (!root || prefersReduced()) return;
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setupRef.current(root);
    }, root);
    return () => {
      if (typeof cleanup === "function") cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ==================================================================
   3. SplitWords
   ------------------------------------------------------------------
   <h1><SplitWords>Built for purpose.</SplitWords></h1>
   Each word sits in an overflow mask ([data-word] inside it) so it can
   rise into place. Screen readers get the plain sentence once.
   Without JavaScript the words are simply shown.
   ================================================================== */

export function SplitWords({ children, className = "" }: { children: string; className?: string }) {
  const words = children.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="-mb-[0.08em] inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span data-word className="inline-block will-change-transform">
                {w}
              </span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </span>
  );
}

/** Shared word reveal: masks rise in with a restrained stagger. */
export function revealWords(targets: gsap.TweenTarget, delay = 0) {
  return gsap.from(targets, { yPercent: 110, duration: 1.1, ease: EASE_OUT, stagger: 0.06, delay });
}

/** Fade + 24px rise for supporting copy and media (matches the site's CSS reveals). */
export function revealUp(targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  return gsap.from(targets, { autoAlpha: 0, y: 24, duration: 0.9, ease: EASE_OUT, stagger: 0.08, ...vars });
}

/* ==================================================================
   4. useInView
   ------------------------------------------------------------------
   const [ref, shown] = useInView<HTMLDivElement>(0.3);
   <div ref={ref} style={{ opacity: shown ? 1 : 0 }}>...</div>
   Turns true once and stays true. Under reduced motion it is true
   from the start, so nothing waits to appear.
   ================================================================== */

export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, shown] as const;
}
