import Link from "next/link";
import { clinique, adresseComplete, lienGoogleMaps } from "@/content/clinique";
import { InfolettreForm } from "@/components/InfolettreForm";

export function PiedDePage() {
  return (
    <footer className="bg-noir text-creme">
      {/* Infolettre */}
      <div className="border-b border-creme/10">
        <div className="conteneur grid gap-8 py-14 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-3xl text-creme">Restez dans la parenthèse</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-creme/70">
              Nouveautés, conseils de soins et offres d&rsquo;ouverture — quelques courriels par
              année, rien de plus.
            </p>
          </div>
          <InfolettreForm />
        </div>
      </div>

      {/* Colonnes */}
      <div className="conteneur grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-serif text-2xl tracking-[0.06em]">
            <span aria-hidden className="text-sauge">
              ({" "}
            </span>
            La&nbsp;Parenthèse
            <span aria-hidden className="text-sauge">
              {" "}
              )
            </span>
          </p>
          <p className="mt-3 font-serif text-sm italic text-creme/70">{clinique.slogan}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-sauge">
            Partenaire exclusif {clinique.partenaire}
          </p>
        </div>

        <div>
          <h3 className="font-sans text-xs font-medium uppercase tracking-[0.16em] text-creme/50">
            Navigation
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              { href: "/soins", libelle: "Soins et tarifs" },
              { href: "/rendez-vous", libelle: "Prendre rendez-vous" },
              { href: "/a-propos", libelle: "À propos" },
              { href: "/contact", libelle: "Contact" },
            ].map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  className="text-creme/80 transition-colors duration-[250ms] hover:text-sauge"
                >
                  {lien.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs font-medium uppercase tracking-[0.16em] text-creme/50">
            La clinique
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-creme/80">
            <li>
              <a
                href={lienGoogleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-[250ms] hover:text-sauge"
              >
                {adresseComplete}
              </a>
            </li>
            <li>{clinique.heures}</li>
            {clinique.telephone && (
              <li>
                <a
                  href={`tel:${clinique.telephone.replace(/\D/g, "")}`}
                  className="transition-colors duration-[250ms] hover:text-sauge"
                >
                  {clinique.telephone}
                </a>
              </li>
            )}
            <li className="text-creme/60">Ouverture : {clinique.ouverture}</li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs font-medium uppercase tracking-[0.16em] text-creme/50">
            Suivez-nous
          </h3>
          <a
            href={clinique.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-creme/80 transition-colors duration-[250ms] hover:text-sauge"
          >
            Instagram — {clinique.instagram.pseudo}
          </a>
          <p className="mt-6 text-sm leading-relaxed text-creme/60">
            La boutique en ligne {clinique.partenaire} arrive bientôt. En attendant, tous les
            produits sont offerts en clinique.
          </p>
        </div>
      </div>

      <div className="border-t border-creme/10">
        <div className="conteneur flex flex-col gap-2 py-6 text-xs text-creme/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {clinique.nom}. Tous droits réservés.
          </p>
          <p>Trois-Rivières, Québec</p>
        </div>
      </div>
    </footer>
  );
}
