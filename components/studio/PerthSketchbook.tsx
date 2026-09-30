"use client";

import { Sketchbook, type SketchbookPage } from "@/src/shaders/sketchbook/Sketchbook";

// ThreeUI sketchbook with our own plates (public/sketchbook/plates/, cut
// from the spreads in public/sketchbook and public/assets/sketches). The
// intro flips from the busywork to the knock-off and lands on Cottesloe.
const pages: SketchbookPage[] = [
  { file: "plates/the-inbox.webp", title: "The inbox never stops", place: "Friday, 4:52pm" },
  { file: "plates/the-office.webp", title: "Everything copied twice", place: "The office" },
  { file: "plates/city-freeway.webp", title: "The city at knock-off", place: "Mitchell Freeway" },
  { file: "plates/kings-park.webp", title: "Kings Park, looking east", place: "Kings Park" },
  { file: "plates/swan-river.webp", title: "Across the Swan", place: "South Perth foreshore" },
  { file: "plates/cottesloe.webp", title: "Cottesloe, after work", place: "Cottesloe Beach" },
  { file: "plates/fremantle.webp", title: "Fremantle, Friday arvo", place: "Fremantle" },
];

export function PerthSketchbook() {
  return (
    <section className="perth-sketchbook" aria-label="Perth sketchbook">
      <Sketchbook assetBaseUrl="/sketchbook/" pages={pages} land={5} title="Perth sketchbook" />
    </section>
  );
}
