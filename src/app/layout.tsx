import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = localFont({
  src: [
    {
      path: "../../public/fonts/DM_Sans/DMSans-VariableFont_opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/DM_Sans/DMSans-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-dm-sans",
  weight: "100 1000",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const fraunces = localFont({
  src: [
    {
      path: "../../public/fonts/Fraunces/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/Fraunces/Fraunces-Italic-VariableFont_SOFT,WONK,opsz,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Good'ai — Business Automations, Sorted",
  description: "Perth-based business automations for SMEs. Tell us your problem, we'll figure out how to fix it.",
};

// Force dynamic to bypass prerender crashes on _global-error / _not-found during build
// (useContext null from client context in error boundary static gen with motion/GSAP tree).
// The design implementation (mail board, assets, fonts from public/design-system-new) is static-friendly;
// revert to 'force-static' or remove once prerender fixed (e.g. by updating motion or Next).
export const dynamic = 'force-dynamic';

// DM Sans + Fraunces load from public/fonts; Fraunces keeps SOFT/WONK/opsz/wght axes for the design spec.




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
