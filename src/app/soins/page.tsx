import type { Metadata } from "next";
import Link from "next/link";
import { CarteSoin } from "@/components/CarteSoin";
import { Reveal } from "@/components/Reveal";
import { SectionEtiquette } from "@/components/SectionEtiquette";
import { clinique } from "@/content/clinique";
import { soins, soinParSlug } from "@/content/soins";

export const metadata: Metadata = {
  title: "Soins et tarifs",
  description:
    "Carte des soins du visage G.M. Collin à Trois-Rivières : consultation et analyse de peau, soins oxygénant, Algomask+, Hydrolifting, Collagène 90+, peeling et soin du dos.",
};

export default function PageSoins() {
  const consultation = soinParSlug("consultation-analyse-de-peau")!;
  const visage = soins.filter((s) => s.categorie === "visage");
  const peeling = soinParSlug("peeling")!;
  const ajoutPeeling = soinParSlug("ajout-peeling")!;
  const corps = soins.filter((s) => s.categorie === "corps");

  return (
    <>
      {/* Entête de page */}
      <section className="py-16 sm:py-24">
        <div className="conteneur text-center">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-sauge-fonce">
              La carte des soins
            </p>
            <h1 className="mx-auto mt-4 max-w-2xl font-serif text-4xl sm:text-5xl lg:text-6xl">
              Des soins choisis pour votre peau
            </h1>
            <p className="mx-auto mt-6 max-w-xl font-serif text-lg italic text-sauge-fonce sm:text-xl">
              Tous les soins sont réalisés avec les produits {clinique.partenaire}, partenaire
              exclusif de la clinique.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Consultation mise en avant */}
      <section className="pb-16 sm:pb-20">
        <div className="conteneur">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-noir px-7 py-10 sm:px-12 sm:py-14">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-10 select-none font-serif text-[12rem] leading-none text-creme/5"
              >
                )
              </span>
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-sauge">
                    Nouvelle cliente? Commencez ici
                  </p>
                  <h2 className="mt-3 font-serif text-3xl text-creme sm:text-4xl">
                    {consultation.nom}
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-creme/75 sm:text-base">
                    {consultation.accroche} Un regard d&rsquo;infirmière sur votre
                    peau, pour repartir avec un plan clair — en clinique comme à la maison.
                  </p>
                  <p className="mt-5 font-sans text-creme">
                    <span className="text-2xl font-medium">{consultation.prixAffiche}</span>
                    <span className="ml-3 text-xs uppercase tracking-[0.14em] text-creme/60">
                      {consultation.duree}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href={`/rendez-vous?soin=${consultation.slug}`}
                    className="btn btn-clair"
                  >
                    Réserver ma consultation
                  </Link>
                  <Link
                    href={`/soins/${consultation.slug}`}
                    className="btn border border-creme/30 text-creme hover:bg-creme/10"
                  >
                    En savoir plus
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Soins du visage */}
      <section className="bg-sauge-clair py-16 sm:py-24">
        <div className="conteneur">
          <Reveal>
            <SectionEtiquette etiquette="En cabine" titre="Soins du visage" />
          </Reveal>
          <div className="mt-10 grid gap-6 pt-3 sm:grid-cols-2 lg:grid-cols-3">
            {visage.map((soin, i) => (
              <Reveal key={soin.slug} delai={(i % 3) * 0.08} className="h-full">
                <CarteSoin soin={soin} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Peeling + option */}
      <section className="py-16 sm:py-24">
        <div className="conteneur grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <CarteSoin soin={peeling} />
          </Reveal>
          <Reveal delai={0.08}>
            <div className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-sauge-fonce/40 bg-sauge-clair/50 p-7">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-sauge-fonce">
                Option sur tous les soins du visage
              </p>
              <h3 className="mt-2 font-serif text-2xl text-noir">{ajoutPeeling.nom}</h3>
              <p className="mt-3 text-sm leading-relaxed">{ajoutPeeling.accroche}</p>
              <p className="mt-4 font-sans text-lg font-medium text-noir">
                {ajoutPeeling.prixAffiche}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Corps */}
      <section className="pb-16 sm:pb-24">
        <div className="conteneur">
          <Reveal>
            <SectionEtiquette etiquette="Aussi à la carte" titre="Soins du corps" />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {corps.map((soin) => (
              <Reveal key={soin.slug} className="h-full">
                <CarteSoin soin={soin} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="pb-20 sm:pb-28">
        <div className="conteneur text-center">
          <Reveal>
            <h2 className="font-serif text-3xl sm:text-4xl">Votre peau mérite sa parenthèse</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base">
              Les rendez-vous se prennent en ligne, directement dans l&rsquo;horaire de la
              clinique.
            </p>
            <Link href="/rendez-vous" className="btn btn-primaire mt-8">
              Prendre rendez-vous
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
