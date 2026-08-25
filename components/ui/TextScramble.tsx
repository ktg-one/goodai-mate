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
        const interval = setInterval(() => {
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

            if (iteration >= children.length) {
                clearInterval(interval);
            }

            iteration += 1 / 2; // Slower reveal
        }, 40);

        return () => clearInterval(interval);
    }, [children]);

    return (
        <span className={className}>
            {displayText}
        </span>
    );
}
