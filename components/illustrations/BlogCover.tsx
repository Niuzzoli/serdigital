"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/cn";
import { C, ease, Frame, mono, ownBox } from "./ServiceIllustration";

// Portadas ilustradas de las notas del blog, en el mismo estilo que las de servicios.
// Una por nota (por slug). Si una nota nueva no tiene portada, no se muestra nada.
//
//   ahorra-ya-con-odoo                          → módulos que se encastran en una plataforma + sello ARCA
//   costos-ocultos-de-operar-un-negocio-con-excel → archivos "final_v2" sueltos que pasan a un solo sistema
//   factura-homologada                          → factura que se arma y recibe el sello CAE
//   zoho-creator                                → bloques de una paleta que arman una aplicación

const COVERS: Record<string, () => React.ReactElement> = {
  "ahorra-ya-con-odoo": OdooModules,
  "costos-ocultos-de-operar-un-negocio-con-excel": ExcelToSystem,
  "factura-homologada": InvoiceStamp,
  "zoho-creator": LowCodeBuilder,
};

export default function BlogCover({ slug, className }: { slug: string; className?: string }) {
  const Art = COVERS[slug];
  if (!Art) return null;
  return (
    <div aria-hidden className={cn("w-full", className)}>
      <Art />
    </div>
  );
}

const VB = "0 0 360 180";
const fade = (delay: number): Variants => ({
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.4, delay } },
});
const pop = (delay: number): Variants => ({
  hidden: { scale: 0.6, opacity: 0 },
  shown: { scale: 1, opacity: 1, transition: { duration: 0.45, delay, ...ease } },
});
const draw = (delay: number, duration = 0.5): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  shown: { pathLength: 1, opacity: 1, transition: { duration, delay, ...ease } },
});

/* ------------------------------------------------------------------ Odoo */

const MODULES = [
  { label: "Contable", col: 0, row: 0, from: { x: -40, y: -30, rotate: -12 } },
  { label: "Ventas", col: 1, row: 0, from: { x: 10, y: -46, rotate: 9 } },
  { label: "Stock", col: 2, row: 0, from: { x: 44, y: -26, rotate: 14 } },
  { label: "Compras", col: 0, row: 1, from: { x: -46, y: 34, rotate: 10 } },
  { label: "RRHH", col: 1, row: 1, from: { x: -6, y: 48, rotate: -10 } },
  { label: "CRM", col: 2, row: 1, from: { x: 40, y: 32, rotate: -14 } },
];

function OdooModules() {
  // Fichas de 66 px: "Contable" (la palabra más larga) entra con aire a los dos lados
  const frame = { x: 22, y: 22, w: 238, h: 136 };
  return (
    <Frame viewBox={VB}>
      {/* La plataforma: un solo sistema */}
      <motion.rect
        x={frame.x}
        y={frame.y}
        width={frame.w}
        height={frame.h}
        rx={16}
        fill={C.surface2}
        stroke={C.line}
        strokeWidth={1.5}
        strokeDasharray="4 5"
        variants={fade(0)}
      />
      {MODULES.map((m, i) => {
        const x = frame.x + 14 + m.col * 72;
        const y = frame.y + 14 + m.row * 58;
        return (
          <motion.g
            key={m.label}
            style={ownBox}
            variants={{
              hidden: { ...m.from, opacity: 0.5 },
              shown: { x: 0, y: 0, rotate: 0, opacity: 1, transition: { duration: 0.7, delay: 0.1 + i * 0.06, ...ease } },
            }}
          >
            <rect x={x} y={y} width={66} height={50} rx={10} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
            <rect x={x + 23} y={y + 11} width={20} height={5} rx={2.5} fill={C.blue} />
            <text x={x + 33} y={y + 37} textAnchor="middle" fontSize={9.5} fill={C.text} style={mono}>
              {m.label}
            </text>
          </motion.g>
        );
      })}
      {/* Conexión con ARCA y sello de cumplimiento */}
      <motion.path
        d={`M${frame.x + frame.w + 2} 90 H272`}
        stroke={C.blue}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        variants={draw(0.9, 0.35)}
      />
      <motion.g style={ownBox} variants={pop(1.15)}>
        <rect x={274} y={64} width={72} height={52} rx={12} fill={C.accent} />
        <text x={310} y={87} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} style={mono}>
          ARCA
        </text>
        <path d="M300 99 l6 6 l12 -12" stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </motion.g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ Excel */

const FILES = [
  { name: "archivo_final.xlsx", y: 36, rotate: -6, dx: -4 },
  { name: "archivo_final_v2.xlsx", y: 74, rotate: 4, dx: 6, error: true },
  { name: "definitivo_nuevo.xlsx", y: 112, rotate: -3, dx: 0 },
];

function ExcelToSystem() {
  const panel = { x: 216, y: 26, w: 132, h: 128 };
  return (
    <Frame viewBox={VB}>
      {FILES.map((f, i) => (
        <motion.g
          key={f.name}
          style={ownBox}
          variants={{
            hidden: { y: -16, opacity: 0, rotate: 0 },
            shown: { y: 0, opacity: 1, rotate: f.rotate, transition: { duration: 0.5, delay: i * 0.12, ...ease } },
          }}
        >
          <rect x={10 + f.dx} y={f.y} width={156} height={32} rx={8} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
          {/* Mini grilla de planilla */}
          <rect x={19 + f.dx} y={f.y + 9} width={14} height={14} rx={3} fill="none" stroke={C.blue} strokeWidth={1.5} />
          <path d={`M${26 + f.dx} ${f.y + 9} v14 M${19 + f.dx} ${f.y + 16} h14`} stroke={C.blue} strokeWidth={1.2} />
          <text x={40 + f.dx} y={f.y + 20} fontSize={8.5} fill={C.muted} style={mono}>
            {f.name}
          </text>
          {f.error && (
            <motion.g style={ownBox} variants={pop(0.55)}>
              <circle cx={164 + f.dx} cy={f.y + 2} r={8} fill={C.accent} />
              <text x={164 + f.dx} y={f.y + 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
                !
              </text>
            </motion.g>
          )}
        </motion.g>
      ))}

      {/* Paso a un sistema */}
      <motion.path
        d="M178 90 H206"
        stroke={C.blue}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="3 6"
        fill="none"
        variants={draw(0.7, 0.4)}
      />
      <motion.path d="M200 84 l6 6 l-6 6" stroke={C.blue} strokeWidth={2} strokeLinecap="round" fill="none" variants={fade(1)} />

      <motion.g style={ownBox} variants={pop(0.85)}>
        <rect x={panel.x} y={panel.y} width={panel.w} height={panel.h} rx={14} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
        <rect x={panel.x + 14} y={panel.y + 14} width={50} height={5} rx={2.5} fill={C.text} opacity={0.7} />
      </motion.g>
      {[0, 1, 2, 3].map((r) => (
        <motion.g key={r} variants={fade(1.05 + r * 0.08)}>
          <line
            x1={panel.x + 14}
            x2={panel.x + panel.w - 14}
            y1={panel.y + 40 + r * 22}
            y2={panel.y + 40 + r * 22}
            stroke={C.line}
          />
          <rect x={panel.x + 14} y={panel.y + 48 + r * 22} width={44} height={4} rx={2} fill={C.muted} opacity={0.6} />
          <rect x={panel.x + 70} y={panel.y + 48 + r * 22} width={30} height={4} rx={2} fill={C.blue} opacity={0.8} />
        </motion.g>
      ))}
      <motion.g style={ownBox} variants={pop(1.45)}>
        <circle cx={panel.x + panel.w - 18} cy={panel.y + 18} r={10} fill={C.accent} />
        <path
          d={`M${panel.x + panel.w - 23} ${panel.y + 18} l4 4 l7 -7`}
          stroke={C.ink}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </motion.g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ Factura */

function InvoiceStamp() {
  const doc = { x: 112, y: 12, w: 136, h: 156 };
  const rows = [
    { label: "CUIT", w: 54 },
    { label: "IVA", w: 36 },
  ];
  return (
    <Frame viewBox={VB}>
      <motion.g style={ownBox} variants={pop(0)}>
        <rect x={doc.x} y={doc.y} width={doc.w} height={doc.h} rx={10} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
        <text x={doc.x + 14} y={doc.y + 24} fontSize={10} fontWeight={700} fill={C.text} style={mono}>
          FACTURA
        </text>
        <rect x={doc.x + doc.w - 34} y={doc.y + 11} width={20} height={20} rx={4} fill="none" stroke={C.text} strokeWidth={1.5} />
        <text x={doc.x + doc.w - 24} y={doc.y + 25} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.text} style={mono}>
          A
        </text>
      </motion.g>
      {rows.map((r, i) => (
        <motion.g key={r.label} variants={fade(0.3 + i * 0.12)}>
          <text x={doc.x + 14} y={doc.y + 50 + i * 16} fontSize={8.5} fill={C.muted} style={mono}>
            {r.label}
          </text>
          <rect x={doc.x + 46} y={doc.y + 45 + i * 16} width={r.w} height={5} rx={2.5} fill={C.muted} opacity={0.5} />
        </motion.g>
      ))}
      {[70, 52, 62].map((w, i) => (
        <motion.g key={i} variants={fade(0.55 + i * 0.1)}>
          <rect x={doc.x + 14} y={doc.y + 82 + i * 14} width={w} height={5} rx={2.5} fill={C.blue} opacity={0.75} />
          <rect x={doc.x + doc.w - 40} y={doc.y + 82 + i * 14} width={26} height={5} rx={2.5} fill={C.muted} opacity={0.5} />
        </motion.g>
      ))}
      <motion.g variants={fade(0.9)}>
        <line x1={doc.x + 14} x2={doc.x + doc.w - 14} y1={doc.y + 128} y2={doc.y + 128} stroke={C.line} />
        <text x={doc.x + 14} y={doc.y + 144} fontSize={9} fill={C.text} style={mono}>
          Total
        </text>
        <rect x={doc.x + doc.w - 54} y={doc.y + 138} width={40} height={7} rx={3.5} fill={C.text} opacity={0.75} />
      </motion.g>

      {/* Sello de homologación */}
      <motion.g
        style={{ ...ownBox }}
        variants={{
          hidden: { scale: 1.6, opacity: 0, rotate: -12 },
          shown: { scale: 1, opacity: 1, rotate: -12, transition: { duration: 0.4, delay: 1.15, ease: [0.34, 1.4, 0.64, 1] } },
        }}
      >
        <rect x={214} y={96} width={92} height={42} rx={8} fill={C.surface} stroke={C.accent} strokeWidth={2.5} />
        <text x={260} y={115} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.accent} style={mono}>
          CAE
        </text>
        <text x={260} y={129} textAnchor="middle" fontSize={8} fill={C.accent} style={mono}>
          homologada
        </text>
      </motion.g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ Zoho Creator */

const BLOCKS = ["Formulario", "Tabla", "Flujo", "Reporte"];

function LowCodeBuilder() {
  const app = { x: 122, y: 16, w: 226, h: 148 };
  const into = (delay: number): Variants => ({
    hidden: { x: -96, opacity: 0, scale: 0.9 },
    shown: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.6, delay, ...ease } },
  });
  return (
    <Frame viewBox={VB}>
      {/* Paleta de bloques */}
      <motion.g variants={fade(0)}>
        <rect x={10} y={16} width={98} height={148} rx={12} fill={C.surface2} stroke={C.line} strokeWidth={1.5} />
      </motion.g>
      {BLOCKS.map((b, i) => (
        <motion.g key={b} variants={pop(0.1 + i * 0.07)} style={ownBox}>
          <rect x={19} y={30 + i * 32} width={80} height={24} rx={7} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
          <rect x={26} y={39 + i * 32} width={6} height={6} rx={1.5} fill={C.blue} />
          <text x={37} y={46 + i * 32} fontSize={8.5} fill={C.text} style={mono}>
            {b}
          </text>
        </motion.g>
      ))}

      {/* La aplicación que se arma */}
      <motion.g variants={fade(0.1)}>
        <rect x={app.x} y={app.y} width={app.w} height={app.h} rx={14} fill={C.surface} stroke={C.line} strokeWidth={1.5} />
        {[0, 1, 2].map((d) => (
          <circle key={d} cx={app.x + 16 + d * 10} cy={app.y + 14} r={3} fill={C.muted} opacity={0.5} />
        ))}
        <line x1={app.x} x2={app.x + app.w} y1={app.y + 26} y2={app.y + 26} stroke={C.line} />
      </motion.g>
      {/* Formulario */}
      <motion.g variants={into(0.45)}>
        <rect x={app.x + 14} y={app.y + 38} width={40} height={4} rx={2} fill={C.muted} opacity={0.6} />
        <rect x={app.x + 14} y={app.y + 46} width={92} height={16} rx={5} fill="none" stroke={C.line} strokeWidth={1.5} />
        <rect x={app.x + 14} y={app.y + 70} width={34} height={4} rx={2} fill={C.muted} opacity={0.6} />
        <rect x={app.x + 14} y={app.y + 78} width={92} height={16} rx={5} fill="none" stroke={C.line} strokeWidth={1.5} />
      </motion.g>
      {/* Tabla */}
      <motion.g variants={into(0.7)}>
        <rect x={app.x + 122} y={app.y + 38} width={92} height={56} rx={6} fill={C.surface2} stroke={C.line} strokeWidth={1} />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x={app.x + 130} y={app.y + 48 + r * 15} width={36} height={4} rx={2} fill={C.blue} opacity={0.8} />
            <rect x={app.x + 174} y={app.y + 48 + r * 15} width={30} height={4} rx={2} fill={C.muted} opacity={0.5} />
          </g>
        ))}
      </motion.g>
      {/* Flujo */}
      <motion.g variants={into(0.95)}>
        {[0, 1, 2].map((n) => (
          <rect key={n} x={app.x + 14 + n * 34} y={app.y + 108} width={24} height={16} rx={5} fill="none" stroke={C.blue} strokeWidth={1.5} />
        ))}
        <path d={`M${app.x + 38} ${app.y + 116} h10 M${app.x + 72} ${app.y + 116} h10`} stroke={C.blue} strokeWidth={1.5} />
      </motion.g>
      {/* Botón final */}
      <motion.g style={ownBox} variants={pop(1.25)}>
        <rect x={app.x + 152} y={app.y + 108} width={62} height={20} rx={10} fill={C.accent} />
        <rect x={app.x + 166} y={app.y + 116} width={34} height={4} rx={2} fill={C.ink} opacity={0.85} />
      </motion.g>
    </Frame>
  );
}
