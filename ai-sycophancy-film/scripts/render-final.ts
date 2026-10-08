import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { BACKGROUND_MUSIC } from "../src/data/audio";

if (!BACKGROUND_MUSIC) {
  console.error(
    "Background music is not configured. Add a licensed track under public/audio/, set BACKGROUND_MUSIC in src/data/audio.ts, then run npm run render.",
  );
  process.exit(2);
}

const musicPath = resolve(process.cwd(), "public", BACKGROUND_MUSIC);
if (!existsSync(musicPath)) {
  console.error("Configured background music file was not found: " + musicPath);
  process.exit(2);
}

mkdirSync(resolve(process.cwd(), "output"), { recursive: true });
const result = spawnSync(
  "npx",
  [
    "remotion",
    "render",
    "src/index.ts",
    "MainFilm",
    "output/final.mp4",
    "--codec",
    "h264",
    "--crf",
    "18",
  ],
  { stdio: "inherit" },
);

process.exit(result.status ?? 1);

