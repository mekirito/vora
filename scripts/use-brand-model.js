const fs = require("fs");
const path = "src/data/profiles.ts";
let s = fs.readFileSync(path, "utf8");

if (!s.includes("BRAND_MODEL_IMAGES")) {
  s = s.replace(
    'import type { Profile } from "@/types";\n\nexport const profiles',
    `import type { Profile } from "@/types";

/** Foto oficial da marca — usada em todos os perfis do protótipo */
const BRAND_MODEL_IMAGES = [
  "/profiles/brand-model.png",
  "/profiles/brand-model.png",
  "/profiles/brand-model.png",
];

export const profiles`,
  );
}

s = s.replace(/images:\s*\[[\s\S]*?\],/g, "images: BRAND_MODEL_IMAGES,");
fs.writeFileSync(path, s);
console.log("ok", (s.match(/images: BRAND_MODEL_IMAGES/g) || []).length);
