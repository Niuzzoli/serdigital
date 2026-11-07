import { cn } from "@/lib/cn";

// Ilustración de la 404: la misma red de nodos del inicio, con un nodo naranja suelto.
// Una línea punteada sale de la red hacia él y no llega. SVG fijo (sin JavaScript);
// el pulso y el flujo de la línea son animaciones CSS (.nf-* en app/globals.css)
// y se apagan con "reducir movimiento".

const NODES: [number, number, number][] = [
  // x, y, radio
  [70, 96, 4],
  [158, 58, 4.5],
  [128, 168, 5],
  [236, 120, 6],
  [206, 236, 4.5],
  [304, 196, 5],
  [84, 268, 4],
  [276, 306, 4],
  [40, 186, 3.5],
];

const LINKS: [number, number][] = [
  [0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5],
  [2, 6], [6, 4], [4, 7], [5, 7], [0, 8], [8, 2], [8, 6],
];

// Nodo suelto y hasta dónde llega la línea que lo busca
const STRAY = { x: 424, y: 104 };
const REACH = { x: 390, y: 127 };

export default function DisconnectedNode({ className }: { className?: string }) {
  const hub = NODES[5];
  return (
    <svg viewBox="0 0 480 360" fill="none" aria-hidden className={cn("h-auto w-full overflow-visible", className)}>
      <g style={{ stroke: "var(--node)" }} strokeWidth={1} strokeOpacity={0.4}>
        {LINKS.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
        ))}
      </g>
      <g style={{ fill: "var(--node)" }}>
        {NODES.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fillOpacity={0.85} />
        ))}
      </g>

      {/* La conexión que no llega */}
      <line
        className="nf-reach"
        x1={hub[0]}
        y1={hub[1]}
        x2={REACH.x}
        y2={REACH.y}
        style={{ stroke: "var(--accent)" }}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray="2 7"
      />

      {/* Nodo suelto: se mueve apenas y emite un pulso */}
      <g className="nf-stray">
        <circle className="nf-pulse" cx={STRAY.x} cy={STRAY.y} r={9} style={{ stroke: "var(--accent)" }} strokeWidth={1.5} />
        <circle cx={STRAY.x} cy={STRAY.y} r={9} style={{ fill: "var(--accent)" }} />
        <text
          x={STRAY.x}
          y={STRAY.y + 38}
          textAnchor="middle"
          className="font-mono"
          style={{ fill: "var(--accent-text)" }}
          fontSize={15}
          letterSpacing={1}
        >
          404
        </text>
      </g>
    </svg>
  );
}
