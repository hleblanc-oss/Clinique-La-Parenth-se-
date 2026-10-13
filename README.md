# Clinique La Parenthèse — Site web

Site de la **Clinique La Parenthèse**, clinique de dermo-esthétique fondée par Karianne Nadeau-Berthiaume, infirmière, à Trois-Rivières (429, rue Barkoff). Positionnement : *« Dermo-esthétique par une infirmière »*, produits **G.M. Collin**. Heures : mardi et mercredi, 9 h à 19 h, sur rendez-vous.

Design : modèle **« Fusion »** choisi par Karianne parmi les démos (`demos/directions.html`, octobre 2026) — grande photo en haut de page, carte des soins façon menu, arches, palette brune du logo.

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

- `DATA_PROVIDER=mock` — données locales réalistes (les 7 soins de la clinique et leurs variations « avec peeling », créneaux générés selon l'horaire mardi et mercredi 9 h-19 h, délai minimum de 4 h, fuseau America/Toronto). Développement et démo sans compte Square; la réservation aboutit à une confirmation simulée.
- `DATA_PROVIDER=square` (défaut) — l'écosystème Square réel (Catalog, Bookings, Customers), en sandbox ou production selon `SQUARE_ENVIRONMENT`. Sans clés, le site affiche le repli doux « réservation bientôt disponible ».

## Configuration Square (sandbox d'abord)

Scripts fournis (exécutés avec `npx tsx`, `.env.local` chargé automatiquement) :

| Script | Rôle |
| ------ | ---- |
| `scripts/liste-locations.ts` | Valide la connexion et liste les locations (pour remplir `SQUARE_LOCATION_ID`) |
| `scripts/seed-sandbox.ts` | **Idempotent.** Configure la location (fuseau America/Toronto, mardi et mercredi 9 h-19 h), crée le team member « Karianne » et une copie conforme des 7 services du vrai catalogue (mêmes noms, variations « avec peeling », prix et durées), puis teste `SearchAvailability` |
| `scripts/test-reservation.ts` | Bout en bout : services → disponibilités → cliente de test → `CreateBooking`, et affiche l'ID de la réservation créée |

Étapes :

1. Dans le [Square Developer Dashboard](https://developer.squareup.com/apps) : créer une application, copier dans `.env.local` le jeton **Sandbox**, l'Application ID et `SQUARE_ENVIRONMENT=sandbox`.
2. `npx tsx scripts/liste-locations.ts` → reporter l'ID dans `SQUARE_LOCATION_ID`.
3. **Activer Square Appointments sur le compte de test** (impossible par API) : Developer Dashboard → Sandbox test accounts → *Open sandbox seller dashboard* → ouvrir **Appointments** dans le sélecteur d'applications et compléter l'activation. Sans cela, `SearchAvailability` et `CreateBooking` répondent `401 — Merchant not onboarded to Appointments`.
4. `npx tsx scripts/seed-sandbox.ts` puis `npx tsx scripts/test-reservation.ts` : la réservation de test doit apparaître dans le calendrier Appointments du sandbox.
5. Tester le flux complet dans le site (`DATA_PROVIDER=square`, `/rendez-vous`).
6. Passage en production : voir ci-dessous.

État du sandbox au 13 octobre 2026 : location `LD3T1SM4P789A` (America/Toronto, mardi et mercredi 9 h-19 h), team member « Karianne » `TMfubFjhinxRF4Ar`, copie conforme des 7 services de la clinique. Le site lit bien ce catalogue (noms propres, option peeling reconnue). **Reste l'étape 3 ci-dessus (activation manuelle d'Appointments) avant de pouvoir afficher des disponibilités et réserver.**

### Brancher le vrai compte Square de la clinique (production)

Le catalogue réel (location `LN4WVN4CZP6QN`) utilise les noms de la page de réservation Square (« soin hydrolift l G.M Collin », variation « Article de base »…). Le site les apparie aux soins éditoriaux par mot-clé (`motCle` dans `src/content/soins.ts`) : renommer un service dans Square ne casse rien tant que le mot-clé reste dans le nom.

1. **Plan Appointments** : avec un jeton d'accès personnel, Square traite les réservations créées par l'API comme des réservations « vendeur », ce qui exige **Appointments Plus ou Premium** ([Bookings API](https://developer.squareup.com/docs/bookings-api/get-ready-to-use-the-api)). Avec le plan gratuit, il faudrait passer par OAuth (permissions « acheteur »), à développer.
2. Dans le Developer Dashboard **du compte de la clinique** : créer une application → onglet *Production* → copier le jeton d'accès.
3. Dans Vercel (Settings → Environment Variables) : `SQUARE_ENVIRONMENT=production`, `SQUARE_ACCESS_TOKEN` (jeton de production), `SQUARE_LOCATION_ID=LN4WVN4CZP6QN`, `DATA_PROVIDER=square`, puis redéployer.
4. Faire une vraie réservation de bout en bout, la vérifier dans le calendrier Appointments, puis l'annuler.
5. À savoir : la page Square de la clinique exige une carte de crédit à la réservation (frais d'annulation de 50 $). Le flux du site ne prend pas de carte pour l'instant : la politique d'annulation est affichée, mais les frais ne peuvent pas être prélevés automatiquement (ajout possible avec le Web Payments SDK). Les courriels de confirmation de Square sont désactivés dans son compte : la page de confirmation du site donne le numéro pour déplacer ou annuler.

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
│   ├── clinique.ts                  # Adresse, téléphone, courriel, heures, politique d'annulation
│   └── soins.ts                     # Contenu éditorial des 7 soins (page Square de la clinique)
└── lib/
    ├── format.ts                    # Dates fr-CA (fuseau America/Toronto), prix CAD
    └── data/                        # Couche fournisseurs (interface commune)
        ├── provider.ts              # Interface FournisseurDonnees
        ├── mock/                    # Données locales réalistes (démo/dev)
        └── square/                  # Client, config, services, bookings, erreurs
```

Principes :

- **Square = source de vérité** pour services réservables, prix et créneaux (cache serveur ~60 s). Le contenu éditorial (descriptions longues, déroulement, précautions) vit dans `src/content/soins.ts`, apparié par mot-clé; les variations « avec peeling » deviennent une option dans le flux de réservation.
- Clés API **uniquement côté serveur** (`import "server-only"` dans `src/lib/square/*`).
- Tous les états prévus : skeletons crème/sauge au chargement, état vide (« Aucune disponibilité cette semaine »), erreur douce avec repli contact, mobile d'abord.
- Palette du logo (`@theme` dans `globals.css`, palette Tailwind par défaut retirée) : crème, nude, pêche, sable, caramel, brun, encre. **Jamais de blanc pur.** Le caramel et le sable sont décoratifs seulement — pour du texte d'accent, `brun` (#805639, contraste AA).

## Scripts

| Commande        | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Développement (localhost:3000)    |
| `npm run build` | Build de production               |
| `npm run start` | Servir le build                   |
| `npm run lint`  | ESLint                            |

## Déploiement Vercel

1. [vercel.com](https://vercel.com) → **Add New… → Project** → importer le dépôt GitHub `hleblanc-oss/Clinique-La-Parenth-se-` (autoriser l'accès Vercel ↔ GitHub au passage). Next.js est détecté automatiquement — aucun réglage de build à changer.
2. Avant de cliquer *Deploy*, ajouter les **variables d'environnement** (mêmes noms que `.env.example`) :
   - `SQUARE_ENVIRONMENT=sandbox`
   - `SQUARE_ACCESS_TOKEN` (jeton sandbox)
   - `SQUARE_APPLICATION_ID`
   - `SQUARE_LOCATION_ID=LD3T1SM4P789A` (location sandbox)
   - `DATA_PROVIDER` : `mock` pour une démo visuelle complète du flux de réservation tant qu'Appointments n'est pas activé dans le sandbox; `square` ensuite.
3. *Deploy* → Vercel fournit une URL `*.vercel.app`. Chaque `git push` redéploie automatiquement.
4. Note : le dépôt étant né avec la seule branche `claude/new-session-19zz3o`, c'est elle la branche par défaut — Vercel la traitera comme production. On pourra créer `main` plus tard et y basculer la production (Vercel → Settings → Git).
5. Au lancement : passer les variables en valeurs de production (voir « Brancher le vrai compte Square ») et brancher le domaine : **cliniquelaparenthese.ca est déjà enregistré chez GoDaddy** (depuis le 20 août 2026, expire le 20 août 2027). Vercel → Settings → Domains → ajouter `cliniquelaparenthese.ca` (et `www`), puis entrer les enregistrements DNS indiqués par Vercel dans le compte GoDaddy qui détient le domaine.

## À faire avant le lancement (Phase 1)

- [x] Téléphone, courriel et heures officiels dans `src/content/clinique.ts`
- [x] Les 7 soins réels (prix, durées, déroulement, précautions du peeling) dans `src/content/soins.ts`
- [x] Logo officiel et design « Fusion » choisi par Karianne
- [x] Photos des soins de la page Square (`public/images/`)
- [ ] Portrait(s) de Karianne → remplacer les photos de soins marquées `TODO` (accueil, À propos)
- [ ] Photos des produits G.M. Collin → remplacer les flacons illustrés du « rituel maison »
- [ ] Photos en plus haute résolution pour le haut de page (les photos Square font ~970 px de large)
- [ ] Activer Appointments dans le sandbox → tester le flux complet → production (plan Appointments Plus/Premium)
- [ ] Brancher le formulaire de contact (Resend ou autre) — la route répond 503 et renvoie vers le courriel et le téléphone en attendant
- [ ] Flux Instagram réel (Behold.so ou API Graph) — tuiles-liens en attendant
- [ ] Brancher cliniquelaparenthese.ca sur Vercel (DNS chez GoDaddy)
- [ ] Textes « À propos » à valider/enrichir avec Karianne (voir questionnaire du brief, § 8.1)

## Phases suivantes

- **Phase 2 — Boutique** : catalogue G.M. Collin (Catalog + Inventory API), pages produits animées, panier, checkout Web Payments SDK, livraison gratuite ≥ 150 $ (barre de progression), quiz d'analyse de peau, webhooks temps réel.
- **Phase 3 — Admin** : dashboard protégé (NextAuth/Clerk) en lecture sur Square : ventes, rendez-vous, clientes, alertes inventaire.
- **Ultérieur** : fidélité (Loyalty API), cartes-cadeaux, bilingue EN.
