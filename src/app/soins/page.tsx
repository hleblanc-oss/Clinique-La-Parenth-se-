import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CarteConsultation } from "@/components/CarteConsultation";
import { CarteDesSoins } from "@/components/CarteDesSoins";
import { Reveal } from "@/components/Reveal";
import { clinique } from "@/content/clinique";

export const metadata: Metadata = {
  title: "Soins et tarifs",
  description:
    "Carte des soins G.M. Collin à Trois-Rivières : consultation et analyse de peau, soins Oxygénant, Algomask, Hydrolifting, Collagène 90+, peeling et soin du dos.",
};

export default function PageSoins() {
  return (
    <>
      {/* Bandeau photo */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/images/soin-peeling.jpg"
          alt="Application d'un peeling au pinceau pendant un soin du visage"
          fill
          preload
          sizes="100vw"
          className="hero-zoom -z-20 object-cover object-[50%_40%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(58,42,34,.35)_0%,rgba(58,42,34,.82)_100%)]"
        />
        <Reveal className="conteneur pb-24 pt-20 text-center sm:pb-28 sm:pt-28">
          <p className="surtitre text-peche">La carte des soins</p>
          <h1 className="mx-auto mt-5 max-w-3xl font-serif text-[clamp(2.8rem,6.5vw,5.5rem)] italic leading-[0.95] text-creme">
            Des soins choisis pour votre peau
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-peche">
            Chaque soin du visage inclut l&rsquo;analyse de votre peau. Tous les protocoles sont
            réalisés avec les produits {clinique.partenaire}.
          </p>
        </Reveal>
      </section>

      <div className="conteneur relative z-10 -mt-12 mb-4 flex justify-center">
        <CarteConsultation className="w-full max-w-[21rem]" />
      </div>

      <section className="py-14 sm:py-20">
        <div className="conteneur max-w-[52rem]">
          <Reveal>
            <CarteDesSoins />
          </Reveal>
        </div>
      </section>

      {/* Bon à savoir */}
      <section className="bg-nude py-16 sm:py-24">
        <div className="conteneur grid gap-10 md:grid-cols-3">
          {[
            {
              titre: "L'analyse de peau, toujours",
              texte:
                "Chaque soin du visage commence par l'analyse de votre peau. Nouvelle cliente? La consultation à 25 $ est gratuite si vous réservez un soin ensuite.",
            },
            {
              titre: "Avant un peeling",
              texte:
                "Quelques précautions à prendre les 3 jours avant et après le traitement : elles sont détaillées sur la page du peeling.",
              lien: { href: "/soins/peeling", libelle: "Voir les précautions" },
            },
            {
              titre: "Annulation",
              texte: clinique.politiqueAnnulation,
            },
          ].map((bloc, i) => (
            <Reveal key={bloc.titre} delai={i * 0.08}>
              <h2 className="font-serif text-2xl">{bloc.titre}</h2>
              <p className="mt-3 text-[0.94rem] leading-relaxed">{bloc.texte}</p>
              {bloc.lien && (
                <Link href={bloc.lien.href} className="lien-souligne mt-4 inline-block">
                  {bloc.lien.libelle}
                </Link>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Appel final */}
      <section className="py-20 sm:py-28">
        <div className="conteneur text-center">
          <Reveal>
            <h2 className="font-serif text-[clamp(2.2rem,4.4vw,3.4rem)]">
              Votre peau mérite sa <em className="text-brun">parenthèse</em>
            </h2>
            <p className="mx-auto mt-4 max-w-md leading-relaxed">
              Les rendez-vous se prennent en ligne, directement dans l&rsquo;horaire de la clinique
              : {clinique.heuresResume.toLowerCase()}.
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
