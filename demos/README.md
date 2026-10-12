# Démos de design — Clinique La Parenthèse

`directions.html` présente les modèles de mise en page dans le style éditorial retenu
(Cormorant Garamond + Jost, tons du logo). Le sélecteur en haut de page passe de l'un à l'autre.
Tous partagent la même palette (bloc `:root`) pour comparer uniquement la structure : les couleurs
se changent ensuite d'un seul endroit.

## Retour de Karianne (12 octobre 2026)

> « J'aime bien le visuel du 2e avec l'image, mais j'aime la façon dont les choses sont placées du 4e.
> Sinon, à choisir un sans changement, j'aime bien le dernier. »

D'où les deux options en tête du sélecteur :

- **Fusion** (ouvert par défaut) : la disposition du modèle Départ, dont le haut de page est remplacé
  par la grande photo pleine largeur du Magazine (titre « Prenez une parenthèse. », badge rotatif,
  mentions Infirmière / G.M. Collin / analyse de peau). La carte « Nouvelle cliente? » chevauche le bas
  de la photo. Le reste (bandeau défilant, carte des soins, Karianne, produits, Instagram, pied de page)
  reprend la disposition du Départ.
- **Départ** : son choix tel quel, sans changement.

Magazine, Atelier et Cocon restent disponibles comme références (onglets en pointillés).

Correction demandée : Karianne est **infirmière** (et non « infirmière clinicienne »), partout.

| Modèle | Structure |
| --- | --- |
| **Fusion** | Disposition du Départ + grande photo du Magazine en haut de page (voir ci-dessus). |
| **1 · Atelier** | Écran partagé : grande photo fixe à gauche (logo, slogan, réservation), contenu qui défile à droite. Soins en accordéon avec le déroulement complet de chaque soin, section « Bon à savoir » (avant/après peeling, annulation), coordonnées en fiche. |
| **2 · Magazine** | Revue beauté : photo pleine largeur avec grand titre, manifeste avec lettrine, 3 soins signatures en zigzag, « Aussi à la carte », bande de chiffres clés, grande citation de Karianne, routine produits, bande Instagram pleine largeur, grand logo en pied de page. |
| **3 · Cocon** | Cartes douces : navigation flottante en pilule, hero arrondi, widget de réservation rapide (prochaine disponibilité en direct), « Comment ça se passe » en 3 étapes, soins filtrables par préoccupation, carte Karianne, FAQ. |
| **Départ** | Le modèle d'origine (arches, carte façon menu), le choix « sans changement » de Karianne. |

Chaque modèle a son flux de réservation cliquable (démo, rien n'est envoyé).

## Présentation ordinateur + téléphone

Sur un ordinateur, chaque modèle s'affiche **en double, côte à côte** : une fenêtre de navigateur
(version ordinateur, mise à l'échelle) et un cadre de téléphone (version mobile, 390 px). Les deux
écrans sont vivants : défilement, accordéons, filtres et réservation fonctionnent dans chacun.
Ouvert directement sur un téléphone, le lien affiche simplement la vraie version mobile, sans cadres.

Techniquement, les points de bascule du site sont des requêtes de conteneur (`@container`) et les
tailles fluides utilisent des unités `cqi` : la mise en page réagit à la largeur de l'écran simulé,
pas à celle de la fenêtre. Le site de chaque modèle est cloné dans les deux écrans (identifiants
préfixés `o-` / `p-`). Dans la source, les identifiants du Fusion commencent par `f-`, ceux du
Départ par `a-`; la carte des soins est générée dans chaque conteneur `.menu-soins`.

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
