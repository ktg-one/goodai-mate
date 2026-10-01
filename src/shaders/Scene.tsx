"use client";

import { Sketchbook } from "./sketchbook/Sketchbook";
import "./threeui.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <Sketchbook assetBaseUrl="/sketchbook/" />
    </div>
  );
}
