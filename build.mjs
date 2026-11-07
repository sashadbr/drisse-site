// Fabrique le site dans dist, le dossier publié en ligne :
// copie src (style, police, images) puis crée les pages à partir du dossier contenu.
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { accueil, fiche, mentions } from "./modeles.mjs";

const lire = (chemin) => JSON.parse(readFileSync(chemin, "utf8"));

// Nom de fichier propre pour l'adresse d'une fiche : « Trousse été » → « trousse-ete ».
const slug = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
cpSync("src", "dist", {
  recursive: true,
  filter: (chemin) => !basename(chemin).startsWith("."),
});

const site = lire("contenu/site.json");
const infos = lire("contenu/mentions.json");

const dossier = "contenu/produits";
const reserves = new Set(["index", "mentions-legales"]);
const produits = readdirSync(dossier)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({ ...lire(join(dossier, f)), fichier: f }))
  .filter((p) => p.nom && p.en_ligne !== false)
  .map((p) => {
    let s = slug(p.fichier.replace(/\.json$/, "")) || slug(p.nom) || "produit";
    if (reserves.has(s)) s = `produit-${s}`;
    return { ...p, slug: s };
  })
  .sort((a, b) => (a.ordre ?? 999) - (b.ordre ?? 999) || a.nom.localeCompare(b.nom, "fr"));

const avecMarches = (site.marches || []).some((m) => m && (m.date || m.lieu));

writeFileSync("dist/index.html", accueil(site, produits));
writeFileSync("dist/mentions-legales.html", mentions(infos, avecMarches));
for (const p of produits) writeFileSync(`dist/${p.slug}.html`, fiche(p, avecMarches));

console.log(`Site prêt dans dist/ (${produits.length} produit${produits.length > 1 ? "s" : ""})`);
