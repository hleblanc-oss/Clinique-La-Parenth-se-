import "server-only";
import { randomUUID } from "node:crypto";
import { getSquareClient } from "./client";
import { locationIdSquare } from "./config";
import { normaliserTelephone } from "@/lib/format";
import type { ConfirmationReservation, Creneau, DemandeReservation } from "../types";

/**
 * Disponibilités et création de rendez-vous — Bookings + Customers API.
 * Le rendez-vous créé apparaît instantanément dans le Square Appointments
 * de la cliente; ses rappels automatiques ne changent pas.
 */

export async function chercherDisponibilites(
  serviceVariationId: string,
  debut: string,
  fin: string,
): Promise<Creneau[]> {
  const client = getSquareClient();

  const reponse = await client.bookings.searchAvailability({
    query: {
      filter: {
        startAtRange: { startAt: debut, endAt: fin },
        locationId: locationIdSquare(),
        segmentFilters: [{ serviceVariationId }],
      },
    },
  });

  const creneaux: Creneau[] = [];
  for (const dispo of reponse.availabilities ?? []) {
    if (!dispo.startAt) continue;
    const segment = dispo.appointmentSegments?.[0];
    if (!segment?.teamMemberId) continue;
    creneaux.push({
      debut: dispo.startAt,
      teamMemberId: segment.teamMemberId,
      dureeMinutes: segment.durationMinutes ?? null,
      versionVariation:
        segment.serviceVariationVersion !== null && segment.serviceVariationVersion !== undefined
          ? segment.serviceVariationVersion.toString()
          : null,
    });
  }

  creneaux.sort((a, b) => a.debut.localeCompare(b.debut));
  return creneaux;
}

/** Recherche la cliente par courriel, sinon la crée (Customers API). */
async function trouverOuCreerCliente(cliente: DemandeReservation["cliente"]): Promise<string> {
  const client = getSquareClient();
  const courriel = cliente.courriel.trim().toLowerCase();

  const recherche = await client.customers.search({
    query: { filter: { emailAddress: { exact: courriel } } },
  });
  const existante = recherche.customers?.[0]?.id;
  if (existante) return existante;

  const telephone = normaliserTelephone(cliente.telephone);
  const creation = await client.customers.create({
    idempotencyKey: randomUUID(),
    givenName: cliente.prenom.trim(),
    familyName: cliente.nom.trim(),
    emailAddress: courriel,
    ...(telephone ? { phoneNumber: telephone } : {}),
    note: "Cliente créée via le site web",
  });

  const id = creation.customer?.id;
  if (!id) throw new Error("Square n'a pas retourné d'identifiant de cliente.");
  return id;
}

export async function creerReservation(
  demande: DemandeReservation,
): Promise<ConfirmationReservation> {
  const client = getSquareClient();
  const customerId = await trouverOuCreerCliente(demande.cliente);

  const reponse = await client.bookings.create({
    idempotencyKey: randomUUID(),
    booking: {
      locationId: locationIdSquare(),
      startAt: demande.debut,
      customerId,
      customerNote: demande.note?.trim() || undefined,
      appointmentSegments: [
        {
          serviceVariationId: demande.serviceVariationId,
          serviceVariationVersion: demande.serviceVariationVersion
            ? BigInt(demande.serviceVariationVersion)
            : undefined,
          teamMemberId: demande.teamMemberId,
          ...(demande.dureeMinutes ? { durationMinutes: demande.dureeMinutes } : {}),
        },
      ],
    },
  });

  const reservation = reponse.booking;
  if (!reservation?.id || !reservation.startAt) {
    throw new Error("Square n'a pas retourné la réservation créée.");
  }

  return { reservationId: reservation.id, debut: reservation.startAt };
}

/** Inscription infolettre : profil cliente Square avec note dédiée. */
export async function inscrireInfolettre(courriel: string): Promise<void> {
  const client = getSquareClient();
  const recherche = await client.customers.search({
    query: { filter: { emailAddress: { exact: courriel } } },
  });
  if (recherche.customers?.length) return;

  await client.customers.create({
    idempotencyKey: randomUUID(),
    emailAddress: courriel,
    note: "Infolettre — inscription via le site web",
  });
}
