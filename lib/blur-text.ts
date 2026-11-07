// Lógica pura del efecto de títulos (components/ui/BlurText.tsx): divide el texto en palabras
// y letras numeradas para escalonar la aparición.

export type TextSegment = { text: string; className?: string };
export type Letter = { char: string; index: number };
export type Token = { type: "word"; letters: Letter[]; className?: string } | { type: "space"; text: string };

export function tokenize(segments: TextSegment[]): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  for (const seg of segments) {
    for (const part of seg.text.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        tokens.push({ type: "space", text: part });
        continue;
      }
      // Array.from respeta tildes y caracteres compuestos
      const letters = Array.from(part).map((char) => ({ char, index: index++ }));
      tokens.push({ type: "word", letters, className: seg.className });
    }
  }
  return tokens;
}

/** Milisegundos entre letra y letra: 20 ms, acortado para que el total no pase de 700 ms */
export function letterStep(letterCount: number): number {
  if (letterCount <= 0) return 20;
  return Math.min(20, Math.round(700 / letterCount));
}
