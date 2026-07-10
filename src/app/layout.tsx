import type { Metadata } from "next";
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
  weight: "100 900",
  display: "swap",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}