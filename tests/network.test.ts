import { expect, test } from "vitest";
import { createNodes, forEachLink, stepNodes, type Node } from "@/lib/network";

const OPTS = { radius: 160, grid: 48, pull: 0.06 };

test("createNodes respeta el tope y la región derecha", () => {
  const n = createNodes(2000, 1000, { region: "right", density: 9000, max: 120, rand: () => 0.5 });
  expect(n.length).toBe(120);
  n.forEach((p) => expect(p.x).toBeGreaterThanOrEqual(2000 * 0.38));
});

test("createNodes usa la densidad cuando no llega al tope", () => {
  expect(createNodes(300, 300, { region: "full", density: 9000, max: 120 }).length).toBe(10);
});

test("stepNodes mantiene los nodos dentro del lienzo", () => {
  const n = createNodes(300, 200, { region: "full", density: 600, max: 50 });
  for (let i = 0; i < 500; i++) stepNodes(n, 300, 200, null, OPTS);
  n.forEach((p) => {
    expect(p.x).toBeGreaterThanOrEqual(-1);
    expect(p.x).toBeLessThanOrEqual(301);
    expect(p.y).toBeGreaterThanOrEqual(-1);
    expect(p.y).toBeLessThanOrEqual(201);
  });
});

test("heat es 1 bajo el puntero y 0 lejos", () => {
  const n: Node[] = [
    { x: 100, y: 100, vx: 0, vy: 0, heat: 0 },
    { x: 900, y: 900, vx: 0, vy: 0, heat: 0 },
  ];
  stepNodes(n, 1000, 1000, { x: 100, y: 100 }, OPTS);
  expect(n[0].heat).toBeCloseTo(1, 1);
  expect(n[1].heat).toBe(0);
});

test("los nodos cerca del puntero se acercan a la grilla", () => {
  const n: Node[] = [{ x: 60, y: 60, vx: 0, vy: 0, heat: 0 }];
  for (let i = 0; i < 60; i++) stepNodes(n, 1000, 1000, { x: 60, y: 60 }, OPTS);
  expect(Math.abs(n[0].x - 48)).toBeLessThan(2);
  expect(Math.abs(n[0].y - 48)).toBeLessThan(2);
});

test("forEachLink une solo nodos cercanos", () => {
  const n: Node[] = [
    { x: 0, y: 0, vx: 0, vy: 0, heat: 0 },
    { x: 50, y: 0, vx: 0, vy: 0, heat: 0 },
    { x: 500, y: 0, vx: 0, vy: 0, heat: 0 },
  ];
  const links: number[] = [];
  forEachLink(n, 110, (_a, _b, t) => links.push(t));
  expect(links).toHaveLength(1);
  expect(links[0]).toBeCloseTo(1 - 50 / 110, 5);
});
