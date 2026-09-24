"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let disposed = false;
        document.documentElement.dataset.loading = "true";
        if (!window.location.hash) window.scrollTo(0, 0);

        const windowLoaded = document.readyState === "complete"
            ? Promise.resolve()
            : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
        const fontsReady = document.fonts?.ready.catch(() => undefined) ?? Promise.resolve();
        const minimumDisplay = new Promise<void>((resolve) => window.setTimeout(resolve, 350));

        Promise.all([windowLoaded, fontsReady, minimumDisplay]).then(() => {
            if (disposed) return;
            requestAnimationFrame(() => requestAnimationFrame(() => {
                if (disposed) return;
                ScrollTrigger.refresh();
                setIsLoading(false);
                window.setTimeout(() => {
                    delete document.documentElement.dataset.loading;
                }, 800);
            }));
        });

        return () => {
            disposed = true;
            delete document.documentElement.dataset.loading;
        };
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: "-4%" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black text-white"
                    role="status"
                    aria-label="Loading Good'Ai"
                >
                    <div className="flex flex-col items-center">
                        <span className="font-display text-5xl md:text-7xl leading-none">Good&apos;Ai</span>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: [0, 0.72, 1] }}
                            transition={{ duration: 1.2, times: [0, 0.75, 1], ease: [0.76, 0, 0.24, 1] }}
                            transformTemplate={({ scaleX }) => `scaleX(${scaleX})`}
                            className="mt-8 h-px w-48 origin-left bg-white"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
