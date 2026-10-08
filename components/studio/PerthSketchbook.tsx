"use client";

import { Sketchbook, type SketchbookPage } from "@/src/shaders/sketchbook/Sketchbook";

// ThreeUI sketchbook pointing at public/assets/sketches/ (1-sketch through 14-sketch).
const pages: SketchbookPage[] = [
  { file: "1-sketch.webp", title: "Missing heaps of calls?", place: "" },
  { file: "2-sketch.webp", title: "On top of your emails and bookings?", place: "" },
  { file: "3-sketch.webp", title: "Don't forget all that admin too...", place: "" },
  { file: "4-sketch.webp", title: "Anyone would be swamped... especially today...", place: "" },
  { file: "5-sketch.webp", title: "So let Goodie smash it out for ya", place: "" },
  { file: "6-sketch.webp", title: "Git Goodie! those bookings! those dam receipts!", place: "" },
  { file: "7-sketch.webp", title: "Too easy... ya little legend!", place: "" },
  { file: "8-sketch.webp", title: "admin, emails, bookings, calls, invoices, posting socials, anything digital!", place: "" },
  { file: "9-sketch.webp", title: "Knock off early!", place: "" },
  { file: "10-sketch.webp", title: "Cheers! AI can be pretty sweet when done right!", place: "" },
  { file: "11-sketch.webp", title: "If AI's gonna take over, it's gonna happen on our terms", place: "" },
  { file: "12-sketch.webp", title: "So let's have a bit of fun with it... ", place: "" },
  { file: "13-sketch.webp", title: "Palm off as much as you can. Back to work Goodie!...", place: "" },
  { file: "14-sketch.webp", title: "Because quality time is really all that matters", place: "" },
];

export function PerthSketchbook() {
  return (
    <section className="perth-sketchbook" aria-label="Perth sketchbook">
      <Sketchbook assetBaseUrl="/assets/sketches/" pages={pages} land={14} title="Perth sketchbook" />
    </section>
  );
}
