"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { clinique, adresseComplete, lienTelephone } from "@/content/clinique";

const liens = [
  { href: "/soins", libelle: "Soins" },
  { href: "/a-propos", libelle: "Karianne" },
  { href: "/contact", libelle: "Contact" },
] as const;

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
    <header className="sticky top-0 z-40 border-b border-encre/10 bg-creme/90 backdrop-blur-md">
      <div className="conteneur flex h-[4.25rem] items-center justify-between gap-4 md:h-[4.75rem]">
        <Link href="/" className="shrink-0">
          <Logo preload className="w-[9.25rem] md:w-44" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              aria-current={chemin === lien.href ? "page" : undefined}
              className={`py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-[250ms] hover:text-brun ${
                chemin?.startsWith(lien.href) ? "text-brun" : "text-encre"
              }`}
            >
              {lien.libelle}
            </Link>
          ))}
          <Link href="/rendez-vous" className="btn btn-primaire px-[1.375rem] py-3 text-[0.72rem]">
            Prendre rendez-vous
          </Link>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <Link href="/rendez-vous" className="btn btn-primaire px-[1.125rem] py-2.5 text-[0.7rem]">
            Réserver
          </Link>
          <button
            type="button"
            onClick={() => setOuvert(true)}
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            aria-label="Ouvrir le menu"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[7px]"
          >
            <span className="h-px w-6 bg-encre" aria-hidden />
            <span className="h-px w-6 bg-encre" aria-hidden />
          </button>
        </div>
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
              className="fixed inset-0 z-40 bg-encre/30 md:hidden"
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
              <div className="flex h-[4.25rem] items-center justify-between border-b border-encre/10 px-6">
                <Logo className="w-[9.25rem]" />
                <button
                  type="button"
                  onClick={() => setOuvert(false)}
                  aria-label="Fermer le menu"
                  className="flex h-11 w-11 items-center justify-center text-2xl leading-none text-encre"
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
                      className="block py-3 font-serif text-3xl text-encre transition-colors duration-[250ms] hover:text-brun"
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

              <div className="border-t border-encre/10 px-6 py-6 text-sm text-texte">
                <p>{adresseComplete}</p>
                <p className="mt-1">{clinique.heuresResume}</p>
                <a href={lienTelephone} className="mt-2 block font-medium text-brun">
                  {clinique.telephone}
                </a>
                <a
                  href={clinique.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block font-medium text-brun"
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
