import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { SceneDefinition, VisualLayout } from "../data/scenes";
import { VisualStage } from "./VisualStage";
import { COLORS, TYPE } from "../styles/tokens";
import { frameAtMotionFps } from "../animation/time";

type Props = { scene: SceneDefinition };

type TextPlacement = {
  top: number;
  left: number;
  width: number;
  align?: "left" | "center" | "right";
  fontSize: number;
  noCopy?: boolean;
};

const placement: Record<VisualLayout, TextPlacement> = {
  clockCloseup: { top: 286, left: 148, width: 700, fontSize: 65 },
  diagonalDialogue: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  pathTurn: { top: 140, left: 270, width: 1380, align: "center", fontSize: 70 },
  quietType: { top: 365, left: 350, width: 1220, align: "center", fontSize: 100 },
  splitVerdict: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  evidenceRuler: { top: 132, left: 150, width: 1480, fontSize: 47 },
  equationStage: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  definitionReveal: { top: 120, left: 130, width: 760, fontSize: 60 },
  questionFork: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  contextResponse: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  preferenceBalance: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  feedbackSequence: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  causalBranches: { top: 96, left: 340, width: 1240, align: "center", fontSize: 43 },
  yearMonument: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  archiveSheet: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  factorConfluence: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  rollbackTimeline: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  mirrorRoom: { top: 112, left: 350, width: 1220, align: "center", fontSize: 42 },
  studyField: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  judgmentGauge: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  echoChamber: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  promptCloseup: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  challengeNotes: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  stanceSwap: { top: 132, left: 340, width: 1240, align: "center", fontSize: 38 },
  cautionCard: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  motifReturn: { top: 70, left: 0, width: 0, fontSize: 0, noCopy: true },
  dilemmaStage: { top: 402, left: 250, width: 1420, align: "center", fontSize: 56 },
  finalQuestion: { top: 410, left: 250, width: 1420, align: "center", fontSize: 74 },
};

const Scene: React.FC<Props> = ({ scene }) => {
  const outputFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const motionFrame =
    frameAtMotionFps(outputFrame, fps) * (scene.motionReferenceMs / scene.durationMs);
  const intro = 30 * 0.55;
  const text = placement[scene.layout];
  const lines = scene.copy.split("\n");
  const copyReveal = interpolate(motionFrame, [0, intro], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.72, 0.24, 1),
  });
  const showCopy = !text.noCopy && scene.copy.trim().length > 0;

  return (
    <AbsoluteFill
      style={{
        color: COLORS.ivory,
        backgroundColor: COLORS.background,
        backgroundImage:
          "radial-gradient(ellipse at 50% 48%, rgba(197,165,116,0.045), transparent 48%), repeating-linear-gradient(0deg, rgba(232,224,209,0.012) 0px, rgba(232,224,209,0.012) 1px, transparent 1px, transparent 6px)",
        fontFamily: TYPE.serif,
        overflow: "hidden",
      }}
    >
      <VisualStage scene={scene} frame={motionFrame} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          boxShadow: "inset 0 0 180px rgba(0,0,0,0.26)",
        }}
      />

      {showCopy ? (
        <div
          style={{
            position: "absolute",
            top: text.top,
            left: text.left,
            width: text.width,
            zIndex: 2,
            textAlign: text.align ?? "left",
            fontSize: text.fontSize,
            lineHeight: 1.3,
            letterSpacing: scene.layout === "finalQuestion" ? 2 : 0,
            fontFamily: scene.id === "S28" ? TYPE.calligraphy : TYPE.serif,
            fontWeight: 400,
            color: COLORS.ivory,
            opacity: copyReveal,
            transform: `translateY(${interpolate(copyReveal, [0, 1], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            clipPath: `inset(0 ${100 - copyReveal * 100}% 0 0)`,
            textShadow: "0 2px 18px rgba(13,12,9,0.72)",
          }}
        >
          {lines.map((line, index) => (
            <div
              key={`${scene.id}-${index}`}
              style={{
                opacity: interpolate(motionFrame, [index * 7, index * 7 + 14], [0.2, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.2, 0.72, 0.24, 1),
                }),
              }}
            >
              {line}
            </div>
          ))}
        </div>
      ) : null}

    </AbsoluteFill>
  );
};

export default Scene;
