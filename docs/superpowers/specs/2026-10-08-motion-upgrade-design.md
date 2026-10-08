# Motion-led final upgrade design

## Goal

Upgrade the existing silent, text-led MG documentary while preserving its black-and-gold archival identity and all 28 scenes. Deliver a 120-second, 1920×1080, 60 fps composition with deterministic Remotion animation and the user-provided BGM. The film remains understandable without narration.

## Approved creative direction

- Keep the existing story and research caveats; remove on-screen “虚拟 / 虚构” disclaimers and labels. Scripted conversational examples remain generic and are not attributed to a real user or product.
- Keep 28 scenes, seven chapters, and the five reviewed visual anchors: “赞同 ≠ 正确”, preference feedback, the 2025 GPT-4o event, the bounded human-effects study, and the final open question.
- Preserve the black, warm-gold, ivory, muted-red palette, archival rules, scientific-instrument drawings, and no-header/no-footer composition.
- Use the provided music file only. No narration, generated SFX, invented metrics, model internals, or reward weights.
- Use Source Han Serif SC for Chinese titles and philosophical copy; Cormorant Garamond for English headlines, years, and chapter numerals; EB Garamond for English annotations; Source Han Sans SC for Chinese chart labels and information.

## Motion direction

Each scene has an arrival, a knowledge-bearing action, and a readable settle. Use frame-deterministic SVG path drawing, masked typography, morphs, camera-scale changes, split/rejoin choreography, and restrained object handoffs. A thin evidence trace may connect selected scenes where its meaning carries forward. Avoid persistent HUD elements, repeated left-copy/right-illustration layouts, decorative particle systems, fake measurement scales, and unmotivated transitions.

The preference-feedback sequence must visibly separate the current response from a later training process: prompt/context → candidate answers → comparison → preference feedback → possible later tendency. Nothing should imply that a user's current like immediately changes the current answer.

## Timing and implementation

- 120,000 ms total, 60 fps, 7,200 frames, exactly 28 contiguous scenes.
- Store scene timing in milliseconds and convert only at the Remotion boundary with one shared helper.
- Keep local motion deterministic at output frames; no wall-clock timers or uncontrolled randomness.
- Generate SRT as screen-copy assistance, not speech recognition. Cue times come from the same millisecond timeline.
- Fade the user-provided music at the end; do not loop it or add other audio sources.

## Verification

Run timeline tests, typecheck, lint, and a real Remotion render. Verify video and audio streams with FFprobe, extract entry/mid/exit frames for all 28 scenes, assemble and visually inspect contact sheets, and review the full preview for motion continuity and readability.
