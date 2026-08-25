import type { Metadata } from "next";
import { ReservationFlow } from "@/components/reservation/ReservationFlow";
import { Reveal } from "@/components/Reveal";
import { soinParSlug } from "@/content/soins";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description:
    "Réservez votre soin en ligne : choisissez votre soin, votre moment, et le rendez-vous s'ajoute directement à l'horaire de la clinique.",
};

export default async function RendezVous({ searchParams }: PageProps<"/rendez-vous">) {
  const params = await searchParams;
  const slugDemande = typeof params.soin === "string" ? params.soin : undefined;
  const soinDemande = slugDemande ? soinParSlug(slugDemande) : undefined;

  return (
    <>
      <section className="py-14 sm:py-20">
        <div className="conteneur text-center">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-sauge-fonce">
              Réservation en ligne
            </p>
            <h1 className="mx-auto mt-4 max-w-2xl font-serif text-4xl sm:text-5xl">
              Prendre rendez-vous
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed sm:text-base">
              Trois petites étapes, et votre rendez-vous est inscrit directement à
              l&rsquo;horaire de la clinique.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="conteneur max-w-3xl">
          <ReservationFlow
            soinPreselectionne={
              soinDemande && !soinDemande.option
                ? { nomSquare: soinDemande.nomSquare, nom: soinDemande.nom }
                : undefined
            }
          />
        </div>
      </section>
    </>
  );
}
