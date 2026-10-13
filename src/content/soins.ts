import { normaliserNom } from "@/lib/format";

/**
 * Carte des soins — contenu éditorial du site.
 *
 * Tiré de la page de réservation Square de la clinique (octobre 2026) :
 * 7 soins, prix, durées et déroulement de chaque soin. Square reste la source
 * de vérité pour ce qui est réservable (prix et durées du flux de réservation);
 * cette liste sert à l'affichage éditorial et de repli si l'API est indisponible.
 */

export type CategorieSoin = "consultation" | "visage" | "peeling" | "corps";

export interface Soin {
  slug: string;
  nom: string;
  /**
   * Mot-clé qui identifie le soin dans les noms du catalogue Square
   * (ex. « soin hydrolift l G.M Collin » → « hydrolift »), comparé sans accents.
   */
  motCle: string;
  categorie: CategorieSoin;
  sousTitre: string;
  accroche: string;
  description: string[];
  pourQui: string[];
  /** Préoccupations ciblées, affichées en petit dans la carte des soins. */
  preoccupations: string[];
  deroulement: string[];
  resultats: string[];
  precautions?: { titre: string; elements: string[] }[];
  conseil?: string;
  prix: number;
  prixAffiche: string;
  duree: string;
  dureeMinutes: number;
  /** Option peeling offerte (variation « avec peeling » au catalogue Square). */
  avecPeeling?: { prix: number; dureeMinutes: number };
  /** Avantage mis en évidence (ex. consultation gratuite si un soin suit). */
  bonus?: string;
  photo?: { src: string; alt: string };
  /** Porte d'entrée recommandée. */
  vedette?: boolean;
  ordre: number;
}

export const PRIX_AJOUT_PEELING = 30;

const PHOTO_MASQUE = {
  src: "/images/soin-masque.jpg",
  alt: "Cliente détendue pendant un soin du visage, masque G.M. Collin appliqué",
};
const PHOTO_COLLAGENE = {
  src: "/images/soin-collagene.jpg",
  alt: "Soin du visage G.M. Collin en cabine",
};
const PHOTO_PEELING = {
  src: "/images/soin-peeling.jpg",
  alt: "Application d'un peeling au pinceau pendant un soin du visage",
};

export const soins: Soin[] = [
  {
    slug: "consultation-analyse-de-peau",
    nom: "Consultation et analyse de peau",
    motCle: "consultation",
    categorie: "consultation",
    sousTitre: "Le point de départ idéal",
    accroche:
      "Parce qu'une belle peau commence par une bonne évaluation. On cible vos préoccupations et on bâtit un plan de soins personnalisé.",
    description: [
      "Parce qu'une belle peau commence par une bonne évaluation. Cette consultation permet d'analyser les besoins de votre peau, de cibler vos préoccupations et de créer un plan de traitement personnalisé.",
      "Grâce à son regard d'infirmière, Karianne tient compte de vos sensibilités, de vos antécédents et de votre médication pour vous proposer des soins réalistes et sécuritaires.",
      "Vous repartez avec des recommandations professionnelles claires, en clinique comme à la maison, pour atteindre des résultats durables.",
    ],
    pourQui: [
      "Toute nouvelle cliente de la clinique",
      "Vous ne savez pas quel soin choisir",
      "Votre peau change (saison, hormones, médication) et votre routine ne suit plus",
    ],
    preoccupations: ["Nouvelle cliente", "Vous hésitez"],
    deroulement: [
      "Analyse des besoins de votre peau",
      "Discussion de vos préoccupations et de vos objectifs",
      "Plan de soins personnalisé",
      "Recommandations professionnelles pour la maison",
    ],
    resultats: [
      "Un plan de soins clair et adapté à votre peau",
      "Des réponses professionnelles à vos questions",
      "Une routine maison simple à suivre",
    ],
    prix: 25,
    prixAffiche: "25 $",
    duree: "20 min",
    dureeMinutes: 20,
    bonus: "Gratuite si vous réservez un soin ensuite",
    vedette: true,
    ordre: 1,
  },
  {
    slug: "soin-oxygenant",
    nom: "Soin Oxygénant",
    motCle: "oxygenant",
    categorie: "visage",
    sousTitre: "Peau grasse et à tendance acnéique",
    accroche: "Purifie et hydrate la peau pour lui redonner son éclat et un teint radieux.",
    description: [
      "Le soin Oxygénant G.M. Collin est conçu pour purifier et hydrater la peau. Il lui permet de retrouver son éclat et un teint radieux.",
      "Il convient tout particulièrement aux peaux grasses ou à tendance acnéique, qu'il assainit sans les assécher. L'analyse de votre peau est incluse.",
    ],
    pourQui: [
      "Peau grasse ou mixte",
      "Tendance acnéique ou imperfections récurrentes",
      "Teint terne qui manque d'éclat",
    ],
    preoccupations: ["Peau grasse", "Acné", "Teint terne"],
    deroulement: [
      "Nettoyage de la peau",
      "Exfoliation",
      "Extraction des points noirs au besoin",
      "Application du sérum",
      "Masque et court massage pendant le temps de pause",
      "Crème de fin de soin et court massage du visage",
      "Contour des yeux et hydratant pour les lèvres",
    ],
    resultats: [
      "Peau purifiée et hydratée",
      "Teint frais et lumineux",
      "Imperfections apaisées avec des soins réguliers",
    ],
    prix: 135,
    prixAffiche: "135 $",
    duree: "1 h 30",
    dureeMinutes: 90,
    photo: PHOTO_MASQUE,
    ordre: 2,
  },
  {
    slug: "soin-algomask",
    nom: "Soin Algomask",
    motCle: "algomask",
    categorie: "visage",
    sousTitre: "Peau sensible ou déshydratée",
    accroche:
      "Calme et hydrate les peaux sensibles, diminue l'apparence des rougeurs et donne un coup d'éclat.",
    description: [
      "Le soin Algomask G.M. Collin est conçu pour calmer et hydrater les peaux sensibles, leur redonner un coup d'éclat et diminuer l'apparence des rougeurs.",
      "C'est le soin réconfort par excellence, avec un massage du décolleté et des épaules. L'analyse de votre peau est incluse, et un peeling peut y être ajouté.",
    ],
    pourQui: [
      "Peau sensible ou réactive, sujette aux rougeurs",
      "Peau déshydratée, qui tiraille",
      "Besoin d'apaisement après l'hiver ou le soleil",
    ],
    preoccupations: ["Rougeurs", "Peau sensible", "Déshydratation"],
    deroulement: [
      "Double nettoyage de la peau",
      "Exfoliation ou peeling (+30 $)",
      "Extraction des points noirs au besoin",
      "Application de la lotion",
      "Masque",
      "Massage du décolleté et des épaules, puis temps de pause",
      "Application du sérum",
      "Crème de fin de soin et court massage du visage",
      "Soin des yeux et des lèvres",
    ],
    resultats: ["Rougeurs visiblement diminuées", "Peau hydratée et confortable", "Éclat immédiat"],
    prix: 130,
    prixAffiche: "130 $",
    duree: "1 h 30",
    dureeMinutes: 90,
    avecPeeling: { prix: 160, dureeMinutes: 90 },
    photo: PHOTO_MASQUE,
    ordre: 3,
  },
  {
    slug: "soin-hydrolifting",
    nom: "Soin Hydrolifting",
    motCle: "hydrolift",
    categorie: "visage",
    sousTitre: "Visage et cou",
    accroche:
      "Hydratation intense pour un coup d'éclat immédiat. Améliore visiblement l'élasticité de la peau et l'apparence des ridules.",
    description: [
      "Formulé pour le visage et le cou, le soin Hydrolifting G.M. Collin procure une hydratation intense pour un coup d'éclat immédiat.",
      "Il améliore visiblement l'élasticité et l'apparence de la peau, ainsi que les rides et ridules. L'analyse de votre peau est incluse, et un peeling peut y être ajouté.",
    ],
    pourQui: [
      "Peau déshydratée qui manque de rebond",
      "Premiers signes de relâchement, rides et ridules",
      "Envie d'un coup d'éclat avant un événement",
    ],
    preoccupations: ["Fermeté", "Hydratation", "Ridules"],
    deroulement: [
      "Double nettoyage de la peau",
      "Exfoliation ou peeling (+30 $)",
      "Extraction des points noirs au besoin",
      "Sérum hydratant",
      "Masque raffermissant",
      "Massage du décolleté et des épaules, puis temps de pause",
      "Crème de fin de soin et court massage du visage",
      "Concentré liftant",
      "Soin des yeux et des lèvres",
    ],
    resultats: [
      "Hydratation intense, éclat immédiat",
      "Peau visiblement plus élastique",
      "Ridules atténuées",
    ],
    prix: 135,
    prixAffiche: "135 $",
    duree: "1 h 15",
    dureeMinutes: 75,
    avecPeeling: { prix: 165, dureeMinutes: 90 },
    photo: PHOTO_COLLAGENE,
    ordre: 4,
  },
  {
    slug: "soin-collagene-90",
    nom: "Soin Collagène 90+",
    motCle: "collagene",
    categorie: "visage",
    sousTitre: "Anti-âge et réparation",
    accroche:
      "Le soin régénérant réputé de G.M. Collin : rides et ridules visiblement atténuées, peau repulpée et radieuse.",
    description: [
      "Hautement réputé, ce soin intensément régénérateur réduit visiblement les rides et ridules. Il procure une hydratation profonde : la peau est plus radieuse, plus ferme et repulpée.",
      "Il comprend un massage de 15 minutes des bras, des épaules et du décolleté. L'analyse de votre peau est incluse, et un peeling peut y être ajouté.",
    ],
    pourQui: [
      "Rides, ridules, perte de fermeté",
      "Peau mature ou dévitalisée",
      "Envie d'offrir à votre peau un soin complet",
    ],
    preoccupations: ["Rides", "Anti-âge", "Éclat"],
    deroulement: [
      "Nettoyage en profondeur de la peau",
      "Exfoliation ou peeling (+30 $)",
      "Extraction des points noirs au besoin",
      "Sérum intensif",
      "Masque en feuille",
      "Massage de 15 minutes des bras, des épaules et du décolleté, puis 15 minutes de pause",
      "Crème de fin de soin",
      "Soin des yeux et des lèvres",
    ],
    resultats: [
      "Rides et ridules visiblement atténuées",
      "Peau repulpée, ferme et radieuse",
      "Hydratation en profondeur",
    ],
    prix: 150,
    prixAffiche: "150 $",
    duree: "1 h 30",
    dureeMinutes: 90,
    avecPeeling: { prix: 180, dureeMinutes: 90 },
    photo: PHOTO_COLLAGENE,
    ordre: 5,
  },
  {
    slug: "peeling",
    nom: "Peeling",
    motCle: "peeling seul",
    categorie: "peeling",
    sousTitre: "Soin peeling seul",
    accroche:
      "Exfolie les couches supérieures de la peau, affine la texture et atténue l'apparence des taches et des marques d'acné.",
    description: [
      "Le peeling favorise l'exfoliation des couches supérieures de la peau : il élimine les cellules mortes et améliore la texture de la peau.",
      "Il permet aussi de réduire l'apparence des taches pigmentaires et des signes visibles du vieillissement, et d'atténuer l'apparence des cicatrices d'acné.",
    ],
    pourQui: [
      "Grain de peau irrégulier, texture rugueuse",
      "Taches pigmentaires ou marques d'acné",
      "Signes visibles du vieillissement",
    ],
    preoccupations: ["Texture", "Taches", "Marques d'acné"],
    deroulement: [
      "Préparation de la peau",
      "Application du peeling choisi pour votre peau",
      "Neutralisation et apaisement",
      "Protection solaire",
    ],
    resultats: [
      "Texture affinée",
      "Teint plus uniforme",
      "Taches et marques atténuées au fil des séances",
    ],
    precautions: [
      {
        titre: "Les 3 jours avant",
        elements: [
          "Évitez tout traitement d'électrolyse, de laser, d'épilation à la cire ou de crème dépilatoire.",
          "Cessez votre exfoliant et tout produit contenant de l'acide salicylique, du rétinol sur ordonnance ou du peroxyde de benzoyle.",
        ],
      },
      {
        titre: "Après le traitement",
        elements: [
          "Ne lavez pas votre visage pendant les 6 à 8 heures suivantes.",
          "Protégez votre peau avec un FPS 30 ou plus et évitez les grosses expositions au soleil pendant au moins une semaine (ou tant que la peau pèle).",
          "Ne frottez pas, ne pincez pas et ne tirez pas votre peau.",
          "Évitez toute grosse source de chaleur pendant les 24 premières heures.",
          "Ne vous maquillez pas pendant 24 heures.",
          "Attendez 48 heures, ou que la desquamation et les rougeurs aient disparu, avant de reprendre votre exfoliant ou tout produit contenant de l'acide salicylique, du rétinol sur ordonnance ou du peroxyde de benzoyle.",
        ],
      },
    ],
    conseil:
      "Pour des résultats optimaux, une cure de 3 à 6 traitements espacés de 4 semaines est fortement recommandée. Nous pourrons en discuter lors de votre rendez-vous.",
    prix: 80,
    prixAffiche: "80 $",
    duree: "30 min",
    dureeMinutes: 30,
    photo: PHOTO_PEELING,
    ordre: 6,
  },
  {
    slug: "soin-du-dos",
    nom: "Soin du dos",
    motCle: "dos",
    categorie: "corps",
    sousTitre: "Purifiant et hydratant",
    accroche:
      "Purifie, exfolie et hydrate la peau du dos en profondeur, avec un vrai moment de détente.",
    description: [
      "Offrez à votre dos l'attention qu'il mérite. Ce soin purifie, exfolie et hydrate la peau en profondeur tout en procurant un véritable moment de détente.",
      "Idéal pour retrouver une peau douce, lumineuse et revitalisée.",
    ],
    pourQui: [
      "Imperfections ou rugosités dans le dos",
      "Peau sèche ou déshydratée",
      "Envie d'un vrai moment de détente",
    ],
    preoccupations: ["Imperfections", "Hydratation", "Détente"],
    deroulement: [
      "Nettoyage en profondeur de la peau",
      "Application de l'exfoliant",
      "Extraction des comédons",
      "Massage du dos (5 minutes)",
      "Application de la lotion",
      "Masque",
      "Crème de fin de soin",
    ],
    resultats: [
      "Peau nette, douce et lumineuse",
      "Hydratation en profondeur",
      "Imperfections apaisées",
    ],
    prix: 120,
    prixAffiche: "120 $",
    duree: "1 h 15",
    dureeMinutes: 75,
    ordre: 7,
  },
];

export const soinParSlug = (slug: string): Soin | undefined => soins.find((s) => s.slug === slug);

/**
 * Retrouve le soin éditorial correspondant à un nom du catalogue Square
 * (« Soin Collagène 90+ l G.M Collin ( Anti-âge et réparation) » → Collagène 90+).
 */
export function apparierSoin(nomCatalogue: string): Soin | undefined {
  const nom = ` ${normaliserNom(nomCatalogue)} `;
  return soins.find((s) => nom.includes(` ${normaliserNom(s.motCle)} `));
}

/** Groupes de la carte des soins, dans l'ordre d'affichage. */
export const groupesCarte: { titre: string; slugs: string[] }[] = [
  { titre: "Pour commencer", slugs: ["consultation-analyse-de-peau"] },
  {
    titre: "Soins du visage",
    slugs: ["soin-oxygenant", "soin-algomask", "soin-hydrolifting", "soin-collagene-90"],
  },
  { titre: "Peeling", slugs: ["peeling"] },
  { titre: "Soin du corps", slugs: ["soin-du-dos"] },
];

export const categoriesLibelles: Record<CategorieSoin, string> = {
  consultation: "Consultation",
  visage: "Soins du visage",
  peeling: "Peeling",
  corps: "Soin du corps",
};
