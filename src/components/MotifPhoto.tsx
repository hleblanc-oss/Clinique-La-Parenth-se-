/**
 * Emplacement visuel en attendant les photos professionnelles (dossier à venir).
 * Dégradé crème/sauge et parenthèses décoratives — à remplacer par <Image>
 * (next/image) dès réception des photos.
 */
export function MotifPhoto({
  ratio = "4/5",
  legende,
  className = "",
}: {
  /** Ratio largeur/hauteur CSS, ex. "4/5", "3/4", "16/10". */
  ratio?: string;
  legende?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-sauge-clair via-creme to-sauge/40 ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="select-none font-serif text-[clamp(5rem,14vw,9rem)] font-light leading-none text-sauge/60">
          (&thinsp;)
        </span>
      </div>
      {legende && (
        <span className="absolute inset-x-0 bottom-4 text-center text-[0.7rem] uppercase tracking-[0.2em] text-sauge-fonce/70">
          {legende}
        </span>
      )}
    </div>
  );
}
