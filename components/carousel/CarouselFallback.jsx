import { PROJECTS } from "./ring/projects";

export function CarouselFallback() {
  return (
      <ol className="hidden h-full content-center gap-4 px-6 py-16 motion-reduce:grid md:grid-cols-2">
        {PROJECTS.map((project) => (
          <li
            key={project.name}
            className="border-2 border-[var(--ink)] bg-[var(--paper)] p-6 shadow-[4px_4px_0_var(--ink)]"
          >
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--red)]">
              {project.type}
            </span>
            <h2 className="mt-2 font-sans text-3xl text-[var(--ink)]">
              {project.name}
            </h2>
          </li>
        ))}
      </ol>
  );
}
