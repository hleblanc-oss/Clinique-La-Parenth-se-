import type {
  ConfirmationReservation,
  Creneau,
  DemandeReservation,
  ServiceReservable,
} from "./types";

/**
 * Interface commune des fournisseurs de données du site.
 * - `square` : l'écosystème réel (Catalog, Bookings, Customers) — production et sandbox.
 * - `mock`   : données locales réalistes pour développer sans compte Square.
 * Sélection via la variable d'environnement DATA_PROVIDER (voir index.ts).
 */
export interface FournisseurDonnees {
  nom: "mock" | "square";
  /** Prêt à répondre? (mock : toujours; square : clés présentes dans l'environnement) */
  estConfigure(): boolean;
  /** Services réservables, avec prix et durées. */
  listerServices(): Promise<ServiceReservable[]>;
  /** Créneaux disponibles pour une variation de service dans la fenêtre donnée. */
  chercherDisponibilites(
    serviceVariationId: string,
    debutISO: string,
    finISO: string,
  ): Promise<Creneau[]>;
  /** Crée le rendez-vous (et la fiche cliente au besoin). */
  creerReservation(demande: DemandeReservation): Promise<ConfirmationReservation>;
  /** Inscrit un courriel à l'infolettre. */
  inscrireInfolettre(courriel: string): Promise<void>;
}
