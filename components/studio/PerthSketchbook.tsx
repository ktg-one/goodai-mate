"use client";

import { Sketchbook, type SketchbookPage } from "@/src/shaders/sketchbook/Sketchbook";

// ThreeUI sketchbook pointing at public/assets/sketches/ (1-sketch through 14-sketch).
const pages: SketchbookPage[] = [
  { file: "1-sketch.jpg", title: "Missing heaps of calls?", place: "" },
  { file: "2-sketch.jpg", title: "On top of your emails and bookings?", place: "" },
  { file: "3-sketch.jpg", title: "Don't forget all that admin too...", place: "" },
  { file: "4-sketch.jpg", title: "Anyone would be swamped... especially today...", place: "" },
  { file: "5-sketch.jpg", title: "So let Goodie smash it out for ya", place: "" },
  { file: "6-sketch.jpg", title: "Git Goodie! those bookings! those dam receipts!", place: "" },
  { file: "7-sketch.png", title: "Too easy... ya little legend!", place: "" },
  { file: "8-sketch.png", title: "admin, emails, bookings, calls, invoices, posting socials, anything digital!", place: "" },
  { file: "9-sketch.png", title: "Knock off early! AI can be pretty sweet when done right", place: "" },
  { file: "10-sketch.png", title: "Cheers! *thinks* the world as we know it is gonna change", place: "" },
  { file: "11-sketch.png", title: "So why not control what we can?", place: "" },
  { file: "12-sketch.png", title: "And have a bit of fun with it. Palm off to Goodie! ", place: "" },
  { file: "13-sketch.png", title: "Because your quality time belongs...", place: "" },
  { file: "14-sketch.png", title: "... with the ones who matter", place: "" },
];

export function PerthSketchbook() {
  return (
    <section className="perth-sketchbook" aria-label="Perth sketchbook">
      <Sketchbook assetBaseUrl="/assets/sketches/" pages={pages} land={14} title="Perth sketchbook" />
    </section>
  );
}
