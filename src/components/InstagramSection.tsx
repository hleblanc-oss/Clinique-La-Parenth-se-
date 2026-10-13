import Image from "next/image";
import { clinique } from "@/content/clinique";
import { Reveal } from "@/components/Reveal";

/**
 * Section Instagram : tuiles en arche menant au profil.
 * TODO : brancher le vrai fil (Behold.so ou API Instagram Graph) pour
 * afficher les derniers posts de @cliniquelaparenthese.
 */

const TUILES: ({ src: string } | null)[] = [
  { src: "/images/soin-collagene.jpg" },
  null,
  { src: "/images/soin-masque.jpg" },
  null,
  { src: "/images/soin-peeling.jpg" },
  null,
];

export function InstagramSection() {
  return (
    <section className="pb-20 sm:pb-28">
      <div className="conteneur">
        <Reveal className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-4xl sm:text-5xl">Suivez la parenthèse</h2>
          <a
            href={clinique.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-caramel pb-1.5 text-[0.82rem] font-medium tracking-[0.12em] text-brun transition-colors duration-[250ms] hover:border-brun"
          >
            {clinique.instagram.pseudo}
          </a>
        </Reveal>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-3.5 lg:grid-cols-6">
          {TUILES.map((tuile, i) => (
            <Reveal key={i} delai={(i % 3) * 0.08}>
              <a
                href={clinique.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Voir le profil Instagram ${clinique.instagram.pseudo}`}
                className="arche relative block aspect-[3/4] transition-transform duration-300 ease-doux motion-safe:hover:-translate-y-1"
              >
                {tuile ? (
                  <Image
                    src={tuile.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 16vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center bg-gradient-to-br from-nude to-peche font-serif text-3xl text-caramel">
                    (&thinsp;)
                  </span>
                )}
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
