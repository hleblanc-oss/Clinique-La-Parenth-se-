# Clinique La Parenthèse — Site web

Site de la **Clinique La Parenthèse**, clinique de dermo-esthétique fondée par Karianne, infirmière clinicienne, à Trois-Rivières (429, rue Barkoff). Positionnement : *« Dermo-esthétique par une infirmière clinicienne »*, partenaire exclusif **G.M. Collin**. Ouverture : **septembre 2026**.

Interface custom par-dessus l'écosystème **Square** (rendez-vous, catalogue, paiements) — jamais de redirection vers les pages génériques Square.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** — tokens de la palette dans `src/app/globals.css` (`@theme`)
- **Framer Motion** — animations douces (300–600 ms, `prefers-reduced-motion` respecté)
- **SDK Square** (`square` npm) côté serveur uniquement
- Polices : Cormorant Garamond (titres), Jost (corps), Tangerine (accents rares) via `next/font`
- Hébergement cible : **Vercel**

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis remplir les clés Square (sandbox)
npm run dev
```

Sans clés Square, le site fonctionne entièrement : le flux de réservation affiche un repli doux (« la réservation en ligne arrive bientôt ») au lieu d'une erreur.

## Fournisseurs de données (`DATA_PROVIDER`)

Le site parle à ses données via une interface unique (`src/lib/data/provider.ts`) :

- `DATA_PROVIDER=mock` — données locales réalistes (les 9 soins du brief, créneaux générés selon l'horaire mar-ven 9 h-17 h / sam 9 h-13 h, fuseau America/Toronto). Développement et démo sans compte Square; la réservation aboutit à une confirmation simulée.
- `DATA_PROVIDER=square` (défaut) — l'écosystème Square réel (Catalog, Bookings, Customers), en sandbox ou production selon `SQUARE_ENVIRONMENT`. Sans clés, le site affiche le repli doux « réservation bientôt disponible ».

## Configuration Square (sandbox d'abord)

Scripts fournis (exécutés avec `npx tsx`, `.env.local` chargé automatiquement) :

| Script | Rôle |
| ------ | ---- |
| `scripts/liste-locations.ts` | Valide la connexion et liste les locations (pour remplir `SQUARE_LOCATION_ID`) |
| `scripts/seed-sandbox.ts` | **Idempotent.** Configure la location (fuseau America/Toronto, heures d'affaires), crée le team member « Karianne » et les 3 services de test, puis teste `SearchAvailability` |
| `scripts/test-reservation.ts` | Bout en bout : services → disponibilités → cliente de test → `CreateBooking`, et affiche l'ID de la réservation créée |

Étapes :

1. Dans le [Square Developer Dashboard](https://developer.squareup.com/apps) : créer une application, copier dans `.env.local` le jeton **Sandbox**, l'Application ID et `SQUARE_ENVIRONMENT=sandbox`.
2. `npx tsx scripts/liste-locations.ts` → reporter l'ID dans `SQUARE_LOCATION_ID`.
3. **Activer Square Appointments sur le compte de test** (impossible par API) : Developer Dashboard → Sandbox test accounts → *Open sandbox seller dashboard* → ouvrir **Appointments** dans le sélecteur d'applications et compléter l'activation. Sans cela, `SearchAvailability` et `CreateBooking` répondent `401 — Merchant not onboarded to Appointments`.
4. `npx tsx scripts/seed-sandbox.ts` puis `npx tsx scripts/test-reservation.ts` : la réservation de test doit apparaître dans le calendrier Appointments du sandbox.
5. Tester le flux complet dans le site (`DATA_PROVIDER=square`, `/rendez-vous`).
6. Passage en production : jeton de production, `SQUARE_ENVIRONMENT=production`, `SQUARE_LOCATION_ID=LN4WVN4CZP6QN` (emplacement réel d'après le lien de réservation de la cliente), puis une vraie réservation de bout en bout.

État du sandbox au 25 août 2026 : location `LD3T1SM4P789A` configurée (America/Toronto, heures d'affaires), team member « Karianne » `TMfubFjhinxRF4Ar`, 3 services créés (Soin Oxygénant 135 $/75 min, Soin Collagène 90+ 150 $/75 min, Consultation 25 $/20 min). **Reste l'étape 3 ci-dessus (activation manuelle d'Appointments) avant de pouvoir réserver.**

## Architecture

```
src/
├── app/
│   ├── page.tsx                     # Accueil (hero, marquee, à propos, soins, citation, Instagram)
│   ├── soins/                       # Carte des soins + page dédiée par soin
│   ├── rendez-vous/                 # Flux de réservation 100 % custom (Bookings API)
│   ├── a-propos/                    # Histoire de Karianne (page de la confiance)
│   ├── contact/                     # Adresse, carte, formulaire
│   └── api/
│       ├── reservation/             # GET services, GET disponibilites, POST réservation
│       ├── infolettre/              # POST inscription (Customers API)
│       └── contact/                 # POST (503 tant qu'aucun service courriel n'est branché)
├── components/                      # En-tête, pied de page, cartes, flux de réservation…
├── content/
│   ├── clinique.ts                  # Adresse, Instagram, heures (source unique)
│   └── soins.ts                     # Contenu éditorial des 9 soins (prix/durées du brief)
└── lib/
    ├── format.ts                    # Dates fr-CA (fuseau America/Toronto), prix CAD
    └── data/                        # Couche fournisseurs (interface commune)
        ├── provider.ts              # Interface FournisseurDonnees
        ├── mock/                    # Données locales réalistes (démo/dev)
        └── square/                  # Client, config, services, bookings, erreurs
```

Principes :

- **Square = source de vérité** pour services réservables, prix et créneaux (cache serveur ~60 s). Le contenu éditorial (descriptions longues) vit dans `src/content/soins.ts`, apparié par nom.
- Clés API **uniquement côté serveur** (`import "server-only"` dans `src/lib/square/*`).
- Tous les états prévus : skeletons crème/sauge au chargement, état vide (« Aucune disponibilité cette semaine »), erreur douce avec repli contact, mobile d'abord.
- Palette stricte crème + sauge + noir (`@theme` dans `globals.css`, palette Tailwind par défaut retirée). **Aucun brun/taupe/beige. Jamais de blanc pur.** Le vert `--sauge` (#A3B29A) est décoratif seulement — pour du texte vert, `--sauge-fonce` (#5F7055, contraste AA).

## Scripts

| Commande        | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Développement (localhost:3000)    |
| `npm run build` | Build de production               |
| `npm run start` | Servir le build                   |
| `npm run lint`  | ESLint                            |

## À faire avant le lancement (Phase 1)

- [ ] Renseigner téléphone et courriel officiels dans `src/content/clinique.ts` (repli des états d'erreur)
- [ ] Heures d'ouverture définitives (`clinique.heures`)
- [ ] Brancher les clés Square sandbox → tester le flux complet → production
- [ ] Photos professionnelles (Karianne + ambiance) → remplacer les composants `MotifPhoto`
- [ ] Logo vectoriel décliné sans taupe (le brun est banni du site)
- [ ] Brancher le formulaire de contact (Resend ou autre) — la route répond 503 en attendant
- [ ] Flux Instagram réel (Behold.so ou API Graph) — tuiles-liens en attendant
- [ ] Acheter le domaine (cliniquelaparenthese.ca) et le brancher sur Vercel (mettre à jour `URL_SITE` dans `src/content/clinique.ts` si différent)
- [ ] Textes « À propos » à valider/enrichir avec Karianne (voir questionnaire du brief, § 8.1)
- [ ] Vouvoiement confirmé (le site est rédigé au vouvoiement)

## Phases suivantes

- **Phase 2 — Boutique** : catalogue G.M. Collin (Catalog + Inventory API), pages produits animées, panier, checkout Web Payments SDK, livraison gratuite ≥ 150 $ (barre de progression), quiz d'analyse de peau, webhooks temps réel.
- **Phase 3 — Admin** : dashboard protégé (NextAuth/Clerk) en lecture sur Square : ventes, rendez-vous, clientes, alertes inventaire.
- **Ultérieur** : fidélité (Loyalty API), cartes-cadeaux, bilingue EN.
