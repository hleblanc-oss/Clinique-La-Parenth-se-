import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { clinique, adresseComplete, lienGoogleMaps, lienTelephone } from "@/content/clinique";

export const metadata: Metadata = {
  title: "Contact",
  description: `${clinique.nom} — ${adresseComplete}. Sur rendez-vous. Écrivez-nous ou réservez en ligne.`,
};

export default function Contact() {
  const adresseRequete = encodeURIComponent(
    `${clinique.adresse.rue}, ${clinique.adresse.ville}, QC ${clinique.adresse.codePostal}`,
  );

  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="conteneur">
          <Reveal>
            <p className="surtitre text-center">Contact</p>
            <h1 className="mx-auto mt-5 max-w-2xl text-center font-serif text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[1.05]">
              Au plaisir de vous <em className="text-brun">recevoir</em>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-center font-serif text-xl italic text-brun">
              Sur rendez-vous : {clinique.heuresResume.toLowerCase()}.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="conteneur grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Coordonnées + carte */}
          <div>
            <Reveal>
              <div className="rounded-2xl border border-encre/8 bg-creme p-7">
                <h2 className="font-serif text-2xl">La clinique</h2>
                <dl className="mt-5 space-y-4 text-sm leading-relaxed">
                  <div>
                    <dt className="etiquette">Adresse</dt>
                    <dd>
                      <a
                        href={lienGoogleMaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-[250ms] hover:text-brun"
                      >
                        {adresseComplete}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="etiquette">Heures</dt>
                    <dd>
                      {clinique.heures.map((h) => (
                        <span key={h.jours} className="block">
                          {h.jours} : {h.heures}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="etiquette">Téléphone</dt>
                    <dd>
                      <a
                        href={lienTelephone}
                        className="transition-colors duration-[250ms] hover:text-brun"
                      >
                        {clinique.telephone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="etiquette">Courriel</dt>
                    <dd>
                      <a
                        href={`mailto:${clinique.courriel}`}
                        className="break-all transition-colors duration-[250ms] hover:text-brun"
                      >
                        {clinique.courriel}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="etiquette">Instagram</dt>
                    <dd>
                      <a
                        href={clinique.instagram.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-[250ms] hover:text-brun"
                      >
                        {clinique.instagram.pseudo}
                      </a>
                    </dd>
                  </div>
                </dl>
                <Link href="/rendez-vous" className="btn btn-primaire mt-7 w-full sm:w-auto">
                  Prendre rendez-vous
                </Link>
              </div>
            </Reveal>

            <Reveal className="mt-6">
              <div className="overflow-hidden rounded-2xl border border-encre/8">
                <iframe
                  title={`Carte — ${clinique.nom}, ${adresseComplete}`}
                  src={`https://www.google.com/maps?q=${adresseRequete}&output=embed`}
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>

          {/* Formulaire */}
          <div>
            <Reveal>
              <h2 className="font-serif text-2xl">Écrivez-nous</h2>
              <p className="mt-3 text-sm leading-relaxed">
                Une question sur un soin, votre peau ou la clinique? Laissez-nous un mot.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
