import { existsSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = process.cwd();
const filesToScan = [
  "index.html",
  "public/site.webmanifest",
  "public/assets/asset-manifest.json",
  "src/data/assetCredits.ts",
  "src/data/observatoryIntro.ts",
  "src/data/releases.ts",
];

const ignoredPrefixes = [
  "/assets/observatory/local-test/",
];

const ignoredMissing = new Set([
  "/assets/observatory/observatory-intro.webm",
  "/assets/observatory/observatory-intro.mp4",
  "/assets/observatory/observatory-intro-poster.webp",
]);

function stripLineComments(source) {
  return source
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("//"))
    .join("\n");
}

const paths = new Set();

for (const file of filesToScan) {
  const absoluteFile = resolve(root, file);
  const source = stripLineComments(readFileSync(absoluteFile, "utf8"));
  const matches = source.matchAll(/["'`](\/(?:assets|favicon|apple-touch-icon|app-icon|icon-|og-image|site\.webmanifest)[^"'`\s)]*)["'`]/g);

  for (const match of matches) {
    const publicPath = match[1];
    if (ignoredPrefixes.some((prefix) => publicPath.startsWith(prefix))) continue;
    paths.add(publicPath);
  }
}

const missing = [];

for (const publicPath of [...paths].sort()) {
  if (ignoredMissing.has(publicPath)) continue;

  const localPath = resolve(root, "public", publicPath.replace(/^\//, ""));
  if (!existsSync(localPath)) {
    missing.push({ publicPath, localPath: relative(root, localPath) });
  }
}

if (missing.length > 0) {
  console.error("Missing public assets:");
  for (const item of missing) {
    console.error(`- ${item.publicPath} -> ${item.localPath}`);
  }
  process.exit(1);
}

console.log(`Validated ${paths.size} public asset references.`);
