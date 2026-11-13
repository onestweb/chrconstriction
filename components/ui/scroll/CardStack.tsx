"use client";

/* ==================================================================
   CARD STACK (sticky cards that pile up as you scroll)
   ------------------------------------------------------------------
   Each card sticks near the top and the next one slides up over it,
   while the cards behind sink back (a little smaller and darker),
   like sheets on a drawing table. onActive reports the card on top,
   so the section around it can follow along (a counter, a photo).

     import CardStack from "@/components/ui/scroll/CardStack";
     <CardStack label="Capabilities" onActive={setActive}>
       {ITEMS.map((c) => <article key={c.id} className="... rounded-[28px] glass ...">...</article>)}
     </CardStack>

   Each child is one card. Give cards the same height on desktop
   (e.g. lg:min-h-[70svh]) so the pile reads as a stack, and pass
   their corner radius as `radius` so the shade matches.
   Reduced motion: cards still stick, but nothing scales or darkens.

   Sections in this file:
     1. HOOK      how far each card has travelled; depth of the ones behind
     2. STACK
   ================================================================== */

import { Children, useEffect, useRef, type ReactNode } from "react";

const OFFSET = 14; // px each card sits lower than the one before

/* ==================================================================
   1. HOOK
   ------------------------------------------------------------------
   For every card: 0 = still below the screen, 1 = stuck on the stack.
   The cards behind sink by the sum of what has landed on them.
   Written straight to the DOM each frame (no re-render).
   ================================================================== */

function useCardStack(count: number, onActive?: (i: number) => void) {
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const shades = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(-1);
  const onActiveRef = useRef(onActive);
  useEffect(() => {
    onActiveRef.current = onActive;
  });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const progress = items.current.slice(0, count).map((li) => {
        if (!li) return 0;
        const top = li.getBoundingClientRect().top;
        const rest = parseFloat(getComputedStyle(li).top) || 0;
        return Math.min(1, Math.max(0, 1 - (top - rest) / Math.max(1, vh - rest)));
      });
      let next = 0;
      progress.forEach((p, i) => {
        if (p > 0.5) next = i;
        if (reduce.matches) return;
        const depth = progress.slice(i + 1).reduce((sum, q) => sum + q, 0);
        const card = cards.current[i];
        const shade = shades.current[i];
        if (card) card.style.transform = `scale(${1 - 0.045 * depth})`;
        if (shade) shade.style.opacity = String(Math.min(0.6, 0.32 * depth));
      });
      if (next !== activeRef.current) {
        activeRef.current = next;
        onActiveRef.current?.(next);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [count]);

  return [items, cards, shades] as const;
}

/* ==================================================================
   2. STACK
   ================================================================== */

export default function CardStack({
  children,
  label,
  onActive,
  radius = "28px",
}: {
  children: ReactNode;
  label: string;
  onActive?: (i: number) => void;
  radius?: string;
}) {
  const list = Children.toArray(children);
  const [items, cards, shades] = useCardStack(list.length, onActive);

  return (
    <ol className="relative" aria-label={label}>
      {list.map((child, i) => (
        <li
          key={i}
          ref={(el) => {
            items.current[i] = el;
          }}
          className="stack-item sticky mb-[6svh] last:mb-0"
          style={{ ["--i" as string]: i }}
        >
          <div
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="relative origin-top will-change-transform"
            style={{ borderRadius: radius }}
          >
            {child}
            {/* Darkens the card as others land on it */}
            <div
              ref={(el) => {
                shades.current[i] = el;
              }}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black opacity-0"
            />
          </div>
        </li>
      ))}
      {/* The finished stack holds for a moment before the page moves on */}
      <li aria-hidden="true" className="h-[18svh]" />
      <style>{`
        .stack-item { top: calc(5.5rem + var(--i) * ${OFFSET}px); }
        @media (min-width: 1024px) { .stack-item { top: calc(6.5rem + var(--i) * ${OFFSET}px); } }
      `}</style>
    </ol>
  );
}
