import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = localFont({
  src: [
    { path: '../../public/fonts/Fraunces-VariableFont_SOFT_WONK_opsz_wght.ttf', style: 'normal' },
    { path: '../../public/fonts/Fraunces-Italic-VariableFont_SOFT_WONK_opsz_wght.ttf', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
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
      className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--fg)] font-sans">{children}</body>
    </html>
  );
}
