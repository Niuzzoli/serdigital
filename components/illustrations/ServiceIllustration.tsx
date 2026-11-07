"use client";

import {
  ChatsCircleIcon,
  FlagIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  TruckIcon,
  UsersThreeIcon,
  WrenchIcon,
} from "@phosphor-icons/react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

// Ilustraciones de los servicios, dibujadas en SVG con los tokens del sitio
// (se adaptan solas a modo claro y oscuro). Son decorativas: aria-hidden.
// Se animan una sola vez al entrar en pantalla; con "reducir movimiento" aparecen ya armadas.
//
//   consultoria → mapa de proceso: pasos desordenados que se ordenan en un flujo
//   desarrollo  → datos de varias áreas que llegan a un mismo tablero
//   seguridad   → grilla de accesos donde un acceso indebido queda bloqueado

export const C = {
  surface: "var(--surface)",
  surface2: "var(--surface-2)",
  line: "var(--line-strong)",
  blue: "var(--blue)",
  accent: "var(--accent)",
  ink: "var(--accent-ink)",
  muted: "var(--muted)",
  text: "var(--text)",
};

export const mono: CSSProperties = { fontFamily: "var(--font-mono)" };
// Para que rotar / escalar un elemento SVG use su propio centro
export const ownBox: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" };

export const ease = { ease: EASE };

export default function ServiceIllustration({ slug, className }: { slug: string; className?: string }) {
  const Art = slug === "consultoria" ? ProcessMap : slug === "desarrollo" ? DataHub : slug === "seguridad" ? AccessGrid : null;
  if (!Art) return null;
  return (
    <div aria-hidden className={cn("w-full", className)}>
      <Art />
    </div>
  );
}

/** Contenedor común: dispara la animación una vez al entrar en pantalla */
export function Frame({ children, viewBox }: { children: React.ReactNode; viewBox: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox={viewBox}
      className="h-auto w-full overflow-visible"
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
    >
      {children}
    </motion.svg>
  );
}

/* ---------------------------------------------------------------- consultoría */

const STEPS = [
  { x: 8, scatter: { x: -4, y: -46, rotate: -14 } },
  { x: 70, scatter: { x: 14, y: 40, rotate: 10 } },
  { x: 132, scatter: { x: -10, y: -34, rotate: 16 } },
  { x: 194, scatter: { x: 16, y: 48, rotate: -11 } },
  { x: 256, scatter: { x: 6, y: -42, rotate: 9 } },
];
const STEP_Y = 76;
const STEP_W = 52;
const STEP_H = 30;

function ProcessMap() {
  // Caja recortada al flujo final; los pasos desordenados arrancan fuera de ella (overflow visible)
  return (
    <Frame viewBox="0 44 316 104">
      {/* Conectores: se dibujan cuando los pasos ya se ordenaron */}
      {STEPS.slice(0, -1).map((s, i) => (
        <motion.path
          key={`c${i}`}
          d={`M${s.x + STEP_W + 2} ${STEP_Y + STEP_H / 2} H${STEPS[i + 1].x - 2}`}
          stroke={C.blue}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: { pathLength: 1, opacity: 1, transition: { duration: 0.35, delay: 0.75 + i * 0.1, ...ease } },
          }}
        />
      ))}

      {STEPS.map((s, i) => {
        const last = i === STEPS.length - 1;
        const v: Variants = {
          hidden: { x: s.scatter.x, y: s.scatter.y, rotate: s.scatter.rotate, opacity: 0.55 },
          shown: { x: 0, y: 0, rotate: 0, opacity: 1, transition: { duration: 0.7, delay: i * 0.05, ...ease } },
        };
        return (
          <motion.g key={i} variants={v} style={ownBox}>
            <rect
              x={s.x}
              y={STEP_Y}
              width={STEP_W}
              height={STEP_H}
              rx={8}
              fill={last ? C.accent : C.surface}
              stroke={last ? C.accent : C.line}
              strokeWidth={1.5}
            />
            {last ? (
              <path
                d={`M${s.x + 18} ${STEP_Y + 15.5} l5 5 l11 -11`}
                stroke={C.ink}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ) : (
              <>
                <rect x={s.x + 9} y={STEP_Y + 9} width={STEP_W - 18} height={4} rx={2} fill={C.blue} opacity={0.75} />
                <rect x={s.x + 9} y={STEP_Y + 17} width={STEP_W - 28} height={4} rx={2} fill={C.muted} opacity={0.45} />
              </>
            )}
          </motion.g>
        );
      })}

      {/* Rótulos: aparecen al final */}
      <motion.g
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: 1.1, duration: 0.4 } } }}
        style={mono}
        fontSize={11}
        fill={C.muted}
      >
        <text x={8} y={STEP_Y + STEP_H + 26}>Relevamiento</text>
        <text x={308} y={STEP_Y + STEP_H + 26} textAnchor="end">
          Proceso digital
        </text>
      </motion.g>
    </Frame>
  );
}

/* ---------------------------------------------------------------- desarrollo */

const SOURCES = [
  { label: "Taller", y: 22 },
  { label: "RRHH", y: 76 },
  { label: "Logística", y: 130 },
];
const BARS = [38, 62, 50, 82, 70];
// Ancho de las pills de origen: entra "Logística" (la palabra más larga) con aire a los lados
const PILL_W = 98;

function DataHub() {
  const hub = { x: 176, y: 14, w: 132, h: 154 };
  const base = hub.y + hub.h - 16;
  return (
    <Frame viewBox="0 0 316 182">
      {/* Líneas de datos de cada área al tablero */}
      {SOURCES.map((s, i) => (
        <motion.path
          key={s.label}
          d={`M${PILL_W + 6} ${s.y + 15} C136 ${s.y + 15}, 138 ${hub.y + 50 + i * 30}, ${hub.x} ${hub.y + 50 + i * 30}`}
          stroke={C.blue}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            shown: { pathLength: 1, opacity: 0.85, transition: { duration: 0.6, delay: 0.2 + i * 0.12, ...ease } },
          }}
        />
      ))}

      {/* Áreas de origen */}
      {SOURCES.map((s, i) => (
        <motion.g
          key={`s${s.label}`}
          variants={{
            hidden: { x: -12, opacity: 0 },
            shown: { x: 0, opacity: 1, transition: { duration: 0.5, delay: i * 0.08, ...ease } },
          }}
        >
          <rect x={6} y={s.y} width={PILL_W} height={30} rx={15} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
          <circle cx={21} cy={s.y + 15} r={4} fill={C.blue} />
          <text x={30} y={s.y + 19} fontSize={11} fill={C.text} style={mono}>
            {s.label}
          </text>
        </motion.g>
      ))}

      {/* Tablero */}
      <motion.g
        variants={{
          hidden: { opacity: 0, scale: 0.96 },
          shown: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.15, ...ease } },
        }}
        style={ownBox}
      >
        <rect x={hub.x} y={hub.y} width={hub.w} height={hub.h} rx={12} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
        <rect x={hub.x + 14} y={hub.y + 14} width={46} height={5} rx={2.5} fill={C.text} opacity={0.7} />
        <rect x={hub.x + 14} y={hub.y + 24} width={30} height={4} rx={2} fill={C.muted} opacity={0.5} />
        <line x1={hub.x + 14} x2={hub.x + hub.w - 14} y1={base} y2={base} stroke={C.line} strokeWidth={1} />
      </motion.g>

      {/* Barras del tablero (sin números: es ilustrativo) */}
      {BARS.map((h, i) => (
        <motion.rect
          key={i}
          x={hub.x + 18 + i * 21}
          y={base - h}
          width={13}
          height={h}
          rx={3}
          fill={i === BARS.length - 2 ? C.accent : C.blue}
          opacity={i === BARS.length - 2 ? 1 : 0.8}
          style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
          variants={{
            hidden: { scaleY: 0 },
            shown: { scaleY: 1, transition: { duration: 0.6, delay: 0.75 + i * 0.07, ...ease } },
          }}
        />
      ))}
    </Frame>
  );
}

/* ---------------------------------------------------------------- seguridad */

const COLS = [
  { label: "Legajos", x: 156 },
  { label: "Facturas", x: 220 },
  { label: "Servidor", x: 284 },
];
const ROWS = [54, 88, 122, 156];
// 1 = acceso permitido, 0 = sin acceso. La celda bloqueada es [1][2].
const ACCESS = [
  [1, 1, 0],
  [1, 0, 0],
  [1, 1, 1],
  [0, 0, 1],
];
const BLOCKED = { row: 1, col: 2 };

function AccessGrid() {
  return (
    <Frame viewBox="0 0 316 182">
      {/* Columnas: recursos */}
      <motion.g
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.4 } } }}
        fontSize={10.5}
        fill={C.muted}
        style={mono}
        textAnchor="middle"
      >
        {COLS.map((c) => (
          <text key={c.label} x={c.x} y={22}>
            {c.label}
          </text>
        ))}
      </motion.g>

      {/* Filas: usuarios */}
      {ROWS.map((y, r) => (
        <motion.g
          key={`u${y}`}
          variants={{
            hidden: { x: -10, opacity: 0 },
            shown: { x: 0, opacity: 1, transition: { duration: 0.45, delay: 0.1 + r * 0.07, ...ease } },
          }}
        >
          <line x1={8} x2={308} y1={y + 17} y2={y + 17} stroke={C.line} strokeWidth={1} opacity={0.6} />
          <circle cx={20} cy={y} r={10} fill={C.surface2} stroke={C.line} strokeWidth={1.5} />
          <circle cx={20} cy={y - 3} r={3.5} fill={C.muted} opacity={0.7} />
          <path d={`M13.5 ${y + 6.5} a6.5 5 0 0 1 13 0`} fill={C.muted} opacity={0.7} />
          <rect x={38} y={y - 5} width={58} height={5} rx={2.5} fill={C.text} opacity={0.6} />
          <rect x={38} y={y + 3} width={36} height={4} rx={2} fill={C.muted} opacity={0.45} />
        </motion.g>
      ))}

      {/* Celdas de acceso */}
      {ROWS.map((y, r) =>
        COLS.map((c, ci) => {
          const blocked = r === BLOCKED.row && ci === BLOCKED.col;
          if (blocked) return null;
          const on = ACCESS[r][ci] === 1;
          return (
            <motion.circle
              key={`${r}-${ci}`}
              cx={c.x}
              cy={y}
              r={7}
              fill={on ? C.blue : "transparent"}
              stroke={on ? C.blue : C.line}
              strokeWidth={1.5}
              style={ownBox}
              variants={{
                hidden: { scale: 0.4, opacity: 0 },
                shown: { scale: 1, opacity: 1, transition: { duration: 0.4, delay: 0.35 + (r * 3 + ci) * 0.035, ...ease } },
              }}
            />
          );
        }),
      )}

      {/* Intento de acceso indebido: pulso y candado */}
      <motion.circle
        cx={COLS[BLOCKED.col].x}
        cy={ROWS[BLOCKED.row]}
        r={14}
        fill="none"
        stroke={C.accent}
        strokeWidth={1.5}
        style={ownBox}
        variants={{
          hidden: { scale: 0.5, opacity: 0 },
          shown: { scale: [0.5, 1.25, 1], opacity: [0, 1, 0.9], transition: { duration: 0.7, delay: 1.0, ...ease } },
        }}
      />
      <motion.g
        style={ownBox}
        variants={{
          hidden: { scale: 0.6, opacity: 0 },
          shown: { scale: 1, opacity: 1, transition: { duration: 0.45, delay: 1.1, ...ease } },
        }}
      >
        <rect
          x={COLS[BLOCKED.col].x - 8}
          y={ROWS[BLOCKED.row] - 3}
          width={16}
          height={12}
          rx={3}
          fill={C.accent}
        />
        <path
          d={`M${COLS[BLOCKED.col].x - 4.5} ${ROWS[BLOCKED.row] - 3} v-3 a4.5 4.5 0 0 1 9 0 v3`}
          stroke={C.accent}
          strokeWidth={2}
          fill="none"
        />
        <circle cx={COLS[BLOCKED.col].x} cy={ROWS[BLOCKED.row] + 3} r={1.6} fill={C.ink} />
      </motion.g>
    </Frame>
  );
}

/* ---------------------------------------------------------------- casos */

// Ilustración de un caso. El caso Audire usa su panel (AudireMockup); Tortoriello, el mapa de operación.
export function CaseIllustration({ slug, className }: { slug: string; className?: string }) {
  if (slug !== "transporte-tortoriello") return null;
  return (
    <div aria-hidden className={cn("w-full", className)}>
      <OperationsMap />
    </div>
  );
}

const HUB = { x: 112, y: 76, w: 92, h: 48 };
const AREAS = [
  { label: "Logística", cx: 40, cy: 38, Icon: TruckIcon, labelY: 76 },
  { label: "Taller", cx: 276, cy: 38, Icon: WrenchIcon, labelY: 76 },
  { label: "Pañol", cx: 40, cy: 162, Icon: PackageIcon, labelY: 198 },
  { label: "RRHH", cx: 276, cy: 162, Icon: UsersThreeIcon, labelY: 198 },
];

// Logística, taller, pañol y RRHH conectados a una misma base de datos
function OperationsMap() {
  const hubCx = HUB.x + HUB.w / 2;
  const hubCy = HUB.y + HUB.h / 2;
  return (
    <Frame viewBox="0 0 316 204">
      {AREAS.map((a, i) => {
        const endX = a.cx < hubCx ? HUB.x : HUB.x + HUB.w;
        const endY = a.cy < hubCy ? HUB.y + 10 : HUB.y + HUB.h - 10;
        const startX = a.cx < hubCx ? a.cx + 22 : a.cx - 22;
        return (
          <g key={`l${a.label}`}>
            <motion.path
              d={`M${startX} ${a.cy} C${(startX + endX) / 2} ${a.cy}, ${(startX + endX) / 2} ${endY}, ${endX} ${endY}`}
              stroke={C.blue}
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                shown: { pathLength: 1, opacity: 0.85, transition: { duration: 0.6, delay: 0.3 + i * 0.1, ...ease } },
              }}
            />
            {/* Un dato que viaja una vez del área a la base */}
            <motion.circle
              r={3.5}
              fill={C.accent}
              variants={{
                hidden: { cx: startX, cy: a.cy, opacity: 0 },
                shown: {
                  cx: [startX, endX],
                  cy: [a.cy, endY],
                  opacity: [0, 1, 0],
                  transition: { duration: 0.8, delay: 0.9 + i * 0.12, ease: "easeInOut" },
                },
              }}
            />
          </g>
        );
      })}

      {/* Base de datos compartida */}
      <motion.g
        style={ownBox}
        variants={{
          hidden: { scale: 0.9, opacity: 0 },
          shown: { scale: 1, opacity: 1, transition: { duration: 0.5, delay: 0.15, ...ease } },
        }}
      >
        <rect x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx={12} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
        <text x={hubCx} y={HUB.y + 21} textAnchor="middle" fontSize={10.5} fill={C.text} style={mono}>
          Datos
        </text>
        <text x={hubCx} y={HUB.y + 35} textAnchor="middle" fontSize={10.5} fill={C.muted} style={mono}>
          compartidos
        </text>
      </motion.g>
      {/* Cuando llegan los datos, la base se marca en naranja */}
      <motion.rect
        x={HUB.x}
        y={HUB.y}
        width={HUB.w}
        height={HUB.h}
        rx={12}
        fill="none"
        stroke={C.accent}
        strokeWidth={2}
        variants={{
          hidden: { opacity: 0 },
          shown: { opacity: 1, transition: { duration: 0.4, delay: 1.6 } },
        }}
      />

      {/* Áreas */}
      {AREAS.map(({ label, cx, cy, Icon, labelY }, i) => (
        <motion.g
          key={label}
          style={ownBox}
          variants={{
            hidden: { scale: 0.7, opacity: 0 },
            shown: { scale: 1, opacity: 1, transition: { duration: 0.45, delay: i * 0.08, ...ease } },
          }}
        >
          <circle cx={cx} cy={cy} r={21} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
          <g style={{ color: "var(--blue)" }}>
            <Icon x={cx - 10} y={cy - 10} size={20} weight="bold" />
          </g>
          <text x={cx} y={labelY} textAnchor="middle" fontSize={10.5} fill={C.muted} style={mono}>
            {label}
          </text>
        </motion.g>
      ))}
    </Frame>
  );
}

/* ---------------------------------------------------------------- cierre / contacto */

// Primer paso de trabajo con un cliente: charla → diagnóstico → plan por etapas
export function NextStepsIllustration({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("w-full", className)}>
      <NextSteps />
    </div>
  );
}

const NEXT = [
  { label: "Primera charla", x: 48, y: 150, Icon: ChatsCircleIcon },
  { label: "Diagnóstico", x: 158, y: 92, Icon: MagnifyingGlassIcon },
  { label: "Plan por etapas", x: 266, y: 34, Icon: FlagIcon },
];

function NextSteps() {
  return (
    <Frame viewBox="0 0 316 196">
      {/* Camino punteado que sube de paso en paso */}
      <motion.path
        d={`M${NEXT[0].x} ${NEXT[0].y} C${NEXT[0].x + 70} ${NEXT[0].y}, ${NEXT[1].x - 70} ${NEXT[1].y}, ${NEXT[1].x} ${NEXT[1].y} S${NEXT[2].x - 70} ${NEXT[2].y}, ${NEXT[2].x} ${NEXT[2].y}`}
        stroke={C.blue}
        strokeWidth={2}
        strokeDasharray="2 7"
        strokeLinecap="round"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          shown: { pathLength: 1, opacity: 0.9, transition: { duration: 1.1, delay: 0.2, ease: "easeInOut" } },
        }}
      />
      {NEXT.map(({ label, x, y, Icon }, i) => {
        const last = i === NEXT.length - 1;
        return (
          <motion.g
            key={label}
            style={ownBox}
            variants={{
              hidden: { scale: 0.7, opacity: 0 },
              shown: { scale: 1, opacity: 1, transition: { duration: 0.45, delay: 0.25 + i * 0.35, ...ease } },
            }}
          >
            <circle
              cx={x}
              cy={y}
              r={22}
              fill={last ? C.accent : C.surface}
              stroke={last ? C.accent : C.line}
              strokeWidth={1.5}
            />
            <g style={{ color: last ? "var(--accent-ink)" : "var(--blue)" }}>
              <Icon x={x - 10} y={y - 10} size={20} weight="bold" />
            </g>
            <text
              x={x}
              y={y + 40}
              textAnchor="middle"
              fontSize={10.5}
              fill={last ? C.text : C.muted}
              style={mono}
            >
              {label}
            </text>
          </motion.g>
        );
      })}
    </Frame>
  );
}
