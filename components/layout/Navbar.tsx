"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { SURVEY_URL, PHONE_HREF, PHONE_DISPLAY } from "@/lib/links";

const navLinks = [
    { name: "Workflows", href: "#demo" },
    { name: "Voice Agent", href: "#demo" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
];

export function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const shouldReduceMotion = useReducedMotion();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = lastScrollY;
        setLastScrollY(latest);

        // Check if scrolled down for floating effect
        if (latest > 100) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }

        // Hide/Show logic on scroll direction
        if (latest > previous && latest > 150) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }
    });

    return (
        <motion.header
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: -20, opacity: 0 },
            }}
            animate={isHidden ? "hidden" : "visible"}
            transition={{
                duration: shouldReduceMotion ? 0.2 : 1.0,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
        >
            {/* Floating Glass Pill */}
            <motion.div
                initial={{ width: "95%" }}
                animate={{ width: isScrolled ? "fit-content" : "95%" }}
                transition={{
                    duration: shouldReduceMotion ? 0.2 : 1.0,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                    "font-display pointer-events-auto flex items-center justify-between transition-all duration-500 rounded-full",
                    isScrolled
                        ? "bg-brand-paper text-brand-ink border border-brand-ink px-6 py-2 shadow-[4px_4px_0_var(--brand-coral)]"
                        : "bg-transparent text-brand-paper py-2 max-w-7xl mx-auto w-full"
                )}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group mr-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current rounded-sm">
                    <span className="font-display text-4xl md:text-5xl font-normal leading-[0.75] text-current group-hover:opacity-70 transition-opacity">
                        Good&apos;Ai
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav
                    className="hidden md:flex items-center gap-2 group/nav relative"
                    onMouseLeave={() => setHoveredNav(null)}
                >
                    {navLinks.map((link) => {
                        const isHovered = hoveredNav === link.name;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onMouseEnter={() => setHoveredNav(link.name)}
                                onFocus={() => setHoveredNav(link.name)}
                                className="relative px-4 py-2 text-lg lg:text-xl font-normal text-current opacity-85 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current rounded-full"
                            >
                                <span className="relative z-10">{link.name}</span>
                                {isHovered && (
                                    <motion.span
                                        layoutId={shouldReduceMotion ? undefined : "navbar-hover-indicator"}
                                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0.8 }}
                                        animate={{ opacity: 1, scaleX: 1 }}
                                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0.8 }}
                                        transition={{
                                            duration: shouldReduceMotion ? 0.2 : 1.0,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="absolute bottom-1 left-3 right-3 h-[2px] bg-brand-coral rounded-full pointer-events-none"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4 ml-8">
                    <a
                        href={PHONE_HREF}
                        className={cn(
                            "font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border border-brand-coral text-brand-coral transition-colors hover:bg-brand-coral hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-coral",
                            isScrolled ? "hidden lg:inline-block" : ""
                        )}
                    >
                        Call AI: {PHONE_DISPLAY}
                    </a>
                    <Button
                        asChild
                        size="sm"
                        className={cn(
                            "h-10 rounded-full px-6 text-sm font-medium transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-coral",
                            isScrolled
                                ? "bg-brand-ink text-brand-paper hover:bg-brand-coral hover:text-brand-ink"
                                : "bg-brand-paper text-brand-ink hover:bg-brand-coral"
                        )}
                    >
                        <a href={SURVEY_URL} target="_blank" rel="noopener noreferrer">Get Started</a>
                    </Button>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden flex items-center">
                    <Button
                        asChild
                        size="sm"
                        className={cn(
                            "rounded-full px-4 transition-colors font-medium mr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-coral",
                            isScrolled
                                ? "bg-brand-ink text-brand-paper hover:bg-brand-coral hover:text-brand-ink"
                                : "bg-brand-paper text-brand-ink hover:bg-brand-coral"
                        )}
                    >
                        <a href={SURVEY_URL} target="_blank" rel="noopener noreferrer">Cuppa?</a>
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-coral" aria-label="Open menu">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="top" className="w-full h-full bg-brand-paper text-brand-ink border-none p-0">
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                            <div className="flex flex-col h-full items-center justify-center relative">
                                <SheetClose className="absolute top-6 right-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-coral rounded-full p-2" aria-label="Close menu">
                                    <X className="w-6 h-6" />
                                </SheetClose>
                                <div className="flex flex-col gap-8 text-center">
                                    {navLinks.map((link) => (
                                        <SheetClose key={link.name} asChild>
                                            <Link
                                                href={link.href}
                                                className="text-4xl font-light hover:italic transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-coral rounded-sm"
                                            >
                                                {link.name}
                                            </Link>
                                        </SheetClose>
                                    ))}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </motion.div>
        </motion.header>
    );
}
