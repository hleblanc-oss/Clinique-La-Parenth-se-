import "server-only";
import type { FournisseurDonnees } from "../provider";
import type {
  ConfirmationReservation,
  Creneau,
  DemandeReservation,
  ServiceReservable,
} from "../types";
import { soins } from "@/content/soins";

/**
 * Fournisseur mock — développer et démontrer le site sans compte Square.
 * Reproduit l'horaire de la clinique : mardi et mercredi, 9 h à 19 h,
 * fuseau America/Toronto, délai minimum de 4 h comme sur Square.
 * Déterministe (pas de hasard entre deux rendus).
 */

const FUSEAU = "America/Toronto";

/** Horaire hebdomadaire (0 = dimanche … 6 = samedi) : [ouverture, fermeture) en heures locales. */
const HORAIRE: Record<number, [number, number] | undefined> = {
  2: [9, 19],
  3: [9, 19],
};

/** Délai minimum avant un rendez-vous (réglage « cutoff » de Square : 4 h). */
const DELAI_MINIMUM_MS = 4 * 3600_000;

const PAS_MINUTES = 45;

function partiesLocales(instant: Date): {
  annee: number;
  mois: number;
  jour: number;
  jourSemaine: number;
} {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSEAU,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const parties = fmt.formatToParts(instant);
  const valeur = (type: string) => parties.find((p) => p.type === type)?.value ?? "";
  const jours = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    annee: Number(valeur("year")),
    mois: Number(valeur("month")),
    jour: Number(valeur("day")),
    jourSemaine: jours.indexOf(valeur("weekday")),
  };
}

/** Décalage (minutes à soustraire de l'heure locale pour obtenir l'UTC) au moment donné. */
function decalageMinutes(instant: Date): number {
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: FUSEAU, timeZoneName: "longOffset" });
  const nom =
    fmt.formatToParts(instant).find((p) => p.type === "timeZoneName")?.value ?? "GMT+00:00";
  const m = nom.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 0;
  const signe = m[1] === "-" ? -1 : 1;
  return signe * (Number(m[2]) * 60 + Number(m[3]));
}

/** Instant UTC correspondant à une heure locale de Toronto pour une date donnée. */
function instantLocal(
  annee: number,
  mois: number,
  jour: number,
  heures: number,
  minutes: number,
): Date {
  const approx = new Date(Date.UTC(annee, mois - 1, jour, heures, minutes));
  const decalage = decalageMinutes(approx);
  return new Date(approx.getTime() - decalage * 60_000);
}

/** Retrait déterministe d'environ un créneau sur trois, pour un horaire réaliste. */
function creneauRetire(jour: number, heures: number, minutes: number): boolean {
  return (jour * 5 + heures * 2 + Math.floor(minutes / 15)) % 3 === 0;
}

function genererCreneaux(dureeMinutes: number, debutISO: string, finISO: string): Creneau[] {
  const debut = new Date(debutISO);
  const fin = new Date(finISO);
  const creneaux: Creneau[] = [];

  for (let t = debut.getTime(); t < fin.getTime(); t += 24 * 3600_000) {
    const local = partiesLocales(new Date(t));
    const plage = HORAIRE[local.jourSemaine];
    if (!plage) continue;
    const [ouverture, fermeture] = plage;

    for (
      let minute = ouverture * 60;
      minute + dureeMinutes <= fermeture * 60;
      minute += PAS_MINUTES
    ) {
      const h = Math.floor(minute / 60);
      const m = minute % 60;
      if (creneauRetire(local.jour, h, m)) continue;
      const instant = instantLocal(local.annee, local.mois, local.jour, h, m);
      if (instant < debut || instant >= fin || instant.getTime() < Date.now() + DELAI_MINIMUM_MS)
        continue;
      creneaux.push({
        debut: instant.toISOString(),
        teamMemberId: "mock-karianne",
        dureeMinutes,
        versionVariation: "1",
      });
    }
  }

  creneaux.sort((a, b) => a.debut.localeCompare(b.debut));
  return creneaux;
}

/** Comme au catalogue Square : une variation par soin, plus « avec peeling » quand offerte. */
const services: ServiceReservable[] = soins.flatMap((soin) => {
  const base: ServiceReservable = {
    variationId: `mock-${soin.slug}`,
    version: "1",
    nom: soin.nom,
    slug: soin.slug,
    avecPeeling: false,
    prixCents: soin.prix * 100,
    dureeMinutes: soin.dureeMinutes,
  };
  if (!soin.avecPeeling) return [base];
  return [
    base,
    {
      ...base,
      variationId: `mock-${soin.slug}-peeling`,
      nom: `${soin.nom} avec peeling`,
      avecPeeling: true,
      prixCents: soin.avecPeeling.prix * 100,
      dureeMinutes: soin.avecPeeling.dureeMinutes,
    },
  ];
});

export const fournisseurMock: FournisseurDonnees = {
  nom: "mock",
  estConfigure: () => true,

  async listerServices() {
    return services;
  },

  async chercherDisponibilites(serviceVariationId, debutISO, finISO) {
    const service = services.find((s) => s.variationId === serviceVariationId);
    if (!service) return [];
    return genererCreneaux(service.dureeMinutes ?? 60, debutISO, finISO);
  },

  async creerReservation(demande: DemandeReservation): Promise<ConfirmationReservation> {
    return {
      reservationId: `mock-${demande.serviceVariationId}-${new Date(demande.debut).getTime().toString(36)}`,
      debut: demande.debut,
    };
  },

  async inscrireInfolettre() {
    // Aucun stockage en mode mock.
  },
};
