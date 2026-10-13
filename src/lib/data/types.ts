/**
 * Types partagés entre les routes API et le client (JSON sérialisable —
 * les bigint du SDK sont convertis en number/string côté serveur).
 */

export interface ServiceReservable {
  /** ID de la variation de service (CatalogItemVariation) — requis pour réserver. */
  variationId: string;
  /** Version du catalogue, requise par CreateBooking (bigint sérialisé en chaîne). */
  version: string;
  /** Nom affiché (nom éditorial du soin quand il est reconnu, sinon nom du catalogue). */
  nom: string;
  /** Soin éditorial correspondant (src/content/soins.ts), s'il est reconnu. */
  slug: string | null;
  /** Variation « avec peeling » d'un soin (option +30 $). */
  avecPeeling: boolean;
  prixCents: number | null;
  dureeMinutes: number | null;
}

export interface Creneau {
  /** Début du rendez-vous (RFC 3339, UTC). */
  debut: string;
  teamMemberId: string;
  dureeMinutes: number | null;
  /** Version de la variation renvoyée par la recherche de disponibilités. */
  versionVariation: string | null;
}

export interface ReponseServices {
  configure: boolean;
  services: ServiceReservable[];
}

export interface ReponseDisponibilites {
  creneaux: Creneau[];
}

export interface DemandeReservation {
  serviceVariationId: string;
  serviceVariationVersion: string | null;
  teamMemberId: string;
  debut: string;
  dureeMinutes?: number | null;
  cliente: {
    prenom: string;
    nom: string;
    courriel: string;
    telephone: string;
  };
  note?: string;
}

export interface ConfirmationReservation {
  reservationId: string;
  debut: string;
}

export type CodeErreurApi =
  | "SQUARE_NON_CONFIGURE"
  | "REQUETE_INVALIDE"
  | "CRENEAU_PRIS"
  | "SQUARE_ERREUR";

export interface ErreurApi {
  code: CodeErreurApi;
  message: string;
}
