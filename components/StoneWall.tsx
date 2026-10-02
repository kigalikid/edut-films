// Jerusalem limestone as it is today: worn. Not smooth cushions, but stone that has been
// knocked, rained on and rubbed for centuries. So each block here has an irregular
// outline with broken corners, the surface is pitted and uneven, some stones are cracked,
// and the joints have opened and gone dark. A lighting filter turns that into real relief
// instead of drawn-on gradients.
// Generated once on the server from a fixed seed, so it never shifts between renders.
const W = 2600;
const ROW = 104;
const ROWS = 10;
const H = ROW * ROWS;

const TONES = ["#e9dfcc", "#e3d8c3", "#ece4d3", "#dfd2bc", "#e6dac6", "#e1d6c4", "#dcd0bb"];
const BLUSH = "#e2cfbf"; // the occasional pink stone (mizzi ahmar)

function prng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Pt = [number, number];

// A closed, softly rounded outline through a ring of points (curve through the midpoints).
function smooth(pts: Pt[]) {
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const f = (p: Pt) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M${f(mid(pts[0], pts[1]))}`;
  for (let i = 1; i <= pts.length; i++) {
    const p = pts[i % pts.length];
    const q = pts[(i + 1) % pts.length];
    d += ` Q${f(p)} ${f(mid(p, q))}`;
  }
  return d + "Z";
}

// The outline of one stone: edges that wander, corners knocked off by different amounts.
function outline(w: number, h: number, rand: () => number): Pt[] {
  const corner = () => (rand() < 0.22 ? 16 + rand() * 20 : 4 + rand() * 9);
  const [c0, c1, c2, c3] = [corner(), corner(), corner(), corner()];
  const j = (amt: number) => (rand() - 0.5) * amt;
  const pts: Pt[] = [];
  const step = 38;
  for (let x = c0; x < w - c1; x += step + rand() * 22) pts.push([x, j(4.5) + 1]);
  pts.push([w - c1, j(3)]);
  for (let y = c1; y < h - c2; y += step + rand() * 22) pts.push([w - 1 + j(4.5), y]);
  pts.push([w + j(3), h - c2]);
  for (let x = w - c2; x > c3; x -= step + rand() * 22) pts.push([x, h - 1 + j(5)]);
  pts.push([c3, h + j(3)]);
  for (let y = h - c3; y > c0; y -= step + rand() * 22) pts.push([1 + j(4.5), y]);
  pts.push([j(3), c0]);
  return pts;
}

// A hairline crack wandering in from one edge.
function crack(w: number, h: number, rand: () => number) {
  let x = w * (0.2 + rand() * 0.6);
  let y = rand() < 0.5 ? 2 : h - 2;
  const dir = y < h / 2 ? 1 : -1;
  const len = h * (0.35 + rand() * 0.6);
  let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
  for (let t = 0; t < len; t += 9 + rand() * 9) {
    x += (rand() - 0.5) * 16;
    y += dir * (9 + rand() * 9);
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export default function StoneWall() {
  const rand = prng(1187);
  const blocks: { x: number; y: number; d: string; tone: string; crack?: string }[] = [];

  for (let row = 0; row < ROWS; row++) {
    let x = -Math.floor(rand() * 180);
    while (x < W) {
      const w = 140 + Math.floor(rand() * 230);
      const gap = 3 + rand() * 4.5; // joints opened unevenly
      const sag = rand() * 5; // courses no longer level
      const bw = w - gap;
      const bh = ROW - gap - sag - rand() * 4;
      blocks.push({
        x: x + gap / 2,
        y: row * ROW + gap / 2 + sag,
        d: smooth(outline(bw, bh, rand)),
        tone: rand() < 0.08 ? BLUSH : TONES[Math.floor(rand() * TONES.length)],
        crack: rand() < 0.14 ? crack(bw, bh, rand) : undefined,
      });
      x += w;
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <defs>
        <filter id="sw-worn" x="0" y="0" width={W} height={H} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          {/* ragged edges: nothing here was cut yesterday */}
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="4" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="8" xChannelSelector="R" yChannelSelector="G" result="stone" />
          {/* height map: edges rolled over by wear, plus an uneven, dished surface */}
          <feGaussianBlur in="stone" stdDeviation="3.4" result="soft" />
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.016" numOctaves="5" seed="11" result="rough" />
          <feComposite in="soft" in2="rough" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" result="height" />
          <feDiffuseLighting in="height" surfaceScale="5.5" diffuseConstant="1.16" lightingColor="#fffaf0" result="lit">
            <feDistantLight azimuth="235" elevation="52" />
          </feDiffuseLighting>
          <feComposite in="stone" in2="lit" operator="arithmetic" k1="1.08" k2="0" k3="0" k4="0" result="shaded" />
          {/* polish: the faint shine of stone rubbed smooth */}
          <feSpecularLighting in="height" surfaceScale="5.5" specularConstant="0.42" specularExponent="14" lightingColor="#fffdf6" result="shine">
            <feDistantLight azimuth="235" elevation="52" />
          </feSpecularLighting>
          <feComposite in="shine" in2="stone" operator="in" result="shineIn" />
          {/* pitting: the small holes limestone gets as it weathers */}
          <feTurbulence type="fractalNoise" baseFrequency="0.11 0.16" numOctaves="4" seed="23" result="speck" />
          <feColorMatrix in="speck" values="0 0 0 0 0.34  0 0 0 0 0.27  0 0 0 0 0.19  0 0 0 7 -4.75" result="pits" />
          <feComposite in="pits" in2="stone" operator="in" result="pitsIn" />
          <feMerge>
            <feMergeNode in="shaded" />
            <feMergeNode in="shineIn" />
            <feMergeNode in="pitsIn" />
          </feMerge>
        </filter>
      </defs>

      {/* The joints: deep and dark with age */}
      <rect width={W} height={H} fill="#ab9b80" />

      <g filter="url(#sw-worn)">
        {blocks.map((b, i) => (
          <g key={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`}>
            <path d={b.d} fill={b.tone} />
            {b.crack && <path d={b.crack} fill="none" stroke="#6f5d45" strokeOpacity="0.55" strokeWidth="1.3" strokeLinejoin="round" />}
          </g>
        ))}
      </g>
    </svg>
  );
}
