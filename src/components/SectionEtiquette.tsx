/** Amorce de section : étiquette Jost majuscules + titre Cormorant. */
export function SectionEtiquette({
  etiquette,
  titre,
  centre = false,
  clair = false,
}: {
  etiquette: string;
  titre: string;
  centre?: boolean;
  /** Sur fond foncé. */
  clair?: boolean;
}) {
  return (
    <div className={centre ? "text-center" : ""}>
      <p
        className={`text-xs font-medium uppercase tracking-[0.2em] ${
          clair ? "text-sauge" : "text-sauge-fonce"
        }`}
      >
        {etiquette}
      </p>
      <h2
        className={`mt-3 font-serif text-3xl sm:text-4xl lg:text-[2.75rem] ${
          clair ? "text-creme" : "text-noir"
        }`}
      >
        {titre}
      </h2>
    </div>
  );
}
