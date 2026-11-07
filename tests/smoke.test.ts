import { expect, test } from "vitest";
import { EASE } from "@/lib/motion";

test("easing único del sitio", () => {
  expect(EASE).toEqual([0.22, 1, 0.36, 1]);
});
