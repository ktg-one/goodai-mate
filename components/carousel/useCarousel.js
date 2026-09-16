"use client";

import { useEffect, useRef } from "react";
import { createCarousel } from "./ring/createCarousel";

export function useCarousel(hero = false) {
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const itemsRef = useRef([]);
  const loaderRef = useRef(null);
  const liveRef = useRef(null);
  const cutRef = useRef(null);
  // Per side: the box that positions the lockup, the filtered wrapper the goo
  // happens inside, the two rows that melt within it, and one more row outside
  // for words carrying over unchanged. See ring/meta.js.
  const metaRef = useRef({
    left: { box: null, goo: null, layers: [], plain: null },
    right: { box: null, goo: null, layers: [], plain: null },
  });

  useEffect(
    () => createCarousel({
      containerRef, listRef, itemsRef, loaderRef, liveRef, cutRef, metaRef,
    }, hero),
    [containerRef, listRef, itemsRef, loaderRef, liveRef, cutRef, metaRef, hero],
  );

  return { containerRef, listRef, itemsRef, loaderRef, liveRef, cutRef, metaRef };
}
