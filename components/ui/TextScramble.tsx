"use client";

import { useEffect, useState } from "react";

interface TextScrambleProps {
    children: string;
    className?: string;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

export function TextScramble({ children, className }: TextScrambleProps) {
    const [displayText, setDisplayText] = useState(children);

    useEffect(() => {
        let iteration = 0;
        let animationFrameId: number;
        let lastTime = performance.now();
        const fpsInterval = 40; // milliseconds

        // Bolt Performance Improvement: Use requestAnimationFrame instead of setInterval
        // `setInterval` executes regardless of screen refresh rate and tab visibility, leading to
        // CPU waste and jank. `requestAnimationFrame` syncs with the browser's display refresh and
        // automatically pauses when the tab is inactive, improving battery life and frame stability.
        const animate = (currentTime: number) => {
            const elapsed = currentTime - lastTime;

            if (elapsed > fpsInterval) {
                lastTime = currentTime - (elapsed % fpsInterval);

                setDisplayText(
                    children
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration) {
                                return children[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("")
                );

                iteration += 1 / 2; // Slower reveal
            }

            if (iteration < children.length) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [children]);

    return (
        <span className={className}>
            {displayText}
        </span>
    );
}
