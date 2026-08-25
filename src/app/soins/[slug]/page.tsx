import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { clinique } from "@/content/clinique";
import { soins, soinParSlug, categoriesLibelles } from "@/content/soins";

export function generateStaticParams() {
  return soins.map((soin) => ({ slug: soin.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/soins/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const soin = soinParSlug(slug);
  if (!soin) return {};
  return {
    title: soin.nom,
    description: `${soin.accroche} ${soin.prixAffiche} · ${soin.duree} — ${clinique.nom}, Trois-Rivières.`,
  };
}

function Liste({ elements }: { elements: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {elements.map((element) => (
        <li key={element} className="flex gap-3 leading-relaxed">
          <span aria-hidden className="mt-0.5 select-none font-serif text-sauge-fonce">
            (&thinsp;)
          </span>
          <span>{element}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function PageSoin({ params }: PageProps<"/soins/[slug]">) {
  const { slug } = await params;
  const soin = soinParSlug(slug);
  if (!soin) notFound();

  const autres = soins.filter((s) => s.slug !== soin.slug && !s.option).slice(0, 3);

  return (
    <>
      {/* Entête */}
      <section className="bg-sauge-clair py-16 sm:py-24">
        <div className="conteneur">
          <Reveal>
            <nav aria-label="Fil d'Ariane" className="text-xs uppercase tracking-[0.16em]">
              <Link
                href="/soins"
                className="text-sauge-fonce transition-colors duration-[250ms] hover:text-noir"
              >
                Soins
              </Link>
              <span aria-hidden className="mx-2 text-sauge">
                ·
              </span>
              <span className="text-texte-doux">{categoriesLibelles[soin.categorie]}</span>
            </nav>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl sm:text-5xl lg:text-6xl">
              {soin.nom}
            </h1>
            <p className="mt-5 max-w-2xl font-serif text-lg italic text-sauge-fonce sm:text-xl">
              {soin.accroche}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <p className="font-sans text-2xl font-medium text-noir">{soin.prixAffiche}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-sauge-fonce">{soin.duree}</p>
              {!soin.option && (
                <Link href={`/rendez-vous?soin=${soin.slug}`} className="btn btn-primaire">
                  Réserver ce soin
                </Link>
              )}
            </div>
            {soin.option && (
              <p className="mt-6 max-w-xl text-sm leading-relaxed">
                Cette option s&rsquo;ajoute à un soin du visage : mentionnez-la simplement en
                réservant votre soin.
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16 sm:py-24">
        <div className="conteneur grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              {soin.description.map((paragraphe) => (
                <p key={paragraphe} className="mt-5 leading-relaxed first:mt-0">
                  {paragraphe}
                </p>
              ))}
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-serif text-2xl sm:text-3xl">Pour qui?</h2>
              <Liste elements={soin.pourQui} />
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-serif text-2xl sm:text-3xl">Le déroulement</h2>
              <ol className="mt-5 space-y-4">
                {soin.deroulement.map((etape, i) => (
                  <li key={etape} className="flex gap-4 leading-relaxed">
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sauge-clair font-sans text-xs font-medium text-sauge-fonce"
                    >
                      {i + 1}
                    </span>
                    <span>{etape}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-serif text-2xl sm:text-3xl">Les résultats</h2>
              <Liste elements={soin.resultats} />
            </Reveal>
          </div>

          {/* Panneau latéral */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <div className="rounded-2xl border border-noir/8 bg-creme p-7">
                <h2 className="font-serif text-xl">En bref</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-noir/8 pb-3">
                    <dt className="text-texte-doux">Prix</dt>
                    <dd className="font-medium text-noir">{soin.prixAffiche}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-noir/8 pb-3">
                    <dt className="text-texte-doux">Durée</dt>
                    <dd className="font-medium text-noir">{soin.duree}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-texte-doux">Produits</dt>
                    <dd className="font-medium text-noir">{clinique.partenaire}</dd>
                  </div>
                </dl>
                {!soin.option && (
                  <Link
                    href={`/rendez-vous?soin=${soin.slug}`}
                    className="btn btn-primaire mt-6 w-full"
                  >
                    Réserver ce soin
                  </Link>
                )}
                {soin.slug !== "consultation-analyse-de-peau" && !soin.option && (
                  <p className="mt-4 text-xs leading-relaxed text-texte-doux">
                    Vous hésitez? La{" "}
                    <Link
                      href="/soins/consultation-analyse-de-peau"
                      className="font-medium text-sauge-fonce underline decoration-sauge underline-offset-2"
                    >
                      consultation à 25&nbsp;$
                    </Link>{" "}
                    est le meilleur point de départ.
                  </p>
                )}
                {soin.categorie === "visage" && (
                  <p className="mt-4 rounded-xl bg-sauge-clair/60 p-3.5 text-xs leading-relaxed">
                    Envie d&rsquo;aller plus loin? Ajoutez un peeling à ce soin (+30&nbsp;$).
                  </p>
                )}
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Autres soins */}
      <section className="bg-sauge-clair py-16 sm:py-20">
        <div className="conteneur">
          <Reveal>
            <h2 className="font-serif text-2xl sm:text-3xl">Vous aimeriez peut-être</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {autres.map((autre, i) => (
              <Reveal key={autre.slug} delai={i * 0.08}>
                <Link
                  href={`/soins/${autre.slug}`}
                  className="group block rounded-2xl border border-noir/8 bg-creme p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(33,29,26,0.25)]"
                >
                  <h3 className="font-serif text-lg leading-snug text-noir transition-colors duration-[250ms] group-hover:text-sauge-fonce">
                    {autre.nom}
                  </h3>
                  <p className="mt-2 text-sm text-texte-doux">
                    {autre.prixAffiche} · {autre.duree}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
