/**
 * Carte des soins — contenu éditorial du site.
 *
 * Les prix et durées reflètent le catalogue Square de la cliente (source de
 * vérité). Le flux de réservation interroge Square en temps réel; cette liste
 * sert à l'affichage éditorial (descriptions longues, « pour qui? », etc.)
 * et de repli visuel si l'API est indisponible.
 */

export type CategorieSoin = "visage" | "peeling" | "consultation" | "corps";

export interface Soin {
  slug: string;
  nom: string;
  /** Nom tel qu'il apparaît dans le catalogue Square (pour l'appariement). */
  nomSquare: string;
  categorie: CategorieSoin;
  accroche: string;
  description: string[];
  pourQui: string[];
  deroulement: string[];
  resultats: string[];
  prix: number;
  prixAffiche: string;
  duree: string;
  dureeMinutes: number;
  /** Option ajoutée à un autre soin — non réservable seule. */
  option?: boolean;
  /** Mis en avant comme porte d'entrée recommandée. */
  vedette?: boolean;
  ordre: number;
}

export const soins: Soin[] = [
  {
    slug: "consultation-analyse-de-peau",
    nom: "Consultation et analyse de peau",
    nomSquare: "Consultation / analyse de peau",
    categorie: "consultation",
    accroche:
      "Évaluation complète de vos besoins et plan de soins personnalisé — le point de départ idéal.",
    description: [
      "Chaque peau a son histoire. Avant de proposer quoi que ce soit, Karianne prend le temps de comprendre la vôtre : votre type de peau, vos préoccupations, votre routine actuelle et vos objectifs.",
      "Grâce à son regard d'infirmière, l'analyse va au-delà de l'esthétique : état de la barrière cutanée, sensibilités, antécédents et contre-indications sont pris en compte pour bâtir un plan de soins réaliste et sécuritaire.",
      "Vous repartez avec des recommandations claires : le soin en cabine le mieux adapté, une routine maison simple et, si vous le souhaitez, un calendrier de suivi.",
    ],
    pourQui: [
      "Toute nouvelle cliente de la clinique — c'est la porte d'entrée recommandée",
      "Vous ne savez pas quel soin choisir",
      "Votre peau change (saison, hormones, médication) et votre routine ne suit plus",
    ],
    deroulement: [
      "Discussion sur vos préoccupations, votre routine et vos objectifs",
      "Examen de la peau et analyse des besoins",
      "Recommandations personnalisées : soins en clinique et routine à la maison",
    ],
    resultats: [
      "Un plan de soins clair et adapté à votre peau",
      "Des réponses professionnelles à vos questions",
      "Le montant de la consultation est un petit investissement qui évite bien des essais-erreurs",
    ],
    prix: 25,
    prixAffiche: "25 $",
    duree: "15 à 20 min",
    dureeMinutes: 20,
    vedette: true,
    ordre: 1,
  },
  {
    slug: "soin-facial-de-base",
    nom: "Soin facial de base",
    nomSquare: "Soin facial de base",
    categorie: "visage",
    accroche: "L'essentiel bien fait : un soin complet de 50 minutes, sans massage.",
    description: [
      "Le classique par excellence : un nettoyage en profondeur, une exfoliation douce et un masque choisi selon l'état de votre peau le jour même.",
      "Réalisé avec les produits G.M. Collin, ce soin redonne à la peau propreté, confort et éclat — parfait comme rendez-vous d'entretien régulier.",
    ],
    pourQui: [
      "Vous découvrez les soins du visage",
      "Vous cherchez un entretien régulier, simple et efficace",
      "Votre horaire est serré : tout est fait en 50 minutes",
    ],
    deroulement: [
      "Démaquillage et double nettoyage",
      "Exfoliation adaptée à votre peau",
      "Extractions au besoin",
      "Masque G.M. Collin ciblé",
      "Protection hydratante et solaire",
    ],
    resultats: [
      "Peau nette et fraîche dès la sortie",
      "Grain de peau affiné",
      "Confort et éclat immédiats",
    ],
    prix: 100,
    prixAffiche: "100 $",
    duree: "50 min",
    dureeMinutes: 50,
    ordre: 2,
  },
  {
    slug: "soin-oxygenant",
    nom: "Soin Oxygénant",
    nomSquare: "Soin Oxygénant",
    categorie: "visage",
    accroche:
      "Purifie et hydrate les peaux grasses ou à tendance acnéique — éclat et teint radieux.",
    description: [
      "Le soin Oxygénant G.M. Collin est reconnu pour son effet coup d'éclat : il purifie la peau en profondeur, resserre l'apparence des pores et oxygène l'épiderme pour un teint visiblement plus lumineux.",
      "Idéal pour les peaux grasses, congestionnées ou à tendance acnéique, il rééquilibre sans assécher : la peau est assainie, hydratée et éclatante de santé.",
    ],
    pourQui: [
      "Peau grasse ou mixte, pores dilatés",
      "Tendance acnéique ou imperfections récurrentes",
      "Teint terne, fumeuses, peau « fatiguée » qui manque d'éclat",
    ],
    deroulement: [
      "Nettoyage et exfoliation en profondeur",
      "Extractions au besoin",
      "Application du complexe oxygénant G.M. Collin",
      "Masque purifiant et hydratation ciblée",
    ],
    resultats: [
      "Peau purifiée, pores resserrés",
      "Teint frais et lumineux dès le premier soin",
      "Imperfections apaisées avec des soins réguliers",
    ],
    prix: 135,
    prixAffiche: "135 $",
    duree: "1 h à 1 h 15",
    dureeMinutes: 75,
    ordre: 3,
  },
  {
    slug: "soin-algomask",
    nom: "Soin Algomask+",
    nomSquare: "Soin Algomask+",
    categorie: "visage",
    accroche:
      "Apaisant et hydratant, il diminue les rougeurs des peaux sensibles ou déshydratées.",
    description: [
      "Le soin Algomask+ mise sur un masque d'algues à effet thermorégulateur qui apaise instantanément : sensation de fraîcheur, rougeurs atténuées, hydratation restaurée.",
      "C'est le soin réconfort par excellence pour les peaux sensibles, réactives ou déshydratées — la peau retrouve souplesse, uniformité et éclat.",
    ],
    pourQui: [
      "Peau sensible ou réactive, sujette aux rougeurs",
      "Peau déshydratée, qui tiraille",
      "Besoin d'apaisement après l'hiver, le soleil ou un stress cutané",
    ],
    deroulement: [
      "Nettoyage doux et exfoliation adaptée",
      "Sérum hydratant et apaisant G.M. Collin",
      "Masque Algomask+ à effet fraîcheur",
      "Crème de finition selon vos besoins",
    ],
    resultats: [
      "Rougeurs visiblement diminuées",
      "Hydratation en profondeur, confort retrouvé",
      "Éclat immédiat, effet bonne mine",
    ],
    prix: 130,
    prixAffiche: "130 $",
    duree: "1 h à 1 h 15",
    dureeMinutes: 75,
    ordre: 4,
  },
  {
    slug: "soin-hydrolifting",
    nom: "Soin Hydrolifting",
    nomSquare: "Soin Hydrolifting",
    categorie: "visage",
    accroche: "Raffermissant et liftant, pour une hydratation intense et une peau tonifiée.",
    description: [
      "Le soin Hydrolifting combine hydratation intense et action tenseur : il lisse les traits, raffermit la peau et redonne du rebond aux zones qui commencent à se relâcher.",
      "Un excellent choix pour prévenir les premiers signes de l'âge ou préparer la peau à une occasion spéciale — l'effet liftant est visible dès la sortie de la cabine.",
    ],
    pourQui: [
      "Premiers signes de relâchement ou traits tirés",
      "Peau déshydratée qui manque de rebond",
      "Envie d'un effet tenseur avant un événement",
    ],
    deroulement: [
      "Nettoyage et exfoliation",
      "Concentré hydratant et tenseur G.M. Collin",
      "Masque liftant",
      "Finition protectrice",
    ],
    resultats: [
      "Peau visiblement plus ferme et rebondie",
      "Traits lissés, ovale du visage redessiné",
      "Hydratation intense et durable",
    ],
    prix: 135,
    prixAffiche: "135 $",
    duree: "1 h",
    dureeMinutes: 60,
    ordre: 5,
  },
  {
    slug: "soin-collagene-90",
    nom: "Soin Collagène 90+",
    nomSquare: "Soin Collagène 90+",
    categorie: "visage",
    accroche:
      "Le régénérateur intensif anti-âge : il réduit l'apparence des rides et ridules.",
    description: [
      "Soin signature de G.M. Collin, le Collagène 90+ est un traitement anti-âge intensif : un feuillet de collagène natif est appliqué sur l'ensemble du visage pour régénérer, repulper et lisser la peau en profondeur.",
      "C'est le soin le plus complet de la carte — celui qu'on choisit quand on veut des résultats visibles sur les rides, les ridules et la fermeté, ou simplement offrir à sa peau ce qui se fait de mieux.",
    ],
    pourQui: [
      "Peau mature ou premiers signes de l'âge marqués",
      "Rides, ridules, perte de fermeté ou d'élasticité",
      "Peau dévitalisée qui a besoin d'une régénération en profondeur",
    ],
    deroulement: [
      "Nettoyage et exfoliation adaptée",
      "Application du feuillet de collagène natif",
      "Modelage doux d'absorption",
      "Crème de finition anti-âge",
    ],
    resultats: [
      "Rides et ridules visiblement atténuées",
      "Peau repulpée, hydratée et régénérée",
      "Résultats optimaux en cure de plusieurs séances",
    ],
    prix: 150,
    prixAffiche: "150 $",
    duree: "1 h à 1 h 15",
    dureeMinutes: 75,
    ordre: 6,
  },
  {
    slug: "peeling",
    nom: "Peeling",
    nomSquare: "Peeling seul",
    categorie: "peeling",
    accroche:
      "Exfoliation professionnelle : élimine les cellules mortes et améliore la texture de la peau.",
    description: [
      "Le peeling professionnel exfolie la peau bien au-delà de ce qu'un gommage maison peut faire : il élimine les cellules mortes, affine le grain de peau et stimule le renouvellement cellulaire.",
      "Réalisé par une infirmière, le choix de l'acide et de son intensité est ajusté à votre peau — efficacité maximale, en toute sécurité.",
    ],
    pourQui: [
      "Grain de peau irrégulier, texture rugueuse",
      "Teint terne, taches ou marques résiduelles",
      "En cure pour préparer la peau à d'autres soins",
    ],
    deroulement: [
      "Nettoyage et préparation de la peau",
      "Application du peeling choisi selon votre peau",
      "Neutralisation et apaisement",
      "Protection hydratante et solaire",
    ],
    resultats: [
      "Texture affinée et adoucie",
      "Teint plus uniforme et lumineux",
      "Renouvellement cellulaire stimulé",
    ],
    prix: 80,
    prixAffiche: "80 $",
    duree: "30 à 45 min",
    dureeMinutes: 45,
    ordre: 7,
  },
  {
    slug: "ajout-peeling",
    nom: "Ajout d'un peeling à un soin",
    nomSquare: "Ajout peeling",
    categorie: "peeling",
    accroche: "Option offerte sur tous les soins du visage, pour amplifier les résultats.",
    description: [
      "Ajoutez une exfoliation professionnelle à n'importe quel soin du visage : le peeling prépare la peau et démultiplie l'efficacité des actifs appliqués ensuite.",
      "Mentionnez-le simplement au moment de réserver votre soin, ou demandez-le sur place.",
    ],
    pourQui: ["Toute cliente qui réserve un soin du visage et souhaite en amplifier les résultats"],
    deroulement: ["Intégré directement à votre soin, sans rendez-vous supplémentaire"],
    resultats: ["Pénétration accrue des actifs", "Éclat et texture améliorés dès la sortie"],
    prix: 30,
    prixAffiche: "+30 $",
    duree: "Intégré au soin",
    dureeMinutes: 0,
    option: true,
    ordre: 8,
  },
  {
    slug: "soin-du-dos-hydratant",
    nom: "Soin du dos hydratant",
    nomSquare: "Soin du dos hydratant",
    categorie: "corps",
    accroche: "Purifie, exfolie et hydrate en profondeur — le dos aussi mérite sa parenthèse.",
    description: [
      "Zone difficile d'accès et souvent négligée, le dos accumule impuretés et sécheresse. Ce soin complet le nettoie, l'exfolie et l'hydrate en profondeur.",
      "Parfait avant une occasion (robe dos nu, mariage, vacances) ou simplement pour offrir à cette zone le soin qu'elle attend depuis longtemps.",
    ],
    pourQui: [
      "Imperfections ou rugosités dans le dos",
      "Peau sèche ou déshydratée",
      "Préparation d'une occasion spéciale",
    ],
    deroulement: [
      "Nettoyage en profondeur",
      "Exfoliation complète du dos",
      "Extractions au besoin",
      "Masque et hydratation intense",
    ],
    resultats: [
      "Peau nette, lisse et confortable",
      "Hydratation en profondeur",
      "Imperfections apaisées",
    ],
    prix: 120,
    prixAffiche: "120 $",
    duree: "50 min à 1 h 15",
    dureeMinutes: 75,
    ordre: 9,
  },
];

export const soinsReservables = soins.filter((s) => !s.option);

export const soinParSlug = (slug: string): Soin | undefined =>
  soins.find((s) => s.slug === slug);

export const categoriesLibelles: Record<CategorieSoin, string> = {
  consultation: "Consultation",
  visage: "Soins du visage",
  peeling: "Peeling",
  corps: "Soins du corps",
};
