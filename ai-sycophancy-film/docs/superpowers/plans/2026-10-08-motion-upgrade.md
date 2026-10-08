# Motion-led final upgrade implementation plan

## Goal

Implement the approved 120-second, 60 fps, 28-scene silent-text documentary upgrade, preserving the existing visual identity while improving continuous motion, adding the provided BGM, and applying the requested four-font system.

## Architecture

- Scene records own `startMs` and `durationMs`; one helper derives start and duration frames.
- `FRAME.duration` derives from the contiguous scene timeline.
- VisualStage animations remain deterministic and use a consistent time conversion at 60 fps; shared motion components handle path tracing and selected scene handoffs.
- Subtitle cue ranges use milliseconds and remain a screen-copy auxiliary file.
- BGM is a single local asset, trimmed by the composition and faded during its final two seconds.

## Tech Stack

React 19, TypeScript strict, Remotion 4, SVG, CSS, Node.js, FFmpeg, FFprobe.

## Global Constraints

- Keep exactly 28 scenes, seven chapters, 1920×1080, 60 fps, 120 seconds, and 7,200 frames.
- No narration, generated sound effects, added metrics, invented model internals, or invented reward weights.
- Keep scientific qualifications and readable source/range text.
- Do not display “虚拟 / 虚构” prompt labels; dialogue copy remains unattributed to real users or products.
- Preserve black-gold archival typography and omit page headers/footers.
- Use deterministic Remotion frame animation only.

## Tasks

1. Add tests for the target composition, millisecond conversion, scene continuity, no virtual-label copy, font assets, and BGM hookup; confirm RED against the current implementation.
2. Migrate tokens, scene records, composition metadata, timeline validation, and SRT generation to 120,000 ms / 60 fps / 7,200 frames while retaining all 28 scene IDs.
3. Rework on-screen copy and the 28-scene timings for silent reading; keep the 2025 timeline and scientific boundaries legible.
4. Convert shared scene animation timing to deterministic 60 fps, then add staged choreography and selected evidence-path handoffs without repeated HUD layouts.
5. Download and package the exact requested fonts with licenses, update design tokens and font loading, and verify rendered glyphs.
6. Copy the supplied BGM into `public/audio/`, add a final fade, and keep the clean render free of audio.
7. Update storyboard, script, style, README, progress, and production report to reflect implemented facts and limitations.
8. Run tests, typecheck, lint, render preview/final outputs, extract and inspect QC frames/contact sheets, and verify MP4 streams and frame count with FFprobe.

## Validation commands

`npm test`, `npm run typecheck`, `npm run lint`, `npm run qc:frames`, `npm run preview`, `npm run render`, followed by FFprobe inspection and visual review of the generated frames and preview.
