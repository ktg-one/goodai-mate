"use client";

import { Sketchbook, type SketchbookPage } from "@/src/shaders/sketchbook/Sketchbook";

// ThreeUI sketchbook with our own plates (public/sketchbook/plates/, cut
// from the spreads in public/sketchbook and public/assets/sketches). The
// intro flips from the busywork to the knock-off and lands on the Fremantle
// brewery. Trimmed to the opening pain and the pub payoff while the in-between
// story frames (pains cancelling, door, cheers) are being made; the other cut
// plates (the-office, city-freeway, kings-park, swan-river, cottesloe) are
// still in plates/.
const pages: SketchbookPage[] = [
  { file: "plates/the-inbox.webp", title: "The inbox never stops", place: "Friday, 4:52pm" },
  { file: "plates/fremantle.webp", title: "Fremantle, Friday arvo", place: "Fremantle" },
];

export function PerthSketchbook() {
  return (
    <section className="perth-sketchbook" aria-label="Perth sketchbook">
      <Sketchbook assetBaseUrl="/sketchbook/" pages={pages} land={1} title="Perth sketchbook" />
    </section>
  );
}
