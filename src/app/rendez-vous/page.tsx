import type { Metadata } from "next";
import { ReservationFlow } from "@/components/reservation/ReservationFlow";
import { Reveal } from "@/components/Reveal";
import { clinique } from "@/content/clinique";
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
            <p className="surtitre">Réservation en ligne</p>
            <h1 className="mx-auto mt-5 max-w-2xl font-serif text-[clamp(2.6rem,5.5vw,4.5rem)] leading-[1.05]">
              Prendre <em className="text-brun">rendez-vous</em>
            </h1>
            <p className="mx-auto mt-5 max-w-lg leading-relaxed">
              Trois petites étapes, et votre rendez-vous est inscrit directement à l&rsquo;horaire
              de la clinique ({clinique.heuresResume.toLowerCase()}).
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="conteneur max-w-3xl">
          <ReservationFlow soinPreselectionne={soinDemande?.slug} />
        </div>
      </section>
    </>
  );
}
