import type { Metadata } from "next";

import "./globals.css";
import { StudioHeader, StudioFooter } from "@/components/studio/Shell";
export const metadata: Metadata = {
  title: { default: "Good'Ai — Good work. More life.", template: "%s — Good'Ai" },
  description: "Practical AI and automation for businesses with better things to do. Voice agents, connected workflows and custom assistants. Built in Perth, working everywhere.",
  metadataBase: new URL("http://localhost:3011"), robots: { index: false, follow: false },
  openGraph: { title: "Good'Ai — Good work. More life.", description: "Less chasing. Less copying. More of the work you actually care about.", images: [{ url: "/brand/coastal-phone.webp", width: 1536, height: 1024 }] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-AU"><body><a className="skip-link" href="#main">Skip to content</a><StudioHeader /><main id="main">{children}</main><StudioFooter /></body></html>;
}
