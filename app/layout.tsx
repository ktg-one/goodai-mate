import type { Metadata } from "next";

import "./globals.css";
import "./studio-controls.css";
import { StudioHeader, StudioFooter } from "@/components/studio/Shell";
import { StudioMotion } from "@/components/studio/StudioMotion";
import { SmoothScroll } from "@/components/studio/SmoothScroll";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://goodai.au";

export const metadata: Metadata = {
  title: { default: "Good'Ai — Good work. More life.", template: "%s — Good'Ai" },
  description: "Practical AI and automation for businesses with better things to do. Voice agents, connected workflows and custom assistants. Built in Perth, working everywhere.",
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Good'Ai — Good work. More life.",
    description: "Less chasing. Less copying. More of the work you actually care about.",
    url: siteUrl,
    siteName: "Good'Ai",
    locale: "en_AU",
    type: "website",
    images: [{ url: "/brand/coastal-phone.webp", width: 1536, height: 1024, alt: "Good'Ai — Good work. More life." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Good'Ai — Good work. More life.",
    description: "Less chasing. Less copying. More of the work you actually care about.",
    images: ["/brand/coastal-phone.webp"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <StudioHeader />
        <main id="main">{children}</main>
        <StudioFooter />
        <StudioMotion />
        <SmoothScroll />
      </body>
    </html>
  );
}
