// Copie le site (dossier src) vers dist, le dossier publié sur Cloudflare Pages.
import { cpSync, rmSync } from "node:fs";
import { basename } from "node:path";

rmSync("dist", { recursive: true, force: true });
cpSync("src", "dist", {
  recursive: true,
  filter: (chemin) => !basename(chemin).startsWith("."),
});
console.log("Site prêt dans dist/");
