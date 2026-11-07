"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { letterStep, tokenize, type TextSegment } from "@/lib/blur-text";
import { cn } from "@/lib/cn";

// Títulos que aparecen letra por letra: arrancan naranjas, desenfocados, un poco más grandes
// e inclinados, y se asientan en su color final (efecto "focus", estilo tilt, desde abajo).
// Con el mouse sobre una palabra, esa queda nítida y las demás se desenfocan.
// Implementación propia con transiciones CSS (ver .blur-text en app/globals.css).
//
// Accesibilidad: el texto completo va en un span sr-only; las letras sueltas quedan aria-hidden,
// así los lectores de pantalla leen el título entero y no letra por letra.

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  /** Texto simple, o por partes con su propia clase (ej. una parte destacada en naranja) */
  text?: string;
  segments?: TextSegment[];
  id?: string;
  className?: string;
  /** Desenfoca las otras palabras al pasar el mouse por una (solo con mouse) */
  focusOnHover?: boolean;
};

export default function BlurText({ as: Tag = "h2", text, segments, id, className, focusOnHover = true }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const shown = inView || reduce === true;

  const parts = segments ?? [{ text: text ?? "" }];
  const tokens = tokenize(parts);
  const letterCount = tokens.reduce((n, t) => n + (t.type === "word" ? t.letters.length : 0), 0);
  const full = parts.map((p) => p.text).join("");

  return (
    <Tag
      ref={ref}
      id={id}
      className={cn("blur-text", className)}
      data-shown={shown}
      data-focus={focusOnHover}
      style={{ "--bt-step": `${letterStep(letterCount)}ms` } as CSSProperties}
    >
      <span className="sr-only">{full}</span>
      <span aria-hidden>
        {tokens.map((t, i) =>
          t.type === "space" ? (
            <span key={i}>{t.text}</span>
          ) : (
            <span key={i} className={cn("bt-word", t.className)}>
              {t.letters.map((l) => (
                <span key={l.index} className="bt-letter" style={{ "--i": l.index } as CSSProperties}>
                  {l.char}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </Tag>
  );
}
