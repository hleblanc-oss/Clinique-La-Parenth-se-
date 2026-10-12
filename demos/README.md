# Démos de design — Clinique La Parenthèse

`directions.html` présente **3 modèles de mise en page** dans le style éditorial retenu
(Cormorant Garamond + Jost, tons du logo). Le sélecteur en haut de page passe de l'un à l'autre.
Tous partagent la même palette (bloc `:root`) pour comparer uniquement la structure : les couleurs
se changent ensuite d'un seul endroit.

| Modèle | Structure |
| --- | --- |
| **1 · Atelier** | Écran partagé : grande photo fixe à gauche (logo, slogan, réservation), contenu qui défile à droite. Soins en accordéon avec le déroulement complet de chaque soin, section « Bon à savoir » (avant/après peeling, annulation), coordonnées en fiche. |
| **2 · Magazine** | Revue beauté : photo pleine largeur avec grand titre, manifeste avec lettrine, 3 soins signatures en zigzag, « Aussi à la carte », bande de chiffres clés, grande citation de Karianne, routine produits, bande Instagram pleine largeur, grand logo en pied de page. |
| **3 · Cocon** | Cartes douces : navigation flottante en pilule, hero arrondi, widget de réservation rapide (prochaine disponibilité en direct), « Comment ça se passe » en 3 étapes, soins filtrables par préoccupation, carte Karianne, FAQ. |
| **Départ** | Le modèle d'origine (arches, carte façon menu), gardé pour comparer. |

Chaque modèle a son flux de réservation cliquable (démo, rien n'est envoyé).

## Présentation ordinateur + téléphone

Sur un ordinateur, chaque modèle s'affiche **en double, côte à côte** : une fenêtre de navigateur
(version ordinateur, mise à l'échelle) et un cadre de téléphone (version mobile, 390 px). Les deux
écrans sont vivants : défilement, accordéons, filtres et réservation fonctionnent dans chacun.
Ouvert directement sur un téléphone, le lien affiche simplement la vraie version mobile, sans cadres.

Techniquement, les points de bascule du site sont des requêtes de conteneur (`@container`) et les
tailles fluides utilisent des unités `cqi` : la mise en page réagit à la largeur de l'écran simulé,
pas à celle de la fenêtre. Le site de chaque modèle est cloné dans les deux écrans (identifiants
préfixés `o-` / `p-`).

## Contenu

Tiré de la page de réservation Square de la clinique (12 octobre 2026) : 7 soins, prix, durées,
déroulement de chaque soin, option peeling (+30 $ sur Algomask, Hydrolifting, Collagène 90+ et soin
du dos), précautions avant/après peeling, heures (mardi et mercredi, 9 h à 19 h), téléphone, courriel
et politique d'annulation (48 h, frais de 50 $). Les 3 photos de soins (`images/`) sont celles de Square.

Le logo est le logo officiel (`public/logo/la-parenthese-logo-01.svg`), intégré en symbole SVG.

## Encore provisoire

- Portrait(s) de Karianne : emplacements avec silhouette
- Photos des produits : flacons illustrés en CSS
- Fil Instagram : tuiles-liens
