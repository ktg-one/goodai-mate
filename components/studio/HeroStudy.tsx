// Faint sepia construction study behind the hero: circle-and-square, a golden
// spiral and ruled margins, like a page from an old notebook. Decorative only.

const PHI = (1 + Math.sqrt(5)) / 2;

function goldenSpiral(x: number, y: number, h: number, turns: number) {
  let w = h * PHI;
  let d = "";
  const squares: [number, number, number][] = [];
  for (let i = 0; i < turns; i++) {
    const dir = i % 4;
    if (dir === 0) { // cut the left square
      const s = h; squares.push([x, y, s]);
      d += `${i ? "" : `M${x} ${y + s}`}A${s} ${s} 0 0 1 ${x + s} ${y}`;
      x += s; w -= s;
    } else if (dir === 1) { // top
      const s = w; squares.push([x, y, s]);
      d += `A${s} ${s} 0 0 1 ${x + s} ${y + s}`;
      y += s; h -= s;
    } else if (dir === 2) { // right
      const s = h; squares.push([x + w - s, y, s]);
      d += `A${s} ${s} 0 0 1 ${x + w - s} ${y + s}`;
      w -= s;
    } else { // bottom
      const s = w; squares.push([x, y + h - s, s]);
      d += `A${s} ${s} 0 0 1 ${x} ${y + h - s}`;
      h -= s;
    }
  }
  return { d, squares };
}

const spiral = goldenSpiral(118, 190, 233, 9);
const ticks = Array.from({ length: 31 }, (_, i) => 90 + i * 14);

export function HeroStudy() {
  return (
    <svg className="hero-study" viewBox="0 0 620 620" fill="none" aria-hidden="true">
      <g className="hero-study-guides">
        <circle cx="310" cy="310" r="250" />
        <rect x="90" y="90" width="440" height="440" />
        <path d="M90 90 530 530M530 90 90 530M310 40v540M40 310h540" strokeDasharray="2 7" />
        <circle cx="310" cy="310" r="3" />
        {spiral.squares.map(([sx, sy, s], i) => <rect key={i} x={sx} y={sy} width={s} height={s} />)}
        <path d={ticks.map((t, i) => `M${t} 566v${i % 5 ? 5 : 11}`).join("")} />
        <path d="M90 560h420" />
      </g>
      <path className="hero-study-line" d={spiral.d} />
      <g className="hero-study-notes">
        <text x="532" y="84">a</text>
        <text x="72" y="548">b</text>
        <text x="352" y="198">φ</text>
        <text x="96" y="604">1 : 1.618</text>
      </g>
    </svg>
  );
}
