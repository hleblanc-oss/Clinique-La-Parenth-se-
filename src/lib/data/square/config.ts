/**
 * Configuration Square — variables d'environnement UNIQUEMENT côté serveur.
 * Ne jamais importer ce module (ni le SDK `square`) dans un composant client.
 *
 * Développement et tests en mode Sandbox avant tout passage en production
 * (SQUARE_ENVIRONMENT=sandbox).
 */

export type EnvironnementSquare = "sandbox" | "production";

export function environnementSquare(): EnvironnementSquare {
  return process.env.SQUARE_ENVIRONMENT === "production" ? "production" : "sandbox";
}

export function accessTokenSquare(): string | undefined {
  return process.env.SQUARE_ACCESS_TOKEN || undefined;
}

export function locationIdSquare(): string | undefined {
  return process.env.SQUARE_LOCATION_ID || undefined;
}

/** Vrai quand les identifiants minimum sont présents pour appeler l'API. */
export function squareEstConfigure(): boolean {
  return Boolean(accessTokenSquare() && locationIdSquare());
}
