import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { clinique } from "@/content/clinique";
import { soins, soinParSlug, categoriesLibelles, PRIX_AJOUT_PEELING } from "@/content/soins";

export function generateStaticParams() {
  return soins.map((soin) => ({ slug: soin.slug }));
}

export async function generateMetadata({ params }: PageProps<"/soins/[slug]">): Promise<Metadata> {
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
          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-caramel" />
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

  const autres = soins.filter((s) => s.slug !== soin.slug).slice(0, 3);

  return (
    <>
      {/* Entête */}
      <section className="bg-nude py-14 sm:py-20">
        <div className="conteneur grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <Reveal>
            <nav aria-label="Fil d'Ariane" className="text-xs uppercase tracking-[0.16em]">
              <Link
                href="/soins"
                className="text-brun transition-colors duration-[250ms] hover:text-encre"
              >
                Soins
              </Link>
              <span aria-hidden className="mx-2 text-caramel">
                ·
              </span>
              <span>{categoriesLibelles[soin.categorie]}</span>
            </nav>
            <h1 className="mt-5 font-serif text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[1.02]">
              {soin.nom}
            </h1>
            <p className="mt-3 font-serif text-xl italic text-brun sm:text-2xl">{soin.sousTitre}</p>
            <p className="mt-5 max-w-2xl leading-relaxed">{soin.accroche}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <p className="font-sans text-2xl font-medium text-encre">{soin.prixAffiche}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-brun">{soin.duree}</p>
              <Link href={`/rendez-vous?soin=${soin.slug}`} className="btn btn-primaire">
                Réserver ce soin
              </Link>
            </div>
          </Reveal>
          {soin.photo && (
            <Reveal delai={0.08} className="mx-auto w-full max-w-[22rem] lg:max-w-none">
              <div className="arche relative aspect-[4/5] shadow-[0_40px_70px_-40px_rgba(40,25,15,.45)]">
                <Image
                  src={soin.photo.src}
                  alt={soin.photo.alt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 34vw, 22rem"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
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
              <h2 className="font-serif text-3xl">Pour qui?</h2>
              <Liste elements={soin.pourQui} />
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-serif text-3xl">Le déroulement</h2>
              <ol className="mt-5 space-y-3.5">
                {soin.deroulement.map((etape, i) => (
                  <li key={etape} className="flex gap-4 leading-relaxed">
                    <span
                      aria-hidden
                      className="min-w-6 shrink-0 font-sans text-xs font-medium leading-[1.9] tracking-[0.1em] text-brun"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{etape}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-serif text-3xl">Les résultats</h2>
              <Liste elements={soin.resultats} />
            </Reveal>

            {soin.precautions && (
              <Reveal className="mt-12">
                <h2 className="font-serif text-3xl">Précautions</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {soin.precautions.map((bloc) => (
                    <div key={bloc.titre} className="rounded-2xl bg-nude p-6">
                      <h3 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-brun">
                        {bloc.titre}
                      </h3>
                      <ul className="mt-3 space-y-2.5 text-[0.92rem] leading-relaxed">
                        {bloc.elements.map((element) => (
                          <li key={element}>{element}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {soin.conseil && (
              <Reveal className="mt-8">
                <p className="border-l-2 border-caramel pl-5 font-serif text-xl italic leading-snug text-encre">
                  {soin.conseil}
                </p>
              </Reveal>
            )}
          </div>

          {/* Panneau latéral */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="rounded-2xl border border-encre/10 bg-creme p-7">
                <h2 className="font-serif text-2xl">En bref</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-encre/10 pb-3">
                    <dt>Prix</dt>
                    <dd className="font-medium text-encre">{soin.prixAffiche}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-encre/10 pb-3">
                    <dt>Durée</dt>
                    <dd className="font-medium text-encre">{soin.duree}</dd>
                  </div>
                  {soin.avecPeeling && (
                    <div className="flex justify-between gap-4 border-b border-encre/10 pb-3">
                      <dt>Avec peeling</dt>
                      <dd className="font-medium text-encre">
                        {soin.avecPeeling.prix}&nbsp;$ (+{PRIX_AJOUT_PEELING}&nbsp;$)
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt>Produits</dt>
                    <dd className="font-medium text-encre">{clinique.partenaire}</dd>
                  </div>
                </dl>
                {soin.bonus && (
                  <p className="mt-4 rounded-full bg-nude px-4 py-2 text-center text-[0.8rem] font-medium text-brun">
                    {soin.bonus}
                  </p>
                )}
                <Link
                  href={`/rendez-vous?soin=${soin.slug}`}
                  className="btn btn-primaire mt-6 w-full"
                >
                  Réserver ce soin
                </Link>
                {soin.slug !== "consultation-analyse-de-peau" && (
                  <p className="mt-4 text-[0.82rem] leading-relaxed">
                    Vous hésitez? La{" "}
                    <Link
                      href="/soins/consultation-analyse-de-peau"
                      className="font-medium text-brun underline decoration-caramel underline-offset-2"
                    >
                      consultation à 25&nbsp;$
                    </Link>{" "}
                    est le meilleur point de départ.
                  </p>
                )}
                <p className="mt-4 border-t border-encre/10 pt-4 text-[0.78rem] leading-relaxed">
                  {clinique.politiqueAnnulation}
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Autres soins */}
      <section className="bg-nude py-16 sm:py-20">
        <div className="conteneur">
          <Reveal>
            <h2 className="font-serif text-3xl">Vous aimeriez peut-être</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {autres.map((autre, i) => (
              <Reveal key={autre.slug} delai={i * 0.08}>
                <Link
                  href={`/soins/${autre.slug}`}
                  className="group block rounded-2xl bg-creme p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(58,42,34,0.3)]"
                >
                  <h3 className="font-serif text-xl leading-snug transition-colors duration-[250ms] group-hover:text-brun">
                    {autre.nom}
                  </h3>
                  <p className="mt-1 font-serif italic text-brun">{autre.sousTitre}</p>
                  <p className="mt-3 text-sm">
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
