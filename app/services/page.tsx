/* Services page: what CHR Construction offers, as a catalogue of four
   service categories. Sections live in components/services/ (plus the
   shared hero, process and why sections). */

import type { Metadata } from "next";
import WorkingProcess from "@/components/home/process/WorkingProcess";
import WhyChooseCHR from "@/components/home/why/WhyChooseCHR";
import { getProject } from "@/components/projects/projects";
import ServiceNavigation from "@/components/services/navigation/ServiceNavigation";
import ServiceSection from "@/components/services/section/ServiceSection";
import { SERVICES } from "@/components/services/services";
import ServicesProjectShowcase from "@/components/services/showcase/ServicesProjectShowcase";
import ContactCTA from "@/components/ui/contact/ContactCTA";
import PageHero from "@/components/ui/pagehero/PageHero";
import { SITE } from "@/components/ui/site";

export const metadata: Metadata = {
  title: `Services | ${SITE.name}`,
  description:
    "Civil construction, building and structural work, residential renovations and outdoor improvements by CHR Construction in the Free State.",
};

const HERO = {
  title: "Construction Solutions. Built Around Your Needs.",
  text: "From civil construction and structural building to residential renovations and outdoor improvements, CHR Construction delivers practical construction solutions with a commitment to quality workmanship.",
  note: "Civil, structural, renovation and outdoor work across the Free State.",
  statement: "Every service below is something CHR has done and photographed. Pick a category in the cards, or explore them all.",
  photo: getProject("steel-structure").photos[1],
  buttons: [
    { label: "Explore Services", href: "#explore" },
    { label: "Request a Quote", href: "#contact" },
  ],
  cards: SERVICES.map((s) => ({ title: s.short, text: s.teaser, href: `#${s.id}`, icon: s.id })),
};

export default function ServicesPage() {
  return (
    <>
      <PageHero {...HERO} cardsLabel="Service categories" />
      <ServiceNavigation>
        {SERVICES.map((s, i) => (
          <ServiceSection key={s.id} service={s} flip={i % 2 === 1} />
        ))}
      </ServiceNavigation>
      <WorkingProcess variant="services" />
      <WhyChooseCHR variant="services" />
      <ServicesProjectShowcase />
      <ContactCTA
        eyebrow="Get in touch"
        title="Let's Build Something Together."
        text="Have a construction project or renovation in mind? Contact CHR Construction to discuss your requirements."
      />
    </>
  );
}
