"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Soin } from "@/content/soins";

/** Carte de soin — élévation subtile au survol (translateY -4 px). */
export function CarteSoin({ soin }: { soin: Soin }) {
  const mouvementReduit = useReducedMotion();

  return (
    <motion.article
      whileHover={mouvementReduit ? undefined : { y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col rounded-2xl border border-noir/8 bg-creme p-7 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(33,29,26,0.25)]"
    >
      {soin.vedette && (
        <span className="absolute -top-3 left-7 rounded-full bg-sauge-fonce px-3.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-creme">
          Pour commencer
        </span>
      )}
      <h3 className="font-serif text-2xl leading-snug text-noir">
        <Link
          href={`/soins/${soin.slug}`}
          className="transition-colors duration-[250ms] after:absolute after:inset-0 after:content-[''] group-hover:text-sauge-fonce"
        >
          {soin.nom}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-texte-doux">{soin.accroche}</p>
      <div className="mt-5 flex items-baseline justify-between border-t border-noir/8 pt-4">
        <span className="font-sans text-lg font-medium text-noir">{soin.prixAffiche}</span>
        <span className="text-xs uppercase tracking-[0.12em] text-sauge-fonce">{soin.duree}</span>
      </div>
    </motion.article>
  );
}
