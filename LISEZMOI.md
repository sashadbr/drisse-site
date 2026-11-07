# Site DRISSE : modifier et publier

Tout le site se trouve dans le dossier `src`. Les fichiers s'ouvrent avec n'importe quel éditeur de texte.

## Modifier

Dans `src/index.html`, des repères en français indiquent quoi faire :

- **Produit** : dans `src/index.html`, copier le bloc `<a class="carte"` … `</a>`, le coller juste en dessous, changer ses textes. Pour sa fiche, copier `src/trousse-pp-tisse.html` sous un nouveau nom et mettre ce nom dans le lien de la carte.
- **Couleur d'accent** : une seule ligne, `--accent` en haut de `src/styles.css`.
- **Marché** : copier une ligne `<tr>` … `</tr>`, changer la date et le lieu. La section « Où acheter » est masquée : retirer le mot `hidden` de la section et de son lien dans le menu (dans `index.html` et `mentions-legales.html`).
- **Photos** : mettre le fichier dans `src/images`, puis retirer les marques de commentaire (`<!--` et `-->`) de la ligne `<img …>` et corriger le nom du fichier si besoin. Le logo est déjà en place.
- **Infos manquantes** : chercher `[À COMPLÉTER]` dans `src/index.html` et `src/mentions-legales.html`.

## Publier sur Cloudflare Pages

- Commande de build : `npm run build`
- Dossier de sortie : `dist`
