import Image from "next/image";

/**
 * Logo officiel (public/logo/) : version brun et caramel sur fond clair,
 * version pêche sur fond brun (pied de page).
 */
export function Logo({
  variante = "couleur",
  className = "",
  preload = false,
}: {
  variante?: "couleur" | "clair";
  className?: string;
  preload?: boolean;
}) {
  return (
    <Image
      src={
        variante === "clair" ? "/logo/la-parenthese-logo-07.svg" : "/logo/la-parenthese-logo-01.svg"
      }
      alt="Clinique La Parenthèse, dermo-esthétique"
      width={428}
      height={105}
      preload={preload}
      className={`h-auto ${className}`}
    />
  );
}
