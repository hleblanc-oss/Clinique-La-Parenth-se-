import Link from "next/link";

export default function PageIntrouvable() {
  return (
    <section className="flex min-h-[60svh] items-center py-20">
      <div className="conteneur text-center">
        <p aria-hidden className="select-none font-serif text-7xl text-caramel">
          (&thinsp;)
        </p>
        <h1 className="mt-6 font-serif text-3xl sm:text-4xl">Cette page a pris une parenthèse</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base">
          L&rsquo;adresse demandée n&rsquo;existe pas (ou plus). Retournez à l&rsquo;accueil ou
          jetez un œil à nos soins.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primaire">
            Retour à l&rsquo;accueil
          </Link>
          <Link href="/soins" className="btn btn-secondaire">
            Voir les soins
          </Link>
        </div>
      </div>
    </section>
  );
}
