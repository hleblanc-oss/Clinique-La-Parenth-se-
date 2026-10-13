/** Badge circulaire qui tourne lentement (arrêté sous prefers-reduced-motion). */
export function BadgeRotatif({
  texte = "INFIRMIÈRE · SOINS DU VISAGE · G.M. COLLIN · ",
  className = "",
}: {
  texte?: string;
  className?: string;
}) {
  return (
    <div aria-hidden className={className}>
      <svg viewBox="0 0 120 120" className="badge-tourne block h-auto w-full">
        <defs>
          <path id="badge-cercle" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
        </defs>
        <circle cx="60" cy="60" r="59" className="fill-nude" />
        <text className="fill-brun font-sans" fontSize="8.6" fontWeight="500">
          <textPath href="#badge-cercle" textLength="276" lengthAdjust="spacingAndGlyphs">
            {texte}
          </textPath>
        </text>
        <text x="60" y="71" textAnchor="middle" className="fill-encre font-serif" fontSize="32">
          ( )
        </text>
      </svg>
    </div>
  );
}
