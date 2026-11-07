import { expect, test } from "vitest";
import { showBackToTop } from "@/lib/scroll";

test("el botón para volver arriba aparece después de bajar ~una pantalla", () => {
  expect(showBackToTop(0, 800)).toBe(false);
  expect(showBackToTop(500, 800)).toBe(false);
  expect(showBackToTop(700, 800)).toBe(true);
  expect(showBackToTop(3000, 800)).toBe(true);
});
