"use client";

import type { ComponentProps } from "react";

import "@designcodeio/threeui/style.css";
import { AnimatedTopDock } from "@designcodeio/threeui/components/AnimatedTopDock";

export type TopDockProps = ComponentProps<typeof AnimatedTopDock>;

export function TopDock(props: TopDockProps) {
  return <AnimatedTopDock {...props} />;
}
