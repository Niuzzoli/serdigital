import { expect, test } from "vitest";
import { canUsePointerEffects } from "@/lib/pointer";

test.each([
  [{ fine: true, hover: true, reducedMotion: false }, true],
  [{ fine: false, hover: true, reducedMotion: false }, false],
  [{ fine: true, hover: false, reducedMotion: false }, false],
  [{ fine: true, hover: true, reducedMotion: true }, false],
])("canUsePointerEffects(%o) = %s", (q, ok) => {
  expect(canUsePointerEffects(q)).toBe(ok);
});
