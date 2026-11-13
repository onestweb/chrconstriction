# CHR Construction website

Three-page site (Home, Services, Projects) for CHR Construction, built from the client's redesign
brief, their Facebook page, flyer and old Wix site, and their own project photographs.

Next.js 16 (App Router) + Tailwind 4 + GSAP + Lenis.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Before going live

1. **Enquiry form.** Set `ENQUIRY_WEBHOOK_URL` in the hosting environment (for example a Formspree,
   Zapier, Make or Slack webhook). Every valid enquiry is POSTed there as JSON (name, phone, email,
   projectType, location, message). Until it is set, the form says it couldn't send and offers
   WhatsApp and the phone number instead, so no enquiry is silently lost.
2. Search the code for `CONFIRM` and check each item with CHR (list below).

### Open items (`CONFIRM`)

- The live domain (`components/ui/site.ts`, `url`).
- That WhatsApp runs on the phone number 079 882 0668 (the Facebook page has a WhatsApp button).
- The full Facebook page address (the screenshot cuts it off).
- Project locations: only "Goldfields Mall" is published. Others show no location until confirmed.
- The roof project: that it replaced thatch (the post offers thatch conversions next to the photos).
- The industrial slab and brickwork: what the enclosure is for.
- The ceilings: material and where it was installed.
- Outdoor services taken only from the old Wix template (pergolas, gazebos, porches, decks).
- Team section (`components/home/team/OurTeam.tsx`): names and roles are placeholders, and the three
  photos were supplied by onest; replace with CHR's own team photos (`public/team/`) if these are not them.
- "10 years" on the home page is fixed (since 2016); update it each year in
  `components/home/intro/CompanyIntroduction.tsx`.

### Content sources

- Business facts: Facebook page (Free State, 079 882 0668, herbstjeanre9@gmail.com, services list),
  Wix site ("running since 2016", "based in the Free State"), Facebook flyer (services).
- Photographs: all CHR's own, from the ZIP, grouped per project in `public/projects/<slug>/`.
  The two family photos in the ZIP (WA0034, WA0035) were left out.
- Hero film: `public/hero/hero.mp4`, the construction video the client supplied for the hero. It is
  not presented as a CHR project.
- Logo: cut from the supplied logo screenshot and recoloured into a colour and a white version
  (`public/navbar/`). Replace with the original vector files when CHR has them.

## Design direction

- **Idea:** the roofline from the CHR logo. The red roof chevron leads every section label, the hero
  frames on the inner pages are cut by a notch like a roof step, and the process line fills like a
  ridge being laid. Everything else stays quiet so CHR's own photographs carry the pages.
- **References (client):** Home hero after the "Steevlp" industrial-worker screenshot (full-bleed
  media, floating bar with a link pill, bottom-left headline, a small media card bottom right and a
  round "Get in touch" badge on the edge). Services and Projects heroes after the "Pitchline" roofing
  screenshot (rounded frame with dark cards in a notch at the bottom right; its stepped dark bands
  also shape the Services showcase). Home services section after the Resin Craft Ideas video
  (full-bleed photo that draws into a right-hand window, then pinned steps with photos wiping up).
- **Type:** Archivo set semi-condensed (wdth 88), weight 600, sentence case, tight tracking for
  headings, echoing the condensed logo. Figtree for text.
- **Colour roles:** page Cool Off-White #F4F5F7; text and dark frames Deep Charcoal #17191E; brand
  Royal Navy #1E3173 (secondary buttons, contact panel, active filters); accent Construction Red
  #DD2730 (primary action, roof marks, progress); cards and bar Pure White; borders Steel Grey
  #E3E6EB; secondary text Muted Slate #626A78.
- **Shape:** 28px frames (heroes, dark sections, contact, footer), 18px media, 20px cards, full pills
  for buttons and chips. No borders on cards: surfaces step in tone.
- **Buttons:** pill, sentence case, with a round "nail head" at the right end carrying an arrow that
  slides out and back in on hover.
- **Navbar:** floating inset bar. Clear over the home film (white logo, links in a soft pill), solid
  white with the colour logo after scrolling. Mobile: the bar grows into a white card menu.
- **Headings:** roof chevron + short label, then a large sentence-case title whose second half is
  softer. Split layout puts the description beside the title on desktop.
- **Contact:** one frame split in two: navy panel (heading, large phone number, WhatsApp, email)
  and a white form.
- **Footer:** charcoal frame with the closing line "Building with purpose. Delivering with
  excellence.", the white logo, four compact columns and a back-to-top row.
- **404:** a CHR foundation photo in a frame: "This page hasn't been built yet."
- **Motion:** calm and architectural. Lenis smooth scroll; GSAP intros (hero film opens from a
  framed window, words rise), clip reveals on photos, a pinned services stage on desktop, gallery
  filtering with Flip, a scrubbed process line, count-up figures. Reduced motion: everything rests
  in place, the film stays on its first frame, no pin.
- **Scroll patterns used:** 13 video hero (no pause button, at the client's request), 11 clip
  reveals, 12 pinned stages (home services), 4 editorial photo grid (featured work and gallery),
  19 before and after, 10 count-up.
- **Karpah signatures kept on purpose:** the softer second half of the title (in sentence case,
  not uppercase), as the heading treatment.

## How the code is organised

```
app/
  layout.tsx            every page: smooth scroll, Navbar, <main>{page}</main>, Footer, WhatsAppButton
  page.tsx              Home: hero, introduction, services, featured projects, why CHR, process, contact
  services/page.tsx     Services: hero, category navigation, four service sections, process, why, showcase, contact
  projects/page.tsx     Projects: hero, filters + featured + gallery + lightbox, before and after, capabilities, contact
  not-found.tsx         the branded 404
  api/enquiry/route.ts  receives the contact form (set ENQUIRY_WEBHOOK_URL)

components/
  buttons/              Button
  ui/                   shared: site.ts (contact details, links), navbar, footer, contact,
                        sectionheading, pagehero (Services and Projects hero), motion, whatsapp, ...
  home/                 home sections (hero, intro, services, featured, why, process)
  services/             services.ts (the four categories) + navigation, section, showcase
  projects/             projects.ts (all projects and photos) + explorer, lightbox, beforeafter, capabilities
```

- **Add a project:** photos into `public/projects/<slug>/1.jpg ...`, then one entry in
  `components/projects/projects.ts` (steps in its header). It appears in the gallery, its filter and
  the lightbox.
- **Change contact details:** `components/ui/site.ts` only.
- Only the client's real photographs and confirmed facts. Search for `CONFIRM` to find what's open.
