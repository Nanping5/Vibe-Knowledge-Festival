# Review Visual Fixes Implementation Plan

> **For agentic workers:** Execute this plan inline, task by task. Keep the existing 28-scene composition and verify every visual claim in rendered frames.

**Goal:** Address the supplied review findings without changing the 1920×1080, 30 FPS, 150-second, 4,500-frame, 28-scene specification or adding audio.

**Architecture:** Keep the existing Remotion/React/SVG scene architecture and visual identity. Make the science-boundary information explicit in scene data and artwork, pace the training sequence by reallocating 90 frames from the three repetitive closing scenes, and make subtitle cues derive from each scene with a short multi-cue exception for the dense event timeline.

**Tech Stack:** Remotion 4.0.534, React, TypeScript, SVG, FFmpeg, FFprobe.

## Global Constraints

- Keep 1920×1080, 30 FPS, 150 seconds, 4,500 frames, and 28 scenes.
- Preserve possible/conditional wording; do not invent research metrics, model internals, or reward weights.
- Do not add narration or an audio track; the available BGM remains unused.
- Keep the black/gold archival documentary visual identity and typography.

---

### Task 1: Reframe the current-response and training timeline

**Files:** `src/data/scenes.ts`, `src/scenes/VisualStage.tsx`, `src/scenes/Scene.tsx`

- [x] Distinguish the current answer grounded in conversation context from later training preference comparisons.
- [x] Extend S12 by 90 frames and pace the five-stage process across the extended duration.
- [x] Reallocate those 90 frames from S26–S28 while keeping scene boundaries continuous and the final frame at 4,500.

### Task 2: Correct research graphics and opening/closing beats

**Files:** `src/data/scenes.ts`, `src/scenes/VisualStage.tsx`, `src/scenes/Scene.tsx`

- [x] Give S19 a readable interpersonal-advice research scope and source alongside the 49% comparison.
- [x] Replace S20's calibrated-looking gauge with an unscaled directional diagram.
- [x] Replace S21's repeated echo text with a single-response, two-outcome branch and readable experiment limits.
- [x] Add a restrained, deterministic clock impact cue at S01.
- [x] Make S26 return to the clock, S27 show the sole full closing question, and S28 retain a unique final sentence with a two-second still hold.

### Task 3: Align external screen-copy subtitles and production documents

**Files:** `src/data/scenes.ts`, `scripts/export-subtitles.ts`, `output/subtitles.srt`, `docs/04-storyboard.md`, `docs/06-production-report.md`, `docs/progress.md`

- [x] Remove the repeated event introduction in S15 and correct S26–S28 copy alignment.
- [x] Split S17's event dates into consecutive, readable timed cues with no gaps or overlaps.
- [x] Label SRT as on-screen-copy support, not speech-recognition captions.

### Task 4: Render and inspect

**Files:** `output/qc-frames/`, `output/contact-sheet*.png`, `output/preview.mp4`, `output/final-clean.mp4`

- [x] Run timeline/content checks, typecheck, lint, and the current project test command.
- [x] Re-render the low-resolution preview, 1080p silent picture, and keyframes for all 28 scenes.
- [x] Inspect critical frames and contact sheets; verify duration/frame count/codecs and absence of an audio stream with FFprobe.
