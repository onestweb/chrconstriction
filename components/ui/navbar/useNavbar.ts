"use client";

/* ==================================================================
   NAVBAR LOGIC (shared by every navbar design)
   ------------------------------------------------------------------
   The navbar and its mobile menu are designed fresh for each site;
   how they behave is not. Navbar.tsx calls this hook and draws
   whatever the design direction asks for.

     const nav = useNavbar();
     <header data-hidden={nav.hidden}>...</header>
     <Link href={href} onClick={(e) => nav.go(e, href)} aria-current={nav.current(href)}>

   Gives:
     overHero   true while the element with id="hero" is under the bar
                (use a transparent bar and the white logo)
     compact    true after the first 24px of scroll
     hidden     true when scrolling down past the hero (tuck the bar away)
     menuOpen / setMenuOpen / toggleMenu   the mobile menu; while open
                the page is locked (smooth scroll pauses), Escape and
                resizing to desktop close it
     isActive(href)  the link of the section in the middle of the screen,
                or the current page
     current(href)   the matching aria-current value ("location", "page")
     go(e, href)     the click handler: glides to a section on this page,
                closes the menu
   ================================================================== */

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { NAV_LINKS } from "@/components/ui/site";
import { isSectionHref, onSectionClick, sectionId, sectionPath } from "./sections";

/** Any element with this id makes the navbar transparent while it's on screen. */
const HERO_ID = "hero";

/** Width from which the desktop links show and the mobile menu closes (Tailwind lg). */
const DESKTOP = "(min-width: 1024px)";

export function useNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [overHero, setOverHero] = useState(true);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inView, setInView] = useState<string | null>(null);
  const lastY = useRef(0);

  // Transparent only while the hero is under the bar. Runs again on every page change.
  useEffect(() => {
    const hero = document.getElementById(HERO_ID);
    if (!hero) {
      const frame = requestAnimationFrame(() => setOverHero(false));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => setOverHero(entry.isIntersecting), {
      rootMargin: "-80px 0px 0px 0px",
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  // Which linked section (if any) is in the middle of the screen.
  useEffect(() => {
    const ids = NAV_LINKS.filter((l) => isSectionHref(l.href) && sectionPath(l.href, pathname) === pathname).map((l) => sectionId(l.href));
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const showing = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? showing.add(e.target.id) : showing.delete(e.target.id)));
        setInView(ids.find((id) => showing.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      setInView(null);
    };
  }, [pathname]);

  // Compact after the first bit of scroll; hidden on scroll down once past the hero.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setCompact(y > 24);
      setHidden(y > lastY.current && y > window.innerHeight * 0.9);
      lastY.current = y;
    };
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Mobile menu: lock page scroll, close on Escape or when resizing to desktop.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const desktop = window.matchMedia(DESKTOP);
    const onResize = () => desktop.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    isSectionHref(href)
      ? sectionPath(href, pathname) === pathname && inView === sectionId(href)
      : !inView && (pathname === href || pathname.startsWith(`${href}/`));

  const current = (href: string) => (isActive(href) ? (isSectionHref(href) ? ("location" as const) : ("page" as const)) : undefined);

  const go = (e: MouseEvent, href: string) => {
    setMenuOpen(false);
    onSectionClick(e, href, pathname, router);
  };

  return {
    overHero,
    compact,
    hidden: hidden && !menuOpen,
    menuOpen,
    setMenuOpen,
    toggleMenu: () => setMenuOpen((open) => !open),
    isActive,
    current,
    go,
  };
}
