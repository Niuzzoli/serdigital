"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { createNodes, forEachLink, stepNodes, type Node } from "@/lib/network";
import { usePointerEffects } from "@/lib/pointer";

// Fondo del hero: red de nodos en canvas 2D.
// - Con mouse: se anima y reacciona al cursor (los nodos cercanos se encienden y se ordenan).
// - En táctil o con "reducir movimiento": un solo cuadro estático.
// - Se pausa fuera de pantalla y con la pestaña oculta. Se limpia al desmontar.

const STEP = { radius: 160, grid: 48, pull: 0.06 };
const LINK_DIST = 110;

function rgb(varName: string, fallback: string): string {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback;
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export default function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animated = usePointerEffects() && site.interactions.heroNetwork;

  useEffect(() => {
    const canvas = canvasRef.current;
    // El canvas queda detrás del texto: los movimientos del mouse se escuchan en toda la sección
    const host = canvas?.closest("section");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    // Colores desde los tokens; se vuelven a leer si cambia el tema del sistema
    let blue = "";
    let accent = "";
    let node = "";
    const readColors = () => {
      blue = rgb("--blue", "#176be0");
      accent = rgb("--accent", "#ff5a1f");
      node = rgb("--node", "#aac4e6");
    };
    readColors();
    // El tema se marca en <html data-theme>: si cambia, se releen los colores
    const themeObserver = new MutationObserver(() => {
      readColors();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;
    let inView = true;
    let resizeTimer = 0;

    const setup = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = createNodes(w, h, {
        region: w >= 768 ? "right" : "full",
        density: w >= 768 ? 9000 : 7000,
        max: 120,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      forEachLink(nodes, LINK_DIST, (a, b, t) => {
        const hot = Math.max(a.heat, b.heat);
        ctx.strokeStyle =
          hot > 0.05 ? `rgba(${accent}, ${0.55 * hot * t})` : `rgba(${blue}, ${0.5 * t})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });
      for (const p of nodes) {
        ctx.fillStyle = p.heat > 0.05 ? `rgba(${accent}, ${0.45 + 0.55 * p.heat})` : `rgba(${node}, 0.7)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6 + p.heat * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      stepNodes(nodes, w, h, pointer, STEP);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!animated || raf || !inView || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    setup();
    draw();
    canvas.style.opacity = "1";
    if (!animated) {
      // Cuadro estático: se redibuja solo si cambia el tamaño
      const ro = new ResizeObserver(() => {
        setup();
        draw();
      });
      ro.observe(canvas);
      return () => {
        ro.disconnect();
        themeObserver.disconnect();
      };
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => (pointer = null);
    const onVisibility = () => (document.hidden ? stop() : start());
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setup();
        draw();
      }, 150);
    });

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    io.observe(canvas);
    ro.observe(canvas);
    start();

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
    };
  }, [animated]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
    />
  );
}
