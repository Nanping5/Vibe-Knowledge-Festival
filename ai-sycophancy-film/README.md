# 《为什么 AI 总是顺着你说话？》

一部 120 秒简体中文 MG 科普微纪录片，使用 React、TypeScript、SVG 与 Remotion 制作。影片保持黑金复古学术纪录片风格，以动态排版、科学图形和屏幕文字独立讲述，无旁白。

## 规格

- 1920×1080，16:9，60 FPS，7,200 帧，28 个镜头。
- `MainFilm` 在本地提供背景音乐文件时包含该音乐和主叙事字幕；`MainFilmClean` 为无音乐、无主字幕的画面版。
- 全片不配旁白；主叙事字幕与动画内的关键词和图形文字协同讲述。
- `output/subtitles.srt` 对应主叙事字幕轨，是人工编写的字幕，不是语音识别稿。

## 环境与安装

- Node.js 24+
- npm
- FFmpeg / FFprobe
- Remotion 4.0.534

```bash
npm install
npm run dev
```

Remotion Studio 中可选 `MainFilm` 预览带音乐版，或选 `MainFilmClean` 预览静音画面版。

## 检查与渲染

```bash
npm test
npm run typecheck
npm run lint
npm run captions
npm run qc:frames
npm run preview
npm run render:clean
npm run render
```

- `npm test`：校验 28 镜头的毫秒与帧时间轴连续、总长 120 秒，并检查字体资源。
- `npm run preview`：生成半分辨率、带 BGM 的 `output/preview.mp4`。
- `npm run render:clean`：生成 1080p 静音画面 `output/final-clean.mp4`；保留动画内的文字，不含主叙事字幕轨。
- `npm run render`：生成包含主叙事字幕和 BGM 的 H.264 MP4 `output/final.mp4`。
- `npm run captions`：从 `src/data/narrative-subtitles.ts` 和镜头毫秒时间轴导出 `output/subtitles.srt`。
- `npm run qc:frames`：为每个镜头导出 entry / mid / exit 关键帧到 `output/qc-frames/`。

## 背景音乐

背景音乐不随公开仓库分发。若你拥有相应使用及分发授权，可将音频放入 `public/audio/BGM.mp3`；主成片会使用该音乐，不循环，音量按 `src/data/audio.ts` 设置，并在末尾 2 秒渐弱。若使用其他文件，请更新 `BACKGROUND_MUSIC`。没有本地音乐文件时，时间轴检查与 `MainFilmClean` 无声预览仍可使用；带音乐预览和 `npm run render` 需要先补充授权音频。

渲染生成的 MP4、关键帧和联系表保存在 `output/`，不纳入源码仓库。

项目不制作旁白或独立音效。

## 字体

| 用途 | 字体 |
|---|---|
| 中文标题、哲学性文字 | Noto Serif SC |
| 中文字幕、图表注释 | Noto Sans SC |
| 英文标题、年份、章节数字 | Cormorant Garamond |
| 英文正文、历史档案 | EB Garamond |
| 少量文学化片尾文字 | Ma Shan Zheng |

Google Fonts 官方字体文件与相应 OFL 许可证位于 `public/fonts/` 和 `assets/fonts/licenses/`。

## 修改内容

- 镜头时长与屏幕文案：`src/data/scenes.ts`，以毫秒记录。
- 主叙事字幕文案及镜头内时码：`src/data/narrative-subtitles.ts`。
- 时间转换：`src/animation/time.ts`；Remotion Sequence 帧数由该时间轴派生。
- 镜头图形与构图：`src/scenes/VisualStage.tsx`。
- 文字排版与场景容器：`src/scenes/Scene.tsx`。
- 色彩和字体 token：`src/styles/tokens.ts`；字体加载在 `src/styles/global.css`。
- 音乐：`src/data/audio.ts`；主输出与静音输出组合在 `src/compositions/MainFilm.tsx`。
- SRT：更新主叙事字幕数据后运行 `npm run captions`。

## 项目资料

- `docs/01-research.md`、`docs/02-fact-check.md`：研究与核验来源。
- `docs/03-script.md`、`docs/04-storyboard.md`：本次 120 秒脚本与逐镜头分镜。
- `docs/05-visual-style.md`：视觉规范。
- `docs/progress.md`、`docs/06-production-report.md`：进度和实际制作/质检结果。
- `docs/07-publishing-copy.md`：发布标题与简介文案。

## 已知边界

- 没有旁白；`final.mp4` 通过主叙事字幕与画面文字完成讲述。
- 本地生成的 `final-clean.mp4` 是无音乐、无主字幕轨的画面版；`final.mp4` 包含主字幕和本地配置的背景音乐。公开仓库不包含渲染成片。
- 视觉参考图未出现在工作区，本项目沿用用户提供的黑金学术档案文字规范。
