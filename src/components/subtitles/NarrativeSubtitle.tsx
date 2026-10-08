import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { NARRATIVE_SUBTITLES } from "../../data/narrative-subtitles";
import { SCENES } from "../../data/scenes";
import { COLORS, TYPE } from "../../styles/tokens";

const FADE_MS = 180;

const NarrativeSubtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeline = useMemo(
    () =>
      NARRATIVE_SUBTITLES.map((cue) => {
        const scene = SCENES.find((candidate) => candidate.id === cue.sceneId);
        if (!scene) throw new Error(`Narrative subtitle refers to missing scene ${cue.sceneId}`);
        return {
          startMs: scene.startMs + cue.startMs,
          endMs: scene.startMs + cue.endMs,
          text: cue.text,
        };
      }),
    [],
  );
  const currentMs = (frame / fps) * 1000;
  const activeIndex = timeline.findIndex((cue) => currentMs >= cue.startMs && currentMs < cue.endMs);
  const active = activeIndex >= 0 ? timeline[activeIndex] : undefined;
  const last = timeline[timeline.length - 1];
  const endingCue =
    !active && last && currentMs >= last.endMs && currentMs < last.endMs + FADE_MS ? last : undefined;

  if (!active && !endingCue) return null;

  const progress = active
    ? interpolate(currentMs, [active.startMs, active.startMs + FADE_MS], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const endingOpacity = endingCue
    ? interpolate(currentMs, [endingCue.endMs, endingCue.endMs + FADE_MS], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const previous = activeIndex > 0 ? timeline[activeIndex - 1] : undefined;
  const crossfade = active && previous && currentMs < active.startMs + FADE_MS ? 1 - progress : 0;
  const gradientOpacity = Math.max(progress, crossfade, endingOpacity);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 1,
          left: 0,
          right: 0,
          bottom: 0,
          height: 205,
          pointerEvents: "none",
          opacity: gradientOpacity,
          background: `linear-gradient(180deg, transparent 0%, rgba(13,12,9,0.28) 27%, rgba(13,12,9,0.88) 72%, ${COLORS.background} 100%)`,
        }}
      />
      {previous && crossfade > 0 ? <div style={subtitleStyle(crossfade, -6 * progress)}>{previous.text}</div> : null}
      {active ? <div style={subtitleStyle(progress, 8 * (1 - progress))}>{active.text}</div> : null}
      {endingCue ? <div style={subtitleStyle(endingOpacity, 0)}>{endingCue.text}</div> : null}
    </AbsoluteFill>
  );
};

const subtitleStyle = (opacity: number, translateY: number): React.CSSProperties => ({
  position: "absolute",
  zIndex: 4,
  left: 128,
  right: 128,
  bottom: 88,
  minHeight: 82,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: COLORS.ivory,
  fontFamily: TYPE.sans,
  fontSize: 38,
  fontWeight: 500,
  lineHeight: 1.42,
  letterSpacing: 0.3,
  textAlign: "center",
  textShadow: "0 2px 12px rgba(13,12,9,0.98)",
  opacity,
  transform: `translateY(${translateY}px)`,
  pointerEvents: "none",
});

export default NarrativeSubtitle;
