import { NextResponse, type NextRequest } from "next/server";
import { courrielValide, normaliserTelephone } from "@/lib/format";
import { getFournisseur } from "@/lib/data";
import {
  reponseDepuisErreurSquare,
  reponseErreur,
  reponseSquareNonConfigure,
} from "@/lib/data/square/erreurs";
import type { DemandeReservation } from "@/lib/data/types";

export const dynamic = "force-dynamic";

function chaine(valeur: unknown, max = 200): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

function validerDemande(corps: unknown): DemandeReservation | null {
  if (typeof corps !== "object" || corps === null) return null;
  const o = corps as Record<string, unknown>;
  const cliente = (o.cliente ?? {}) as Record<string, unknown>;

  const demande: DemandeReservation = {
    serviceVariationId: chaine(o.serviceVariationId, 64),
    serviceVariationVersion: chaine(o.serviceVariationVersion, 32) || null,
    teamMemberId: chaine(o.teamMemberId, 64),
    debut: chaine(o.debut, 40),
    dureeMinutes:
      typeof o.dureeMinutes === "number" && o.dureeMinutes > 0 && o.dureeMinutes <= 8 * 60
        ? Math.round(o.dureeMinutes)
        : null,
    cliente: {
      prenom: chaine(cliente.prenom, 80),
      nom: chaine(cliente.nom, 80),
      courriel: chaine(cliente.courriel, 160),
      telephone: chaine(cliente.telephone, 30),
    },
    note: chaine(o.note, 500) || undefined,
  };

  if (
    !demande.serviceVariationId ||
    !demande.teamMemberId ||
    Number.isNaN(Date.parse(demande.debut)) ||
    Date.parse(demande.debut) < Date.now() ||
    !demande.cliente.prenom ||
    !demande.cliente.nom ||
    !courrielValide(demande.cliente.courriel) ||
    !normaliserTelephone(demande.cliente.telephone)
  ) {
    return null;
  }

  if (demande.serviceVariationVersion && !/^\d+$/.test(demande.serviceVariationVersion)) {
    demande.serviceVariationVersion = null;
  }

  return demande;
}

/** Création du rendez-vous dans le calendrier de la clinique. */
export async function POST(requete: NextRequest) {
  const fournisseur = getFournisseur();
  if (!fournisseur.estConfigure()) return reponseSquareNonConfigure();

  let corps: unknown;
  try {
    corps = await requete.json();
  } catch {
    return reponseErreur("REQUETE_INVALIDE", "Corps de requête invalide.", 400);
  }

  const demande = validerDemande(corps);
  if (!demande) {
    return reponseErreur(
      "REQUETE_INVALIDE",
      "Vérifiez vos coordonnées (courriel et téléphone) et le créneau choisi.",
      400,
    );
  }

  try {
    const confirmation = await fournisseur.creerReservation(demande);
    return NextResponse.json(confirmation, { status: 201 });
  } catch (erreur) {
    return reponseDepuisErreurSquare(erreur);
  }
}
