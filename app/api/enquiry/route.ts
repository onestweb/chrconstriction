/* ==================================================================
   POST /api/enquiry
   ------------------------------------------------------------------
   Receives the enquiry from the contact section and forwards it to
   wherever the client wants enquiries delivered.

   Set ENQUIRY_WEBHOOK_URL in the environment (for example a Formspree,
   Zapier, Make or Slack webhook) and every valid enquiry is POSTed
   there as JSON. Until it is set, the route answers 503 and the form
   offers WhatsApp and phone instead, so no enquiry is silently lost.
   Add fields here and in ContactCTA.tsx together. CHR's form also
   sends projectType and location (required by the brief).
   ================================================================== */

import { NextResponse } from "next/server";
import { SITE } from "@/components/ui/site";

type Enquiry = {
  name: string;
  phone: string;
  email?: string;
  projectType?: string;
  location?: string;
  message?: string;
  consent: boolean;
};

const clean = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const enquiry: Enquiry = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    projectType: clean(body.projectType, 80),
    location: clean(body.location, 160),
    message: clean(body.message, 2000),
    consent: body.consent === true,
  };

  // The same rules as the form: a name, a reachable number and consent.
  const digits = enquiry.phone.replace(/\D/g, "");
  if (!enquiry.name || digits.length < 9 || !enquiry.consent) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 422 });
  }

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: SITE.url, receivedAt: new Date().toISOString(), ...enquiry }),
    });
    if (!res.ok) throw new Error(`Webhook answered ${res.status}`);
  } catch {
    return NextResponse.json({ ok: false, reason: "delivery" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
