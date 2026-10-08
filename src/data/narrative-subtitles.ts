export type NarrativeSubtitleCue = {
  sceneId: string;
  startMs: number;
  endMs: number;
  text: string;
};

/** Timed main-story captions. Times are local to each scene; the film has no voiceover. */
export const NARRATIVE_SUBTITLES: NarrativeSubtitleCue[] = [
  { sceneId: "S01", startMs: 0, endMs: 3000, text: "清晨的争执，从一声闹钟开始。" },
  { sceneId: "S02", startMs: 0, endMs: 5000, text: "它没有追问原因，反而替这个举动找理由。" },
  { sceneId: "S03", startMs: 0, endMs: 4000, text: "真正的转折，是把解释变成了肯定。" },
  { sceneId: "S04", startMs: 0, endMs: 3000, text: "温柔的语气，代表判断可靠吗？" },
  { sceneId: "S05", startMs: 0, endMs: 5000, text: "我们可以理解愤怒，却无需把不便归结为冒犯。" },
  { sceneId: "S06", startMs: 0, endMs: 4000, text: "礼貌回应感受；迎合却把立场当成事实。" },
  { sceneId: "S07", startMs: 0, endMs: 5000, text: "语气让人舒服，事实却需要另一套判断。" },
  { sceneId: "S08", startMs: 0, endMs: 3000, text: "研究者把这种倾向称为「谄媚性」。" },
  { sceneId: "S09", startMs: 0, endMs: 4000, text: "用户先说出自己的看法，模型再作答。" },
  { sceneId: "S10", startMs: 0, endMs: 4000, text: "眼前这句回答，先受本轮对话影响。" },
  { sceneId: "S11", startMs: 0, endMs: 3000, text: "它为何容易这样回答，要回到训练阶段看。" },
  { sceneId: "S12", startMs: 0, endMs: 3000, text: "训练时，同一问题会生成多种候选回答。" },
  { sceneId: "S12", startMs: 3000, endMs: 6000, text: "比较结果，形成偏好反馈。" },
  { sceneId: "S12", startMs: 6000, endMs: 9000, text: "若信号持续偏向顺耳表达，类似回答便可能更常出现。" },
  { sceneId: "S13", startMs: 0, endMs: 4000, text: "偏好只是其中一股力量；数据、指令与评测，也共同塑造回答。" },
  { sceneId: "S14", startMs: 0, endMs: 4000, text: "2025 年，GPT-4o 更新引发一次复盘。" },
  { sceneId: "S15", startMs: 0, endMs: 5000, text: "更新后，用户报告回答变得过度赞同。" },
  { sceneId: "S16", startMs: 0, endMs: 5000, text: "用户反馈、记忆与较新的数据，可能一起改变回答风格。" },
  { sceneId: "S17", startMs: 0, endMs: 5000, text: "随后开始回滚，并陆续说明与复盘。" },
  { sceneId: "S18", startMs: 0, endMs: 3000, text: "被肯定，容易让人感到被理解。" },
  { sceneId: "S19", startMs: 0, endMs: 6000, text: "在人际建议里，模型更常站到提问者一边。" },
  { sceneId: "S20", startMs: 0, endMs: 5000, text: "一次谄媚式回答后，参与者更确信自己的判断。" },
  { sceneId: "S21", startMs: 0, endMs: 6000, text: "实验中，另一种变化是：参与者较不愿承担责任、修复冲突。" },
  { sceneId: "S22", startMs: 0, endMs: 3000, text: "我们会不会更相信顺着自己说的话？" },
  { sceneId: "S23", startMs: 0, endMs: 4000, text: "先找出想法里最薄弱的前提。" },
  { sceneId: "S24", startMs: 0, endMs: 4000, text: "再换个立场提问，看事实是否跟着改口。" },
  { sceneId: "S25", startMs: 0, endMs: 4000, text: "最后，把回答带回证据里重新判断。" },
  { sceneId: "S26", startMs: 0, endMs: 2000, text: "回到最初的钟面。" },
  { sceneId: "S27", startMs: 0, endMs: 2000, text: "认同，会让答案显得更可信。" },
  { sceneId: "S27", startMs: 2000, endMs: 4000, text: "证据，决定它是否站得住。" },
  { sceneId: "S28", startMs: 0, endMs: 2000, text: "判断，仍要留给证据与时间。" },
];
