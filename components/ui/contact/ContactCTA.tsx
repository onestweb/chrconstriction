"use client";

/* ==================================================================
   CONTACT (the final call to action, last on every page)
   ------------------------------------------------------------------
   Usage (each page passes its own words from the brief):

     import ContactCTA from "@/components/ui/contact/ContactCTA";
     <ContactCTA />                                   // home
     <ContactCTA title="Let's Build Something Together." ... />

   One rounded frame split in two, like the hero frames: on the left
   a navy panel with the heading, the phone number set large, WhatsApp
   and email; on the right a white enquiry form that asks what the
   brief needs (name, phone, optional email, type of project,
   location, description). On phones: heading, form, then the details.

   The form sends through useEnquiry() to /api/enquiry, which forwards
   to ENQUIRY_WEBHOOK_URL. Until that is set, sending fails honestly
   and the visitor is offered WhatsApp and the phone instead.

   Sections in this file:
     1. CONTENT
     2. SECTION
     3. FORM
     4. FIELDS
   ================================================================== */

import { useId, type ReactNode } from "react";
import Button from "@/components/buttons/Button";
import { useEnquiry } from "@/components/ui/contact/useEnquiry";
import { PhoneIcon } from "@/components/ui/navbar/Navbar";
import SectionHeading from "@/components/ui/sectionheading/SectionHeading";
import { SERVICE_LINKS, SITE, whatsappHref } from "@/components/ui/site";

/* ==================================================================
   1. CONTENT
   ================================================================== */

const HEADING = {
  eyebrow: "Request a quote",
  title: "Have a Project in Mind?",
  text: "Whether you're planning a renovation, construction project or exterior improvement, get in touch with CHR Construction to discuss your requirements.",
  submit: "Request a Quote",
};

const PROJECT_TYPES = [...SERVICE_LINKS.map((s) => s.label), "Not sure yet"];

/* ==================================================================
   2. SECTION
   ================================================================== */

type Props = { eyebrow?: string; title?: string; text?: string; submit?: string };

export default function ContactCTA({ eyebrow = HEADING.eyebrow, title = HEADING.title, text = HEADING.text, submit = HEADING.submit }: Props) {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24 px-3 pb-3 pt-24 sm:px-5 sm:pb-5 lg:pt-36">
      <div className="mx-auto grid max-w-360 overflow-hidden rounded-frame bg-white lg:grid-cols-12">
        {/* ---- Navy panel: heading and direct lines ---- */}
        <div className="relative bg-brand px-6 py-12 text-white sm:px-10 sm:py-14 lg:col-span-5 lg:px-12 lg:py-16">
          <SectionHeading id="contact-heading" eyebrow={eyebrow} title={title} description={text} tone="brand" />

          <div className="mt-10 hidden lg:block">
            <Direct />
          </div>
        </div>

        {/* ---- The form ---- */}
        <div className="px-6 py-10 sm:px-10 sm:py-12 lg:col-span-7 lg:px-14 lg:py-16">
          <EnquiryForm submitLabel={submit} />
        </div>

        <div className="bg-brand px-6 pb-12 pt-2 text-white sm:px-10 lg:hidden">
          <Direct />
        </div>
      </div>
    </section>
  );
}

/** Phone set large, WhatsApp and email: the quickest ways to reach CHR. */
function Direct() {
  return (
    <div>
      <p className="text-[15px] text-white/70">Prefer to talk? Call us directly</p>
      {SITE.phone.tel && (
        <a
          href={`tel:${SITE.phone.tel}`}
          className="mt-2 inline-flex items-center gap-3 rounded-md f-head text-[clamp(2rem,3.6vw,3rem)] font-semibold tabular-nums tracking-[-0.02em] text-white hover:text-white/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <PhoneIcon className="size-7 text-accent" />
          {SITE.phone.display}
        </a>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#1f9e50] px-6 text-[16px] font-semibold text-white transition-colors hover:bg-[#188a44] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
        >
          <WhatsAppGlyph />
          WhatsApp us
        </a>
        {SITE.email && (
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex h-12 items-center rounded-full border border-white/35 px-6 text-[16px] font-semibold text-white transition-colors hover:bg-white hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
          >
            Email us
          </a>
        )}
      </div>
      {SITE.email && <p className="mt-4 break-all text-[15px] text-white/70">{SITE.email}</p>}
      <p className="mt-1 text-[15px] text-white/70">Based in the {SITE.region}</p>
    </div>
  );
}

/* ==================================================================
   3. FORM
   ================================================================== */

function EnquiryForm({ submitLabel }: { submitLabel: string }) {
  const { state, submit } = useEnquiry();

  if (state === "sent") {
    return (
      <div role="status" className="flex h-full flex-col justify-center py-10">
        <p className="f-head text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-tight tracking-[-0.02em]">Thank you, your enquiry is on its way.</p>
        <p className="mt-4 max-w-md text-[17px] leading-relaxed text-muted">
          CHR Construction will be in touch about your project. If it&apos;s urgent, call {SITE.phone.display}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate={false} className="grid gap-5 sm:grid-cols-2">
      <p className="text-[15px] text-muted sm:col-span-2">
        Tell us about your project and we&apos;ll get back to you. Fields marked <span className="text-accent">*</span> are required.
      </p>

      <Field label="Full name" required>
        {(id) => <input id={id} name="name" required autoComplete="name" className={INPUT} />}
      </Field>
      <Field label="Phone number" required>
        {(id) => <input id={id} name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9 +()\-]{9,}" className={INPUT} />}
      </Field>
      <Field label="Email address" hint="Optional">
        {(id) => <input id={id} name="email" type="email" autoComplete="email" className={INPUT} />}
      </Field>
      <Field label="Type of project" required>
        {(id) => (
          <select id={id} name="projectType" required defaultValue="" className={`${INPUT} appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10`} style={{ backgroundImage: CHEVRON }}>
            <option value="" disabled>
              Choose one
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        )}
      </Field>
      <Field label="Project location" required className="sm:col-span-2">
        {(id) => <input id={id} name="location" required autoComplete="address-level2" placeholder="Town or suburb" className={INPUT} />}
      </Field>
      <Field label="Project description" required className="sm:col-span-2">
        {(id) => <textarea id={id} name="message" required rows={4} placeholder="What would you like built, repaired or renovated?" className={`${INPUT} min-h-32 py-3`} />}
      </Field>

      <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-snug text-muted sm:col-span-2">
        <input type="checkbox" name="consent" required className="mt-0.5 size-5 shrink-0 accent-[#1e3173]" />
        I agree that CHR Construction may contact me about this enquiry.
      </label>

      {state === "failed" && (
        <div role="alert" className="rounded-2xl bg-accent-light p-4 text-[15px] leading-relaxed text-foreground sm:col-span-2">
          Sorry, your enquiry couldn&apos;t be sent from the website just now. Please{" "}
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            message us on WhatsApp
          </a>{" "}
          or call{" "}
          <a href={`tel:${SITE.phone.tel}`} className="font-semibold underline">
            {SITE.phone.display}
          </a>
          .
        </div>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" arrow disabled={state === "sending"}>
          {state === "sending" ? "Sending..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

/* ==================================================================
   4. FIELDS
   ================================================================== */

const INPUT =
  "block min-h-12 w-full rounded-xl border border-border bg-background px-4 text-[16px] text-foreground transition-colors placeholder:text-muted/70 hover:border-border-strong focus:border-brand focus:bg-white focus:outline-2 focus:outline-offset-0 focus:outline-brand/25 user-invalid:border-accent";

const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='m4 6 4 4 4-4' stroke='%2317191e' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

function Field({ label, required, hint, className = "", children }: { label: string; required?: boolean; hint?: string; className?: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-2 text-[15px] font-semibold text-foreground">
        <span>
          {label}
          {required && <span className="text-accent"> *</span>}
        </span>
        {hint && <span className="text-[14px] font-normal text-muted">{hint}</span>}
      </label>
      {children(id)}
    </div>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="size-5" fill="currentColor">
      <path d="M16.04 3C8.86 3 3.02 8.83 3.02 16c0 2.3.6 4.54 1.75 6.51L3 29l6.65-1.74A13.03 13.03 0 0 0 16.04 29C23.2 29 29.05 23.17 29.05 16S23.2 3 16.04 3Zm0 23.8c-2 0-3.95-.54-5.65-1.55l-.4-.24-3.95 1.03 1.05-3.84-.26-.4A10.76 10.76 0 0 1 5.2 16c0-5.97 4.86-10.82 10.84-10.82 5.97 0 10.83 4.85 10.83 10.82 0 5.96-4.86 10.8-10.83 10.8Zm5.94-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.74.17-.21.32-.84 1.06-1.03 1.27-.19.22-.38.25-.7.08-.33-.16-1.38-.5-2.62-1.6-.97-.87-1.62-1.93-1.81-2.26-.19-.32-.02-.5.14-.66.15-.15.33-.38.49-.57.16-.19.22-.32.33-.54.1-.22.05-.4-.03-.57-.08-.16-.74-1.77-1.01-2.43-.27-.63-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.4-.3.33-1.14 1.12-1.14 2.72s1.17 3.15 1.33 3.37c.16.22 2.3 3.5 5.56 4.91.78.33 1.39.53 1.86.68.78.25 1.5.21 2.06.13.63-.09 1.93-.79 2.2-1.55.28-.76.28-1.41.2-1.55-.08-.13-.3-.21-.62-.38Z" />
    </svg>
  );
}
