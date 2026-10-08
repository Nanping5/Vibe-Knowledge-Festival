import { Composition } from "remotion";
import { MainFilm, MainFilmClean } from "./compositions/MainFilm";
import { FRAME } from "./styles/tokens";
import { TOTAL_FRAMES } from "./data/timeline";

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="MainFilm"
        component={MainFilm}
        durationInFrames={TOTAL_FRAMES}
        fps={FRAME.fps}
        width={FRAME.width}
        height={FRAME.height}
      />
      <Composition
        id="MainFilmClean"
        component={MainFilmClean}
        durationInFrames={TOTAL_FRAMES}
        fps={FRAME.fps}
        width={FRAME.width}
        height={FRAME.height}
      />
    </>
  );
};
