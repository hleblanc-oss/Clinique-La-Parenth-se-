import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { clinique } from "@/content/clinique";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Karianne, infirmière et esthéticienne, a fondé Clinique La Parenthèse à Trois-Rivières : la rigueur des soins infirmiers au service de votre peau.",
};

/*
 * Page de la confiance — premier jet à valider et enrichir avec Karianne
 * (entrevue prévue; voir le questionnaire du brief, section 8.1).
 */
export default function APropos() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="conteneur">
          <Reveal>
            <p className="surtitre text-center">À propos</p>
            <h1 className="mx-auto mt-5 max-w-3xl text-center font-serif text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[1.05]">
              La rigueur d&rsquo;une infirmière, la douceur d&rsquo;une{" "}
              <em className="text-brun">parenthèse</em>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="conteneur grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="lg:sticky lg:top-28">
            {/* TODO : remplacer par le portrait de Karianne dès réception. */}
            <div className="arche relative mx-auto aspect-[4/5] max-w-md shadow-[0_40px_70px_-40px_rgba(40,25,15,.45)]">
              <Image
                src="/images/soin-masque.jpg"
                alt="Soin du visage G.M. Collin à la clinique"
                fill
                preload
                sizes="(min-width: 1024px) 40vw, 28rem"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="max-w-prose">
            <Reveal>
              <h2 className="font-serif text-3xl sm:text-4xl">
                Bonjour, moi c&rsquo;est {clinique.fondatrice}
              </h2>
              <p className="mt-5 leading-relaxed">
                Infirmière de 28 ans, j&rsquo;ai passé les dernières années à prendre soin des gens
                — au sens le plus concret du terme. C&rsquo;est dans ce métier que j&rsquo;ai appris
                la rigueur, l&rsquo;écoute et l&rsquo;importance de chaque détail.
              </p>
              <p className="mt-4 leading-relaxed">
                La peau m&rsquo;a toujours fascinée : c&rsquo;est un organe à part entière, et il
                mérite mieux que des solutions improvisées. En me formant en esthétique et en soins
                du visage, j&rsquo;ai trouvé ma façon à moi de conjuguer science et bien-être.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-serif text-3xl sm:text-4xl">Pourquoi « La Parenthèse »?</h2>
              <p className="mt-5 leading-relaxed">
                Parce qu&rsquo;on court toutes, tout le temps. J&rsquo;ai voulu créer un endroit où
                le temps ralentit : une parenthèse dans votre semaine, où l&rsquo;on s&rsquo;occupe
                de vous et de votre peau — sans pression, sans chaîne de montage, sans vente forcée.
              </p>
              <p className="mt-4 leading-relaxed">
                La clinique vous accueille au 429, rue Barkoff, à Trois-Rivières, sur rendez-vous (
                {clinique.heuresResume.toLowerCase()}). Un espace intime, pensé pour que chaque
                visite soit un moment à vous.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-serif text-3xl sm:text-4xl">Pourquoi {clinique.partenaire}?</h2>
              <p className="mt-5 leading-relaxed">
                J&rsquo;ai choisi {clinique.partenaire} comme partenaire exclusif pour la même
                raison que j&rsquo;ai choisi les soins infirmiers : le sérieux. Une marque
                dermo-cosmétique d&rsquo;ici, appuyée par la recherche, avec des protocoles en
                cabine qui donnent de vrais résultats.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <div className="rounded-2xl bg-nude p-7">
                <p className="font-serif text-xl italic leading-relaxed text-encre">
                  <span aria-hidden className="text-brun">
                    ({" "}
                  </span>
                  Ma promesse est simple : des soins honnêtes, adaptés à votre peau, dans un endroit
                  où vous êtes attendue.
                  <span aria-hidden className="text-brun">
                    {" "}
                    )
                  </span>
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-brun">
                  {clinique.fondatrice}
                </p>
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/rendez-vous" className="btn btn-primaire">
                  Prendre rendez-vous
                </Link>
                <Link href="/soins" className="btn btn-secondaire">
                  Voir les soins
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
