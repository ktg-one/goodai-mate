"use client";

import { useRef, useState } from "react";
import { motion, type HTMLMotionProps, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

type BaseProps = {
    children: React.ReactNode;
    className?: string;
    strength?: number;
    href?: string;
    target?: string;
    rel?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
};

export type MagneticButtonProps = BaseProps &
    Omit<HTMLMotionProps<"button"> & HTMLMotionProps<"a">, keyof BaseProps>;

const SPRING_TRANSITION: Transition = {
    type: "spring",
    stiffness: 150,
    damping: 15,
    mass: 0.1,
};

export function MagneticButton({
    children,
    className,
    strength = 0.5,
    href,
    target,
    rel,
    onClick,
    ...props
}: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        setPosition({ x: x * strength, y: y * strength });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const commonClasses = cn(
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-coral outline-none",
        className
    );

    const animationProps = {
        animate: { x: position.x, y: position.y },
        transition: SPRING_TRANSITION,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
    };

    if (href) {
        return (
            <motion.a
                ref={ref}
                href={href}
                target={target}
                rel={rel}
                onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
                className={commonClasses}
                {...animationProps}
                {...(props as HTMLMotionProps<"a">)}
            >
                {children}
            </motion.a>
        );
    }

    return (
        <motion.button
            ref={ref}
            onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
            className={commonClasses}
            {...animationProps}
            {...(props as HTMLMotionProps<"button">)}
        >
            {children}
        </motion.button>
    );
}
