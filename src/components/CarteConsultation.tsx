import Link from "next/link";
import { soinParSlug } from "@/content/soins";

/** Carte « Nouvelle cliente? » qui mène directement à la réservation de la consultation. */
export function CarteConsultation({ className = "" }: { className?: string }) {
  const consultation = soinParSlug("consultation-analyse-de-peau")!;
  return (
    <Link
      href={`/rendez-vous?soin=${consultation.slug}`}
      className={`flex flex-col gap-1 rounded-[1.25rem] bg-creme px-5 py-4 text-left shadow-[0_24px_44px_-22px_rgba(40,25,15,.45)] transition-transform duration-300 ease-doux motion-safe:hover:-translate-y-1 ${className}`}
    >
      <span className="text-[0.66rem] font-medium uppercase tracking-[0.16em] text-brun">
        Nouvelle cliente?
      </span>
      <strong className="font-serif text-[1.3rem] font-medium leading-tight text-encre">
        {consultation.nom}&nbsp;· {consultation.prix}&nbsp;$
      </strong>
      {consultation.bonus && (
        <span className="mt-0.5 text-[0.82rem] text-brun">{consultation.bonus} →</span>
      )}
    </Link>
  );
}
