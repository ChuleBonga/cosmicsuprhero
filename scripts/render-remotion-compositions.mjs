import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

const compositions = [
  "observatory-intro",
  "chamber-celestial-multiverse",
  "chamber-stargazing-vol-3",
  "chamber-just-sounds-really",
  "chamber-enter-aquarius",
  "chamber-soil-and-sun",
  "chamber-songs-i-made-at-night",
  "chamber-bad-guys-finish-last",
];

mkdirSync("renders", { recursive: true });

for (const composition of compositions) {
  const output = `renders/${composition}.mp4`;
  console.log(`Rendering ${composition} -> ${output}`);
  const result = spawnSync(
    "npx",
    ["remotion", "render", "src/remotion/index.ts", composition, output],
    {
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
