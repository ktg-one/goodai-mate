"use client";

import { Sketchbook, type SketchbookPage } from "@/src/shaders/sketchbook/Sketchbook";

// ThreeUI sketchbook pointing at public/assets/sketches/ (1-sketch through 14-sketch).
const pages: SketchbookPage[] = [
  { file: "1-sketch.jpg", title: "Sketch 1", place: "" },
  { file: "2-sketch.jpg", title: "Sketch 2", place: "" },
  { file: "3-sketch.jpg", title: "Sketch 3", place: "" },
  { file: "4-sketch.jpg", title: "Sketch 4", place: "" },
  { file: "5-sketch.jpg", title: "Sketch 5", place: "" },
  { file: "6-sketch.jpg", title: "Sketch 6", place: "" },
  { file: "7-sketch.png", title: "Sketch 7", place: "" },
  { file: "8-sketch.png", title: "Sketch 8", place: "" },
  { file: "9-sketch.png", title: "Sketch 9", place: "" },
  { file: "10-sketch.png", title: "Sketch 10", place: "" },
  { file: "11-sketch.png", title: "Sketch 11", place: "" },
  { file: "12-sketch.png", title: "Sketch 12", place: "" },
  { file: "13-sketch.png", title: "Sketch 13", place: "" },
  { file: "14-sketch.png", title: "Sketch 14", place: "" },
];

export function PerthSketchbook() {
  return (
    <section className="perth-sketchbook" aria-label="Perth sketchbook">
      <Sketchbook assetBaseUrl="/assets/sketches/" pages={pages} land={13} title="Perth sketchbook" />
    </section>
  );
}
