const MOTS = ["Hydratation", "Éclat", "Apaisement", "Anti-âge", "Peau saine", "Douceur"];

function Sequence({ cachee = false }: { cachee?: boolean }) {
  return (
    <span aria-hidden={cachee || undefined} className="flex shrink-0 items-center">
      {MOTS.map((mot) => (
        <span key={mot} className="flex items-center">
          <span className="px-7 text-[0.78rem] font-medium uppercase tracking-[0.24em] text-brun">
            {mot}
          </span>
          <span aria-hidden className="text-caramel">
            ·
          </span>
        </span>
      ))}
    </span>
  );
}

/** Bandeau de mots-clés à défilement lent. */
export function Marquee() {
  return (
    <div className="marquee overflow-hidden bg-nude py-4">
      <div className="marquee-piste">
        <Sequence />
        <Sequence cachee />
      </div>
    </div>
  );
}
