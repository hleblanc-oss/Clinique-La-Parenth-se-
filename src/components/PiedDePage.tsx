import Link from "next/link";
import { Logo } from "@/components/Logo";
import { InfolettreForm } from "@/components/InfolettreForm";
import { clinique, adresseComplete, lienGoogleMaps, lienTelephone } from "@/content/clinique";

const titreColonne = "font-sans text-[0.7rem] font-medium uppercase tracking-[0.22em] text-peche";

export function PiedDePage() {
  return (
    <footer className="bg-brun pb-28 text-creme md:pb-0">
      {/* Infolettre */}
      <div className="border-b border-creme/20">
        <div className="conteneur grid gap-8 py-14 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-3xl text-creme sm:text-4xl">
              Restez dans la parenthèse
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-creme/90">
              Nouveautés, conseils de soins et offres de la clinique : quelques courriels par année,
              rien de plus.
            </p>
          </div>
          <InfolettreForm />
        </div>
      </div>

      <div className="conteneur grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Logo variante="clair" className="w-full max-w-[14.5rem]" />
          <p className="mt-5 max-w-[18em] font-serif text-xl italic leading-snug text-creme">
            {clinique.slogan}.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-peche">
            Produits {clinique.partenaire}
          </p>
        </div>

        <div>
          <h3 className={titreColonne}>Adresse</h3>
          <p className="mt-4 text-[0.92rem] leading-relaxed">
            {clinique.adresse.rue}
            <br />
            {clinique.adresse.ville} ({clinique.adresse.province}) {clinique.adresse.codePostal}
          </p>
          <a
            href={lienGoogleMaps}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Itinéraire vers ${adresseComplete}`}
            className="mt-2 inline-block text-[0.92rem] underline decoration-peche/60 underline-offset-4 transition-colors duration-[250ms] hover:text-peche"
          >
            Itinéraire
          </a>
        </div>

        <div>
          <h3 className={titreColonne}>Heures</h3>
          <dl className="mt-4 space-y-1.5 text-[0.92rem]">
            {clinique.heures.map((h) => (
              <div key={h.jours} className="flex justify-between gap-4">
                <dt>{h.jours}</dt>
                <dd>{h.heures}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[0.82rem] text-creme/90">Sur rendez-vous seulement</p>
        </div>

        <div>
          <h3 className={titreColonne}>Nous joindre</h3>
          <ul className="mt-4 space-y-1.5 text-[0.92rem]">
            <li>
              <a
                href={lienTelephone}
                className="transition-colors duration-[250ms] hover:text-peche"
              >
                {clinique.telephone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${clinique.courriel}`}
                className="break-all transition-colors duration-[250ms] hover:text-peche"
              >
                {clinique.courriel}
              </a>
            </li>
            <li>
              <a
                href={clinique.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-[250ms] hover:text-peche"
              >
                Instagram {clinique.instagram.pseudo}
              </a>
            </li>
          </ul>
          <Link href="/rendez-vous" className="btn btn-clair mt-5">
            Prendre rendez-vous
          </Link>
        </div>
      </div>

      <div className="border-t border-creme/20">
        <div className="conteneur flex flex-col gap-3 py-6 text-xs text-creme/90 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {clinique.nom}. Tous droits réservés.
          </p>
          <nav aria-label="Liens du pied de page" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/soins" className="hover:text-peche">
              Soins et tarifs
            </Link>
            <Link href="/a-propos" className="hover:text-peche">
              Karianne
            </Link>
            <Link href="/contact" className="hover:text-peche">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
