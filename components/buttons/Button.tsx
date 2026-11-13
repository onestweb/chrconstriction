/* ==================================================================
   BUTTON (the one button of the CHR site)
   ------------------------------------------------------------------
   Usage:

     import Button, { buttonClasses } from "@/components/buttons/Button";
     <Button href="/projects" arrow>Explore Our Projects</Button>
     <Button type="submit" variant="secondary">Send</Button>

   The look comes from the client's hero reference: a full pill with
   the label in sentence case and, when `arrow` is set, a round
   "nail head" at the right end that carries the arrow. On hover the
   arrow slides out of the circle and a second one slides in.

   Props:
     variant   primary (red, the main action) | secondary (navy) |
               outline-light (over photos, video, dark) |
               outline-dark (on light sections) | ghost-light (text only on dark)
     size      sm | md | lg
     arrow     adds the arrow circle
     href      renders a next/link, else a <button type="button">

   Sections in this file:
     1. CLASSES
     2. BUTTON
     3. ARROW
   ================================================================== */

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* ==================================================================
   1. CLASSES
   ================================================================== */

export type ButtonVariant = "primary" | "secondary" | "outline-light" | "outline-dark" | "ghost-light";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group relative inline-flex min-h-11 select-none items-center justify-center gap-3 rounded-full font-semibold leading-none whitespace-nowrap transition-[background-color,color,border-color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover [--dot:#ffffff] [--dot-ink:var(--accent)]",
  secondary: "bg-brand text-white hover:bg-brand-hover [--dot:var(--accent)] [--dot-ink:#ffffff]",
  "outline-light":
    "border border-white/45 bg-white/5 text-white hover:border-white hover:bg-white hover:text-foreground [--dot:#ffffff] [--dot-ink:var(--foreground)]",
  "outline-dark":
    "border border-foreground/20 bg-transparent text-foreground hover:border-foreground hover:bg-foreground hover:text-white [--dot:var(--foreground)] [--dot-ink:#ffffff]",
  "ghost-light": "text-white underline decoration-white/40 underline-offset-[6px] hover:decoration-white [--dot:transparent] [--dot-ink:#ffffff]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-11 px-5 text-[15px]",
  md: "h-12 px-6 text-[16px]",
  lg: "h-14 px-7 text-[17px]",
};

// With the arrow circle the right padding tightens so the circle sits in the pill's end.
const arrowPad: Record<ButtonSize, string> = { sm: "pr-1.5", md: "pr-1.5", lg: "pr-2" };

type CommonProps = { variant?: ButtonVariant; size?: ButtonSize; arrow?: boolean; className?: string; children: ReactNode };
type LinkButtonProps = CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children"> & { href: string };
type NativeButtonProps = CommonProps & Omit<ComponentProps<"button">, "className" | "children"> & { href?: undefined };
export type ButtonProps = LinkButtonProps | NativeButtonProps;

export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
  arrow = false,
}: Pick<CommonProps, "variant" | "size" | "className" | "arrow"> = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${arrow && variant !== "ghost-light" ? arrowPad[size] : ""} ${className}`.trim();
}

/* ==================================================================
   2. BUTTON
   ================================================================== */

export default function Button(props: ButtonProps) {
  const { variant, size = "md", arrow = false, className, children, ...rest } = props;
  const classes = buttonClasses({ variant, size, className, arrow });
  const content = (
    <>
      <span>{children}</span>
      {arrow && <Arrow size={size} />}
    </>
  );
  if (rest.href !== undefined) {
    return (
      <Link {...(rest as Omit<LinkButtonProps, keyof CommonProps>)} className={classes}>
        {content}
      </Link>
    );
  }
  const { type = "button", ...buttonRest } = rest as Omit<NativeButtonProps, keyof CommonProps>;
  return (
    <button type={type} {...buttonRest} className={classes}>
      {content}
    </button>
  );
}

/* ==================================================================
   3. ARROW
   ------------------------------------------------------------------
   The round end of the pill. Two arrows: the first slides out to the
   top right, the second follows it in from the bottom left.
   ================================================================== */

export function Arrow({ size = "md" }: { size?: ButtonSize }) {
  const box = size === "lg" ? "size-10" : size === "sm" ? "size-8" : "size-9";
  return (
    <span
      aria-hidden="true"
      className={`relative grid ${box} shrink-0 place-items-center overflow-hidden rounded-full bg-(--dot) text-(--dot-ink) transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-0`}
    >
      <ArrowGlyph className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-5 group-hover:-translate-y-5 motion-reduce:transition-none" />
      <ArrowGlyph className="absolute -translate-x-5 translate-y-5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0 group-hover:translate-y-0 motion-reduce:transition-none" />
    </span>
  );
}

export function ArrowGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={`size-4 ${className}`} aria-hidden="true">
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
