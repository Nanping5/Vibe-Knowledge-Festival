import { SCENES } from "./scenes";

export const TOTAL_FRAMES = SCENES.reduce(
  (max, scene) => Math.max(max, scene.startFrame + scene.durationFrames),
  0,
);

export const TOTAL_DURATION_MS = SCENES.reduce(
  (max, scene) => Math.max(max, scene.startMs + scene.durationMs),
  0,
);

export const TIMELINE = SCENES.map((scene) => ({
  id: scene.id,
  chapter: scene.chapter,
  startFrame: scene.startFrame,
  durationFrames: scene.durationFrames,
  startMs: scene.startMs,
  durationMs: scene.durationMs,
}));
