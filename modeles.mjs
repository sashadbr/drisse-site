// Modèles des pages du site. Les textes viennent du dossier contenu
// (modifiables depuis Pages CMS) ; ici, seulement la mise en page.

const esc = (s = "") =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    // Espace insécable avant ? ! : ; » (typographie française).
    .replace(/ ([?!:;»])/g, "\u00a0$1")
    .replace(/« /g, "«\u00a0");

// Texte sur plusieurs lignes : un retour à la ligne devient <br>.
const lignes = (s = "") => esc(s.trim()).replaceAll("\n", "<br>");

// Texte en paragraphes : une ligne vide sépare deux paragraphes.
const paragraphes = (s = "") =>
  s
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${lignes(p)}</p>`)
    .join("\n          ");

const aCompleter = '<span class="a-completer">[À COMPLÉTER]</span>';
const ouACompleter = (s) => (s && String(s).trim() ? esc(s) : aCompleter);

// Chemin d'image : « /images/x.jpg » ou « images/x.jpg » donnent « images/x.jpg ».
// Les espaces et parenthèses des noms de fichiers sont encodés pour l'adresse.
const image = (s = "") => encodeURI(String(s ?? "").trim().replace(/^\/+/, ""));

const photo = (classe, src, alt, repere) =>
  `<figure class="photo ${classe}">${
    image(src)
      ? `<img src="${esc(image(src))}" alt="${esc(alt)}" loading="lazy">`
      : `<figcaption class="photo__repere"><strong>[PHOTO À AJOUTER]</strong>${esc(repere)}</figcaption>`
  }</figure>`;

const fleche =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
const corde =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20c4-4 4-12 8-16"/><path d="M12 4c4 4 4 12 8 16"/><path d="M8 12h8"/></svg>';
const coche =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

// Lien de réseau social : accepte un lien complet ou un @pseudo.
function reseau(valeur, base) {
  const v = String(valeur || "").trim();
  if (!v) return aCompleter;
  const pseudo = v.replace(/^https?:\/\/(www\.)?[^/]+\//, "").replace(/^@/, "").replace(/\/.*$/, "");
  const lien = /^https?:\/\//.test(v) ? v : `${base}${pseudo}`;
  return `<a href="${esc(lien)}">@${esc(pseudo)}</a>`;
}

function page({ titre, description, contenu, avecMarches, accueil }) {
  const ancre = (id) => (accueil ? `#${id}` : `index.html#${id}`);
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(titre)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#f5f2ec">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preload" href="fonts/rubik-black.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <a class="evitement" href="#contenu">Aller au contenu</a>

  ${PIED_ET_TETE.bandeau}

  <header class="entete">
    <div class="conteneur entete__interieur">
      <a class="logo" href="${accueil ? "#contenu" : "index.html"}" aria-label="DRISSE, accueil">
        <img src="images/logo.svg" alt="DRISSE" width="1561" height="511">
      </a>
      <nav class="nav" aria-label="Navigation principale">
        <a href="${ancre("produits")}">Produits</a>
        <a href="${ancre("histoire")}">Histoire</a>${avecMarches ? `\n        <a href="${ancre("ou-acheter")}">Où acheter</a>` : ""}
        <a href="${ancre("contact")}">Contact</a>
      </nav>
    </div>
  </header>

  <main id="contenu">
${contenu}
  </main>

  <footer class="pied">
    <div class="conteneur pied__interieur">
      <span>DRISSE, fait main dans le Gard</span>
      <a href="mentions-legales.html">Mentions légales</a>
    </div>
  </footer>
  <!-- Statistiques de visite : Cloudflare Web Analytics (sans cookies) -->
  <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "ad04ecaae732474285681f6a8cb2f818"}'></script>
</body>
</html>
`;
}

const PIED_ET_TETE = { bandeau: "" };

function carte(p) {
  return `<a class="carte" href="${esc(p.slug)}.html">
          <div class="photo">${p.etiquette ? `
            <span class="carte__etiquette">${esc(p.etiquette)}</span>` : ""}${
    image(p.photo)
      ? `
            <img src="${esc(image(p.photo))}" alt="${esc(p.nom)}" loading="lazy">`
      : `
            <p class="photo__repere"><strong>[PHOTO À AJOUTER]</strong>${esc(p.nom)}</p>`
  }
          </div>
          <span class="carte__ligne"><span>${esc(p.nom)}</span><span class="carte__prix">${esc(p.prix)}</span></span>${p.matiere ? `
          <span class="carte__matiere">${esc(p.matiere)}</span>` : ""}
        </a>`;
}

export function accueil(site, produits) {
  PIED_ET_TETE.bandeau = site.bandeau ? `<div class="bandeau">${esc(site.bandeau)}</div>` : "";
  const marches = (site.marches || []).filter((m) => m && (m.date || m.lieu));
  const atelier = site.photos_atelier || {};

  const contenu = `    <section class="conteneur accueil">
      <div class="accueil__tete">
        <h1>${lignes(site.titre)}</h1>
        <div class="accueil__suite">
          <p>${esc(site.accroche)}</p>
          <a class="bouton" href="#produits">Voir les produits ${fleche}</a>
        </div>
      </div>
      ${photo("accueil__photo", site.photo_accueil, "Une création DRISSE en situation", "Une trousse en situation, en extérieur")}

      <div class="atouts">
        ${(site.atouts || [])
          .map((a) => `<p class="atout"><span><strong>${esc(a.titre)}</strong>${esc(a.texte)}</span></p>`)
          .join("\n        ")}
      </div>
    </section>

    <section class="section conteneur" id="produits">
      <div class="section__tete">
        <h2 class="section__titre">Produits</h2>${site.produits_intro ? `
        <p>${esc(site.produits_intro)}</p>` : ""}
      </div>
      <div class="produits">
        ${produits.map(carte).join("\n        ")}${site.case_bientot ? `
        <div class="carte carte--a-venir">
          <div class="photo">
            <p class="photo__repere"><strong>Bientôt</strong>${esc(site.bientot_texte)}</p>
          </div>
        </div>` : ""}
      </div>
    </section>

    <section class="section conteneur" id="histoire">
      <div class="histoire">
        <div class="histoire__photos">
          ${photo("histoire__grande", atelier.grande, "À la machine, dans l'atelier", "À la machine, dans l'atelier")}
          ${photo("histoire__petite", atelier.petite_1, "Matière avant la découpe", "Matière avant la découpe")}
          ${photo("histoire__petite", atelier.petite_2, "Gabarits et chutes de tissu", "Gabarits et chutes de tissu")}
        </div>
        <div class="histoire__texte">
          <span class="surtitre">Histoire</span>
          <h2>${esc(site.histoire_titre)}</h2>
          ${paragraphes(site.histoire_debut)}${site.fibre ? `
          <div class="fibre">
            <span class="surtitre">Ma fibre</span>
            <p>${esc(site.fibre)}</p>
          </div>` : ""}
          ${paragraphes(site.histoire_suite)}${site.note_drisse ? `
          <div class="note">
            ${corde}
            <p><strong>Drisse :</strong> ${esc(site.note_drisse)}</p>
          </div>` : ""}
        </div>
      </div>
    </section>
${marches.length ? `
    <section class="section conteneur" id="ou-acheter">
      <div class="section__tete">
        <h2 class="section__titre">Où acheter</h2>
      </div>
      <table class="marches">
        <thead>
          <tr><th scope="col">Date</th><th scope="col">Lieu</th></tr>
        </thead>
        <tbody>
          ${marches.map((m) => `<tr><th scope="row">${esc(m.date)}</th><td>${esc(m.lieu)}</td></tr>`).join("\n          ")}
        </tbody>
      </table>
    </section>
` : ""}
    <section class="section conteneur" id="contact">
      <div class="contact">
        <div class="contact__texte">
          <h2>${lignes(site.contact_titre)}</h2>
          <p>${esc(site.contact_texte)}</p>
        </div>
        <dl class="contact__liste">
          <div><dt>Instagram</dt><dd>${reseau(site.instagram, "https://www.instagram.com/")}</dd></div>
          <div><dt>TikTok</dt><dd>${reseau(site.tiktok, "https://www.tiktok.com/@")}</dd></div>
        </dl>
      </div>
    </section>`;

  return page({
    titre: "DRISSE | Fait main dans le Gard",
    description: site.accroche,
    contenu,
    avecMarches: marches.length > 0,
    accueil: true,
  });
}

export function fiche(p, avecMarches) {
  const photos = (p.photos || []).filter((s) => s && String(s).trim());
  const contenu = `    <div class="conteneur">
    <nav class="ariane" aria-label="Fil d'Ariane">
      <a href="index.html#produits">Produits</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.nom)}</span>
    </nav>

    <div class="fiche-produit">
      <div class="fiche-produit__photos">
        ${photo("fiche-produit__principale", p.photo, p.nom, `${p.nom}, de près`)}
        ${
          photos.length
            ? photos.map((src) => photo("fiche-produit__petite", src, p.nom, "")).join("\n        ")
            : `${photo("fiche-produit__petite", "", "", "Ouverte, à plat, avec son contenu")}
        ${photo("fiche-produit__petite", "", "", "Détail des coutures")}`
        }
      </div>

      <div class="fiche-produit__texte">
        <div class="fiche-produit__tete">${p.pastille ? `
          <span class="pastille">${esc(p.pastille)}</span>` : ""}
          <h1>${esc(p.nom)}</h1>
          <span class="fiche-produit__prix">${esc(p.prix)}</span>
        </div>
        ${paragraphes(p.description)}
        <a class="bouton" href="index.html#contact">Me contacter pour l'acheter</a>
        <dl class="fiche">
          <div><dt>Matière</dt><dd>${ouACompleter(p.matiere)}</dd></div>
          <div><dt>Dimensions</dt><dd>${ouACompleter(p.dimensions)}</dd></div>
          <div><dt>Poids</dt><dd>${ouACompleter(p.poids)}</dd></div>
          <div><dt>Fabrication</dt><dd>${ouACompleter(p.fabrication)}</dd></div>
        </dl>${(p.points || []).filter(Boolean).length ? `
        <ul class="garanties">
          ${p.points.filter(Boolean).map((t) => `<li>${coche}<span>${esc(t)}</span></li>`).join("\n          ")}
        </ul>` : ""}
      </div>
    </div>
    </div>`;

  return page({
    titre: `${p.nom} | DRISSE`,
    description: p.description || p.nom,
    contenu,
    avecMarches,
    accueil: false,
  });
}

export function mentions(m, avecMarches) {
  const contenu = `    <div class="conteneur legal">
    <h1>Mentions légales</h1>

    <section>
      <h2>Éditeur du site</h2>
      <dl class="fiche">
        <div><dt>Nom</dt><dd>${ouACompleter(m.nom)}</dd></div>
        <div><dt>Adresse</dt><dd>${ouACompleter(m.adresse)}</dd></div>
        <div><dt>SIRET</dt><dd>${ouACompleter(m.siret)}</dd></div>
        <div><dt>Contact</dt><dd>${ouACompleter(m.contact)}</dd></div>
      </dl>
    </section>

    <section>
      <h2>Hébergeur</h2>
      <dl class="fiche">
        <div><dt>Nom</dt><dd>GitHub, Inc. (GitHub Pages)</dd></div>
        <div><dt>Adresse</dt><dd>88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis</dd></div>
        <div><dt>Site</dt><dd><a href="https://github.com">github.com</a></dd></div>
      </dl>
    </section>

    <a href="index.html">Retour à l'accueil</a>
    </div>`;

  return page({
    titre: "Mentions légales | DRISSE",
    description: "Mentions légales du site DRISSE.",
    contenu,
    avecMarches,
    accueil: false,
  });
}
