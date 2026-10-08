import React, { useEffect, useState } from "react";
import {
  Audio,
  Sequence,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { SCENES } from "../data/scenes";
import { BACKGROUND_MUSIC, BACKGROUND_MUSIC_VOLUME } from "../data/audio";
import Scene from "../scenes/Scene";
import { FRAME } from "../styles/tokens";

const FontReadiness: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading bundled film fonts"));
  useEffect(() => {
    const fontRequests = [
      ['400 32px "Noto Serif SC"', "谄媚性答案"],
      ['400 24px "Noto Sans SC"', "研究范围说明"],
      ['400 48px "Cormorant Garamond"', "2025"],
      ['400 24px "EB Garamond"', "ARCHIVE RECORD"],
      ['400 40px "Ma Shan Zheng"', "时针仍走"],
    ] as const;
    Promise.all(fontRequests.map(([font, sample]) => document.fonts.load(font, sample)))
      .then((faces) => {
        if (faces.some((loaded) => loaded.length === 0)) {
          throw new Error("One or more bundled film fonts did not load.");
        }
        continueRender(handle);
      })
      .catch((error: unknown) => cancelRender(error));
  }, [handle]);
  return null;
};

const SceneTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <FontReadiness />
      {SCENES.map((scene) => (
        <Sequence
          key={scene.id}
          name={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames}
          premountFor={fps}
        >
          <Scene scene={scene} />
        </Sequence>
      ))}
    </>
  );
};

const MusicTrack: React.FC = () => {
  const { fps } = useVideoConfig();
  const musicFadeStart = FRAME.duration - fps * 2;
  if (!BACKGROUND_MUSIC) return null;
  return (
    <Audio
      src={staticFile(BACKGROUND_MUSIC)}
      volume={(audioFrame) =>
        BACKGROUND_MUSIC_VOLUME *
        interpolate(audioFrame, [musicFadeStart, FRAME.duration], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

export const MainFilm: React.FC = () => (
  <>
    <SceneTrack />
    <MusicTrack />
  </>
);

export const MainFilmClean: React.FC = () => <SceneTrack />;
