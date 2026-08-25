"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { clinique, adresseComplete } from "@/content/clinique";

const liens = [
  { href: "/soins", libelle: "Soins" },
  { href: "/a-propos", libelle: "À propos" },
  { href: "/contact", libelle: "Contact" },
] as const;

export function Logo({ classe = "" }: { classe?: string }) {
  return (
    <span className={`font-serif text-xl leading-none tracking-[0.06em] text-noir ${classe}`}>
      <span aria-hidden className="text-sauge">
        ({" "}
      </span>
      La&nbsp;Parenthèse
      <span aria-hidden className="text-sauge">
        {" "}
        )
      </span>
    </span>
  );
}

export function EnTete() {
  const [ouvert, setOuvert] = useState(false);
  const chemin = usePathname();
  const mouvementReduit = useReducedMotion();

  useEffect(() => {
    if (!ouvert) return;
    document.body.style.overflow = "hidden";
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    window.addEventListener("keydown", surTouche);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", surTouche);
    };
  }, [ouvert]);

  return (
    <header className="sticky top-0 z-40 border-b border-noir/8 bg-creme/85 backdrop-blur-md">
      <div className="conteneur flex h-[4.25rem] items-center justify-between gap-4">
        <Link href="/" aria-label={`${clinique.nom} — accueil`} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              aria-current={chemin === lien.href ? "page" : undefined}
              className={`text-[0.8125rem] font-medium uppercase tracking-[0.12em] transition-colors duration-[250ms] hover:text-sauge-fonce ${
                chemin?.startsWith(lien.href) ? "text-sauge-fonce" : "text-noir"
              }`}
            >
              {lien.libelle}
            </Link>
          ))}
          <Link href="/rendez-vous" className="btn btn-primaire px-6 py-2.5 text-[0.72rem]">
            Prendre rendez-vous
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOuvert(true)}
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          aria-label="Ouvrir le menu"
          className="flex h-11 w-11 flex-col items-center justify-center gap-[7px] md:hidden"
        >
          <span className="h-px w-6 bg-noir" aria-hidden />
          <span className="h-px w-6 bg-noir" aria-hidden />
        </button>
      </div>

      <AnimatePresence>
        {ouvert && (
          <>
            <motion.div
              key="fond"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setOuvert(false)}
              aria-hidden
              className="fixed inset-0 z-40 bg-noir/30 md:hidden"
            />
            <motion.div
              key="panneau"
              id="menu-mobile"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={mouvementReduit ? { opacity: 0 } : { x: "100%" }}
              animate={mouvementReduit ? { opacity: 1 } : { x: 0 }}
              exit={mouvementReduit ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-sm flex-col bg-creme md:hidden"
            >
              <div className="flex h-[4.25rem] items-center justify-between border-b border-noir/8 px-6">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOuvert(false)}
                  aria-label="Fermer le menu"
                  className="flex h-11 w-11 items-center justify-center text-2xl leading-none text-noir"
                >
                  <span aria-hidden>×</span>
                </button>
              </div>

              <nav aria-label="Navigation mobile" className="flex flex-1 flex-col gap-1 px-6 pt-8">
                {liens.map((lien, i) => (
                  <motion.div
                    key={lien.href}
                    initial={mouvementReduit ? { opacity: 0 } : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i + 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={lien.href}
                      onClick={() => setOuvert(false)}
                      className="block py-3 font-serif text-3xl text-noir transition-colors duration-[250ms] hover:text-sauge-fonce"
                    >
                      {lien.libelle}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.34, duration: 0.35 }}
                  className="pt-6"
                >
                  <Link
                    href="/rendez-vous"
                    onClick={() => setOuvert(false)}
                    className="btn btn-primaire w-full"
                  >
                    Prendre rendez-vous
                  </Link>
                </motion.div>
              </nav>

              <div className="border-t border-noir/8 px-6 py-6 text-sm text-texte-doux">
                <p>{adresseComplete}</p>
                <a
                  href={clinique.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-medium text-sauge-fonce"
                >
                  {clinique.instagram.pseudo}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
