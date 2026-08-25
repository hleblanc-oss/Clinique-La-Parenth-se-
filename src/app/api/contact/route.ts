import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Formulaire de contact.
 *
 * TODO avant lancement : brancher un service d'envoi de courriels (par ex.
 * Resend) et le courriel officiel de la clinique. Tant que ce n'est pas fait,
 * la route répond 503 et le formulaire affiche le repli (Instagram/téléphone)
 * — aucun message ne peut se perdre en silence.
 */
export async function POST(requete: NextRequest) {
  try {
    await requete.json();
  } catch {
    return NextResponse.json(
      { code: "REQUETE_INVALIDE", message: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      code: "SERVICE_NON_CONFIGURE",
      message: "Le formulaire de contact n'est pas encore en service.",
    },
    { status: 503 },
  );
}
