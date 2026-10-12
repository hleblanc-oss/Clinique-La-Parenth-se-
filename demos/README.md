# Démos de design — Clinique La Parenthèse

`directions.html` présente les **2 options retenues par Karianne**, dans le style éditorial
(Cormorant Garamond + Jost, tons du logo). Le sélecteur en haut de page passe de l'une à l'autre.
Les deux partagent la même palette (bloc `:root`) : les couleurs se changent ensuite d'un seul endroit.

## Retour de Karianne (12 octobre 2026)

> « J'aime bien le visuel du 2e avec l'image, mais j'aime la façon dont les choses sont placées du 4e.
> Sinon, à choisir un sans changement, j'aime bien le dernier. »

| Option | Structure |
| --- | --- |
| **1 · Fusion** (ouverte par défaut) | La disposition du Départ, avec une grande photo pleine largeur en haut de page (titre « Prenez une parenthèse. », badge rotatif, mentions Infirmière / G.M. Collin / analyse de peau). La carte « Nouvelle cliente? » chevauche le bas de la photo. Le reste (bandeau défilant, carte des soins, Karianne, produits, Instagram, pied de page) reprend le Départ. |
| **2 · Départ** | Le modèle d'origine tel quel (arches, carte des soins façon menu) : son choix « sans changement ». |

Les autres modèles essayés (Atelier, Magazine, Cocon) ont été retirés de la démo pour faciliter
le choix; ils restent dans l'historique git (commit `f35dfd8`).

Chaque option a son flux de réservation cliquable (démo, rien n'est envoyé).

Correction demandée : Karianne est **infirmière** (et non « infirmière clinicienne »), partout.

## Présentation ordinateur + téléphone

Sur un ordinateur, chaque option s'affiche **en double, côte à côte** : une fenêtre de navigateur
(version ordinateur, mise à l'échelle) et un cadre de téléphone (version mobile, 390 px). Les deux
écrans sont vivants : défilement, liens internes et réservation fonctionnent dans chacun.
Ouvert directement sur un téléphone, le lien affiche simplement la vraie version mobile, sans cadres.

Techniquement, les points de bascule du site sont des requêtes de conteneur (`@container`) et les
tailles fluides utilisent des unités `cqi` : la mise en page réagit à la largeur de l'écran simulé,
pas à celle de la fenêtre. Le site de chaque option est cloné dans les deux écrans (identifiants
préfixés `o-` / `p-`). Dans la source, les identifiants du Fusion commencent par `f-`, ceux du
Départ par `a-`; la carte des soins est générée dans chaque conteneur `.menu-soins`.

## Contenu

Tiré de la page de réservation Square de la clinique (12 octobre 2026) : 7 soins, prix, durées,
option peeling (+30 $ sur Algomask, Hydrolifting, Collagène 90+ et soin du dos), heures (mardi et
mercredi, 9 h à 19 h), téléphone, courriel et politique d'annulation (48 h, frais de 50 $). Les
photos de soins (`images/`) sont celles de Square.

Le logo est le logo officiel (`public/logo/la-parenthese-logo-01.svg`), intégré en symbole SVG.

## Encore provisoire

- Portrait(s) de Karianne : emplacements avec silhouette
- Photos des produits : flacons illustrés en CSS
- Fil Instagram : tuiles-liens
