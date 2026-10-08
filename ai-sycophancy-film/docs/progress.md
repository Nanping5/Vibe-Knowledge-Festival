# 制作进度

## 项目状态

- 状态：最终版本已渲染并完成技术与视觉检查。
- 当前规格：1920×1080、60 FPS、120 秒、7,200 帧、28 个 Scene。
- 表达方式：MG 动画、画面内关键文字和主叙事字幕；无配音、无独立音效。
- 音频：`BGM.mp3` 为用户提供的音乐。主成片为 H.264/AAC；静音画面版不含音轨。
- 字体：Noto Serif SC、Noto Sans SC、Cormorant Garamond、EB Garamond、Ma Shan Zheng；字体与 OFL 许可证随项目保存。

## 阶段记录

| 阶段 | 状态 | 实际结果 |
| --- | --- | --- |
| 1. 研究资料 | 完成 | 研究与事实核验见 `docs/01-research.md`、`docs/02-fact-check.md`；引用 GPT-4o 官方复盘、谄媚性论文与 2026 年人际建议研究。 |
| 2. 科普文案 | 完成 | 120 秒、28 镜头；无配音，字幕负责连续讲述。S10–S13 把当前对话、训练反馈与多因素影响讲成连续因果链；S23–S25 以反证和核验完成观众行动路径。 |
| 3. 动画分镜 | 完成 | 28 个镜头连续覆盖 7,200 帧；S12 用输入、回答比较、偏好信号和后续倾向构成连续动画。 |
| 4. 视觉规范 | 完成 | 保留黑金复古学术档案风格；字幕采用 Noto Sans SC 下方安全区排版，不使用提示卡片或页脚免责条。 |
| 5. 工程架构 | 完成 | Remotion 4.0.534、React、TypeScript、SVG；场景时间轴以毫秒定义并派生帧数。 |
| 6. MG 动画实现 | 完成 | 28 个镜头使用差异化构图、Kinetic Typography、路径动画、遮罩、镜头运动和跨镜头图形接力；无页眉页脚。 |
| 7. 字幕与音频 | 完成 | 主字幕人工编写并导出 SRT，已挂载到 `MainFilm` 并烧录进正式 MP4；只使用用户提供的 BGM，不含旁白或独立音效。 |
| 8. 视频渲染 | 完成 | 实际生成 `final.mp4`、`final-clean.mp4` 和 `preview.mp4`。 |
| 9. 质量审核 | 完成 | 84 张含主字幕的关键帧、四张 Contact Sheet 和预览抽样已查看；从最终 MP4 抽帧确认字幕可见，FFprobe 元数据核验通过。 |
| 10. 迭代交付 | 完成 | 删除底部提示式解释，将机制改写为连续叙事；结尾的核验建议由“回答—证据—判断”动画承担。 |

## 已核验的交付规格

- `output/final.mp4`：H.264，1920×1080，60/1 FPS，7,200 帧，120.000 秒；AAC，48 kHz，双声道。
- `output/final-clean.mp4`：H.264，1920×1080，60/1 FPS，7,200 帧，120.000 秒；无音轨、无主叙事字幕轨，保留动画内文字。
- `output/preview.mp4`：H.264，960×540，60/1 FPS，7,200 帧，120.000 秒；含 AAC 背景音乐与主叙事字幕。
- `output/subtitles.srt`：31 条主叙事字幕 cue，时码连续覆盖到 01:58；最后两秒保留无字幕静止余韵。
- `output/qc-frames/`：28 镜头各有 entry / mid / exit 三帧，共 84 张。
- Contact Sheet：`contact-sheet.png` 总览及 `contact-sheet-entry.png`、`contact-sheet-mid.png`、`contact-sheet-exit.png`。
- `output/thumbnail.png`：从 S07 核心判断镜头导出的 1280×720 封面帧。

## 实际执行的检查

- `npm test`：通过；28 个镜头、7,200 帧、120 秒和字幕时码连续性通过。
- `npm run typecheck`：通过。
- `npm run lint`：通过。
- `npm run captions`：成功生成主叙事字幕 SRT。
- `npm run qc:frames`：成功渲染 84 张关键帧。
- `npm run preview`、`npm run render:clean`、`npm run render`：均实际成功。
- FFprobe：分别核验了预览、无字幕静音版和主成片的编码、分辨率、帧率、时长、帧数和音轨。

## 已知边界

- 工作区未找到 `assets/reference/style-reference.png`；视觉按用户给出的黑金复古学术纪录片文字规范执行。
- 全片没有旁白；主叙事字幕负责讲述。`subtitles.srt` 是人工撰写的画面字幕，不是语音识别稿。
- BGM 按 120 秒 Composition 输出，不循环，片尾两秒渐弱。
