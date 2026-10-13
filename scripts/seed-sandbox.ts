/**
 * Étape 2 — Seed du sandbox Square (idempotent).
 *
 *   npx tsx scripts/seed-sandbox.ts
 *
 * Crée/synchronise dans le sandbox :
 *  1. Location : fuseau America/Toronto + heures d'affaires mardi et mercredi 9 h-19 h
 *  2. Team member « Karianne » (ACTIVE, toutes les locations)
 *  3. Les 7 services APPOINTMENTS_SERVICE du vrai catalogue de la clinique, avec
 *     leurs noms exacts (« soin hydrolift l G.M Collin », variation « Article de base »,
 *     variations « avec peeling »…) pour tester l'appariement du site comme en production.
 *     Les 3 services de test de la première version du seed sont retirés.
 *  4. Test SearchAvailability — si aucune dispo ne sort, le script l'explique précisément
 *
 * Les heures de travail Appointments du personnel n'ont PAS d'API d'écriture
 * publique : si le test final ne retourne rien, un unique réglage manuel reste
 * à faire dans le Seller Dashboard sandbox (le script détaille lequel).
 */
import { SquareClient, SquareEnvironment, SquareError, type Square } from "square";
import { randomUUID } from "node:crypto";
import { config } from "dotenv";

config({ path: ".env.local" });

const token = process.env.SQUARE_ACCESS_TOKEN;
const locationId = process.env.SQUARE_LOCATION_ID;
if (!token || !locationId) {
  console.error("SQUARE_ACCESS_TOKEN et SQUARE_LOCATION_ID requis dans .env.local");
  process.exit(1);
}

const client = new SquareClient({
  token,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

interface ServiceCible {
  nom: string;
  variations: { nom: string; prixCents: number; dureeMinutes: number }[];
}

/** Copie conforme du catalogue de la clinique (page de réservation Square, octobre 2026). */
const SERVICES_CIBLES: ServiceCible[] = [
  {
    nom: "consultation/ analyse de peau",
    variations: [{ nom: "Article de base", prixCents: 2500, dureeMinutes: 20 }],
  },
  {
    nom: "soin Oxygénant | G.M Collin ( peau grasse et à tendance acnéique",
    variations: [{ nom: "Soin oxygénant", prixCents: 13500, dureeMinutes: 90 }],
  },
  {
    nom: "soin Algomask | G.M Collin ( peau sensible/ déshydratée)",
    variations: [
      { nom: "Soin Algomask", prixCents: 13000, dureeMinutes: 90 },
      { nom: "Soin Algomask avec peeling", prixCents: 16000, dureeMinutes: 90 },
    ],
  },
  {
    nom: "soin hydrolift l G.M Collin",
    variations: [
      { nom: "Soin hydrolifting", prixCents: 13500, dureeMinutes: 75 },
      { nom: "Soin hydrolifting avec peeling", prixCents: 16500, dureeMinutes: 90 },
    ],
  },
  {
    nom: "Soin Collagène 90+ l G.M Collin ( Anti-âge et réparation)",
    variations: [
      { nom: "Soin Collagène 90+", prixCents: 15000, dureeMinutes: 90 },
      { nom: "Soin Collagène 90+ avec peeling", prixCents: 18000, dureeMinutes: 90 },
    ],
  },
  {
    nom: "Soin peeling seul",
    variations: [{ nom: "Article de base", prixCents: 8000, dureeMinutes: 30 }],
  },
  {
    nom: "Soin du dos G.M Collin",
    variations: [{ nom: "Article de base", prixCents: 12000, dureeMinutes: 75 }],
  },
];

/** Services de test créés par la première version du seed, remplacés par les vrais noms. */
const SERVICES_OBSOLETES = [
  "Soin Oxygénant",
  "Soin Collagène 90+",
  "Consultation / analyse de peau",
];

const HEURES_AFFAIRES: Square.BusinessHoursPeriod[] = [
  { dayOfWeek: "TUE", startLocalTime: "09:00", endLocalTime: "19:00" },
  { dayOfWeek: "WED", startLocalTime: "09:00", endLocalTime: "19:00" },
];

function normaliser(nom: string): string {
  return nom
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function afficherErreurSquare(contexte: string, erreur: unknown): never {
  if (erreur instanceof SquareError) {
    console.error(`\nÉCHEC — ${contexte}`);
    console.error(`  Statut HTTP : ${erreur.statusCode}`);
    for (const e of erreur.errors) {
      console.error(
        `  [${e.category}/${e.code}] ${e.detail ?? ""} ${e.field ? `(champ: ${e.field})` : ""}`,
      );
    }
  } else {
    console.error(`\nÉCHEC — ${contexte} :`, erreur);
  }
  process.exit(1);
}

async function majLocation(): Promise<void> {
  try {
    const actuel = await client.locations.get({ locationId: locationId! });
    const location = actuel.location;
    const bonFuseau = location?.timezone === "America/Toronto";
    const bonnesHeures =
      JSON.stringify(location?.businessHours?.periods ?? []) === JSON.stringify(HEURES_AFFAIRES);

    if (bonFuseau && bonnesHeures) {
      console.log("1. Location déjà configurée (America/Toronto, mardi et mercredi 9 h-19 h)");
      return;
    }

    await client.locations.update({
      locationId: locationId!,
      location: {
        timezone: "America/Toronto",
        businessHours: { periods: HEURES_AFFAIRES },
      },
    });
    console.log("1. Location mise à jour : fuseau America/Toronto, mardi et mercredi 9 h-19 h");
  } catch (erreur) {
    afficherErreurSquare("mise à jour de la location", erreur);
  }
}

async function assurerKarianne(): Promise<string> {
  try {
    const recherche = await client.teamMembers.search({
      query: { filter: { status: "ACTIVE" } },
      limit: 100,
    });
    const existante = (recherche.teamMembers ?? []).find(
      (m) => normaliser(m.givenName ?? "") === "karianne",
    );
    if (existante?.id) {
      console.log(`2. Team member « Karianne » déjà présente (${existante.id})`);
      return existante.id;
    }

    const creation = await client.teamMembers.create({
      idempotencyKey: "seed-karianne-1",
      teamMember: {
        givenName: "Karianne",
        // Nom de famille requis par l'API — valeur sandbox, sans importance côté site.
        familyName: "La Parenthèse",
        status: "ACTIVE",
        assignedLocations: { assignmentType: "ALL_CURRENT_AND_FUTURE_LOCATIONS" },
      },
    });
    const id = creation.teamMember?.id;
    if (!id) throw new Error("Square n'a pas retourné l'ID du team member.");
    console.log(`2. Team member « Karianne » créée (${id})`);
    return id;
  } catch (erreur) {
    afficherErreurSquare("création du team member Karianne", erreur);
  }
}

async function servicesExistants(): Promise<Map<string, Square.CatalogObject.Item>> {
  const parNom = new Map<string, Square.CatalogObject.Item>();
  const pages = await client.catalog.list({ types: "ITEM" });
  for await (const objet of pages) {
    if (objet.type !== "ITEM") continue;
    const nom = objet.itemData?.name;
    if (nom) parNom.set(normaliser(nom), objet);
  }
  return parNom;
}

function idTemporaire(...parties: string[]): string {
  return `#${parties.map((p) => normaliser(p).replace(/ /g, "-")).join("--")}`;
}

async function retirerServicesObsoletes(existants: Map<string, Square.CatalogObject.Item>) {
  const ids = SERVICES_OBSOLETES.map((nom) => existants.get(normaliser(nom))?.id).filter(
    (id): id is string => Boolean(id),
  );
  if (!ids.length) return;
  await client.catalog.batchDelete({ objectIds: ids });
  console.log(`3. ${ids.length} service(s) de test obsolète(s) retiré(s) du catalogue sandbox`);
}

async function assurerServices(teamMemberId: string): Promise<Map<string, string>> {
  try {
    await retirerServicesObsoletes(await servicesExistants());
    const existants = await servicesExistants();
    const aUpserter: Square.CatalogObject[] = [];

    for (const cible of SERVICES_CIBLES) {
      const existant = existants.get(normaliser(cible.nom));
      const itemId = existant?.id ?? idTemporaire(cible.nom);
      const variationsExistantes = (existant?.itemData?.variations ?? []).filter(
        (v): v is Square.CatalogObject.ItemVariation => v.type === "ITEM_VARIATION",
      );

      const variations: Square.CatalogObject[] = cible.variations.map((v) => {
        // Mise à jour en place (id + version conservés → pas de doublon)
        const actuelle = variationsExistantes.find(
          (x) => normaliser(x.itemVariationData?.name ?? "") === normaliser(v.nom),
        );
        return {
          type: "ITEM_VARIATION",
          id: actuelle?.id ?? idTemporaire(cible.nom, v.nom),
          ...(actuelle?.version !== undefined ? { version: actuelle.version } : {}),
          presentAtAllLocations: true,
          itemVariationData: {
            ...actuelle?.itemVariationData,
            itemId,
            name: v.nom,
            pricingType: "FIXED_PRICING",
            priceMoney: { amount: BigInt(v.prixCents), currency: "CAD" },
            serviceDuration: BigInt(v.dureeMinutes * 60_000),
            availableForBooking: true,
            teamMemberIds: [teamMemberId],
          },
        };
      });

      aUpserter.push({
        ...(existant ?? {}),
        type: "ITEM",
        id: itemId,
        presentAtAllLocations: true,
        itemData: {
          ...existant?.itemData,
          name: cible.nom,
          productType: "APPOINTMENTS_SERVICE",
          variations,
        },
      } as Square.CatalogObject);
    }

    await client.catalog.batchUpsert({
      idempotencyKey: randomUUID(),
      batches: [{ objects: aUpserter }],
    });

    // Relire pour obtenir les IDs définitifs des variations
    const apres = await servicesExistants();
    const variationParNom = new Map<string, string>();
    for (const cible of SERVICES_CIBLES) {
      const item = apres.get(normaliser(cible.nom));
      const variations = (item?.itemData?.variations ?? []).filter(
        (v): v is Square.CatalogObject.ItemVariation => v.type === "ITEM_VARIATION",
      );
      if (!item?.id || variations.length !== cible.variations.length) {
        throw new Error(`Service « ${cible.nom} » incomplet après l'upsert.`);
      }
      variationParNom.set(cible.nom, variations[0].id!);
      const resume = cible.variations
        .map((v) => `${v.nom} ${(v.prixCents / 100).toFixed(0)} $ ${v.dureeMinutes} min`)
        .join(" / ");
      console.log(`3. « ${cible.nom} » prêt (${item.id}) — ${resume}`);
    }
    return variationParNom;
  } catch (erreur) {
    afficherErreurSquare("upsert des services dans le catalogue", erreur);
  }
}

async function testerDisponibilites(variationId: string): Promise<void> {
  const debut = new Date(Date.now() + 3600_000);
  const fin = new Date(Date.now() + 8 * 24 * 3600_000);
  try {
    const reponse = await client.bookings.searchAvailability({
      query: {
        filter: {
          startAtRange: { startAt: debut.toISOString(), endAt: fin.toISOString() },
          locationId: locationId!,
          segmentFilters: [{ serviceVariationId: variationId }],
        },
      },
    });
    const dispos = reponse.availabilities ?? [];
    if (dispos.length > 0) {
      console.log(
        `4. SearchAvailability OK — ${dispos.length} créneaux sur 7 jours ` +
          `(premier : ${dispos[0].startAt})`,
      );
      return;
    }
    console.log("\n4. SearchAvailability répond, mais AUCUN créneau sur les 7 prochains jours.");
    console.log(
      [
        "   Cause la plus probable : les heures de travail Appointments du personnel",
        "   n'ont pas d'API d'écriture publique — elles doivent être activées une fois",
        "   dans le Seller Dashboard SANDBOX :",
        "     1. Developer Dashboard → votre application → « Open sandbox seller dashboard »",
        "        (ou https://app.squareupsandbox.com après connexion au compte de test)",
        "     2. Appointments → Settings → Staff : Karianne → définir ses heures",
        "        (mardi et mercredi, 9 h à 19 h)",
        "     3. Relancer : npx tsx scripts/seed-sandbox.ts",
      ].join("\n"),
    );
  } catch (erreur) {
    if (
      erreur instanceof SquareError &&
      erreur.errors.some((e) => /not onboarded to Appointments/i.test(e.detail ?? ""))
    ) {
      console.log("\n4. ACTION REQUISE — le compte de test sandbox n'a pas Appointments activé :");
      console.log(
        [
          "   [AUTHENTICATION_ERROR/UNAUTHORIZED] Merchant not onboarded to Appointments",
          "",
          "   Ce réglage ne peut pas se faire par API :",
          "     1. Developer Dashboard (https://developer.squareup.com/apps)",
          "        → Sandbox test accounts → « Default Test Account » → Open sandbox seller dashboard",
          "     2. Dans le sélecteur d'applications du dashboard, ouvrir Appointments",
          "        et compléter l'activation (offre gratuite)",
          "     3. Relancer : npx tsx scripts/seed-sandbox.ts",
          "        (idempotent — il ne créera aucun doublon et refera le test de disponibilités)",
        ].join("\n"),
      );
      return;
    }
    afficherErreurSquare("test SearchAvailability", erreur);
  }
}

async function principal() {
  console.log(`Seed du sandbox Square — location ${locationId}\n`);
  await majLocation();
  const karianneId = await assurerKarianne();
  const variations = await assurerServices(karianneId);
  const premiereVariation = variations.get(SERVICES_CIBLES[0].nom)!;
  await testerDisponibilites(premiereVariation);
  console.log("\nSeed terminé.");
}

void principal();
