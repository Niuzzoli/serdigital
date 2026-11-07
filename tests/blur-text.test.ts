import { expect, test } from "vitest";
import { letterStep, tokenize } from "@/lib/blur-text";

test("tokenize separa palabras y espacios, y numera las letras en orden", () => {
  const t = tokenize([{ text: "Hola mundo" }]);
  expect(t.map((x) => (x.type === "space" ? "_" : x.letters.map((l) => l.char).join("")))).toEqual(["Hola", "_", "mundo"]);
  const word = t[2];
  expect(word.type === "word" && word.letters.map((l) => l.index)).toEqual([4, 5, 6, 7, 8]);
});

test("tokenize conserva la clase de cada segmento (ej. la parte destacada del título)", () => {
  const t = tokenize([{ text: "para que " }, { text: "decida y opere", className: "text-accent-text" }, { text: " más" }]);
  const words = t.filter((x) => x.type === "word");
  expect(words.map((w) => (w.type === "word" ? [w.letters.map((l) => l.char).join(""), w.className ?? ""] : null))).toEqual([
    ["para", ""],
    ["que", ""],
    ["decida", "text-accent-text"],
    ["y", "text-accent-text"],
    ["opere", "text-accent-text"],
    ["más", ""],
  ]);
});

test("letterStep usa 20 ms por letra y lo acorta en títulos largos (máx. 700 ms en total)", () => {
  expect(letterStep(10)).toBe(20);
  expect(letterStep(35)).toBe(20);
  expect(letterStep(70)).toBe(10);
  expect(letterStep(0)).toBe(20);
});
