/* ==================================================================
   PROJECTS (the portfolio data, shared by all three pages)
   ------------------------------------------------------------------
   Used by:
     - the Projects page (featured project, filterable gallery,
       lightbox, before and after)
     - the home page's "Work That Speaks for Itself"
     - the Services page's showcase and service photographs

   Every photograph here is CHR Construction's own, from the client's
   ZIP (Facebook posts and site photos). Titles and descriptions only
   say what the photos and CHR's own posts show; nothing is added.

   To add a project:
     1. Put its photos in public/projects/<slug>/ as 1.jpg, 2.jpg ...
        (around 1200px on the long side).
     2. Copy one entry below, give it the new slug, its category and
        each photo's real width and height.
     3. It appears in the gallery, under its filter, with its lightbox.

   TO CONFIRM (with CHR):
     - locations of every project except the Goldfields Mall repair
     - the roof project: that it replaced thatch (the post offers
       thatch conversions next to these photos)
     - the industrial slab and brickwork: what the enclosure is for
     - the ceilings: material and where it was installed

   Sections in this file:
     1. TYPES
     2. CATEGORIES
     3. PROJECTS
     4. HELPERS
   ================================================================== */

import type { Photo } from "@/components/ui/photoviewer/PhotoViewer";

/* ==================================================================
   1. TYPES
   ================================================================== */

export type CategoryId = "civil" | "building" | "residential" | "outdoor";

export type Project = {
  slug: string;
  title: string;
  category: CategoryId;
  /** Only when CHR has published it. */
  location?: string;
  /** When CHR posted it, if known. */
  date?: string;
  summary: string;
  /** What the photographs show, in order. */
  photos: Photo[];
  /** Genuine before photographs from the same job (shown in the lightbox). */
  before?: Photo[];
};

/* ==================================================================
   2. CATEGORIES
   ================================================================== */

export const CATEGORIES: Record<CategoryId, { label: string; short: string }> = {
  civil: { label: "Civil Construction", short: "Civil" },
  building: { label: "Building & Structural", short: "Building" },
  residential: { label: "Residential Renovations", short: "Residential" },
  outdoor: { label: "Outdoor Projects", short: "Outdoor" },
};

/* ==================================================================
   3. PROJECTS  (display order of the gallery)
   ================================================================== */

const p = (slug: string, n: number | string, width: number, height: number, alt: string, caption: string, position?: string): Photo => ({
  src: `/projects/${slug}/${n}.jpg`,
  width,
  height,
  alt,
  caption,
  position,
});

export const PROJECTS: Project[] = [
  {
    slug: "bathroom-closet",
    title: "Open-plan bathroom & walk-in closet",
    category: "residential",
    date: "December 2025",
    summary:
      "A bedroom suite reworked from bare brick into an open-plan bathroom with a tiled walk-in shower, twin basins and a fitted walk-in closet. CHR Construction carried out the full job, from the stripped-back shell to the finished room.",
    photos: [
      p("bathroom-closet", 1, 1152, 517, "Tiled walk-in shower with two wall niches and pebble floor, open to the bedroom", "Walk-in shower, open to the bedroom"),
      p("bathroom-closet", 2, 1152, 518, "Wood-look wall tiles with two recessed shower niches", "Shower wall with recessed niches"),
      p("bathroom-closet", 3, 1152, 517, "Twin round mirrors above a floating vanity with two vessel basins", "Twin-basin vanity"),
      p("bathroom-closet", 4, 1152, 517, "Vanity and bathroom opening onto the bedroom", "Open plan from bath to bedroom"),
      p("bathroom-closet", 5, 770, 1712, "Tiled toilet nook with a recessed niche and wall-hung toilet", "Toilet nook"),
      p("bathroom-closet", 6, 1152, 518, "Fitted walk-in closet with open shelving, drawers and hanging space", "Walk-in closet"),
      p("bathroom-closet", 7, 1152, 517, "View through the walk-in closet towards the dressing area", "Closet and dressing area"),
      p("bathroom-closet", 8, 1152, 517, "The finished bedroom with the walk-in closet beyond", "The finished bedroom"),
    ],
    before: [
      p("bathroom-closet", "before-1", 1152, 517, "The shower wall before: exposed brick with two openings and a bare floor", "Before: the shower wall"),
      p("bathroom-closet", "before-2", 770, 1712, "The toilet nook before: bare brick and a rough concrete floor", "Before: the toilet nook"),
      p("bathroom-closet", "before-3", 1152, 518, "The room before: walls opened up and rubble on the floor", "Before: the room stripped back"),
    ],
  },
  {
    slug: "steel-structure",
    title: "Steel structure & column foundations",
    category: "building",
    summary:
      "A steel-framed open structure on a commercial site: column bases excavated by hand, reinforcing cages fixed and cast, then the steel columns, trusses and roof sheeting erected on top.",
    photos: [
      p("steel-structure", 1, 1152, 864, "Completed steel-framed open structure with a sheeted roof under a blue sky", "The finished steel structure"),
      p("steel-structure", 2, 1152, 864, "Underside of the steel roof trusses and columns", "Columns and roof trusses"),
      p("steel-structure", 3, 1152, 1536, "A steel column rising from its concrete base beside the structure", "Column on its base"),
      p("steel-structure", 4, 1152, 864, "Steel column base plate on a new concrete footing", "Base plate on the footing"),
      p("steel-structure", 5, 1152, 1536, "Excavated foundation pit with a blinding layer and a reinforcing cage", "Foundation pit and reinforcing"),
      p("steel-structure", 6, 946, 1712, "Reinforcing mesh and cage standing in a deep foundation excavation", "Reinforcing in the excavation"),
      p("steel-structure", 7, 1152, 1536, "Reinforcing steel fixed inside a foundation excavation", "Steel fixed before the pour"),
      p("steel-structure", 8, 771, 1712, "A team member placing timber shuttering in a foundation pit", "Shuttering the column base"),
    ],
  },
  {
    slug: "pothole-goldfields",
    title: "Pothole repair, Goldfields Mall",
    category: "civil",
    location: "Goldfields Mall",
    summary:
      "Pothole repair at Goldfields Mall: the damaged surface cut back to a clean rectangle, the area cordoned off, then filled and compacted with a plate compactor to a level patch.",
    photos: [
      p("pothole-goldfields", 1, 1152, 1536, "Team compacting a pothole patch beside the road at Goldfields Mall, with a traffic cone and barrier tape", "Compacting the repair"),
      p("pothole-goldfields", 2, 963, 1712, "The finished rectangular asphalt patch in the road surface", "The finished patch"),
    ],
  },
  {
    slug: "braai-area",
    title: "Covered braai area",
    category: "outdoor",
    date: "October 2025",
    summary:
      "An outdoor entertainment area built around a braai: a steep timber-truss roof, white columns, a built-in braai wall and a paved floor opening onto the garden.",
    photos: [
      p("braai-area", 1, 1152, 1536, "Covered braai area with exposed timber trusses, paving and a view to the garden", "Under the timber roof"),
      p("braai-area", 2, 1152, 1536, "Front of the braai area: a white column and steep gable framed by plants", "The gable entrance"),
      p("braai-area", 3, 1152, 1536, "The braai area from the paved path, with its steep roof", "Approach from the garden"),
      p("braai-area", 4, 1152, 1536, "Built-in braai wall under the timber roof, with paving in front", "The built-in braai"),
      p("braai-area", 5, 1152, 1536, "Inside the braai area: trusses, the braai and planters", "Trusses and braai wall"),
    ],
  },
  {
    slug: "house-build",
    title: "New house build",
    category: "building",
    summary:
      "A single-storey house built from the ground up: brick walls, plastered and painted, steel windows and a pitched metal roof, with a new concrete slab cast alongside.",
    photos: [
      p("house-build", 1, 960, 1280, "Newly built plastered house with a covered entrance and scaffolding beside it", "The house nearing completion"),
      p("house-build", 2, 960, 1280, "The house with a newly cast concrete slab in front and team members on site", "New slab beside the house"),
      p("house-build", 3, 960, 1280, "Side of the house with stacked bricks and team members at the door", "On site"),
      p("house-build", 4, 960, 1280, "The long side of the house with materials stacked on site", "Side elevation"),
      p("house-build", 5, 720, 960, "The house and concrete slab from the corner of the site", "From the corner of the site"),
    ],
  },
  {
    slug: "roof",
    title: "Roof replacement",
    category: "building",
    date: "September 2025",
    summary:
      "New pressed-metal tiled roofs on brick homes, with flashings, gutters and exposed timber trusses inside. CHR offers this as the insurance-friendly alternative to thatch.",
    photos: [
      p("roof", 1, 1152, 1536, "New maroon tiled roof over a face-brick house, with a team member in the garden", "The new roof"),
      p("roof", 2, 1152, 1536, "Hipped tiled roof against a clear blue sky", "Hipped roof against the sky"),
      p("roof", 3, 1152, 1536, "Roof edge with a new flashing and gutter against the brick wall", "Flashing and gutter detail"),
      p("roof", 4, 1152, 1536, "Tiled roof over a face-brick house with a timber door", "Over the entrance"),
      p("roof", 5, 1152, 1536, "Inside: exposed timber trusses, ceiling fans and lights under the new roof", "Exposed trusses inside"),
      p("roof", 6, 1152, 1536, "Timber trusses and roof sheeting seen from below", "Trusses from below"),
    ],
  },
  {
    slug: "slab-brickwork",
    title: "Concrete slab & brickwork, industrial site",
    category: "civil",
    summary:
      "A concrete slab and face-brick enclosure on an industrial site: ground prepared, slab cast and finished, then brick walls built up around it.",
    photos: [
      p("slab-brickwork", 1, 1152, 1536, "Freshly cast concrete slab being finished by the team", "Finishing the slab"),
      p("slab-brickwork", 2, 1152, 864, "Completed brick enclosure around the concrete slab, next to industrial buildings", "The completed enclosure"),
      p("slab-brickwork", 3, 1152, 864, "Bricklayers building the enclosure walls on the slab", "Walls going up"),
      p("slab-brickwork", 4, 1152, 864, "Brickwork starting on the slab edge with bricks stacked around it", "First courses of brick"),
      p("slab-brickwork", 5, 1152, 1536, "Inside the enclosure: a cast floor with a channel along the wall", "Inside the enclosure"),
      p("slab-brickwork", 6, 1152, 864, "Wet concrete slab with the industrial building behind", "The slab after the pour"),
      p("slab-brickwork", 7, 1152, 864, "Concrete slab curing beside the industrial building", "Slab curing"),
    ],
  },
  {
    slug: "road-track",
    title: "Children's road-safety track",
    category: "civil",
    summary:
      "“A little fun project for the team”: a small concrete road layout with circles, a pedestrian crossing and painted markings, so children can learn about roads and their rules.",
    photos: [p("road-track", 1, 1152, 1154, "Small concrete road-safety track with painted circles, arrows and a zebra crossing", "The finished track")],
  },
  {
    slug: "ceilings",
    title: "Ceiling installation",
    category: "residential",
    summary: "A new high-gloss ceiling with downlights, fitted in a large room with cornices finished around the edge.",
    photos: [
      p("ceilings", 1, 1152, 864, "Glossy white ceiling with downlights reflecting the room's windows", "The new ceiling"),
      p("ceilings", 2, 1152, 864, "Ceiling and cornices with scaffolding still in the room", "Finishing the cornices"),
    ],
  },
  {
    slug: "precast-fencing",
    title: "Precast concrete wall",
    category: "outdoor",
    summary: "A precast concrete boundary wall going up, panel by panel, along a property line.",
    photos: [p("precast-fencing", 1, 1147, 440, "Team members lifting a precast concrete panel into place on a long boundary wall", "Setting the panels")],
  },
];

/* ==================================================================
   4. HELPERS
   ================================================================== */

export const getProject = (slug: string) => {
  const found = PROJECTS.find((x) => x.slug === slug);
  if (!found) throw new Error(`Unknown project: ${slug}`);
  return found;
};

/** The project shown large at the top of the Projects page. */
export const FEATURED_SLUG = "bathroom-closet";

/** Genuine before and after pairs (same wall, same angle). */
export const BEFORE_AFTER = [
  {
    title: "Shower wall",
    project: "bathroom-closet",
    before: p("bathroom-closet", "before-1", 1152, 517, "Before: exposed brick wall with two openings", "Before"),
    after: p("bathroom-closet", 2, 1152, 518, "After: tiled shower wall with two recessed niches", "After"),
  },
  {
    title: "Toilet nook",
    project: "bathroom-closet",
    before: p("bathroom-closet", "before-2", 770, 1712, "Before: bare brick nook with a rough floor", "Before"),
    after: p("bathroom-closet", 5, 770, 1712, "After: tiled nook with a wall-hung toilet and niche", "After"),
  },
];
