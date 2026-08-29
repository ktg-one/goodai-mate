"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { SURVEY_URL } from "@/lib/links";

const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Field notes", href: "https://goodai.up.railway.app/" },
    { name: "Services", href: "#specs" },
    { name: "Prices", href: "#pricing" },
];

export function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

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
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
        >
            {/* Floating Glass Pill */}
            <motion.div
                initial={{ width: "95%" }}
                animate={{ width: isScrolled ? "fit-content" : "95%" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "font-display pointer-events-auto flex items-center justify-between transition-all duration-500 rounded-full",
                    isScrolled
                        ? "bg-brand-paper text-brand-ink border border-brand-ink px-6 py-2 shadow-[4px_4px_0_var(--brand-coral)]"
                        : "bg-transparent text-brand-paper py-2 max-w-7xl mx-auto w-full"
                )}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group mr-8">
                    <span className="font-display text-4xl md:text-5xl font-normal leading-[0.75] tracking-tighter text-current group-hover:opacity-70 transition-opacity">
                        Good&apos;Ai
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-2 group/nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="pen-underline relative px-4 py-2 text-lg lg:text-xl font-normal text-current opacity-75 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4 ml-8">
                    <Link href={SURVEY_URL} className={cn("text-lg lg:text-xl font-normal text-current opacity-75 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current transition-opacity", isScrolled ? "hidden lg:block" : "")}>
                        Survey
                    </Link>
                    <Button
                        asChild
                        size="sm"
                        className={cn(
                            "h-10 rounded-full px-7 text-base lg:text-lg transition-colors font-normal",
                            isScrolled
                                ? "bg-brand-ink text-brand-paper hover:bg-brand-coral hover:text-brand-ink"
                                : "bg-brand-paper text-brand-ink hover:bg-brand-coral"
                        )}
                    >
                        <Link href={SURVEY_URL}>Quick Chat</Link>
                    </Button>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden flex items-center">
                    <Button
                        asChild
                        size="sm"
                        className={cn(
                            "rounded-full px-4 transition-colors font-medium mr-2",
                            isScrolled
                                ? "bg-brand-ink text-brand-paper hover:bg-brand-coral hover:text-brand-ink"
                                : "bg-brand-paper text-brand-ink hover:bg-brand-coral"
                        )}
                    >
                        <Link href={SURVEY_URL}>Cuppa?</Link>
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open menu">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="top" className="w-full h-full bg-brand-paper text-brand-ink border-none p-0">
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                            <div className="flex flex-col h-full items-center justify-center relative">
                                <SheetClose className="absolute top-6 right-6" aria-label="Close menu">
                                    <X className="w-6 h-6" />
                                </SheetClose>
                                <div className="flex flex-col gap-8 text-center">
                                    {navLinks.map((link) => (
                                        <SheetClose key={link.name} asChild>
                                            <Link
                                                href={link.href}
                                                className="text-4xl font-light tracking-tight hover:italic transition-all"
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
