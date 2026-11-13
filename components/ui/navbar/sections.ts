/* ==================================================================
   SECTION LINKS (shared by Navbar and Footer)
   ------------------------------------------------------------------
   Links to a section of a page, like "/#services" or "#contact":

     - Already on that page: glide to the section (no page load).
     - On another page: go to that page, then to the section.
     - "#contact" means "this page's contact section". Every page ends
       with one; on a page without it, it opens the home page's.

   isSectionHref / sectionId tell a section link from a page link.
   ================================================================== */

import type { MouseEvent } from "react";
import { scrollToSection } from "@/components/ui/motion/motion";

type Router = { push: (href: string) => void };

export const isSectionHref = (href: string) => href.includes("#");

export const sectionId = (href: string) => href.slice(href.indexOf("#") + 1);

/** The page a section link belongs to ("#contact" belongs to the current page). */
export const sectionPath = (href: string, pathname: string) => href.slice(0, href.indexOf("#")) || pathname;

export function onSectionClick(e: MouseEvent, href: string, pathname: string, router: Router) {
  if (!isSectionHref(href) || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  if (sectionPath(href, pathname) !== pathname) return; // Next.js takes it to the other page
  e.preventDefault();
  e.stopPropagation(); // Lenis would otherwise handle the same click
  const el = document.getElementById(sectionId(href));
  if (!el) {
    router.push(`/#${sectionId(href)}`);
    return;
  }
  // A frame later, so a closing mobile menu has released the page first.
  requestAnimationFrame(() => scrollToSection(el));
}
