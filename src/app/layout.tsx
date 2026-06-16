import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const fraunces = localFont({
  src: [
    {
      path: "../../public/fonts/Fraunces-VariableFont_SOFT_WONK_opsz_wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/Fraunces-Italic-VariableFont_SOFT_WONK_opsz_wght.ttf",
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
// The design implementation (mail board, assets, fonts from public/) is static-friendly;
// revert to 'force-static' or remove once prerender fixed (e.g. by updating motion or Next).
export const dynamic = 'force-dynamic';

// Fraunces loaded here via next/font/local (variable TTF with SOFT + WONK + opsz + wght axes)
// so --font-display (and .wonk-line, h1/h2, .brand-wordmark, .font-display) get proper optimization + axis support.
// Matches design spec in public/README.md + public/colors_and_type.css verbatim.




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
