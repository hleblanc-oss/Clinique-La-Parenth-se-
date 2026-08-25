import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Tangerine } from "next/font/google";
import { EnTete } from "@/components/EnTete";
import { PiedDePage } from "@/components/PiedDePage";
import { clinique, URL_SITE } from "@/content/clinique";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

// Tangerine : accents décoratifs RARES uniquement, en très grand format.
const tangerine = Tangerine({
  variable: "--font-tangerine",
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: {
    default: `${clinique.nom} — Dermo-esthétique à Trois-Rivières`,
    template: `%s — ${clinique.nom}`,
  },
  description:
    "Dermo-esthétique par une infirmière clinicienne à Trois-Rivières. Soins du visage G.M. Collin, analyse de peau personnalisée et réservation en ligne. Ouverture septembre 2026.",
  keywords: [
    "dermo-esthétique",
    "soins du visage",
    "Trois-Rivières",
    "G.M. Collin",
    "infirmière clinicienne",
    "esthétique",
    "analyse de peau",
  ],
  openGraph: {
    type: "website",
    locale: "fr_CA",
    siteName: clinique.nom,
    title: `${clinique.nom} — Dermo-esthétique à Trois-Rivières`,
    description:
      "Soins du visage G.M. Collin par une infirmière clinicienne, dans une ambiance intime et personnalisée.",
  },
};

const donneesStructurees = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: clinique.nom,
  description: clinique.slogan,
  url: URL_SITE,
  address: {
    "@type": "PostalAddress",
    streetAddress: clinique.adresse.rue,
    addressLocality: clinique.adresse.ville,
    addressRegion: "QC",
    postalCode: clinique.adresse.codePostal,
    addressCountry: "CA",
  },
  sameAs: [clinique.instagram.url],
  priceRange: "$$",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${jost.variable} ${tangerine.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-noir focus:px-5 focus:py-2 focus:text-creme"
        >
          Aller au contenu
        </a>
        <EnTete />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <PiedDePage />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(donneesStructurees) }}
        />
      </body>
    </html>
  );
}
