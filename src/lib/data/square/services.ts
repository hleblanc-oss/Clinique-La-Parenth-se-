import "server-only";
import type { Square } from "square";
import { getSquareClient } from "./client";
import type { ServiceReservable } from "../types";
import { apparierSoin } from "@/content/soins";
import { normaliserNom } from "@/lib/format";

/**
 * Services réservables tirés du catalogue Square (source de vérité).
 * Cache mémoire court (~60 s) pour la performance, comme prévu au brief.
 *
 * Les noms du catalogue de la clinique sont rédigés pour la page Square
 * (« soin hydrolift l G.M Collin », variation « Article de base »…) : chaque
 * service est apparié au soin éditorial pour afficher un nom propre, et les
 * variations « avec peeling » deviennent l'option peeling du soin.
 */

const DUREE_CACHE_MS = 60_000;

let cache: { horodatage: number; services: ServiceReservable[] } | null = null;

function versEntier(valeur: bigint | number | null | undefined): number | null {
  if (valeur === null || valeur === undefined) return null;
  return Number(valeur);
}

/** Variation par défaut de Square (« Regular » en anglais, « Article de base » en français). */
const VARIATION_PAR_DEFAUT = /^(regular|standard|article de base)$/i;

/** Nom de catalogue lisible quand le soin n'est pas reconnu : « soin X | G.M Collin (…) » → « soin X ». */
function nettoyerNom(nom: string): string {
  return nom.split(/\s+[|(]|\s+l\s+G\.?M/i)[0].trim();
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
  const soin = apparierSoin(nomItem);
  const avecPeeling = normaliserNom(nomVariation).includes("avec peeling");

  let nom: string;
  if (soin) {
    nom = avecPeeling ? `${soin.nom} avec peeling` : soin.nom;
  } else {
    const base = nettoyerNom(nomItem) || "Soin";
    nom =
      nomVariation && !VARIATION_PAR_DEFAUT.test(nomVariation) ? `${base} — ${nomVariation}` : base;
  }

  const dureeMs = versEntier(donnees.serviceDuration);

  return {
    variationId: variation.id,
    version: variation.version?.toString() ?? "0",
    nom,
    slug: soin?.slug ?? null,
    avecPeeling,
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
