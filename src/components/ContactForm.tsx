"use client";

import { useState } from "react";
import { clinique } from "@/content/clinique";
import { courrielValide } from "@/lib/format";

type Etat = "repos" | "envoi" | "succes" | "indisponible" | "erreur";

export function ContactForm() {
  const [etat, setEtat] = useState<Etat>("repos");

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formulaire = e.currentTarget;
    const donnees = new FormData(formulaire);
    const nom = String(donnees.get("nom") ?? "").trim();
    const courriel = String(donnees.get("courriel") ?? "").trim();
    const message = String(donnees.get("message") ?? "").trim();

    if (!nom || !courrielValide(courriel) || !message) {
      setEtat("erreur");
      return;
    }

    setEtat("envoi");
    try {
      const reponse = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, courriel, message }),
      });
      if (reponse.ok) {
        setEtat("succes");
        formulaire.reset();
      } else {
        setEtat("indisponible");
      }
    } catch {
      setEtat("indisponible");
    }
  }

  if (etat === "succes") {
    return (
      <div role="status" className="rounded-2xl bg-sauge-clair p-7">
        <p className="font-serif text-xl italic text-noir">Merci pour votre message!</p>
        <p className="mt-2 text-sm leading-relaxed">
          Nous vous répondrons dès que possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={envoyer} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-nom" className="etiquette">
            Votre nom
          </label>
          <input
            id="contact-nom"
            name="nom"
            type="text"
            autoComplete="name"
            required
            className="champ"
            placeholder="Prénom et nom"
          />
        </div>
        <div>
          <label htmlFor="contact-courriel" className="etiquette">
            Votre courriel
          </label>
          <input
            id="contact-courriel"
            name="courriel"
            type="email"
            autoComplete="email"
            required
            className="champ"
            placeholder="vous@exemple.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="etiquette">
          Votre message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="champ resize-y"
          placeholder="Comment pouvons-nous vous aider?"
        />
      </div>

      <div aria-live="polite">
        {etat === "erreur" && (
          <p className="text-sm text-sauge-fonce">
            Veuillez remplir tous les champs avec une adresse courriel valide.
          </p>
        )}
        {etat === "indisponible" && (
          <p className="rounded-xl bg-sauge-clair/70 p-4 text-sm leading-relaxed">
            Le formulaire n&rsquo;est pas encore en service. En attendant, écrivez-nous sur{" "}
            <a
              href={clinique.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sauge-fonce underline decoration-sauge underline-offset-2"
            >
              Instagram
            </a>
            {clinique.telephone ? (
              <>
                {" "}
                ou appelez-nous au{" "}
                <a
                  href={`tel:${clinique.telephone.replace(/\D/g, "")}`}
                  className="font-medium text-sauge-fonce"
                >
                  {clinique.telephone}
                </a>
              </>
            ) : null}
            .
          </p>
        )}
      </div>

      <button type="submit" disabled={etat === "envoi"} className="btn btn-primaire">
        {etat === "envoi" ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}
