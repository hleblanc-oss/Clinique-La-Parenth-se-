import { NextResponse, type NextRequest } from "next/server";
import { getFournisseur } from "@/lib/data";
import {
  reponseDepuisErreurSquare,
  reponseErreur,
  reponseSquareNonConfigure,
} from "@/lib/data/square/erreurs";
import type { ReponseDisponibilites } from "@/lib/data/types";

export const dynamic = "force-dynamic";

const FENETRE_MAX_JOURS = 32; // SearchAvailability accepte au plus 32 jours par requête.

function dateValide(valeur: string | null): valeur is string {
  return Boolean(valeur && !Number.isNaN(Date.parse(valeur)));
}

/** Créneaux disponibles en temps réel (`?service=<variationId>&debut=<ISO>&fin=<ISO>`). */
export async function GET(requete: NextRequest) {
  const fournisseur = getFournisseur();
  if (!fournisseur.estConfigure()) return reponseSquareNonConfigure();

  const params = requete.nextUrl.searchParams;
  const service = params.get("service");
  const debut = params.get("debut");
  const fin = params.get("fin");

  if (!service || !dateValide(debut) || !dateValide(fin)) {
    return reponseErreur("REQUETE_INVALIDE", "Paramètres de recherche invalides.", 400);
  }

  const debutMs = Date.parse(debut);
  const finMs = Date.parse(fin);
  if (finMs <= debutMs || finMs - debutMs > FENETRE_MAX_JOURS * 24 * 3600 * 1000) {
    return reponseErreur("REQUETE_INVALIDE", "Fenêtre de recherche invalide.", 400);
  }

  // Square exige une plage qui commence dans le futur.
  const maintenant = Date.now();
  const debutEffectif = debutMs < maintenant ? new Date(maintenant + 60_000).toISOString() : debut;
  if (Date.parse(debutEffectif) >= finMs) {
    const corps: ReponseDisponibilites = { creneaux: [] };
    return NextResponse.json(corps);
  }

  try {
    const creneaux = await fournisseur.chercherDisponibilites(service, debutEffectif, fin);
    const corps: ReponseDisponibilites = { creneaux };
    return NextResponse.json(corps);
  } catch (erreur) {
    return reponseDepuisErreurSquare(erreur);
  }
}
