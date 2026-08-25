import { NextResponse } from "next/server";
import { getFournisseur } from "@/lib/data";
import { reponseDepuisErreurSquare } from "@/lib/data/square/erreurs";
import type { ReponseServices } from "@/lib/data/types";

export const dynamic = "force-dynamic";

/** Services réservables depuis le fournisseur actif (Square ou mock). */
export async function GET() {
  const fournisseur = getFournisseur();

  if (!fournisseur.estConfigure()) {
    const corps: ReponseServices = { configure: false, services: [] };
    return NextResponse.json(corps);
  }

  try {
    const services = await fournisseur.listerServices();
    const corps: ReponseServices = { configure: true, services };
    return NextResponse.json(corps, {
      headers: { "Cache-Control": "private, max-age=60" },
    });
  } catch (erreur) {
    return reponseDepuisErreurSquare(erreur);
  }
}
