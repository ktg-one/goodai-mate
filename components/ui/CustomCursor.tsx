"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING_CONFIG = { damping: 25, stiffness: 700 };

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for the cursor
    // ⚡ Bolt: Extract spring configuration to module scope to preserve referential equality across renders
    const cursorX = useSpring(mouseX, SPRING_CONFIG);
    const cursorY = useSpring(mouseY, SPRING_CONFIG);

    useEffect(() => {
        // ⚡ Bolt: Use functional state update to prevent listener churn (removing/re-adding window listeners on cursor move)
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - 16); // Center the 32px cursor
            mouseY.set(e.clientY - 16);
            setIsVisible((prev) => (prev ? prev : true));
        };

        const handleMouseDown = () => document.body.classList.add("cursor-clicking");
        const handleMouseUp = () => document.body.classList.remove("cursor-clicking");

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full bg-white text-black pointer-events-none z-[10000] mix-blend-difference hidden md:flex items-center justify-center font-[10px]"
            style={{
                x: cursorX,
                y: cursorY,
                opacity: isVisible ? 1 : 0,
            }}
        >
            {/* Optional: Small inner dot or ring */}
        </motion.div>
    );
}
