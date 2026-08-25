"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PanneauRepli } from "./PanneauRepli";
import {
  cleJour,
  courrielValide,
  formatDateComplete,
  formatDateLongue,
  formatDuree,
  formatHeure,
  formatPrix,
  normaliserNom,
} from "@/lib/format";
import type {
  ConfirmationReservation,
  Creneau,
  ReponseDisponibilites,
  ReponseServices,
  ServiceReservable,
} from "@/lib/data/types";

/**
 * Flux de réservation 100 % custom sur la Bookings API :
 * service → créneau (temps réel) → coordonnées → confirmation.
 */

const JOURS_PAR_FENETRE = 7;
const MAX_SEMAINES = 8;

type Etape = 1 | 2 | 3 | 4;

const ETAPES: { numero: Etape; libelle: string }[] = [
  { numero: 1, libelle: "Le soin" },
  { numero: 2, libelle: "Le moment" },
  { numero: 3, libelle: "Vos coordonnées" },
];

function fenetreSemaine(offset: number): { debut: Date; fin: Date } {
  const debut = new Date();
  debut.setDate(debut.getDate() + offset * JOURS_PAR_FENETRE);
  if (offset > 0) debut.setHours(0, 0, 0, 0);
  const fin = new Date(debut);
  fin.setDate(fin.getDate() + JOURS_PAR_FENETRE);
  fin.setHours(23, 59, 59, 999);
  return { debut, fin };
}

function trouverServicePreselectionne(
  services: ServiceReservable[],
  cible: { nomSquare: string; nom: string },
): ServiceReservable | undefined {
  const nomSquare = normaliserNom(cible.nomSquare);
  const nom = normaliserNom(cible.nom);
  return (
    services.find((s) => normaliserNom(s.nom) === nomSquare) ??
    services.find((s) => normaliserNom(s.nom) === nom) ??
    services.find(
      (s) => normaliserNom(s.nom).includes(nomSquare) || nomSquare.includes(normaliserNom(s.nom)),
    )
  );
}

export function ReservationFlow({
  soinPreselectionne,
}: {
  soinPreselectionne?: { nomSquare: string; nom: string };
}) {
  const mouvementReduit = useReducedMotion();

  const [etape, setEtape] = useState<Etape>(1);
  const [configure, setConfigure] = useState<boolean | null>(null);
  const [erreurServices, setErreurServices] = useState(false);
  const [services, setServices] = useState<ServiceReservable[]>([]);
  const [service, setService] = useState<ServiceReservable | null>(null);

  const [semaine, setSemaine] = useState(0);
  const [creneaux, setCreneaux] = useState<Creneau[] | null>(null);
  const [erreurCreneaux, setErreurCreneaux] = useState(false);
  const [creneau, setCreneau] = useState<Creneau | null>(null);

  const [envoi, setEnvoi] = useState(false);
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null);
  const [erreurFormulaire, setErreurFormulaire] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<
    (ConfirmationReservation & { recapService: string }) | null
  >(null);

  const preselection = useRef(soinPreselectionne);

  /* Services depuis le catalogue Square, puis présélection éventuelle. */
  useEffect(() => {
    const controleur = new AbortController();
    (async () => {
      try {
        const reponse = await fetch("/api/reservation/services", {
          signal: controleur.signal,
        });
        if (!reponse.ok) throw new Error();
        const corps = (await reponse.json()) as ReponseServices;
        setConfigure(corps.configure);
        setServices(corps.services);

        // Arrivée via « Réserver ce soin » : on saute directement au choix du moment.
        const cible = preselection.current;
        preselection.current = undefined;
        if (cible && corps.services.length) {
          const trouve = trouverServicePreselectionne(corps.services, cible);
          if (trouve) {
            setService(trouve);
            setEtape(2);
          }
        }
      } catch {
        if (!controleur.signal.aborted) {
          setConfigure(true);
          setErreurServices(true);
        }
      }
    })();
    return () => controleur.abort();
  }, []);

  /* Disponibilités temps réel — le fetch seulement; les réinitialisations
     d'état se font dans les gestionnaires d'événements. */
  useEffect(() => {
    if (etape !== 2 || !service) return;
    const controleur = new AbortController();
    const { debut, fin } = fenetreSemaine(semaine);
    const params = new URLSearchParams({
      service: service.variationId,
      debut: debut.toISOString(),
      fin: fin.toISOString(),
    });
    (async () => {
      try {
        const reponse = await fetch(`/api/reservation/disponibilites?${params}`, {
          signal: controleur.signal,
        });
        if (!reponse.ok) throw new Error();
        const corps = (await reponse.json()) as ReponseDisponibilites;
        setCreneaux(corps.creneaux);
      } catch {
        if (!controleur.signal.aborted) setErreurCreneaux(true);
      }
    })();
    return () => controleur.abort();
  }, [etape, service, semaine]);

  function reinitialiserCreneaux() {
    setCreneaux(null);
    setCreneau(null);
    setErreurCreneaux(false);
  }

  function allerAuMoment() {
    reinitialiserCreneaux();
    setSemaine(0);
    setErreurEnvoi(null);
    setEtape(2);
  }

  function changerSemaine(offset: number) {
    reinitialiserCreneaux();
    setSemaine(offset);
  }

  const parJour = useMemo(() => {
    const groupes = new Map<string, Creneau[]>();
    for (const c of creneaux ?? []) {
      const jour = cleJour(c.debut);
      const liste = groupes.get(jour) ?? [];
      liste.push(c);
      groupes.set(jour, liste);
    }
    return [...groupes.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [creneaux]);

  /* Étape 3 — envoi */
  async function reserver(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!service || !creneau) return;
    const donnees = new FormData(e.currentTarget);
    const cliente = {
      prenom: String(donnees.get("prenom") ?? "").trim(),
      nom: String(donnees.get("nom") ?? "").trim(),
      courriel: String(donnees.get("courriel") ?? "").trim(),
      telephone: String(donnees.get("telephone") ?? "").trim(),
    };
    const note = String(donnees.get("note") ?? "").trim();

    if (!cliente.prenom || !cliente.nom) {
      setErreurFormulaire("Veuillez indiquer votre prénom et votre nom.");
      return;
    }
    if (!courrielValide(cliente.courriel)) {
      setErreurFormulaire("Veuillez entrer une adresse courriel valide.");
      return;
    }
    if (cliente.telephone.replace(/\D/g, "").length < 10) {
      setErreurFormulaire("Veuillez entrer un numéro de téléphone à 10 chiffres.");
      return;
    }

    setErreurFormulaire(null);
    setErreurEnvoi(null);
    setEnvoi(true);
    try {
      const reponse = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceVariationId: service.variationId,
          serviceVariationVersion: creneau.versionVariation ?? service.version,
          teamMemberId: creneau.teamMemberId,
          debut: creneau.debut,
          dureeMinutes: creneau.dureeMinutes ?? service.dureeMinutes,
          cliente,
          note: note || undefined,
        }),
      });

      if (reponse.status === 201) {
        const corps = (await reponse.json()) as ConfirmationReservation;
        setConfirmation({ ...corps, recapService: service.nom });
        setEtape(4);
        return;
      }

      if (reponse.status === 409) {
        reinitialiserCreneaux();
        setEtape(2);
        setErreurEnvoi(
          "Oups — ce créneau vient tout juste d'être réservé. Choisissez-en un autre.",
        );
        return;
      }

      const corps = (await reponse.json().catch(() => null)) as { message?: string } | null;
      setErreurEnvoi(
        corps?.message ?? "Un pépin technique est survenu. Réessayez dans quelques minutes.",
      );
    } catch {
      setErreurEnvoi("Un pépin technique est survenu. Vérifiez votre connexion et réessayez.");
    } finally {
      setEnvoi(false);
    }
  }

  /* Rendu */

  if (configure === false) {
    return (
      <PanneauRepli
        titre="La réservation en ligne arrive très bientôt"
        message="Nous mettons la touche finale à la prise de rendez-vous en ligne. D'ici là, écrivez-nous et nous vous trouverons un moment avec plaisir."
      />
    );
  }

  if (erreurServices) {
    return (
      <PanneauRepli
        titre="Petit contretemps de notre côté"
        message="La réservation en ligne est momentanément indisponible. Réessayez dans quelques minutes, ou écrivez-nous — nous vous trouverons un moment avec plaisir."
      />
    );
  }

  const transition = {
    initial: mouvementReduit ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: mouvementReduit ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit: { opacity: 0 },
  };

  return (
    <div>
      {/* Stepper */}
      {etape < 4 && (
        <ol className="mb-10 flex items-center justify-center gap-2 sm:gap-4">
          {ETAPES.map((e, i) => (
            <li key={e.numero} className="flex items-center gap-2 sm:gap-4">
              {i > 0 && <span aria-hidden className="h-px w-6 bg-sauge sm:w-10" />}
              <span
                aria-current={etape === e.numero ? "step" : undefined}
                className={`flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.12em] sm:text-xs ${
                  etape === e.numero
                    ? "text-noir"
                    : etape > e.numero
                      ? "text-sauge-fonce"
                      : "text-texte-doux/50"
                }`}
              >
                <span
                  aria-hidden
                  className={`flex h-7 w-7 items-center justify-center rounded-full border font-sans text-xs ${
                    etape === e.numero
                      ? "border-noir bg-noir text-creme"
                      : etape > e.numero
                        ? "border-sauge-fonce bg-sauge-clair text-sauge-fonce"
                        : "border-texte-doux/30"
                  }`}
                >
                  {etape > e.numero ? "✓" : e.numero}
                </span>
                <span className="hidden sm:inline">{e.libelle}</span>
              </span>
            </li>
          ))}
        </ol>
      )}

      <AnimatePresence mode="wait">
        {/* Étape 1 — choix du soin */}
        {etape === 1 && (
          <motion.div
            key="etape-1"
            {...transition}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-serif text-2xl">Choisissez votre soin</h2>
            {configure === null ? (
              <div aria-label="Chargement des soins" role="status" className="mt-6 space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-[4.5rem] w-full" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="mt-6">
                <PanneauRepli
                  titre="Aucun soin réservable pour le moment"
                  message="Le calendrier de réservation s'active bientôt. Écrivez-nous et nous vous trouverons un moment avec plaisir."
                />
              </div>
            ) : (
              <div role="radiogroup" aria-label="Soins offerts" className="mt-6 space-y-3">
                {services.map((s) => (
                  <button
                    key={s.variationId}
                    type="button"
                    role="radio"
                    aria-checked={service?.variationId === s.variationId}
                    onClick={() => setService(s)}
                    className={`flex w-full items-baseline justify-between gap-4 rounded-2xl border p-5 text-left transition-colors duration-[250ms] ${
                      service?.variationId === s.variationId
                        ? "border-sauge-fonce bg-sauge-clair"
                        : "border-noir/10 bg-creme hover:border-sauge-fonce/50"
                    }`}
                  >
                    <span>
                      <span className="block font-serif text-lg leading-snug text-noir">
                        {s.nom}
                      </span>
                      {s.dureeMinutes ? (
                        <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-sauge-fonce">
                          {formatDuree(s.dureeMinutes)}
                        </span>
                      ) : null}
                    </span>
                    {s.prixCents !== null && (
                      <span className="shrink-0 font-sans font-medium text-noir">
                        {formatPrix(s.prixCents)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="btn btn-primaire"
                disabled={!service}
                onClick={allerAuMoment}
              >
                Choisir le moment
              </button>
            </div>
          </motion.div>
        )}

        {/* Étape 2 — choix du créneau */}
        {etape === 2 && service && (
          <motion.div
            key="etape-2"
            {...transition}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-2xl">Choisissez votre moment</h2>
              <p className="text-sm text-sauge-fonce">{service.nom}</p>
            </div>

            {erreurEnvoi && (
              <p role="alert" className="mt-4 rounded-xl bg-sauge-clair p-4 text-sm">
                {erreurEnvoi}
              </p>
            )}

            {/* Navigation de semaine */}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                className="btn btn-secondaire px-5 py-2 text-[0.7rem]"
                onClick={() => changerSemaine(Math.max(0, semaine - 1))}
                disabled={semaine === 0 || (creneaux === null && !erreurCreneaux)}
              >
                ‹ Précédente
              </button>
              <p aria-live="polite" className="text-center text-sm font-medium text-noir">
                {semaine === 0
                  ? "Les 7 prochains jours"
                  : `Semaine du ${formatDateLongue(fenetreSemaine(semaine).debut.toISOString())}`}
              </p>
              <button
                type="button"
                className="btn btn-secondaire px-5 py-2 text-[0.7rem]"
                onClick={() => changerSemaine(Math.min(MAX_SEMAINES - 1, semaine + 1))}
                disabled={semaine >= MAX_SEMAINES - 1 || (creneaux === null && !erreurCreneaux)}
              >
                Suivante ›
              </button>
            </div>

            {/* Créneaux */}
            <div aria-live="polite" className="mt-6 min-h-40">
              {erreurCreneaux ? (
                <PanneauRepli
                  titre="Les disponibilités ne répondent pas"
                  message="Impossible d'afficher le calendrier pour l'instant. Réessayez dans quelques minutes, ou écrivez-nous."
                />
              ) : creneaux === null ? (
                <div
                  role="status"
                  aria-label="Chargement des disponibilités"
                  className="space-y-6"
                >
                  {[0, 1].map((i) => (
                    <div key={i}>
                      <div className="skeleton h-5 w-48" />
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {[0, 1, 2, 3, 4].map((j) => (
                          <div key={j} className="skeleton h-11 w-24 rounded-full" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : parJour.length === 0 ? (
                <div className="rounded-2xl bg-sauge-clair p-8 text-center">
                  <p className="font-serif text-xl text-noir">
                    Aucune disponibilité cette semaine
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">
                    L&rsquo;horaire se remplit vite — jetez un œil à la semaine suivante.
                  </p>
                  {semaine < MAX_SEMAINES - 1 && (
                    <button
                      type="button"
                      className="btn btn-primaire mt-5"
                      onClick={() => changerSemaine(semaine + 1)}
                    >
                      Voir la semaine suivante
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-7">
                  {parJour.map(([jour, liste]) => (
                    <section key={jour} aria-label={formatDateLongue(liste[0].debut)}>
                      <h3 className="font-serif text-lg text-noir">
                        {formatDateLongue(liste[0].debut)}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {liste.map((c) => {
                          const choisi =
                            creneau?.debut === c.debut &&
                            creneau.teamMemberId === c.teamMemberId;
                          return (
                            <button
                              key={`${c.debut}-${c.teamMemberId}`}
                              type="button"
                              aria-pressed={choisi}
                              onClick={() => setCreneau(c)}
                              className={`rounded-full border px-5 py-2.5 font-sans text-sm transition-colors duration-[250ms] ${
                                choisi
                                  ? "border-noir bg-noir text-creme"
                                  : "border-noir/15 bg-creme text-noir hover:border-sauge-fonce hover:bg-sauge-clair"
                              }`}
                            >
                              {formatHeure(c.debut)}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between gap-3">
              <button
                type="button"
                className="btn btn-secondaire"
                onClick={() => {
                  reinitialiserCreneaux();
                  setErreurEnvoi(null);
                  setEtape(1);
                }}
              >
                ‹ Retour
              </button>
              <button
                type="button"
                className="btn btn-primaire"
                disabled={!creneau}
                onClick={() => {
                  setErreurEnvoi(null);
                  setEtape(3);
                }}
              >
                Continuer
              </button>
            </div>
          </motion.div>
        )}

        {/* Étape 3 — coordonnées */}
        {etape === 3 && service && creneau && (
          <motion.div
            key="etape-3"
            {...transition}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-serif text-2xl">Vos coordonnées</h2>

            {/* Récapitulatif */}
            <div className="mt-6 rounded-2xl bg-sauge-clair p-6">
              <p className="font-serif text-lg text-noir">{service.nom}</p>
              <p className="mt-1 text-sm">
                {formatDateComplete(creneau.debut)} à {formatHeure(creneau.debut)}
              </p>
              <p className="mt-1 text-sm text-sauge-fonce">
                {[
                  formatDuree(creneau.dureeMinutes ?? service.dureeMinutes),
                  service.prixCents !== null ? formatPrix(service.prixCents) : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            <form onSubmit={reserver} noValidate className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="rv-prenom" className="etiquette">
                    Prénom
                  </label>
                  <input
                    id="rv-prenom"
                    name="prenom"
                    autoComplete="given-name"
                    required
                    className="champ"
                  />
                </div>
                <div>
                  <label htmlFor="rv-nom" className="etiquette">
                    Nom
                  </label>
                  <input
                    id="rv-nom"
                    name="nom"
                    autoComplete="family-name"
                    required
                    className="champ"
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="rv-courriel" className="etiquette">
                    Courriel
                  </label>
                  <input
                    id="rv-courriel"
                    name="courriel"
                    type="email"
                    autoComplete="email"
                    required
                    className="champ"
                    placeholder="vous@exemple.com"
                  />
                </div>
                <div>
                  <label htmlFor="rv-telephone" className="etiquette">
                    Téléphone
                  </label>
                  <input
                    id="rv-telephone"
                    name="telephone"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="champ"
                    placeholder="819 555 0123"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="rv-note" className="etiquette">
                  Note (facultatif)
                </label>
                <textarea
                  id="rv-note"
                  name="note"
                  rows={3}
                  className="champ resize-y"
                  placeholder="Allergies, préoccupations, première visite…"
                />
              </div>

              <div aria-live="polite">
                {erreurFormulaire && (
                  <p className="text-sm text-sauge-fonce">{erreurFormulaire}</p>
                )}
                {erreurEnvoi && (
                  <p role="alert" className="rounded-xl bg-sauge-clair p-4 text-sm">
                    {erreurEnvoi}
                  </p>
                )}
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <button
                  type="button"
                  className="btn btn-secondaire"
                  onClick={() => {
                    reinitialiserCreneaux();
                    setEtape(2);
                  }}
                  disabled={envoi}
                >
                  ‹ Retour
                </button>
                <button type="submit" className="btn btn-primaire" disabled={envoi}>
                  {envoi ? "Réservation en cours…" : "Confirmer le rendez-vous"}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Étape 4 — confirmation */}
        {etape === 4 && confirmation && (
          <motion.div
            key="etape-4"
            {...transition}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <span
              aria-hidden
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sauge-clair font-serif text-3xl text-sauge-fonce"
            >
              ✓
            </span>
            <h2 className="mt-6 font-serif text-3xl text-noir">C&rsquo;est réservé!</h2>
            <p className="mx-auto mt-4 max-w-md leading-relaxed">
              <span className="font-medium text-noir">{confirmation.recapService}</span>
              <br />
              {formatDateComplete(confirmation.debut)} à {formatHeure(confirmation.debut)}
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-texte-doux">
              Votre rendez-vous est inscrit à l&rsquo;horaire de la clinique. Une confirmation
              et un rappel vous seront envoyés automatiquement.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/" className="btn btn-primaire">
                Retour à l&rsquo;accueil
              </Link>
              <Link href="/soins" className="btn btn-secondaire">
                Découvrir les autres soins
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
