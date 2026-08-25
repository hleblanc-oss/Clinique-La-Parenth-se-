import Link from "next/link";
import { clinique } from "@/content/clinique";

/**
 * Repli doux quand la réservation en ligne est indisponible
 * (Square non configuré ou API en erreur) — jamais de message technique.
 */
export function PanneauRepli({ titre, message }: { titre: string; message: string }) {
  return (
    <div className="rounded-2xl bg-sauge-clair p-8 text-center sm:p-10">
      <span aria-hidden className="font-serif text-4xl text-sauge-fonce">
        (&thinsp;)
      </span>
      <h2 className="mt-3 font-serif text-2xl text-noir">{titre}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed">{message}</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {clinique.telephone && (
          <a href={`tel:${clinique.telephone.replace(/\D/g, "")}`} className="btn btn-primaire">
            Appeler {clinique.telephone}
          </a>
        )}
        <a
          href={clinique.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondaire"
        >
          Écrire sur Instagram
        </a>
        <Link href="/soins" className="btn btn-secondaire">
          Voir les soins
        </Link>
      </div>
    </div>
  );
}
