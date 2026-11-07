// Simulación de la red de nodos del hero (sin DOM, se puede testear).
// Los nodos flotan despacio; los que quedan cerca del cursor se "encienden" (heat)
// y se acomodan hacia una grilla: procesos que se conectan y se ordenan.

export type Node = { x: number; y: number; vx: number; vy: number; heat: number };

type CreateOpts = {
  /** "right": solo en el 62 % derecho (deja el texto limpio) */
  region: "right" | "full";
  /** px² de lienzo por nodo */
  density: number;
  max: number;
  rand?: () => number;
};

type StepOpts = { radius: number; grid: number; pull: number };

const SPEED = 0.25;

export function createNodes(w: number, h: number, opts: CreateOpts): Node[] {
  const rand = opts.rand ?? Math.random;
  const count = Math.min(opts.max, Math.round((w * h) / opts.density));
  const x0 = opts.region === "right" ? w * 0.38 : 0;
  const nodes: Node[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: x0 + rand() * (w - x0),
      y: rand() * h,
      vx: (rand() - 0.5) * SPEED,
      vy: (rand() - 0.5) * SPEED,
      heat: 0,
    });
  }
  return nodes;
}

export function stepNodes(
  nodes: Node[],
  w: number,
  h: number,
  pointer: { x: number; y: number } | null,
  opts: StepOpts,
): void {
  for (const p of nodes) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > w) {
      p.vx *= -1;
      p.x = Math.max(0, Math.min(w, p.x));
    }
    if (p.y < 0 || p.y > h) {
      p.vy *= -1;
      p.y = Math.max(0, Math.min(h, p.y));
    }

    if (!pointer) {
      p.heat *= 0.92;
      continue;
    }
    const d = Math.hypot(pointer.x - p.x, pointer.y - p.y);
    const near = d < opts.radius ? 1 - d / opts.radius : 0;
    p.heat = near;
    if (near > 0) {
      const gx = Math.round(p.x / opts.grid) * opts.grid;
      const gy = Math.round(p.y / opts.grid) * opts.grid;
      p.x += (gx - p.x) * opts.pull * near;
      p.y += (gy - p.y) * opts.pull * near;
    }
  }
}

export function forEachLink(
  nodes: Node[],
  maxDist: number,
  cb: (a: Node, b: Node, t: number) => void,
): void {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < maxDist) cb(a, b, 1 - d / maxDist);
    }
  }
}
