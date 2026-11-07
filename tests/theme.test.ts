import { expect, test } from "vitest";
import { nextPreference, parsePreference, resolveTheme } from "@/lib/theme";

test("sin elección guardada sigue al sistema", () => {
  expect(resolveTheme(null, true)).toBe("light");
  expect(resolveTheme(null, false)).toBe("dark");
});

test("la elección guardada gana sobre el sistema", () => {
  expect(resolveTheme("dark", true)).toBe("dark");
  expect(resolveTheme("light", false)).toBe("light");
});

test("'system' o un valor inválido siguen al sistema", () => {
  expect(resolveTheme("system", true)).toBe("light");
  expect(resolveTheme("violeta", false)).toBe("dark");
});

test("parsePreference normaliza lo guardado", () => {
  expect(parsePreference("light")).toBe("light");
  expect(parsePreference("dark")).toBe("dark");
  expect(parsePreference(null)).toBe("system");
  expect(parsePreference("cualquier cosa")).toBe("system");
});

test("el botón recorre automático → claro → oscuro → automático", () => {
  expect(nextPreference("system")).toBe("light");
  expect(nextPreference("light")).toBe("dark");
  expect(nextPreference("dark")).toBe("system");
});
