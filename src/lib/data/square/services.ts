import "server-only";
import type { Square } from "square";
import { getSquareClient } from "./client";
import type { ServiceReservable } from "../types";

/**
 * Services réservables tirés du catalogue Square (source de vérité).
 * Cache mémoire court (~60 s) pour la performance, comme prévu au brief.
 */

const DUREE_CACHE_MS = 60_000;

let cache: { horodatage: number; services: ServiceReservable[] } | null = null;

function versEntier(valeur: bigint | number | null | undefined): number | null {
  if (valeur === null || valeur === undefined) return null;
  return Number(valeur);
}

function mapperVariation(
  item: Square.CatalogObject.Item,
  variation: Square.CatalogObject,
): ServiceReservable | null {
  if (variation.type !== "ITEM_VARIATION" || !variation.id) return null;
  const donnees = variation.itemVariationData;
  if (!donnees) return null;
  if (donnees.availableForBooking === false) return null;

  const nomItem = item.itemData?.name?.trim() ?? "";
  const nomVariation = donnees.name?.trim() ?? "";
  const nom =
    nomVariation && !/^(regular|standard)$/i.test(nomVariation)
      ? `${nomItem} — ${nomVariation}`
      : nomItem;

  const dureeMs = versEntier(donnees.serviceDuration);

  return {
    variationId: variation.id,
    version: variation.version?.toString() ?? "0",
    nom: nom || "Soin",
    prixCents: versEntier(donnees.priceMoney?.amount),
    dureeMinutes: dureeMs ? Math.round(dureeMs / 60_000) : null,
  };
}

export async function listerServices(): Promise<ServiceReservable[]> {
  if (cache && Date.now() - cache.horodatage < DUREE_CACHE_MS) {
    return cache.services;
  }

  const client = getSquareClient();
  const services: ServiceReservable[] = [];

  const pages = await client.catalog.list({ types: "ITEM" });
  for await (const objet of pages) {
    if (objet.type !== "ITEM") continue;
    if (objet.itemData?.productType !== "APPOINTMENTS_SERVICE") continue;
    for (const variation of objet.itemData.variations ?? []) {
      const service = mapperVariation(objet, variation);
      if (service) services.push(service);
    }
  }

  cache = { horodatage: Date.now(), services };
  return services;
}
