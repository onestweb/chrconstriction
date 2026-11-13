/* ==================================================================
   SERVICES (the four service categories, shared by Home and Services)
   ------------------------------------------------------------------
   Used by the home page's pinned services section and every
   category section on /services. Each id is also the anchor on the
   Services page (/services#civil ...).

   Where the services come from: CHR's Facebook page ("civil
   engineering and house renovations, painting, laminated flooring,
   tiling, paving, fencing"), their flyer ("house renovations,
   structural build, site development, foundation work, commercial
   improvements"), their posts (pothole repair, braai areas, roofs,
   bathrooms, steel structures) and the old Wix site (porches and
   decks, pergolas and gazebos, stairs and railings).

   TO CONFIRM: the items marked "confirm" below appear only on the old
   Wix template or in the brief, not in CHR's own posts.

   Sections in this file:
     1. TYPES
     2. SERVICES
   ================================================================== */

import type { Photo } from "@/components/ui/photoviewer/PhotoViewer";
import { getProject, type CategoryId } from "@/components/projects/projects";

/* ==================================================================
   1. TYPES
   ================================================================== */

export type Service = {
  id: CategoryId;
  number: string;
  title: string;
  short: string;
  /** One line for the home page preview. */
  teaser: string;
  description: string;
  items: string[];
  photo: Photo;
  /** A second photo for the Services page section. */
  detail: Photo;
};

/* ==================================================================
   2. SERVICES
   ================================================================== */

const photo = (slug: string, i: number) => getProject(slug).photos[i];

export const SERVICES: Service[] = [
  {
    id: "civil",
    number: "01",
    title: "Civil Construction",
    short: "Civil",
    teaser: "Road and pothole repairs, concrete work and site development.",
    description:
      "Civil construction solutions for infrastructure, site development and road-related projects, with attention to the requirements of each development.",
    items: ["Road repairs", "Pothole repairs", "Concrete slabs and concrete work", "Site development", "Civil engineering work"],
    photo: photo("slab-brickwork", 1),
    detail: photo("pothole-goldfields", 0),
  },
  {
    id: "building",
    number: "02",
    title: "Building & Structural Construction",
    short: "Building & Structural",
    teaser: "New buildings, foundations, structural steel, roofs and commercial improvements.",
    description:
      "Construction and structural solutions designed around the requirements of residential and commercial projects.",
    items: ["Building construction", "Foundation work", "Structural steel work", "Roof replacement", "Commercial improvements"],
    photo: photo("steel-structure", 0),
    detail: photo("house-build", 0),
  },
  {
    id: "residential",
    number: "03",
    title: "Residential Renovations",
    short: "Residential",
    teaser: "Bathrooms, tiling, painting, flooring, ceilings and full home renovations.",
    description:
      "Transforming residential spaces through practical improvements, quality finishes and construction solutions tailored to each project.",
    items: ["Bathroom renovations", "Tiling", "Painting", "Laminated flooring", "Ceilings", "General home renovations"],
    photo: photo("bathroom-closet", 0),
    detail: photo("bathroom-closet", 5),
  },
  {
    id: "outdoor",
    number: "04",
    title: "Outdoor & Exterior Improvements",
    short: "Outdoor & Exterior",
    teaser: "Braai areas, paving, fencing, pergolas, gazebos, porches and decks.",
    description:
      "Practical outdoor construction and exterior improvements designed to enhance the functionality and appearance of residential spaces.",
    // Pergolas, gazebos, porches and decks: from the old Wix site, confirm with CHR.
    items: ["Braai areas", "Paving", "Fencing and precast walls", "Pergolas and gazebos", "Porches and decks"],
    photo: photo("braai-area", 0),
    detail: photo("precast-fencing", 0),
  },
];

/** The working process, shared by Home and Services. */
export const PROCESS = [
  { title: "Consultation", home: "We meet to understand your requirements, ideas and project objectives.", services: "Understanding your vision and requirements." },
  { title: "Planning & Quotation", home: "We assess the scope of the work and prepare a suitable quotation.", services: "Assessing the scope and preparing a quotation." },
  { title: "Construction", home: "Our team carries out the work according to the agreed requirements.", services: "Carrying out the agreed construction work." },
  { title: "Completion", home: "We work towards a finished project that meets the agreed expectations.", services: "Working towards the agreed project outcome." },
];
