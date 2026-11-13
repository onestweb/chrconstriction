"use client";

/* ==================================================================
   ENQUIRY (the contact form's logic, shared by every design)
   ------------------------------------------------------------------
   The contact section is designed per site; how it sends is not.

     const { state, submit } = useEnquiry();
     <form onSubmit={submit}>...<input name="name" />...</form>

   Every named field in the form is sent to /api/enquiry as JSON.
   A checkbox named "consent" is sent as true / false. Add a field
   here by giving it a name in the form, and accept it in
   app/api/enquiry/route.ts.

   state:
     idle      nothing sent yet
     sending   disable the submit button
     sent      replace the form with a thank-you (role="status")
     failed    show the WhatsApp and phone fallback (role="alert")
   ================================================================== */

import { useState, type FormEvent } from "react";

export type EnquiryState = "idle" | "sending" | "sent" | "failed";

export function useEnquiry() {
  const [state, setState] = useState<EnquiryState>("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, consent: data.consent === "on" }),
      });
      setState(res.ok ? "sent" : "failed");
    } catch {
      setState("failed");
    }
  }

  return { state, submit };
}
