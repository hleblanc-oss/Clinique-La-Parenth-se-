"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Bouton « Prendre rendez-vous » toujours à portée de pouce sur mobile. */
export function BoutonFlottant() {
  const chemin = usePathname();
  if (chemin?.startsWith("/rendez-vous")) return null;

  return (
    <Link
      href="/rendez-vous"
      className="btn btn-primaire fixed inset-x-4 bottom-[calc(0.875rem+env(safe-area-inset-bottom,0px))] z-30 shadow-[0_14px_30px_-12px_rgba(30,18,10,.5)] md:hidden"
    >
      Prendre rendez-vous
    </Link>
  );
}
