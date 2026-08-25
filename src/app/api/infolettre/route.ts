import { NextResponse, type NextRequest } from "next/server";
import { courrielValide } from "@/lib/format";
import { getFournisseur } from "@/lib/data";
import {
  reponseDepuisErreurSquare,
  reponseErreur,
  reponseSquareNonConfigure,
} from "@/lib/data/square/erreurs";

export const dynamic = "force-dynamic";

/**
 * Inscription à l'infolettre : la personne est enregistrée comme cliente
 * (Customers API en mode Square) avec une note « infolettre ». Square
 * Marketing — inclus dans l'écosystème de la cliente — peut ensuite cibler
 * ces profils.
 */
export async function POST(requete: NextRequest) {
  let courriel = "";
  try {
    const corps = (await requete.json()) as { courriel?: unknown };
    courriel = typeof corps.courriel === "string" ? corps.courriel.trim().toLowerCase() : "";
  } catch {
    return reponseErreur("REQUETE_INVALIDE", "Corps de requête invalide.", 400);
  }

  if (!courrielValide(courriel) || courriel.length > 160) {
    return reponseErreur("REQUETE_INVALIDE", "Adresse courriel invalide.", 400);
  }

  const fournisseur = getFournisseur();
  if (!fournisseur.estConfigure()) return reponseSquareNonConfigure();

  try {
    await fournisseur.inscrireInfolettre(courriel);
    return NextResponse.json({ ok: true });
  } catch (erreur) {
    return reponseDepuisErreurSquare(erreur);
  }
}
