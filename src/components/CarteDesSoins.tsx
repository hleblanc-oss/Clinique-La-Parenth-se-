import Link from "next/link";
import { clinique } from "@/content/clinique";
import { groupesCarte, PRIX_AJOUT_PEELING, soinParSlug, soins } from "@/content/soins";

/** Carte des soins façon menu : groupes, points de conduite, prix et lien de réservation. */
export function CarteDesSoins() {
  const avecPeeling = soins.filter((s) => s.avecPeeling).map((s) => s.nom.replace(/^Soin /, ""));

  return (
    <div>
      {groupesCarte.map((groupe, g) => (
        <div key={groupe.titre} className={g > 0 ? "mt-11" : ""}>
          <h3 className="border-b border-encre pb-3.5 font-sans text-[0.72rem] font-medium uppercase tracking-[0.24em] text-brun">
            {groupe.titre}
          </h3>
          {groupe.slugs.map((slug) => {
            const soin = soinParSlug(slug)!;
            return (
              <article key={soin.slug} className="border-b border-encre/12 pb-5 pt-[1.375rem]">
                <div className="flex items-baseline gap-3.5">
                  <h4 className="min-w-0 font-serif text-[1.45rem] font-medium leading-tight text-encre sm:text-[1.65rem]">
                    <Link
                      href={`/soins/${soin.slug}`}
                      className="transition-colors duration-[250ms] hover:text-brun"
                    >
                      {soin.nom}
                    </Link>
                  </h4>
                  <span
                    aria-hidden
                    className="min-w-4 flex-1 -translate-y-1 border-b-[1.5px] border-dotted border-sable"
                  />
                  <span className="whitespace-nowrap font-sans text-[1.05rem] font-medium tabular-nums text-encre">
                    {soin.prix}&nbsp;$
                  </span>
                </div>
                <p className="mt-1 font-serif text-[1.05rem] italic leading-snug text-brun">
                  {soin.sousTitre}
                </p>
                <p className="mt-2 max-w-[50ch] text-[0.94rem] leading-relaxed">{soin.accroche}</p>
                {soin.bonus && (
                  <span className="mt-2.5 inline-block rounded-full bg-nude px-3 py-1 text-[0.78rem] font-medium text-brun">
                    {soin.bonus}
                  </span>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.82rem] text-brun">
                  <b className="font-medium">{soin.duree}</b>
                  <span>{soin.preoccupations.join(" · ")}</span>
                  <Link href={`/rendez-vous?soin=${soin.slug}`} className="lien-souligne ml-auto">
                    Réserver<span className="sr-only"> : {soin.nom}</span>
                  </Link>
                </div>
              </article>
            );
          })}
          {groupe.titre === "Soins du visage" && avecPeeling.length > 0 && (
            <p className="mt-4 flex justify-between gap-3 rounded-[0.875rem] border border-dashed border-caramel px-[1.125rem] py-3.5 text-[0.9rem]">
              <span>
                Ajout d&rsquo;un peeling au soin {avecPeeling.slice(0, -1).join(", ")} ou{" "}
                {avecPeeling.at(-1)}
              </span>
              <strong className="whitespace-nowrap font-medium text-encre">
                +{PRIX_AJOUT_PEELING}&nbsp;$
              </strong>
            </p>
          )}
        </div>
      ))}
      <p className="mt-8 text-[0.85rem] leading-relaxed text-brun">
        Tous les soins sont réalisés avec les produits {clinique.partenaire}.{" "}
        {clinique.politiqueAnnulation}
      </p>
    </div>
  );
}
