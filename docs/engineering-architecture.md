# Remotion 工程架构

## 合成规格

- MainFilm：1920×1080、60 FPS、120 秒、7,200 帧，28 个连续镜头，含主叙事字幕和 BGM。
- MainFilmClean：同画面与时间轴，不含 BGM 与主叙事字幕；保留构图内的动态文字。
- 全片没有旁白和独立音效；主叙事字幕与动画文字共同承担讲述。

## 时间轴

`src/data/scenes.ts` 的镜头数据以 `durationMs` 记录；场景数组顺序决定 `startMs`。唯一转换函数位于 `src/animation/time.ts`，在 Remotion Sequence 边界将毫秒换算为 60 FPS 帧数。`src/data/timeline.ts` 汇总总毫秒和总帧数，Composition 使用派生后的 `TOTAL_FRAMES`。

场景内的 SVG 动作沿用原有 30 FPS 编排坐标，以 `motionReferenceMs / durationMs` 将旧动作节奏映射到新镜头时间；导出仍以 60 FPS 采样。因此运动没有依赖实际墙钟，也没有将 Composition FPS 与动画推进速度混用。

## 源码职责

- `src/Composition.tsx`：注册 MainFilm 与 MainFilmClean。
- `src/compositions/MainFilm.tsx`：组织 28 个 Sequence、等待本地字体加载、配置字幕显示并添加唯一 BGM 轨。
- `src/data/scenes.ts`：镜头、毫秒时长、画面文字、布局类型与动画参考时长。
- `src/data/narrative-subtitles.ts`、`src/components/subtitles/NarrativeSubtitle.tsx`：主叙事字幕文案、毫秒时码与确定性字幕运动。
- `src/scenes/Scene.tsx`：统一场景背景、主要屏幕文字和排版动画。
- `src/scenes/VisualStage.tsx`：差异化全画幅 SVG 镜头、相机运动和 S12→S13、S14→S15 的图形接力。
- `src/styles/tokens.ts`、`src/styles/global.css`：画幅、颜色、字体角色与字体加载。
- `scripts/validate-timeline.ts`：规格、连续性、视觉节拍、科学限制、字体资源和 BGM 资源的检查。
- `scripts/export-subtitles.ts`：将主叙事字幕时码导出为 `output/subtitles.srt`。
- `scripts/extract-frames.ts`：按每镜头入场、主体、出场导出关键帧。

## 字体

项目从 Google Fonts 获取并随工程分发五套字体：Noto Serif SC、Noto Sans SC、Cormorant Garamond、EB Garamond 与 Ma Shan Zheng。所有字体均有对应 OFL 文件，`FontReadiness` 在渲染时等待字体就绪后再出帧。具体使用角色见 `docs/05-visual-style.md`。

## 音频

`public/audio/BGM.mp3` 是用户提供的背景音乐副本。`MainFilm` 播放该曲，不循环，组合时截取到 120 秒并在末尾 2 秒淡出。`MainFilmClean` 不加载音频。无声输出用于画面审阅，带音乐版才是本项目的最终音画文件。

## 确定性与性能

所有画面变化由 `useCurrentFrame()`、`interpolate()` 和 SVG 路径确定；无 setTimeout、setInterval、CSS 自主循环或随机抖动。场景复用路径与字体资源，纸纹为低对比静态背景，不引入动态噪声滤镜。

## 常用命令

- `npm run dev`：启动 Remotion Studio。
- `npm test`：验证时间轴和交付资源。
- `npm run typecheck`：TypeScript strict 检查。
- `npm run lint`：ESLint。
- `npm run captions`：生成 `output/subtitles.srt`。
- `npm run qc:frames`：生成 84 张镜头关键帧。
- `npm run preview`：渲染 960×540 带音乐预览。
- `npm run render:clean`：渲染 1080p 静音画面版。
- `npm run render`：渲染 1080p 带音乐 MP4。
