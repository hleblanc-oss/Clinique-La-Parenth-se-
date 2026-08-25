/**
 * Étape 2 — Seed du sandbox Square (idempotent).
 *
 *   npx tsx scripts/seed-sandbox.ts
 *
 * Crée/synchronise dans le sandbox :
 *  1. Location : fuseau America/Toronto + heures d'affaires mar-ven 9h-17h, sam 9h-13h
 *  2. Team member « Karianne » (ACTIVE, toutes les locations)
 *  3. Trois services APPOINTMENTS_SERVICE identiques aux vrais, réservables par Karianne
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

const SERVICES_CIBLES = [
  { nom: "Soin Oxygénant", prixCents: 13500, dureeMinutes: 75 },
  { nom: "Soin Collagène 90+", prixCents: 15000, dureeMinutes: 75 },
  { nom: "Consultation / analyse de peau", prixCents: 2500, dureeMinutes: 20 },
] as const;

const HEURES_AFFAIRES: Square.BusinessHoursPeriod[] = [
  { dayOfWeek: "TUE", startLocalTime: "09:00", endLocalTime: "17:00" },
  { dayOfWeek: "WED", startLocalTime: "09:00", endLocalTime: "17:00" },
  { dayOfWeek: "THU", startLocalTime: "09:00", endLocalTime: "17:00" },
  { dayOfWeek: "FRI", startLocalTime: "09:00", endLocalTime: "17:00" },
  { dayOfWeek: "SAT", startLocalTime: "09:00", endLocalTime: "13:00" },
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
      console.error(`  [${e.category}/${e.code}] ${e.detail ?? ""} ${e.field ? `(champ: ${e.field})` : ""}`);
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
      console.log("1. Location déjà configurée (America/Toronto, mar-ven 9-17, sam 9-13)");
      return;
    }

    await client.locations.update({
      locationId: locationId!,
      location: {
        timezone: "America/Toronto",
        businessHours: { periods: HEURES_AFFAIRES },
      },
    });
    console.log("1. Location mise à jour : fuseau America/Toronto, heures mar-ven 9-17, sam 9-13");
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

async function assurerServices(teamMemberId: string): Promise<Map<string, string>> {
  try {
    const existants = await servicesExistants();
    const aUpserter: Square.CatalogObject[] = [];

    for (const cible of SERVICES_CIBLES) {
      const existant = existants.get(normaliser(cible.nom));

      if (existant) {
        // Mise à jour en place (id + version conservés → pas de doublon)
        const variations = existant.itemData?.variations ?? [];
        const variation = variations.find(
          (v): v is Square.CatalogObject.ItemVariation => v.type === "ITEM_VARIATION",
        );
        aUpserter.push({
          ...existant,
          itemData: {
            ...existant.itemData,
            name: cible.nom,
            productType: "APPOINTMENTS_SERVICE",
            variations: [
              {
                type: "ITEM_VARIATION",
                id: variation?.id ?? `#${normaliser(cible.nom).replace(/ /g, "-")}-v`,
                ...(variation?.version !== undefined ? { version: variation.version } : {}),
                presentAtAllLocations: true,
                itemVariationData: {
                  ...variation?.itemVariationData,
                  itemId: existant.id,
                  name: "Standard",
                  pricingType: "FIXED_PRICING",
                  priceMoney: { amount: BigInt(cible.prixCents), currency: "CAD" },
                  serviceDuration: BigInt(cible.dureeMinutes * 60_000),
                  availableForBooking: true,
                  teamMemberIds: [teamMemberId],
                },
              },
            ],
          },
        });
      } else {
        const idTemp = `#${normaliser(cible.nom).replace(/ /g, "-")}`;
        aUpserter.push({
          type: "ITEM",
          id: idTemp,
          presentAtAllLocations: true,
          itemData: {
            name: cible.nom,
            productType: "APPOINTMENTS_SERVICE",
            variations: [
              {
                type: "ITEM_VARIATION",
                id: `${idTemp}-v`,
                presentAtAllLocations: true,
                itemVariationData: {
                  itemId: idTemp,
                  name: "Standard",
                  pricingType: "FIXED_PRICING",
                  priceMoney: { amount: BigInt(cible.prixCents), currency: "CAD" },
                  serviceDuration: BigInt(cible.dureeMinutes * 60_000),
                  availableForBooking: true,
                  teamMemberIds: [teamMemberId],
                },
              },
            ],
          },
        });
      }
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
      const variation = item?.itemData?.variations?.find(
        (v): v is Square.CatalogObject.ItemVariation => v.type === "ITEM_VARIATION",
      );
      if (!item?.id || !variation?.id) {
        throw new Error(`Service « ${cible.nom} » introuvable après l'upsert.`);
      }
      variationParNom.set(cible.nom, variation.id);
      console.log(
        `3. Service « ${cible.nom} » prêt — item ${item.id}, variation ${variation.id}, ` +
          `${(cible.prixCents / 100).toFixed(0)} $, ${cible.dureeMinutes} min`,
      );
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
        "        (mar-ven 9 h à 17 h, sam 9 h à 13 h)",
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
  const premiereVariation = variations.get("Consultation / analyse de peau")!;
  await testerDisponibilites(premiereVariation);
  console.log("\nSeed terminé.");
}

void principal();
