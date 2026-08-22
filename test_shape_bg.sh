#!/bin/bash
# Check if public/assets/shapes exists
if [ -d "public/assets/shapes" ]; then
  ls -la public/assets/shapes
else
  echo "creating shapes"
  mkdir -p public/assets/shapes
  touch public/assets/shapes/shape-big-1.svg
  touch public/assets/shapes/shape-big-2.svg
  touch public/assets/shapes/shape-big-3.svg
fi
