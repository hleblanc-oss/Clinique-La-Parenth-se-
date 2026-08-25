/** Formatage des dates, heures et prix — français québécois, fuseau de Trois-Rivières. */

export const FUSEAU_CLINIQUE = "America/Toronto";

export function formatPrix(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "";
  const dollars = cents / 100;
  const entier = Number.isInteger(dollars);
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: entier ? 0 : 2,
    maximumFractionDigits: entier ? 0 : 2,
  }).format(dollars);
}

export function formatDuree(minutes: number | null | undefined): string {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}

export function formatDateLongue(iso: string): string {
  const texte = new Intl.DateTimeFormat("fr-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: FUSEAU_CLINIQUE,
  }).format(new Date(iso));
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export function formatDateComplete(iso: string): string {
  const texte = new Intl.DateTimeFormat("fr-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: FUSEAU_CLINIQUE,
  }).format(new Date(iso));
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export function formatHeure(iso: string): string {
  return new Intl.DateTimeFormat("fr-CA", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: FUSEAU_CLINIQUE,
  })
    .format(new Date(iso))
    .replace(":", " h ");
}

/** Clé AAAA-MM-JJ d'un instant, dans le fuseau de la clinique. */
export function cleJour(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: FUSEAU_CLINIQUE,
  }).format(new Date(iso));
}

/** Comparaison de noms tolérante (accents, casse, ponctuation) pour apparier Square et le contenu local. */
export function normaliserNom(nom: string): string {
  return nom
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function courrielValide(courriel: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(courriel.trim());
}

/** Normalise un numéro nord-américain vers le format E.164 (attendu par Square). */
export function normaliserTelephone(brut: string): string | null {
  const chiffres = brut.replace(/\D/g, "");
  if (chiffres.length === 10) return `+1${chiffres}`;
  if (chiffres.length === 11 && chiffres.startsWith("1")) return `+${chiffres}`;
  return null;
}
