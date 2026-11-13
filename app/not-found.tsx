/* Any address that doesn't exist. Navbar, footer and smooth scrolling come
   from app/layout.tsx; the page itself is components/ui/notfound/. */

import type { Metadata } from "next";
import NotFound from "@/components/ui/notfound/NotFound";
import { SITE } from "@/components/ui/site";

export const metadata: Metadata = {
  title: `Page not found | ${SITE.name}`,
};

export default function NotFoundPage() {
  return <NotFound />;
}
