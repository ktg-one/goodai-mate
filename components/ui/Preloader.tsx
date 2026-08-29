"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        const fpsInterval = 20; // Adjust speed here
        let currentCount = 0;

        // Bolt Performance Improvement: Use requestAnimationFrame instead of setInterval
        // Using `requestAnimationFrame` for loading progress loops ensures the animation
        // synchronizes with the browser's render cycle. It avoids unnecessary execution
        // when the tab is inactive and provides a smoother, more efficient visual update
        // compared to the fixed, decoupled scheduling of `setInterval`.
        const animate = (currentTime: number) => {
            const elapsed = currentTime - lastTime;

            if (elapsed > fpsInterval) {
                lastTime = currentTime - (elapsed % fpsInterval);

                currentCount++;
                setCounter(currentCount);

                if (currentCount >= 100) {
                    setTimeout(() => setIsLoading(false), 500); // Delay fade out
                }
            }

            if (currentCount < 100) {
                 animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -50 }} // Slide up reveal
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black text-white"
                >
                    <div className="flex flex-col items-center">
                        <span className="text-[12rem] md:text-[20rem] font-bold leading-none tracking-tighter opacity-10 tabular-nums">
                            {counter}
                        </span>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "200px" }}
                            className="h-1 bg-white mt-8 rounded-full"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
