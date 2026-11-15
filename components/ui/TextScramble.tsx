"use client";

import { useEffect, useState } from "react";

interface TextScrambleProps {
    children: string;
    className?: string;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

export function TextScramble({ children, className }: TextScrambleProps) {
    const [displayText, setDisplayText] = useState(children);

    useEffect(() => {
        let iteration = 0;
        const length = children.length;
        const charLen = CHARS.length;

        const interval = setInterval(() => {
            // ⚡ Bolt: Eliminate intermediate array allocations (.split, .map, .join) during 40ms interval ticks
            // to prevent heap allocation churn and garbage collection pauses during scramble animation.
            let result = "";
            for (let index = 0; index < length; index++) {
                if (index < iteration) {
                    result += children[index];
                } else {
                    result += CHARS[Math.floor(Math.random() * charLen)];
                }
            }
            setDisplayText(result);

            if (iteration >= length) {
                clearInterval(interval);
            }

            iteration += 0.5; // Slower reveal
        }, 40);

        return () => clearInterval(interval);
    }, [children]);

    return (
        <span className={className}>
            {displayText}
        </span>
    );
}
