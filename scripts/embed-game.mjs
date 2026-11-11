import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const from = "game-walk/dist";
const into = "dist/play";
if (!existsSync("dist/index.html") || !existsSync(join(from, "index.html"))) {
  throw new Error("Site and game must both build before embedding.");
}
mkdirSync(into, { recursive: true });
for (const entry of readdirSync(from, { withFileTypes: true })) {
  if (entry.name === "audio") continue; // Public cut-point approval remains pending.
  cpSync(join(from, entry.name), join(into, entry.name), { recursive: true, force: true });
}
// The production website omits all uncleared game audio. Signal this to the first-person
// runtime so it does not promise playback or request a nonexistent media file.
const firstPersonPath = join(into, "experiments", "first-person", "index.html");
if (!existsSync(firstPersonPath)) throw new Error("First-person 3D route missing from production build.");
const firstPersonHtml = readFileSync(firstPersonPath, "utf8");
if (!firstPersonHtml.includes("<body>")) throw new Error("Cannot mark first-person production audio restriction.");
writeFileSync(firstPersonPath, firstPersonHtml.replace("<body>", '<body data-public-audio-restricted="true">'));
const html = readFileSync(join(into, "index.html"), "utf8");
if (!html.includes("/play/assets/")) throw new Error("Nested game assets use incorrect public base.");
if (!existsSync(join(into, "art", "protagonist_atlas.png"))) throw new Error("Protagonist missing.");
if (!existsSync(join(into, "art", "near_tile.png"))) throw new Error("Parallax missing.");
if (existsSync(join(into, "audio"))) throw new Error("Unapproved preview audio must not be published.");
console.log(JSON.stringify({
  page: "/play/",
  files: readdirSync(into),
  gameJs: readdirSync(join(into, "assets")).filter(x=>x.endsWith(".js")).map(x=>({name:x,bytes:statSync(join(into,"assets",x)).size})),
  previewAudio: "excluded pending explicit cut-point approval",
  rootPagePreserved: true
}, null, 2));
