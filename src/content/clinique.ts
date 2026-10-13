/**
 * Informations de la clinique — source unique pour tout le site.
 * Tirées de la page de réservation Square de la clinique (octobre 2026).
 * TODO : nom de domaine confirmé (URL_SITE).
 */

export const URL_SITE = "https://cliniquelaparenthese.ca";

export const clinique = {
  nom: "Clinique La Parenthèse",
  slogan: "Dermo-esthétique par une infirmière",
  fondatrice: "Karianne",
  fondatriceNomComplet: "Karianne Nadeau-Berthiaume",
  partenaire: "G.M. Collin",
  adresse: {
    rue: "429, rue Barkoff",
    ville: "Trois-Rivières",
    province: "Québec",
    codePostal: "G8T 2A5",
  },
  telephone: "(819) 386-1636",
  courriel: "clinique.laparenthese@gmail.com",
  instagram: {
    pseudo: "@cliniquelaparenthese",
    url: "https://www.instagram.com/cliniquelaparenthese/",
  },
  /** Heures d'ouverture, sur rendez-vous. */
  heures: [
    { jours: "Mardi", heures: "9 h à 19 h" },
    { jours: "Mercredi", heures: "9 h à 19 h" },
    { jours: "Autres jours", heures: "Fermé" },
  ],
  heuresResume: "Mardi et mercredi, 9 h à 19 h",
  /** Horaires pour les données structurées (schema.org). */
  heuresSchema: ["Tu 09:00-19:00", "We 09:00-19:00"],
  politiqueAnnulation:
    "Annulation ou déplacement sans frais jusqu'à 48 h avant le rendez-vous. Moins de 48 h avant, ou en cas d'absence sans préavis : frais de 50 $.",
} as const;

export const adresseComplete = `${clinique.adresse.rue}, ${clinique.adresse.ville} (${clinique.adresse.province}) ${clinique.adresse.codePostal}`;

export const lienTelephone = `tel:+1${clinique.telephone.replace(/\D/g, "")}`;

export const lienGoogleMaps =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(
    `${clinique.adresse.rue}, ${clinique.adresse.ville}, QC ${clinique.adresse.codePostal}`,
  );
