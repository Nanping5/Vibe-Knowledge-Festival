import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { SCENES } from "../src/data/scenes";
import { NARRATIVE_SUBTITLES } from "../src/data/narrative-subtitles";

const timestamp = (milliseconds: number) => {
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000);
  const seconds = Math.floor((milliseconds % 60_000) / 1000);
  const remainder = milliseconds % 1000;
  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    "," +
    String(remainder).padStart(3, "0")
  );
};

const cues = NARRATIVE_SUBTITLES.map((cue) => {
  const scene = SCENES.find((candidate) => candidate.id === cue.sceneId);
  assert.ok(scene, "Narrative subtitle refers to missing scene: " + cue.sceneId);
  return {
    startMs: scene.startMs + cue.startMs,
    endMs: scene.startMs + cue.endMs,
    text: cue.text,
  };
});

let previousEndMs = 0;
for (const cue of cues) {
  assert.ok(cue.startMs >= previousEndMs, "SRT cues must be ordered and non-overlapping");
  assert.ok(cue.endMs > cue.startMs, "SRT cues must have positive duration");
  assert.ok(cue.text.trim(), "SRT cues must contain text");
  previousEndMs = cue.endMs;
}

const contents = cues.map((cue, index) => {
  return [
    String(index + 1),
    timestamp(cue.startMs) + " --> " + timestamp(cue.endMs),
    cue.text,
  ].join("\n");
}).join("\n\n");

const output = resolve(process.cwd(), "output/subtitles.srt");
mkdirSync(resolve(process.cwd(), "output"), { recursive: true });
writeFileSync(output, contents + "\n", "utf8");
console.log("Wrote timed main-story subtitles (no voiceover): " + output);
