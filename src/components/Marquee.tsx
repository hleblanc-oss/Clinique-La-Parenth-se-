const MOTS = ["Hydratation", "Anti-âge", "Éclat", "Apaisement", "Douceur", "Peau saine"];

function Sequence({ cachee = false }: { cachee?: boolean }) {
  return (
    <span aria-hidden={cachee || undefined} className="flex shrink-0 items-center">
      {MOTS.map((mot) => (
        <span key={mot} className="flex items-center">
          <span className="px-6 text-[0.8125rem] font-medium uppercase tracking-[0.22em] text-sauge-fonce sm:px-10">
            {mot}
          </span>
          <span aria-hidden className="text-sauge">
            ·
          </span>
        </span>
      ))}
    </span>
  );
}

/** Bandeau de mots-clés à défilement lent (inspiration Esthelle). */
export function Marquee() {
  return (
    <div className="marquee overflow-hidden border-y border-sauge/30 bg-sauge-clair py-3.5">
      <div className="marquee-piste">
        <Sequence />
        <Sequence cachee />
      </div>
    </div>
  );
}
