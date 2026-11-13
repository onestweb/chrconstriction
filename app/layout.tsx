import type { Metadata, Viewport } from "next";
import { Archivo, Figtree } from "next/font/google";
import Footer from "@/components/ui/footer/Footer";
import { SmoothScroll } from "@/components/ui/motion/motion";
import Navbar from "@/components/ui/navbar/Navbar";
import { SITE } from "@/components/ui/site";
import WhatsAppButton from "@/components/ui/whatsapp/WhatsAppButton";
import "./globals.css";

// Headings: Archivo set semi-condensed (wdth 88), a nod to the condensed
// capitals of the CHR logo without copying them. Body: Figtree.
// globals.css reads these two variable names: swap the fonts, keep the names.
const headingFont = Archivo({
  variable: "--font-heading-face",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const bodyFont = Figtree({
  variable: "--font-body-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} | ${SITE.tagline}`,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    images: ["/hero/poster.jpg"],
    locale: "en_ZA",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#17191e",
};

/* Every page of the site sits inside this layout: smooth scrolling, the
   navbar, the page itself (in <main>), the footer and the floating
   WhatsApp button. Pages only list their own sections. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <SmoothScroll />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
