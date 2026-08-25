import "server-only";
import type { FournisseurDonnees } from "./provider";
import { fournisseurMock } from "./mock";
import { fournisseurSquare } from "./square";

/**
 * Sélection du fournisseur de données :
 *   DATA_PROVIDER=mock   → données locales réalistes (développement/démo)
 *   DATA_PROVIDER=square → écosystème Square (défaut; sandbox ou production
 *                          selon SQUARE_ENVIRONMENT)
 *
 * Le défaut est volontairement `square` : sans clés, le site affiche le repli
 * doux « réservation bientôt disponible » plutôt que de faux créneaux.
 */
export function getFournisseur(): FournisseurDonnees {
  return process.env.DATA_PROVIDER === "mock" ? fournisseurMock : fournisseurSquare;
}

export type { FournisseurDonnees } from "./provider";
