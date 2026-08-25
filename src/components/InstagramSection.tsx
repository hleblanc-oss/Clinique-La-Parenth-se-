import { clinique } from "@/content/clinique";
import { SectionEtiquette } from "@/components/SectionEtiquette";
import { Reveal } from "@/components/Reveal";

/**
 * Section Instagram — tuiles décoratives menant au profil.
 * TODO Phase 1+ : brancher un flux réel (Behold.so ou API Instagram Graph)
 * pour afficher les derniers posts de @cliniquelaparenthese.
 */

const TUILES = [
  "from-sauge-clair to-sauge/50",
  "from-creme to-sauge-clair",
  "from-sauge/40 to-sauge-clair",
  "from-sauge-clair to-creme",
  "from-sauge/30 to-creme",
  "from-creme to-sauge/40",
];

export function InstagramSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="conteneur">
        <Reveal>
          <SectionEtiquette etiquette="Instagram" titre="Suivez la parenthèse" centre />
          <p className="mt-4 text-center">
            <a
              href={clinique.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sauge-fonce underline decoration-sauge underline-offset-4 transition-colors duration-[250ms] hover:text-noir"
            >
              {clinique.instagram.pseudo}
            </a>
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
          {TUILES.map((degrade, i) => (
            <Reveal key={i} delai={i * 0.08}>
              <a
                href={clinique.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Voir le profil Instagram ${clinique.instagram.pseudo}`}
                className="group block overflow-hidden rounded-xl"
              >
                <div
                  className={`flex aspect-square items-center justify-center bg-gradient-to-br ${degrade} transition-transform duration-300 ease-doux group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
                >
                  <span aria-hidden className="font-serif text-3xl text-sauge-fonce/50">
                    (&thinsp;)
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
