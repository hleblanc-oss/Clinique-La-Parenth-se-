import Link from "next/link";
import { clinique, lienTelephone } from "@/content/clinique";

/**
 * Repli doux quand la réservation en ligne est indisponible
 * (Square non configuré ou API en erreur) — jamais de message technique.
 */
export function PanneauRepli({ titre, message }: { titre: string; message: string }) {
  return (
    <div className="rounded-2xl bg-nude p-8 text-center sm:p-10">
      <span aria-hidden className="font-serif text-4xl text-brun">
        (&thinsp;)
      </span>
      <h2 className="mt-3 font-serif text-2xl text-encre">{titre}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed">{message}</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href={lienTelephone} className="btn btn-primaire">
          Appeler {clinique.telephone}
        </a>
        <a href={`mailto:${clinique.courriel}`} className="btn btn-secondaire">
          Écrire un courriel
        </a>
        <Link href="/soins" className="btn btn-secondaire">
          Voir les soins
        </Link>
      </div>
    </div>
  );
}
