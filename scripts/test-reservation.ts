/**
 * Étape 4 — Réservation de test de bout en bout dans le sandbox.
 *
 *   npx tsx scripts/test-reservation.ts
 *
 * 1. Liste les services APPOINTMENTS_SERVICE du catalogue
 * 2. Cherche les disponibilités réelles des 7 prochains jours (SearchAvailability)
 * 3. Retrouve/crée la cliente « Test Cliente » <test@exemple.com> (Customers API)
 * 4. Crée la réservation sur le premier créneau (CreateBooking) et affiche son ID
 *
 * En cas d'erreur de permissions/scopes, le script s'arrête et montre le
 * message exact — réglage à faire dans le Developer Dashboard, pas à contourner.
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

function arreterSurErreur(contexte: string, erreur: unknown): never {
  if (erreur instanceof SquareError) {
    console.error(`\nARRÊT — ${contexte} a échoué :`);
    console.error(`  Statut HTTP : ${erreur.statusCode}`);
    for (const e of erreur.errors) {
      console.error(`  [${e.category}/${e.code}] ${e.detail ?? ""}${e.field ? ` (champ: ${e.field})` : ""}`);
    }
    if (erreur.errors.some((e) => /not onboarded to Appointments/i.test(e.detail ?? ""))) {
      console.error(
        "\n  → Le compte de test sandbox n'a pas Appointments activé. À faire une fois :\n" +
          "    Developer Dashboard → Sandbox test accounts → Open sandbox seller dashboard\n" +
          "    → ouvrir Appointments dans le sélecteur d'applications → compléter l'activation.\n" +
          "    Puis relancer ce script.",
      );
    }
  } else {
    console.error(`\nARRÊT — ${contexte} :`, erreur);
  }
  process.exit(1);
}

async function premierServiceReservable(): Promise<{ variationId: string; nom: string }> {
  try {
    const pages = await client.catalog.list({ types: "ITEM" });
    const services: { variationId: string; nom: string }[] = [];
    for await (const objet of pages) {
      if (objet.type !== "ITEM" || objet.itemData?.productType !== "APPOINTMENTS_SERVICE") continue;
      for (const v of objet.itemData.variations ?? []) {
        if (v.type === "ITEM_VARIATION" && v.id) {
          services.push({ variationId: v.id, nom: objet.itemData.name ?? v.id });
        }
      }
    }
    if (!services.length) {
      console.error("Aucun service réservable — lancer d'abord : npx tsx scripts/seed-sandbox.ts");
      process.exit(1);
    }
    console.log(`1. ${services.length} services au catalogue :`);
    for (const s of services) console.log(`   - ${s.nom} (${s.variationId})`);
    return services[0];
  } catch (erreur) {
    arreterSurErreur("la lecture du catalogue", erreur);
  }
}

async function premiereDisponibilite(variationId: string): Promise<Square.Availability> {
  try {
    const reponse = await client.bookings.searchAvailability({
      query: {
        filter: {
          startAtRange: {
            startAt: new Date(Date.now() + 3600_000).toISOString(),
            endAt: new Date(Date.now() + 7 * 24 * 3600_000).toISOString(),
          },
          locationId: locationId!,
          segmentFilters: [{ serviceVariationId: variationId }],
        },
      },
    });
    const dispos = reponse.availabilities ?? [];
    console.log(`2. ${dispos.length} créneaux disponibles sur 7 jours`);
    if (!dispos.length || !dispos[0].startAt) {
      console.error(
        "   Aucun créneau : vérifier les heures de Karianne dans le Seller Dashboard sandbox " +
          "(Appointments → Staff), puis relancer.",
      );
      process.exit(1);
    }
    console.log(`   Premier créneau : ${dispos[0].startAt}`);
    return dispos[0];
  } catch (erreur) {
    arreterSurErreur("SearchAvailability", erreur);
  }
}

async function clienteDeTest(): Promise<string> {
  try {
    const recherche = await client.customers.search({
      query: { filter: { emailAddress: { exact: "test@exemple.com" } } },
    });
    const existante = recherche.customers?.[0]?.id;
    if (existante) {
      console.log(`3. Cliente de test retrouvée (${existante})`);
      return existante;
    }
    const creation = await client.customers.create({
      idempotencyKey: randomUUID(),
      givenName: "Test",
      familyName: "Cliente",
      emailAddress: "test@exemple.com",
      note: "Réservation de test — site web (sandbox)",
    });
    const id = creation.customer?.id;
    if (!id) throw new Error("Pas d'ID de cliente retourné.");
    console.log(`3. Cliente de test créée (${id})`);
    return id;
  } catch (erreur) {
    arreterSurErreur("Customers API (recherche/création)", erreur);
  }
}

async function principal() {
  console.log(`Réservation de test — sandbox, location ${locationId}\n`);
  const service = await premierServiceReservable();
  const dispo = await premiereDisponibilite(service.variationId);
  const customerId = await clienteDeTest();

  const segment = dispo.appointmentSegments?.[0];
  try {
    const reponse = await client.bookings.create({
      idempotencyKey: randomUUID(),
      booking: {
        locationId: locationId!,
        startAt: dispo.startAt,
        customerId,
        customerNote: "Réservation de test créée par le site (sandbox)",
        appointmentSegments: [
          {
            serviceVariationId: segment?.serviceVariationId ?? service.variationId,
            serviceVariationVersion: segment?.serviceVariationVersion,
            teamMemberId: segment?.teamMemberId ?? "",
            durationMinutes: segment?.durationMinutes ?? undefined,
          },
        ],
      },
    });
    const reservation = reponse.booking;
    console.log("\n4. RÉSERVATION CRÉÉE ✓");
    console.log(`   ID          : ${reservation?.id}`);
    console.log(`   Service     : ${service.nom}`);
    console.log(`   Début       : ${reservation?.startAt}`);
    console.log(`   Statut      : ${reservation?.status}`);
    console.log("\n   À vérifier dans le Sandbox Seller Dashboard → Appointments → Calendar.");
  } catch (erreur) {
    arreterSurErreur("CreateBooking", erreur);
  }
}

void principal();
