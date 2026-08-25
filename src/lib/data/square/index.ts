import "server-only";
import type { FournisseurDonnees } from "../provider";
import { squareEstConfigure } from "./config";
import { listerServices } from "./services";
import { chercherDisponibilites, creerReservation, inscrireInfolettre } from "./bookings";

export const fournisseurSquare: FournisseurDonnees = {
  nom: "square",
  estConfigure: squareEstConfigure,
  listerServices,
  chercherDisponibilites,
  creerReservation,
  inscrireInfolettre,
};
