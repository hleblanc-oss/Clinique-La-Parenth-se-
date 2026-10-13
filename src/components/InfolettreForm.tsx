"use client";

import { useState } from "react";
import { clinique } from "@/content/clinique";
import { courrielValide } from "@/lib/format";

type Etat = "repos" | "envoi" | "succes" | "indisponible" | "erreur";

export function InfolettreForm() {
  const [courriel, setCourriel] = useState("");
  const [etat, setEtat] = useState<Etat>("repos");

  async function inscrire(e: React.FormEvent) {
    e.preventDefault();
    if (!courrielValide(courriel)) {
      setEtat("erreur");
      return;
    }
    setEtat("envoi");
    try {
      const reponse = await fetch("/api/infolettre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courriel }),
      });
      if (reponse.ok) {
        setEtat("succes");
        setCourriel("");
      } else if (reponse.status === 503) {
        setEtat("indisponible");
      } else {
        setEtat("erreur");
      }
    } catch {
      setEtat("indisponible");
    }
  }

  if (etat === "succes") {
    return (
      <p role="status" className="font-serif text-lg italic text-peche">
        Merci! Vous êtes bien inscrite — à très bientôt.
      </p>
    );
  }

  return (
    <form onSubmit={inscrire} className="w-full" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="infolettre-courriel" className="sr-only">
          Votre courriel
        </label>
        <input
          id="infolettre-courriel"
          type="email"
          name="courriel"
          autoComplete="email"
          required
          placeholder="Votre courriel"
          value={courriel}
          onChange={(e) => {
            setCourriel(e.target.value);
            if (etat === "erreur") setEtat("repos");
          }}
          aria-invalid={etat === "erreur" ? true : undefined}
          className="w-full rounded-full border border-creme/45 bg-transparent px-6 py-3.5 text-creme placeholder:text-creme/75 transition-colors duration-[250ms] focus:border-peche focus:outline-none"
        />
        <button type="submit" disabled={etat === "envoi"} className="btn btn-clair shrink-0">
          {etat === "envoi" ? "Un instant…" : "S'inscrire"}
        </button>
      </div>
      <div aria-live="polite" className="min-h-[1.25rem]">
        {etat === "erreur" && (
          <p className="mt-2 text-sm text-peche">Veuillez entrer une adresse courriel valide.</p>
        )}
        {etat === "indisponible" && (
          <p className="mt-2 text-sm text-creme/90">
            L&rsquo;inscription en ligne arrive bientôt. D&rsquo;ici là, suivez-nous sur{" "}
            <a
              href={clinique.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-peche underline-offset-4 hover:text-peche"
            >
              Instagram
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}
