# Site DRISSE : modifier et publier

## Modifier le site : l'espace d'administration

1. Aller sur https://app.pagescms.org et se connecter avec son compte GitHub.
2. Choisir le dépôt `sashadbr/drisse-site`, branche `main`.
3. Trois rubriques :
   - **Produits** : ajouter, modifier ou masquer un produit (« Visible sur le site »). Chaque produit a sa fiche, créée toute seule.
   - **Textes du site** : titre, histoire, photos de l'atelier, marchés, contact.
   - **Mentions légales**.
4. Cliquer sur **Save** : le site se met à jour en ligne en moins d'une minute.

Les photos se glissent directement dans les champs photo ; elles sont rangées dans `src/images`.

Une case laissée vide s'affiche `[À COMPLÉTER]` sur le site, ou `[PHOTO À AJOUTER]` pour une photo.

## Comment c'est rangé

- `contenu/` : tous les textes et produits (ce que modifie l'espace d'administration).
- `src/` : le style (`styles.css`), la police, le logo et les photos.
- `modeles.mjs` : la mise en page de chaque page.
- `build.mjs` : fabrique le site dans `dist` à partir de tout ça (`npm run build`).
- `.pages.yml` : les réglages des formulaires de l'espace d'administration.

La couleur d'accent se change sur une seule ligne : `--accent`, en haut de `src/styles.css`.

## Publier sur GitHub Pages

Le site se publie tout seul sur https://drisse-atelier.fr à chaque mise à jour de la branche `main` (fichier `.github/workflows/pages.yml`). L'onglet **Actions** du dépôt montre si la publication a réussi.
