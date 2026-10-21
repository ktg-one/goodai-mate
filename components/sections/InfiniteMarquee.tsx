"use client";

import { useMemo } from "react";
import { m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InfiniteMarqueeProps {
    className?: string;
    speed?: number; // Duration in seconds for one full loop
    items?: string[];
}

const DEFAULT_ITEMS = ["WORKFLOWS", "AUTOMATION", "SYSTEMS", "LESS ADMIN", "MORE FRIDAY"];

export function InfiniteMarquee({
    className,
    speed = 20,
    items = DEFAULT_ITEMS
}: InfiniteMarqueeProps) {
    const shouldReduceMotion = useReducedMotion();

    // Double the array to guarantee seamless 50% infinite translation loop
    const marqueeItems = useMemo(() => [...items, ...items], [items]);

    // ⚡ Bolt: Memoize the rendered items to avoid O(N) operations and
    // redundant DOM element re-creations on every render.
    const renderedItems = useMemo(() => {
        const seen = new Map<string, number>();
        // Render 2 sets of marqueeItems (total 4x original items) for seamless looping
        return [...marqueeItems, ...marqueeItems].map((item) => {
            const count = (seen.get(item) ?? 0) + 1;
            seen.set(item, count);
            return (
                <m.span
                    key={`${item}-${count}`}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.1, color: "var(--brand-paper)" }}
                    transition={{ duration: 1.0, ease: "easeOut" }}
                    className="inline-block text-sm md:text-base font-medium tracking-[0.3em] text-brand-ink mx-8 uppercase transition-colors duration-1000 cursor-pointer"
                >
                    {item}
                </m.span>
            );
        });
    }, [marqueeItems, shouldReduceMotion]);

    const effectiveDuration = Math.max(speed, 1.0);

    return (
        <div className={cn("relative w-full overflow-hidden bg-brand-coral py-6 border-y border-brand-ink select-none", className)}>
            <m.div
                className="flex whitespace-nowrap"
                animate={shouldReduceMotion ? { x: "0%" } : { x: ["0%", "-50%"] }}
                style={{ width: "max-content" }}
                whileHover={shouldReduceMotion ? {} : { scale: 0.99 }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: effectiveDuration,
                        ease: "linear",
                    },
                    scale: {
                        duration: 1.0,
                        ease: "easeOut",
                    },
                }}
            >
                {renderedItems}
            </m.div>
        </div>
    );
}
