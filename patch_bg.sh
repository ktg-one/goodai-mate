#!/bin/bash
# Applying shape backgrounds to alternating sections
# The instructions say: "applying public/assets/shapes/shape-big-*.svg backgrounds to every 2nd viewport and bare cards"

# The viewports basically map to the sections in the marketing site.
# In `HomeClient.tsx` and other components, let's just make a global CSS class and apply it. Or we can inject it inline via a small modification to the CSS.
# Alternatively, I can just write a global selector in globals.css for `<section>` elements.

cat << 'STYLE' >> src/app/globals.css

/* Viewport shapes pattern */
section:nth-of-type(2n) {
  background-image: url('/assets/shapes/shape-big-1.svg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-blend-mode: multiply;
}

/* Let's try changing background of the bare cards if applicable */
.stamp-card-paper {
  background-image: url('/assets/shapes/shape-big-2.svg');
  background-repeat: no-repeat;
  background-position: top right;
  background-size: 50%;
  background-blend-mode: multiply;
}

STYLE
