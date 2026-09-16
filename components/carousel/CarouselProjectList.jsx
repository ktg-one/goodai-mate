import { PROJECTS } from "./ring/projects";

// Pointer events stay on the canvas; the engine controls sizing and selection.
export function CarouselProjectList({ listRef, itemsRef }) {
  return (
      <ul
        ref={listRef}
        aria-label="Projects"
        style={{
          fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
        }}
        className="pointer-events-none absolute right-[12vw] top-[2.4vh] z-10 flex flex-col items-start text-right leading-[1.4] tracking-[0.01em] text-[var(--ink)] opacity-0 max-sm:hidden"
      >
        {PROJECTS.map((p, i) => (
          <li
            key={p.name}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            // No transition, deliberately: the colour turns over the moment
            // the ring passes the halfway point between two slots.
            style={{ opacity: 0.2 }}
          >
            {p.name}
          </li>
        ))}
      </ul>
  );
}
