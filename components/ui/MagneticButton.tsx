"use client";

import React, { useRef, useState } from "react";
import { m, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticProps {
    children: React.ReactNode;
    className?: string;
    strength?: number; // How strong the magnetic pull is (default: 0.35)
}

export function Magnetic({
    children,
    className,
    strength = 0.35,
}: MagneticProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const shouldReduceMotion = useReducedMotion();

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (shouldReduceMotion || !ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        setPosition({ x: x * strength, y: y * strength });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <m.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{
                duration: 1.0,
                ease: "easeOut",
            }}
            className={cn("inline-block", className)}
        >
            {children}
        </m.div>
    );
}

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
    strength?: number; // How strong the magnetic pull is (default: 0.5)
}

export function MagneticButton({
    children,
    className,
    strength = 0.5,
    ...props
}: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const shouldReduceMotion = useReducedMotion();

    const handleMouseMove = (e: React.MouseEvent) => {
        if (shouldReduceMotion || !ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        setPosition({ x: x * strength, y: y * strength });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <m.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{
                duration: 1.0,
                ease: "easeOut",
            }}
            className={cn("focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-coral outline-none", className)}
            {...props}
        >
            {children}
        </m.button>
    );
}
