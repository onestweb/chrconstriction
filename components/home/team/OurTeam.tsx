"use client";

/* ==================================================================
   OUR TEAM  (home page)
   ------------------------------------------------------------------
   Where it sits:

     <WhyChooseCHR />
     <OurTeam />
     <WorkingProcess />

   The owner in a tall portrait on the left, with the heading and the
   rest of the team on the right. Each photo opens from a slight inset
   as it scrolls in (clip reveal); the name cards rise after it.
   Reduced motion: everything in place.

   CONFIRM: names and roles are placeholders until CHR sends them.
   The owner photo is cropped above the shirt, which carried another
   company's name. Swap in CHR's own team photos when they have them:
   replace the files in public/team/ and edit TEAM below.

   Sections in this file:
     1. CONTENT
     2. SECTION
     3. MEMBER CARD
   ================================================================== */

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGsap, useInView } from "@/components/ui/motion/motion";
import SectionHeading, { Muted } from "@/components/ui/sectionheading/SectionHeading";

/* ==================================================================
   1. CONTENT
   ================================================================== */

type Member = { name: string; role: string; photo: { src: string; width: number; height: number; alt: string; position?: string } };

const HEADING = {
  eyebrow: "Our team",
  description: "Meet the owner and the people who plan, build and finish CHR's projects across the Free State.",
};

const OWNER: Member = {
  name: "Owner's name", // CONFIRM
  role: "Owner",
  photo: { src: "/team/owner.jpg", width: 880, height: 1050, alt: "Portrait of the owner of CHR Construction", position: "50% 30%" },
};

const TEAM: Member[] = [
  {
    name: "Team member names", // CONFIRM
    role: "Role to confirm", // CONFIRM
    photo: { src: "/team/site-team.jpg", width: 1162, height: 860, alt: "Two CHR team members in hard hats reviewing plans on site", position: "50% 35%" },
  },
  {
    name: "Team member name", // CONFIRM
    role: "Role to confirm", // CONFIRM
    photo: { src: "/team/team-member.jpg", width: 1106, height: 860, alt: "CHR team member in a hard hat and safety vest", position: "62% 30%" },
  },
];

/* ==================================================================
   2. SECTION
   ================================================================== */

export default function OurTeam() {
  const root = useRef<HTMLElement | null>(null);

  useGsap(root, () => {
    gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((frame) => {
      gsap.fromTo(
        frame,
        { clipPath: "inset(8% 8% 8% 8% round 18px)" },
        { clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "none", scrollTrigger: { trigger: frame, start: "top 95%", end: "top 45%", scrub: true } },
      );
      const img = frame.querySelector("img");
      if (img) gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: frame, start: "top 95%", end: "top 45%", scrub: true } });
    });
  });

  return (
    <section ref={root} id="team" aria-labelledby="team-heading" className="mx-auto max-w-360 px-5 pt-28 sm:px-8 lg:px-12 lg:pt-40">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-10">
        {/* Owner */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <MemberCard member={OWNER} tall sizes="(min-width:1024px) 38vw, 100vw" />
        </div>

        {/* Heading and the team */}
        <div className="order-1 flex flex-col lg:order-2 lg:col-span-7">
          <SectionHeading
            id="team-heading"
            eyebrow={HEADING.eyebrow}
            title={
              <>
                The people behind <Muted>every build.</Muted>
              </>
            }
            description={HEADING.description}
          />
          <ul aria-label="Team members" className="mt-10 hidden gap-4 sm:grid-cols-2 lg:mt-auto lg:grid lg:pt-12">
            {TEAM.map((m) => (
              <li key={m.photo.src}>
                <MemberCard member={m} sizes="(min-width:1024px) 28vw, 50vw" />
              </li>
            ))}
          </ul>
        </div>

        {/* The team, below the owner on phones and tablets */}
        <ul aria-label="Team members" className="order-3 grid gap-4 sm:grid-cols-2 lg:hidden">
          {TEAM.map((m) => (
            <li key={m.photo.src}>
              <MemberCard member={m} sizes="(min-width:640px) 50vw, 100vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ==================================================================
   3. MEMBER CARD
   ================================================================== */

function MemberCard({ member, tall = false, sizes }: { member: Member; tall?: boolean; sizes: string }) {
  const [ref, shown] = useInView<HTMLElement>(0.25);
  return (
    <figure ref={ref} data-shown={shown} className="relative">
      <div data-clip className={`relative overflow-hidden rounded-media bg-surface-hover ${tall ? "aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[620px]" : "aspect-[4/3]"}`}>
        <Image src={member.photo.src} alt={member.photo.alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: member.photo.position ?? "50% 50%" }} />
      </div>
      <figcaption
        className={`reveal-up absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 rounded-[16px] bg-surface/95 px-4 py-3 backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-auto sm:min-w-[60%] ${tall ? "lg:px-5 lg:py-4" : ""}`}
      >
        <span>
          <span className={`block f-head font-semibold leading-tight text-foreground ${tall ? "text-[22px]" : "text-[18px]"}`}>{member.name}</span>
          <span className="mt-0.5 block text-[14px] text-muted">{member.role}</span>
        </span>
        {tall && (
          <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-white">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11 12 4l9 7" />
            </svg>
          </span>
        )}
      </figcaption>
    </figure>
  );
}
