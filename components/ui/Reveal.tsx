"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { DUR, EASE, SHIFT } from "@/lib/motion";

// Aparición al entrar en pantalla, una sola vez.
// <Reveal> anima un bloque; <RevealGroup> + <RevealItem> hacen un stagger leve en listas.

const viewport = { once: true, margin: "0px 0px -10% 0px" } as const;

function useVariants(): Variants {
  const reduce = useReducedMotion();
  return {
    hidden: { opacity: 0, y: reduce ? 0 : SHIFT },
    shown: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE } },
  };
}

type Props = { children: ReactNode; className?: string; delay?: number };

export function Reveal({ children, className, delay = 0 }: Props) {
  const variants = useVariants();
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="shown"
      viewport={viewport}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
  as = "div",
}: Props & { as?: "div" | "ul" | "ol" }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={viewport}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.06 } } }}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: Props & { as?: "div" | "li" | "article" }) {
  const variants = useVariants();
  const Tag = motion[as];
  return (
    <Tag className={className} variants={variants}>
      {children}
    </Tag>
  );
}
