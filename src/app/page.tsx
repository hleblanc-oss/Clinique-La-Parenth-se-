import Link from "next/link";
import { Marquee } from "@/components/Marquee";
import { MotifPhoto } from "@/components/MotifPhoto";
import { Reveal, ApparitionHero } from "@/components/Reveal";
import { SectionEtiquette } from "@/components/SectionEtiquette";
import { CarteSoin } from "@/components/CarteSoin";
import { InstagramSection } from "@/components/InstagramSection";
import { clinique } from "@/content/clinique";
import { soins } from "@/content/soins";

const SLUGS_APERCU = [
  "consultation-analyse-de-peau",
  "soin-collagene-90",
  "soin-oxygenant",
  "soin-algomask",
];

export default function Accueil() {
  const apercu = SLUGS_APERCU.map((slug) => soins.find((s) => s.slug === slug)!).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_10%,var(--color-sauge-clair)_0%,transparent_70%)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -left-10 top-1/2 hidden -translate-y-1/2 select-none font-serif text-[26rem] font-light leading-none text-sauge-clair lg:block"
        >
          (
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 select-none font-serif text-[26rem] font-light leading-none text-sauge-clair lg:block"
        >
          )
        </span>

        <div className="conteneur relative flex min-h-[calc(100svh-4.25rem)] flex-col items-center justify-center py-20 text-center">
          <ApparitionHero className="flex flex-col items-center">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-sauge-fonce">
              Trois-Rivières · Ouverture {clinique.ouverture}
            </p>
            <h1 className="mt-6 max-w-3xl font-serif text-[2.75rem] leading-[1.08] sm:text-6xl lg:text-7xl">
              Offrez une parenthèse à votre peau
            </h1>
            <p className="mt-6 max-w-xl font-serif text-xl italic text-sauge-fonce sm:text-2xl">
              {clinique.slogan}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-texte-doux sm:text-base">
              Des soins du visage {clinique.partenaire} choisis pour votre peau, dans une ambiance
              intime et chaleureuse — loin des grandes chaînes, près de vous.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/rendez-vous" className="btn btn-primaire">
                Prendre rendez-vous
              </Link>
              <Link href="/soins" className="btn btn-secondaire">
                Découvrir les soins
              </Link>
            </div>
          </ApparitionHero>
        </div>
      </section>

      <Marquee />

      {/* À propos (court) */}
      <section className="py-20 sm:py-28">
        <div className="conteneur grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <MotifPhoto ratio="4/5" legende="Photo de Karianne à venir" />
          </Reveal>
          <div>
            <Reveal>
              <p aria-hidden className="font-script text-[3.5rem] leading-none text-sauge">
                la beauté en douceur
              </p>
            </Reveal>
            <Reveal delai={0.08}>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-[2.75rem]">
                Une infirmière derrière chaque soin
              </h2>
            </Reveal>
            <Reveal delai={0.16}>
              <p className="mt-6 leading-relaxed">
                Je m&rsquo;appelle {clinique.fondatrice}. Infirmière clinicienne de formation et
                esthéticienne spécialisée en soins du visage, j&rsquo;ai fondé{" "}
                {clinique.nom} pour offrir ce qui me manquait : des soins de la peau rigoureux,
                appuyés par une vraie expertise médicale, dans un endroit où l&rsquo;on prend le
                temps.
              </p>
            </Reveal>
            <Reveal delai={0.24}>
              <p className="mt-4 leading-relaxed">
                Ici, pas de protocole à la chaîne : chaque soin commence par votre peau, votre
                histoire et vos objectifs.
              </p>
            </Reveal>
            <Reveal delai={0.32}>
              <Link href="/a-propos" className="btn btn-secondaire mt-8">
                Faire connaissance
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Aperçu des soins */}
      <section className="bg-sauge-clair py-20 sm:py-28">
        <div className="conteneur">
          <Reveal>
            <SectionEtiquette etiquette="Les soins" titre="Prendre soin, sérieusement" centre />
            <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed sm:text-base">
              Des protocoles {clinique.partenaire} adaptés à votre peau. Nouvelle cliente? La
              consultation à 25&nbsp;$ est le meilleur point de départ.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 pt-3 sm:grid-cols-2 lg:grid-cols-4">
            {apercu.map((soin, i) => (
              <Reveal key={soin.slug} delai={i * 0.08} className="h-full">
                <CarteSoin soin={soin} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link href="/soins" className="btn btn-primaire">
              Voir tous les soins et tarifs
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Citation pleine page */}
      <section className="relative overflow-hidden py-28 sm:py-40">
        <div className="conteneur relative">
          <Reveal>
            <blockquote className="mx-auto max-w-3xl text-center">
              <p className="font-serif text-3xl italic leading-snug text-noir sm:text-4xl lg:text-[3.25rem]">
                <span aria-hidden className="text-sauge">
                  ({" "}
                </span>
                S&rsquo;arrêter un instant, c&rsquo;est déjà prendre soin de soi.
                <span aria-hidden className="text-sauge">
                  {" "}
                  )
                </span>
              </p>
              <footer className="mt-6 text-xs uppercase tracking-[0.2em] text-sauge-fonce">
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
