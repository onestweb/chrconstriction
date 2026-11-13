/* Home page: the sections in order. Navbar, footer, WhatsApp button and
   smooth scrolling come from app/layout.tsx. Each section lives in
   components/home/<name>/. */

import type { Metadata } from "next";
import FeaturedProjects from "@/components/home/featured/FeaturedProjects";
import Hero from "@/components/home/hero/Hero";
import CompanyIntroduction from "@/components/home/intro/CompanyIntroduction";
import WorkingProcess from "@/components/home/process/WorkingProcess";
import OurTeam from "@/components/home/team/OurTeam";
import ServicesOverview from "@/components/home/services/ServicesOverview";
import WhyChooseCHR from "@/components/home/why/WhyChooseCHR";
import ContactCTA from "@/components/ui/contact/ContactCTA";
import { SITE } from "@/components/ui/site";

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.tagline}`,
  description: SITE.description,
};

export default function Home() {
  return (
    <>
      <Hero />
      <CompanyIntroduction />
      <ServicesOverview />
      <FeaturedProjects />
      <WhyChooseCHR />
      <OurTeam />
      <WorkingProcess />
      <ContactCTA />
    </>
  );
}
