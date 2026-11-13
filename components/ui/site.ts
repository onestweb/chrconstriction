/* ==================================================================
   SITE (shared content for the whole site)
   ------------------------------------------------------------------
   The one place for the business's name, contact details and links.
   The navbar, footer, WhatsApp button, contact section, 404 page,
   enquiry route and page metadata all read from here, so a phone
   number or a link only ever changes in one place.

   Sources: CHR's Facebook page, their old Wix site and their
   Facebook flyer (all in the client's ZIP, November 2026).

   TO CONFIRM:
     - the live domain (url)
     - that WhatsApp runs on the same number as the phone line
     - the full Facebook page address (the screenshot cuts it off)

   Sections in this file:
     1. BUSINESS
     2. LINKS
   ================================================================== */

/* ==================================================================
   1. BUSINESS
   ================================================================== */

export const SITE = {
  name: "CHR Construction",
  tagline: "Civil, building and renovation work in the Free State",
  description:
    "CHR Construction is a Free State construction company working since 2016 across civil works, building and structural construction, residential renovations and outdoor improvements.",
  url: "https://chrconstruction.co.za", // CONFIRM, used for metadata
  since: "2016", // "With operations running since 2016" (old Wix site)
  region: "Free State",

  phone: { display: "079 882 0668", tel: "+27798820668" },
  email: "herbstjeanre9@gmail.com",
  address: [] as string[], // no street address published; the Facebook page lists "Free State"
  maps: "",
  hours: "", // not published

  whatsapp: {
    number: "27798820668", // CONFIRM: the Facebook page's WhatsApp button, assumed same as the phone line
    message: "Hello CHR Construction, I'd like a quote for a project.",
  },

  facebook: "https://www.facebook.com/", // CONFIRM: the page is "CHR Construction" (full link cut off in the screenshot)

  logo: {
    colour: "/navbar/logo.png", // for the white bar
    white: "/navbar/logo-white.png", // knockout, for over the hero
    width: 1296,
    height: 410,
  },
};

/* ==================================================================
   2. LINKS
   ------------------------------------------------------------------
   Three pages (the brief fixes the scope) and the contact section
   that ends every page ("#contact").
   ================================================================== */

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Get a Quote", href: "#contact" },
] as const;

/** Footer "Explore" column. */
export const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Request a Quote", href: "#contact" },
];

/** The four service categories, used by the footer, the forms and the filters. */
export const SERVICE_LINKS = [
  { label: "Civil Construction", href: "/services#civil" },
  { label: "Building & Structural", href: "/services#building" },
  { label: "Residential Renovations", href: "/services#residential" },
  { label: "Outdoor & Exterior", href: "/services#outdoor" },
];

export const whatsappHref = () =>
  `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(SITE.whatsapp.message)}`;
