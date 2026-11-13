/* Projects page: CHR Construction's portfolio, photography first.
   Sections live in components/projects/ (plus the shared hero and
   contact section). Filtering and the project lightbox happen on this
   page; there are no separate project or category URLs. */

import type { Metadata } from "next";
import BeforeAfter from "@/components/projects/beforeafter/BeforeAfter";
import CompanyCapabilities from "@/components/projects/capabilities/CompanyCapabilities";
import ProjectsExplorer from "@/components/projects/explorer/ProjectsExplorer";
import { CATEGORIES, getProject } from "@/components/projects/projects";
import ContactCTA from "@/components/ui/contact/ContactCTA";
import PageHero from "@/components/ui/pagehero/PageHero";
import { SITE } from "@/components/ui/site";

export const metadata: Metadata = {
  title: `Projects | ${SITE.name}`,
  description:
    "A selection of CHR Construction's work across civil construction, structural building, residential renovations and outdoor improvements.",
};

const CARD_PROJECTS = ["steel-structure", "pothole-goldfields", "braai-area"].map(getProject);

const HERO = {
  title: "Built Through Experience. Defined by Quality.",
  text: "Explore a selection of CHR Construction's work across civil construction, structural building, residential renovations and outdoor improvements.",
  note: "Every photograph on this page is from a CHR Construction site.",
  statement: "A closer look at the projects, craftsmanship and capabilities behind CHR Construction.",
  photo: getProject("braai-area").photos[0],
  photoPosition: "50% 35%",
  buttons: [
    { label: "Explore Our Work", href: "#explore" },
    { label: "Start Your Project", href: "#contact" },
  ],
  cards: CARD_PROJECTS.map((p) => ({ title: p.title, text: CATEGORIES[p.category].label, href: `/projects#p-${p.slug}`, image: p.photos[0] })),
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero {...HERO} cardsLabel="Highlighted projects" />
      <ProjectsExplorer />
      <BeforeAfter />
      <CompanyCapabilities />
      <ContactCTA
        eyebrow="Start your project"
        title="Your Project Could Be Next."
        text="Have an idea, development or renovation in mind? Let's discuss your requirements and explore how CHR Construction can help."
        submit="Start Your Project"
      />
    </>
  );
}
