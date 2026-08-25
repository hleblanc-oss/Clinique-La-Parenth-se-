import "server-only";
import { SquareError } from "square";
import { NextResponse } from "next/server";
import type { CodeErreurApi } from "../types";

export function reponseErreur(code: CodeErreurApi, message: string, statut: number) {
  return NextResponse.json({ code, message }, { status: statut });
}

export function reponseSquareNonConfigure() {
  return reponseErreur(
    "SQUARE_NON_CONFIGURE",
    "La réservation en ligne n'est pas encore activée.",
    503,
  );
}

/** Mappe une erreur du SDK vers une réponse API douce (sans détail technique côté client). */
export function reponseDepuisErreurSquare(erreur: unknown) {
  if (erreur instanceof SquareError) {
    const details = erreur.errors.map((e) => `${e.code} ${e.detail ?? ""}`).join(" ");
    // Créneau devenu indisponible entre l'affichage et la confirmation.
    if (
      erreur.statusCode === 400 &&
      /availab|no longer|not available|conflict|already/i.test(details)
    ) {
      return reponseErreur(
        "CRENEAU_PRIS",
        "Ce créneau vient tout juste d'être réservé. Choisissez-en un autre.",
        409,
      );
    }
    console.error("[square]", erreur.statusCode, details || erreur.message);
  } else {
    console.error("[square]", erreur);
  }
  return reponseErreur(
    "SQUARE_ERREUR",
    "Un pépin technique est survenu de notre côté. Réessayez dans quelques minutes.",
    502,
  );
}
