"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Apparition douce au défilement : fade + translateY 24 px, 500 ms.
 * Sous `prefers-reduced-motion`, seul le fondu est conservé.
 */
export function Reveal({
  children,
  delai = 0,
  className,
}: {
  children: ReactNode;
  /** Décalage en secondes (stagger de 0,08 s entre enfants d'une même section). */
  delai?: number;
  className?: string;
}) {
  const mouvementReduit = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: mouvementReduit ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: delai, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
