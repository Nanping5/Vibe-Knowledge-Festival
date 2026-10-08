import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { SCENES } from "../src/data/scenes";
import { NARRATIVE_SUBTITLES } from "../src/data/narrative-subtitles";
import { BACKGROUND_MUSIC } from "../src/data/audio";
import { msToFrames } from "../src/animation/time";
import { FRAME, TYPE } from "../src/styles/tokens";
import { TOTAL_DURATION_MS, TOTAL_FRAMES } from "../src/data/timeline";

assert.equal(FRAME.width, 1920);
assert.equal(FRAME.height, 1080);
assert.equal(FRAME.fps, 60);
assert.equal(FRAME.duration, 7200);
assert.equal(FRAME.duration / FRAME.fps, 120);
assert.equal(msToFrames(120_000, FRAME.fps), FRAME.duration);
assert.equal(msToFrames(500, FRAME.fps), 30);
assert.equal(SCENES.length, 28);

let expectedStartMs = 0;
let expectedStartFrame = 0;
for (const scene of SCENES) {
  assert.equal(scene.startMs, expectedStartMs, `${scene.id} must be contiguous in milliseconds`);
  assert.equal(scene.startFrame, expectedStartFrame, `${scene.id} must be contiguous in frames`);
  assert.ok(scene.durationMs > 0, `${scene.id} must have a positive duration`);
  assert.equal(scene.startFrame, msToFrames(scene.startMs, FRAME.fps));
  assert.equal(scene.durationFrames, msToFrames(scene.durationMs, FRAME.fps));
  expectedStartMs += scene.durationMs;
  expectedStartFrame += scene.durationFrames;
}
assert.equal(expectedStartMs, 120_000);
assert.equal(expectedStartFrame, 7_200);
assert.equal(TOTAL_DURATION_MS, 120_000);
assert.equal(TOTAL_FRAMES, FRAME.duration);
assert.ok(NARRATIVE_SUBTITLES.length >= SCENES.length, "narrative subtitle track must carry the full story");
let previousSubtitleEndMs = 0;
for (const cue of NARRATIVE_SUBTITLES) {
  const scene = SCENES.find((candidate) => candidate.id === cue.sceneId);
  assert.ok(scene, `subtitle cue refers to missing scene ${cue.sceneId}`);
  assert.ok(cue.startMs >= 0 && cue.endMs <= scene.durationMs, `${cue.sceneId} subtitle must fit its shot`);
  assert.ok(cue.endMs > cue.startMs, `${cue.sceneId} subtitle must have positive duration`);
  assert.ok(cue.text.trim(), `${cue.sceneId} subtitle must contain readable copy`);
  assert.ok(Array.from(cue.text).length <= 40, `${cue.sceneId} subtitle should fit on one line at the designed size`);
  const globalStartMs = scene.startMs + cue.startMs;
  const globalEndMs = scene.startMs + cue.endMs;
  assert.equal(globalStartMs, previousSubtitleEndMs, "narrative subtitles must not overlap or leave unintended gaps");
  previousSubtitleEndMs = globalEndMs;
}
assert.equal(previousSubtitleEndMs, 118_000, "the final two seconds must remain visually still and caption-free");
let previousBeatFrame = 0;
const visualBeats = SCENES.filter((scene) => scene.visualBeat);
for (const beat of visualBeats) {
  assert.ok(beat.startFrame - previousBeatFrame <= 20 * FRAME.fps, `visual beat gap before ${beat.id} exceeds 20 seconds`);
  previousBeatFrame = beat.startFrame;
}
assert.ok(FRAME.duration - previousBeatFrame <= 20 * FRAME.fps, "final visual beat is over 20 seconds from the end");

const byId = (id: string) => {
  const scene = SCENES.find((candidate) => candidate.id === id);
  assert.ok(scene, `missing scene ${id}`);
  return scene;
};
assert.equal(SCENES.filter((scene) => scene.visualBeat).length > 0, true);
assert.ok(byId("S12").durationMs >= 9_000, "feedback mechanism must have room for its five-step sequence");
assert.equal(byId("S26").durationMs, 2_000);
assert.equal(byId("S27").durationMs, 4_000);
assert.equal(byId("S28").durationMs, 4_000);
assert.match(byId("S19").note ?? "", /人际建议任务/);
assert.match(byId("S19").note ?? "", /11 个模型/);
assert.match(byId("S19").note ?? "", /普遍比例/);
assert.match(byId("S20").note ?? "", /方向示意/);
assert.match(byId("S21").note ?? "", /单次互动/);
assert.match(byId("S21").note ?? "", /N=2,405/);
assert.ok(
  [...SCENES.flatMap((scene) => [scene.label, scene.copy, scene.note, scene.caption]), ...NARRATIVE_SUBTITLES.map((cue) => cue.text)]
    .every((copy) => !/虚拟|虚构/.test(copy ?? "")),
  "screen copy must not display virtual-example labels",
);

assert.match(TYPE.serif, /Noto Serif SC/);
assert.match(TYPE.sans, /Noto Sans SC/);
assert.match(TYPE.latin, /Cormorant Garamond/);
assert.match(TYPE.englishNote, /EB Garamond/);
assert.match(TYPE.calligraphy, /Ma Shan Zheng/);
for (const fontFile of [
  "public/fonts/NotoSerifSC-Variable.ttf",
  "public/fonts/NotoSansSC-Variable.ttf",
  "public/fonts/CormorantGaramond-VF.ttf",
  "public/fonts/EBGaramond-VF.ttf",
  "public/fonts/MaShanZheng-Regular.ttf",
]) {
  assert.ok(existsSync(resolve(process.cwd(), fontFile)), `missing font asset ${fontFile}`);
}

assert.equal(BACKGROUND_MUSIC, "audio/BGM.mp3");
const backgroundMusicPath = resolve(process.cwd(), "public", BACKGROUND_MUSIC);
if (existsSync(backgroundMusicPath)) {
  console.log("Optional local BGM found.");
} else {
  console.log("Optional local BGM is not bundled; add an authorized track before rendering MainFilm.");
}

console.log("Timeline valid: 28 scenes, 7,200 frames, 120 seconds at 60 fps; font assets are present.");
