/**
 * Flacon illustré en CSS (rituel maison), en attendant les photos des produits.
 * Formes : pompe (nettoyant, sérum), tube (exfoliant), pot (crème).
 */
export function Flacon({ forme, nom }: { forme: "pompe" | "tube" | "pot"; nom: string }) {
  const corps =
    "relative flex flex-col items-center justify-center bg-creme text-center shadow-[inset_-10px_0_16px_rgba(40,25,15,.07),inset_8px_0_12px_rgba(255,250,245,.45),0_18px_24px_-18px_rgba(40,25,15,.45)]";
  const etiquette = (
    <em className="px-1 font-serif text-[0.8rem] italic leading-tight text-brun">{nom}</em>
  );

  if (forme === "tube") {
    return (
      <div aria-hidden className="flex w-full flex-col-reverse items-center">
        <i className="block h-[22px] w-[34%] rounded-[3px_3px_8px_8px] bg-brun" />
        <i
          className={`${corps} aspect-[1/1.9] w-[62%] rounded-[3px_3px_10px_10px] [clip-path:polygon(0_0,100%_0,84%_100%,16%_100%)]`}
        >
          {etiquette}
        </i>
      </div>
    );
  }

  if (forme === "pot") {
    return (
      <div aria-hidden className="flex w-full flex-col items-center">
        <i className="block h-6 w-[86%] rounded-[8px_8px_3px_3px] bg-brun" />
        <i className={`${corps} aspect-[1.45/1] w-[80%] rounded-[8px_8px_16px_16px]`}>
          {etiquette}
        </i>
      </div>
    );
  }

  return (
    <div aria-hidden className="flex w-full flex-col items-center">
      <i className="relative block h-3 w-[24%] rounded-[5px_5px_2px_2px] bg-brun">
        <i className="absolute left-[88%] top-0.5 block h-[5px] w-[80%] rounded-r-[3px] bg-brun" />
      </i>
      <i className="block h-4 w-[11%] bg-brun/75" />
      <i className={`${corps} aspect-[1/1.75] w-[64%] rounded-[16px_16px_20px_20px]`}>
        {etiquette}
      </i>
    </div>
  );
}
