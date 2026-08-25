/**
 * Informations de la clinique — source unique pour tout le site.
 * TODO avant lancement : téléphone et courriel officiels de la clinique,
 * heures d'ouverture définitives, nom de domaine confirmé.
 */

export const URL_SITE = "https://cliniquelaparenthese.ca";

export const clinique = {
  nom: "Clinique La Parenthèse",
  slogan: "Dermo-esthétique par une infirmière clinicienne",
  fondatrice: "Karianne",
  ouverture: "septembre 2026",
  partenaire: "G.M. Collin",
  adresse: {
    rue: "429, rue Barkoff",
    ville: "Trois-Rivières",
    province: "Québec",
    codePostal: "G8T 2A5",
  },
  /** TODO : numéro officiel de la clinique (affiché en fallback quand Square est indisponible). */
  telephone: null as string | null,
  /** TODO : courriel officiel de la clinique. */
  courriel: null as string | null,
  instagram: {
    pseudo: "@cliniquelaparenthese",
    url: "https://www.instagram.com/cliniquelaparenthese/",
  },
  heures: "Sur rendez-vous",
} as const;

export const adresseComplete = `${clinique.adresse.rue}, ${clinique.adresse.ville} (${clinique.adresse.province}) ${clinique.adresse.codePostal}`;

export const lienGoogleMaps =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`${clinique.adresse.rue}, ${clinique.adresse.ville}, QC ${clinique.adresse.codePostal}`);
