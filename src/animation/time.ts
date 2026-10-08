/** Convert a millisecond timestamp to the nearest deterministic Remotion frame. */
export const msToFrames = (milliseconds: number, fps: number): number =>
  Math.round((milliseconds * fps) / 1000);

/** Convert the render frame into the original 30 fps motion-authoring clock. */
export const frameAtMotionFps = (frame: number, outputFps: number): number =>
  (frame * 30) / outputFps;

export const secondsToMs = (seconds: number): number => Math.round(seconds * 1000);
