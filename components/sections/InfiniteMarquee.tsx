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

    // ⚡ Bolt: Memoize the rendered items to avoid O(N) operations and
    // redundant DOM element re-creations on every render.
    const renderedItems = useMemo(() => {
        const seen = new Map<string, number>();
        // Duplicate list twice to allow seamless -50% percentage transform loop
        const quadrupledItems = [...items, ...items, ...items, ...items];
        return quadrupledItems.map((item) => {
            const count = (seen.get(item) ?? 0) + 1;
            seen.set(item, count);
            return (
                <m.span
                    key={`${item}-${count}`}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.08, y: -2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                    transition={{
                        duration: 1.0,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block text-sm md:text-base font-medium tracking-[0.3em] text-brand-ink mx-6 md:mx-8 uppercase px-3 py-1 rounded-md border border-transparent hover:border-brand-ink/20 hover:bg-brand-paper/20 cursor-pointer transition-colors duration-300"
                >
                    {item}
                </m.span>
            );
        });
    }, [items, shouldReduceMotion]);

    return (
        <div className={cn("relative w-full overflow-hidden bg-brand-coral py-6 border-y border-brand-ink select-none", className)}>
            <m.div
                className="flex whitespace-nowrap will-change-transform"
                animate={shouldReduceMotion ? { x: "0%" } : { x: ["0%", "-50%"] }}
                style={{ width: "max-content" }}
                transition={
                    shouldReduceMotion
                        ? { duration: 0 }
                        : {
                              x: {
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  duration: speed,
                                  ease: "linear",
                              },
                          }
                }
            >
                {renderedItems}
            </m.div>
        </div>
    );
}
