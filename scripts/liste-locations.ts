/**
 * Étape 1 — Validation de la connexion Square sandbox.
 * Liste les locations du compte et aide à remplir SQUARE_LOCATION_ID.
 *
 *   npx tsx scripts/liste-locations.ts
 */
import { SquareClient, SquareEnvironment, SquareError } from "square";
import { config } from "dotenv";

config({ path: ".env.local" });

const token = process.env.SQUARE_ACCESS_TOKEN;
if (!token) {
  console.error("SQUARE_ACCESS_TOKEN manquant dans .env.local");
  process.exit(1);
}

const client = new SquareClient({
  token,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

async function principal() {
  try {
    const reponse = await client.locations.list();
    const locations = reponse.locations ?? [];
    console.log(`Connexion réussie — ${locations.length} location(s) dans le sandbox :\n`);
    for (const l of locations) {
      console.log(`  ID        : ${l.id}`);
      console.log(`  Nom       : ${l.name}`);
      console.log(`  Statut    : ${l.status}`);
      console.log(`  Fuseau    : ${l.timezone}`);
      console.log(`  Devise    : ${l.currency}`);
      console.log(`  Pays      : ${l.country}`);
      console.log("");
    }
  } catch (erreur) {
    if (erreur instanceof SquareError) {
      console.error("ÉCHEC de l'appel Locations API :");
      console.error(`  Statut HTTP : ${erreur.statusCode}`);
      for (const e of erreur.errors) {
        console.error(`  [${e.category}/${e.code}] ${e.detail ?? ""} ${e.field ?? ""}`);
      }
    } else {
      console.error("ÉCHEC (erreur réseau/inattendue) :", erreur);
    }
    process.exit(1);
  }
}

void principal();
