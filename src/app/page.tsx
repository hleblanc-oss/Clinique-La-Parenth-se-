import Image from "next/image";
import Link from "next/link";
import { BadgeRotatif } from "@/components/BadgeRotatif";
import { CarteConsultation } from "@/components/CarteConsultation";
import { CarteDesSoins } from "@/components/CarteDesSoins";
import { Flacon } from "@/components/Flacon";
import { InstagramSection } from "@/components/InstagramSection";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { clinique } from "@/content/clinique";

/*
 * Accueil — modèle « Fusion » choisi par Karianne (octobre 2026) :
 * grande photo pleine largeur en haut de page, puis la disposition du modèle
 * de départ (carte des soins façon menu, Karianne, rituel maison, Instagram).
 */

const RITUEL = [
  {
    forme: "pompe",
    nom: "Nettoyant",
    titre: "Nettoyer",
    texte: "Un nettoyant doux, matin et soir, choisi pour votre type de peau.",
  },
  {
    forme: "tube",
    nom: "Exfoliant",
    titre: "Exfolier",
    texte: "Une à deux fois par semaine, pour un grain de peau affiné.",
  },
  {
    forme: "pompe",
    nom: "Sérum",
    titre: "Traiter",
    texte: "Le sérum ciblé : hydratation, éclat ou anti-âge.",
  },
  {
    forme: "pot",
    nom: "Crème",
    titre: "Protéger",
    texte: "Une crème qui nourrit et protège votre barrière cutanée.",
  },
] as const;

export default function Accueil() {
  return (
    <>
      {/* Grande photo */}
      <section className="relative isolate grid min-h-[min(82svh,780px)] items-end justify-items-center overflow-hidden text-center">
        <Image
          src="/images/soin-masque.jpg"
          alt="Cliente détendue pendant un soin du visage G.M. Collin"
          fill
          preload
          sizes="100vw"
          className="hero-zoom -z-20 object-cover object-[50%_30%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(58,42,34,.18)_0%,rgba(58,42,34,.3)_40%,rgba(58,42,34,.86)_100%)]"
        />
        <BadgeRotatif className="absolute right-3.5 top-4 w-[5.25rem] sm:right-[5%] sm:top-10 sm:w-[7.5rem]" />

        <Reveal className="max-w-[61rem] px-5 pb-[7.5rem] pt-28 sm:pb-36">
          <p className="surtitre text-peche">Dermo-esthétique · Trois-Rivières</p>
          <h1 className="mt-5 font-serif text-[clamp(3.6rem,9.5vw,9rem)] italic leading-[0.88] tracking-[-0.02em] text-creme">
            Prenez une parenthèse.
          </h1>
          <p className="mx-auto mt-6 max-w-[34em] leading-relaxed text-peche sm:text-lg">
            Des soins du visage {clinique.partenaire} réalisés par {clinique.fondatrice},
            infirmière. On prend le temps de comprendre votre peau, puis on en prend soin.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/rendez-vous" className="btn btn-clair">
              Réserver un soin
            </Link>
            <Link href="#carte" className="btn btn-fantome">
              Voir la carte des soins
            </Link>
          </div>
          <ul className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-peche">
            {["Infirmière", `Produits ${clinique.partenaire}`, "Analyse de peau incluse"].map(
              (element) => (
                <li key={element} className="flex items-center gap-2.5">
                  <span aria-hidden className="size-1.5 rounded-full bg-caramel" />
                  {element}
                </li>
              ),
            )}
          </ul>
        </Reveal>
      </section>

      <div className="conteneur relative z-10 -mt-14 mb-6 flex justify-center md:-mt-16 md:justify-end">
        <CarteConsultation className="w-full max-w-[21rem] md:max-w-[19rem]" />
      </div>

      <Marquee />

      {/* Carte des soins */}
      <section id="carte" className="py-20 sm:py-28 lg:py-32">
        <div className="conteneur grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal className="lg:sticky lg:top-32">
            <p className="surtitre">La carte</p>
            <h2 className="mt-5 font-serif text-[clamp(2.4rem,4.6vw,3.6rem)] leading-[1.05] tracking-[-0.01em]">
              Des soins <em className="text-brun">choisis</em> pour votre peau
            </h2>
            <p className="mt-5 max-w-[30em] leading-relaxed">
              Chaque soin du visage inclut l&rsquo;analyse de votre peau. Tous les protocoles sont
              réalisés avec les produits {clinique.partenaire}.
            </p>
            <div className="relative mt-7 hidden aspect-[5/4] overflow-hidden rounded-[12.5rem_12.5rem_1.25rem_1.25rem] lg:block">
              <Image
                src="/images/soin-collagene.jpg"
                alt="Soin du visage G.M. Collin en cabine"
                fill
                sizes="(min-width: 1024px) 30vw, 0px"
                className="object-cover"
              />
            </div>
            <p className="mt-5 rounded-[1.125rem] bg-nude px-5 py-4 text-[0.94rem] leading-relaxed">
              Pas certaine de votre choix? Commencez par la{" "}
              <Link
                href="/rendez-vous?soin=consultation-analyse-de-peau"
                className="font-semibold text-brun underline underline-offset-[3px]"
              >
                consultation à 25&nbsp;$
              </Link>
              , gratuite si vous réservez un soin ensuite.
            </p>
          </Reveal>
          <Reveal delai={0.08}>
            <CarteDesSoins />
          </Reveal>
        </div>
      </section>

      {/* Karianne */}
      <section className="bg-nude py-20 sm:py-28 lg:py-32">
        <div className="conteneur grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          {/* TODO : remplacer la première photo par le portrait de Karianne dès réception. */}
          <Reveal className="relative pb-11">
            <figure className="w-[min(80%,22.5rem)] -rotate-[2.5deg] bg-creme p-3.5 pb-12 shadow-[0_30px_50px_-30px_rgba(30,18,10,.45)]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/soin-masque.jpg"
                  alt="Soin du visage en cabine à la clinique"
                  fill
                  sizes="(min-width: 1024px) 360px, 80vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3.5 text-center font-serif text-[1.2rem] italic leading-none text-brun">
                En cabine
              </figcaption>
            </figure>
            <figure className="absolute bottom-0 right-0 w-[min(48%,14.5rem)] rotate-[5deg] bg-creme p-2.5 pb-10 shadow-[0_30px_50px_-30px_rgba(30,18,10,.45)]">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src="/images/soin-peeling.jpg"
                  alt="Application d'un peeling au pinceau"
                  fill
                  sizes="(min-width: 1024px) 232px, 48vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2.5 text-center font-serif text-base italic leading-none text-brun">
                Le peeling
              </figcaption>
            </figure>
          </Reveal>

          <div>
            <Reveal>
              <p
                aria-hidden
                className="-mb-1 font-script text-[clamp(3.6rem,7vw,5.5rem)] leading-none text-brun"
              >
                tout en douceur
              </p>
              <h2 className="font-serif text-[clamp(2.4rem,4.6vw,3.6rem)] leading-[1.05]">
                Bonjour, moi c&rsquo;est {clinique.fondatrice}
              </h2>
            </Reveal>
            <Reveal delai={0.08}>
              <p className="mt-5 max-w-[36em] leading-[1.8]">
                Infirmière de formation et esthéticienne spécialisée en soins du visage, j&rsquo;ai
                ouvert La Parenthèse pour offrir des soins rigoureux dans un endroit où l&rsquo;on
                prend le temps.
              </p>
              <p className="mt-4 max-w-[36em] leading-[1.8]">
                Mon regard d&rsquo;infirmière me permet de tenir compte de vos sensibilités, de
                votre médication et de vos objectifs avant chaque soin. Ici, pas de protocole à la
                chaîne : tout commence par votre peau.
              </p>
            </Reveal>
            <Reveal delai={0.16}>
              <dl className="mt-8 grid gap-5 border-t border-encre/15 pt-6 sm:grid-cols-3">
                {[
                  ["Formation", "Infirmière"],
                  ["Spécialité", "Soins du visage"],
                  ["Partenaire", clinique.partenaire],
                ].map(([terme, valeur]) => (
                  <div key={terme}>
                    <dt className="text-[0.66rem] font-medium uppercase tracking-[0.2em] text-brun">
                      {terme}
                    </dt>
                    <dd className="mt-2 font-serif text-xl font-medium text-encre">{valeur}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/a-propos" className="btn btn-secondaire mt-8">
                Faire connaissance
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Rituel maison */}
      <section className="py-20 sm:py-28 lg:py-32">
        <div className="conteneur">
          <Reveal className="grid items-end gap-6 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="surtitre">Le rituel maison</p>
              <h2 className="mt-5 font-serif text-[clamp(2.4rem,4.6vw,3.6rem)] leading-[1.05]">
                Prolonger le soin <em className="text-brun">chez vous</em>
              </h2>
            </div>
            <p className="max-w-[34em] leading-relaxed">
              Les produits {clinique.partenaire} utilisés en cabine sont offerts à la clinique.{" "}
              {clinique.fondatrice} vous prépare une routine simple, adaptée à votre peau, pour
              garder les résultats plus longtemps.
            </p>
          </Reveal>
          {/* TODO : remplacer les flacons illustrés par les photos des produits. */}
          <ol className="mt-12 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-4">
            {RITUEL.map((etape, i) => (
              <li key={etape.titre}>
                <Reveal delai={i * 0.08}>
                  <div className="arche flex aspect-[3/4] items-end justify-center bg-nude pb-[16%]">
                    <div className="w-[52%]">
                      <Flacon forme={etape.forme} nom={etape.nom} />
                    </div>
                  </div>
                  <h3 className="mt-4 flex items-baseline gap-2.5 font-serif text-2xl font-medium">
                    <span className="font-sans text-xs font-medium tracking-[0.14em] text-brun">
                      0{i + 1}
                    </span>
                    {etape.titre}
                  </h3>
                  <p className="mt-1.5 text-[0.92rem] leading-relaxed">{etape.texte}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Citation */}
      <section aria-label="Citation" className="pb-20 pt-4 text-center sm:pb-32">
        <div className="conteneur">
          <Reveal>
            <blockquote className="mx-auto max-w-[54rem]">
              <p className="font-serif text-[clamp(1.9rem,4.4vw,3.4rem)] italic leading-tight text-encre">
                <span aria-hidden className="text-caramel">
                  ({" "}
                </span>
                S&rsquo;arrêter un instant, c&rsquo;est déjà prendre soin de soi.
                <span aria-hidden className="text-caramel">
                  {" "}
                  )
                </span>
              </p>
              <footer className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-brun">
                {clinique.fondatrice}, fondatrice
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <InstagramSection />
    </>
  );
}
