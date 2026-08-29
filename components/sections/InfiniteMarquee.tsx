"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface InfiniteMarqueeProps {
    className?: string;
    speed?: number; // Duration in seconds for one full loop
    items?: string[];
}

export function InfiniteMarquee({
    className,
    speed = 20,
    items = ["WORKFLOWS", "AUTOMATION", "SYSTEMS", "LESS ADMIN", "MORE FRIDAY"]
}: InfiniteMarqueeProps) {

    // Bolt Performance Improvement: Memoize the rendered items array.
    // Previously, `[...items, ...items, ...items, ...items].map(...)` was inline in the JSX,
    // causing a new array of DOM elements to be created on every render, which scales O(N)
    // with the length of `items` and triggers unnecessary React reconciliations.
    // Wrapping it in `useMemo` avoids redundant computations and allocations,
    // saving memory and CPU on every re-render of this component or its parents.
    const renderedItems = useMemo(() => {
        return [...items, ...items, ...items, ...items].map((item, i) => (
            <span key={i} className="text-sm md:text-base font-medium tracking-[0.3em] text-brand-ink mx-8 uppercase">
                {item}
            </span>
        ));
    }, [items]);

    return (
        <div className={cn("relative w-full overflow-hidden bg-brand-coral py-6 border-y border-brand-ink select-none", className)}>
            {/* Gradient Masks for Edge Blur */}

            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: [0, -1000] }} // Arbitrary large number, better implemented with percent or measure
                style={{ width: "max-content" }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: speed,
                        ease: "linear",
                    },
                }}
            >
                {/* Render items 4 times to ensure no gaps on large screens */}
                {renderedItems}
            </motion.div>
        </div>
    );
}
