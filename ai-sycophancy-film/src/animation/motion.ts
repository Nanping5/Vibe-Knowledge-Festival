import { Easing, interpolate } from "remotion";

export const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const smooth = Easing.bezier(0.22, 0.72, 0.25, 1);

export const reveal = (frame: number, start = 0, duration = 24) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: smooth,
  });

export const out = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [1, 0], {
    ...clamp,
    easing: smooth,
  });

export const drift = (frame: number, duration: number, amount = 1) =>
  interpolate(frame, [0, duration], [0, amount], clamp);

