import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { SCENES } from "../src/data/scenes";
import { msToFrames } from "../src/animation/time";
import { FRAME } from "../src/styles/tokens";

const main = async () => {
  const root = process.cwd();
  const outputDir = resolve(root, "output/qc-frames");
  mkdirSync(outputDir, { recursive: true });

  const serveUrl = await bundle({
    entryPoint: resolve(root, "src/index.ts"),
    onProgress: (progress) => {
      if (progress === 1) console.log("Composition bundle ready.");
    },
  });
  const composition = await selectComposition({ serveUrl, id: "MainFilm" });
  const browser = await openBrowser("chrome", { logLevel: "error" });

  try {
    for (const scene of SCENES) {
      const targets = [
        { label: "entry", frame: scene.startFrame + msToFrames(scene.id === "S01" ? 330 : 450, FRAME.fps) },
        { label: "mid", frame: scene.startFrame + Math.floor(scene.durationFrames / 2) },
        { label: "exit", frame: scene.startFrame + scene.durationFrames - msToFrames(450, FRAME.fps) },
      ];

      for (const target of targets) {
        const output = resolve(outputDir, scene.id + "-" + target.label + ".png");
        console.log("Rendering " + scene.id + " " + target.label + " at frame " + target.frame);
        await renderStill({
          composition,
          serveUrl,
          output,
          frame: target.frame,
          imageFormat: "png",
          overwrite: true,
          puppeteerInstance: browser,
          logLevel: "error",
        });
      }
    }
  } finally {
    await browser.close({ silent: true });
  }

  console.log("Rendered 84 QC frames to output/qc-frames.");
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
