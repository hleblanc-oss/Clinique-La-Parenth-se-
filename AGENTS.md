<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Règles du projet — Clinique La Parenthèse

Brief complet : voir README.md. Règles non négociables pour toute contribution :

## Palette (validée par la cliente)
- Strictement crème (#F8F4EF) + sauge (#A3B29A / clair #E4E9DF / foncé #5F7055) + noir (#211D1A), corps de texte #2F332C.
- **INTERDIT : brun/taupe/beige, et blanc pur (#FFFFFF).** La palette Tailwind par défaut est retirée dans `globals.css` — ne pas la réintroduire.
- `--sauge` (#A3B29A) jamais pour du texte sur fond clair (décoratif seulement); texte vert = `--sauge-fonce`.

## Typographie
- Titres : Cormorant Garamond (400–500). Corps/nav/boutons/prix : Jost. 
- Tangerine : UNIQUEMENT décoratif, ≥ 48 px, 2–3 mots, jamais en navigation, prix, boutons ou paragraphe.

## Motion
- Framer Motion, durées 300–600 ms, easing `[0.22, 1, 0.36, 1]` ou easeOut. Doux, jamais flashy.
- Toujours respecter `prefers-reduced-motion` (garder les fades, retirer translations/zooms).

## Square
- Clés/tokens uniquement côté serveur (`src/lib/square/`, `import "server-only"`). Jamais dans un composant client.
- Sandbox d'abord (`SQUARE_ENVIRONMENT=sandbox`), production ensuite.
- Le catalogue Square est la source de vérité (pas de BD produits parallèle; cache court ~60 s).

## Contenu
- Français québécois soigné, vouvoiement. Mobile d'abord (<768 px). 
- Prévoir chargement (skeletons crème/sauge), vide, erreur (message doux + repli contact) pour tout appel réseau.
