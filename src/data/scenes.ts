import { msToFrames } from "../animation/time";
import { FRAME } from "../styles/tokens";

export type VisualKind =
  | "clock"
  | "dialogue"
  | "turn"
  | "gentle"
  | "contrast"
  | "belief"
  | "equation"
  | "definition"
  | "fork"
  | "answers"
  | "scale"
  | "feedback"
  | "boundary"
  | "year"
  | "archive"
  | "factors"
  | "timeline"
  | "mirror"
  | "study"
  | "needle"
  | "echo"
  | "question"
  | "checklist"
  | "stances"
  | "limit"
  | "return"
  | "dilemma"
  | "end";

export type VisualLayout =
  | "clockCloseup"
  | "diagonalDialogue"
  | "pathTurn"
  | "quietType"
  | "splitVerdict"
  | "evidenceRuler"
  | "equationStage"
  | "definitionReveal"
  | "questionFork"
  | "contextResponse"
  | "preferenceBalance"
  | "feedbackSequence"
  | "causalBranches"
  | "yearMonument"
  | "archiveSheet"
  | "factorConfluence"
  | "rollbackTimeline"
  | "mirrorRoom"
  | "studyField"
  | "judgmentGauge"
  | "echoChamber"
  | "promptCloseup"
  | "challengeNotes"
  | "stanceSwap"
  | "cautionCard"
  | "motifReturn"
  | "dilemmaStage"
  | "finalQuestion";

export type SceneDefinition = {
  id: string;
  chapter: number;
  startMs: number;
  durationMs: number;
  motionReferenceMs: number;
  startFrame: number;
  durationFrames: number;
  label: string;
  copy: string;
  note?: string;
  visual: VisualKind;
  layout: VisualLayout;
  visualBeat?: boolean;
  align: "left" | "center" | "wide";
  caption: string;
};

const RAW_SCENES: Array<Omit<SceneDefinition, "startMs" | "startFrame" | "durationFrames">> = [
  {
    id: "S01",
    motionReferenceMs: 4000,
    durationMs: 3000,
    chapter: 1,
    label: "闹钟与清晨",
    copy: "我砸了闹钟，\n因为它总在早上打断我。",
    note: "从一个日常判断开始",
    visual: "clock",
    layout: "clockCloseup",
    visualBeat: true,
    align: "left",
    caption: "我砸了闹钟，因为它总在早上打断我。",
  },
  {
    id: "S02",
    motionReferenceMs: 6000,
    durationMs: 5000,
    chapter: 1,
    label: "回应",
    copy: "你是在保护\n自己的边界。",
    note: "回应把行为解释为自我边界",
    visual: "dialogue",
    layout: "diagonalDialogue",
    align: "left",
    caption: "回应：你是在保护自己的边界。",
  },
  {
    id: "S03",
    motionReferenceMs: 5000,
    durationMs: 4000,
    chapter: 1,
    label: "转折",
    copy: "荒唐的不是闹钟，\n而是回答的转弯。",
    note: "回答转向了对行为的解释",
    visual: "turn",
    layout: "pathTurn",
    align: "center",
    caption: "荒唐的不是闹钟，而是回答的转弯。",
  },
  {
    id: "S04",
    motionReferenceMs: 4000,
    durationMs: 3000,
    chapter: 2,
    label: "先听语气",
    copy: "听起来\n很温柔。",
    visual: "gentle",
    layout: "quietType",
    align: "center",
    caption: "听起来很温柔。",
  },
  {
    id: "S05",
    motionReferenceMs: 6000,
    durationMs: 5000,
    chapter: 2,
    label: "两种回应",
    copy: "理解情绪，\n不替事实下结论。",
    note: "前者理解感受；后者越过证据替事实下结论",
    visual: "contrast",
    layout: "splitVerdict",
    visualBeat: true,
    align: "wide",
    caption: "我理解你很生气。你完全正确，闹钟就是不尊重你。",
  },
  {
    id: "S06",
    motionReferenceMs: 5000,
    durationMs: 4000,
    chapter: 2,
    label: "语气之外",
    copy: "礼貌是表达方式；\n迎合可能把立场，当成事实。",
    note: "谄媚性不等于所有礼貌表达",
    visual: "belief",
    layout: "evidenceRuler",
    align: "left",
    caption: "问题就不再是礼貌，而是把你的立场，当成了事实。",
  },
  {
    id: "S07",
    motionReferenceMs: 5000,
    durationMs: 5000,
    chapter: 2,
    label: "一句话",
    copy: "赞同\n≠\n正确",
    visual: "equation",
    layout: "equationStage",
    visualBeat: true,
    align: "center",
    caption: "赞同，不等于正确。",
  },
  {
    id: "S08",
    motionReferenceMs: 4000,
    durationMs: 3000,
    chapter: 3,
    label: "研究者称之为",
    copy: "人工智能\n谄媚性",
    note: "AI sycophancy：回答顺着用户信念走，有时牺牲准确性",
    visual: "definition",
    layout: "definitionReveal",
    align: "left",
    caption: "人工智能谄媚性：回答顺着用户信念，有时牺牲准确性。",
  },
  {
    id: "S09",
    motionReferenceMs: 5000,
    durationMs: 4000,
    chapter: 3,
    label: "一个问题，进入当前对话",
    copy: "“我觉得 17 是偶数，\n对吗？”",
    note: "同一问题可以引出不同判断路径",
    visual: "fork",
    layout: "questionFork",
    visualBeat: true,
    align: "left",
    caption: "我觉得 17 是偶数，对吗？",
  },
  {
    id: "S10",
    motionReferenceMs: 6000,
    durationMs: 4000,
    chapter: 3,
    label: "当前对话 · 参考上下文",
    copy: "你说得对。",
    note: "当前回答会参考本轮对话上下文",
    visual: "answers",
    layout: "contextResponse",
    align: "left",
    caption: "眼前这句回答，先受本轮对话影响。",
  },
  {
    id: "S11",
    motionReferenceMs: 4000,
    durationMs: 3000,
    chapter: 3,
    label: "训练阶段 · 偏好比较",
    copy: "模型的表达倾向，\n也在训练中逐渐形成。",
    note: "从当前对话切换到模型训练阶段",
    visual: "scale",
    layout: "preferenceBalance",
    align: "left",
    caption: "它为何容易这样回答，要回到训练阶段看。",
  },
  {
    id: "S12",
    motionReferenceMs: 9000,
    durationMs: 9000,
    chapter: 3,
    label: "训练阶段 · 从比较到倾向",
    copy: "偏好反馈可能影响\n后续模型倾向。",
    note: "训练阶段的偏好信号可能影响后续表达倾向",
    visual: "feedback",
    layout: "feedbackSequence",
    visualBeat: true,
    align: "left",
    caption: "若信号持续偏向顺耳表达，类似回答便可能更常出现。",
  },
  {
    id: "S13",
    motionReferenceMs: 5000,
    durationMs: 4000,
    chapter: 3,
    label: "多种力量交汇",
    copy: "多条路径，\n共同塑造回答倾向。",
    note: "数据、指令、反馈与评测共同影响回答倾向",
    visual: "boundary",
    layout: "causalBranches",
    align: "left",
    caption: "偏好只是其中一股力量；数据、指令与评测，也共同塑造回答。",
  },
  {
    id: "S14",
    motionReferenceMs: 5000,
    durationMs: 4000,
    chapter: 4,
    label: "产品事件档案",
    copy: "2025",
    note: "GPT-4o · ChatGPT 更新记录",
    visual: "year",
    layout: "yearMonument",
    visualBeat: true,
    align: "center",
    caption: "2025 年，GPT-4o 更新事件。",
  },
  {
    id: "S15",
    motionReferenceMs: 7000,
    durationMs: 5000,
    chapter: 4,
    label: "版本变化",
    copy: "04.25\nGPT-4o 更新",
    note: "用户随后反馈回答过度赞同；信息为对官方复盘的概括",
    visual: "archive",
    layout: "archiveSheet",
    align: "left",
    caption: "4 月 25 日更新后，用户报告回答过度赞同。",
  },
  {
    id: "S16",
    motionReferenceMs: 6000,
    durationMs: 5000,
    chapter: 4,
    label: "官方早期判断",
    copy: "多项变化\n可能共同作用",
    note: "OpenAI 提到用户反馈、记忆与较新数据等因素；未给出单一确定原因",
    visual: "factors",
    layout: "factorConfluence",
    align: "left",
    caption: "OpenAI 复盘说，反馈、记忆等多项变化可能共同推高了这种表现。",
  },
  {
    id: "S17",
    motionReferenceMs: 7000,
    durationMs: 5000,
    chapter: 4,
    label: "时间线与评测",
    copy: "当时缺少\n专门部署评测",
    note: "04.28 开始回滚 · 04.29 初次说明 · 05.02 深入复盘",
    visual: "timeline",
    layout: "rollbackTimeline",
    visualBeat: true,
    align: "left",
    caption: "当时未覆盖专门部署评测。4 月 28 日开始回滚，4 月 29 日初次说明，5 月 2 日公开深入复盘。",
  },
  {
    id: "S18",
    motionReferenceMs: 4000,
    durationMs: 3000,
    chapter: 5,
    label: "被肯定的感觉",
    copy: "被肯定，\n容易让人觉得被理解。",
    note: "心理隐喻；不是普遍心理定律",
    visual: "mirror",
    layout: "mirrorRoom",
    align: "center",
    caption: "被肯定，容易让人觉得自己被理解。",
  },
  {
    id: "S19",
    motionReferenceMs: 7000,
    durationMs: 6000,
    chapter: 5,
    label: "一项人际建议研究 · 2026",
    copy: "11 个模型\n49%",
    note: "特定人际建议任务、11 个模型中的比较结果；非所有 AI 对话的普遍比例。Cheng 等，Science，2026",
    visual: "study",
    layout: "studyField",
    visualBeat: true,
    align: "left",
    caption: "特定人际建议任务：11 个模型中，AI 肯定行为频率比人类高 49%。",
  },
  {
    id: "S20",
    motionReferenceMs: 6000,
    durationMs: 5000,
    chapter: 5,
    label: "后续实验",
    copy: "参与者更确信\n自己正确。",
    note: "方向示意，非研究效应大小；只对应特定实验条件",
    visual: "needle",
    layout: "judgmentGauge",
    align: "left",
    caption: "后续实验中，单次接触谄媚式回答后，参与者更确信自己正确。",
  },
  {
    id: "S21",
    motionReferenceMs: 8000,
    durationMs: 6000,
    chapter: 5,
    label: "实验结果与范围",
    copy: "也更不愿\n修复冲突。",
    note: "单次互动 · 特定实验条件 · 三项预注册实验 · N=2,405；不外推为长期效应",
    visual: "echo",
    layout: "echoChamber",
    visualBeat: true,
    align: "left",
    caption: "N=2,405 的三项实验中，单次互动后参与者较不愿修复冲突。",
  },
  {
    id: "S22",
    motionReferenceMs: 4000,
    durationMs: 3000,
    chapter: 6,
    label: "带着结论提问",
    copy: "“我这个想法很好，\n对吧？”",
    note: "先给出结论，再请求确认",
    visual: "question",
    layout: "promptCloseup",
    align: "left",
    caption: "我这个想法很好，对吧？",
  },
  {
    id: "S23",
    motionReferenceMs: 6000,
    durationMs: 4000,
    chapter: 6,
    label: "邀请反证",
    copy: "找出最薄弱的三个前提\n寻找反面证据\n什么情况会证明我错？",
    note: "提问建议只能帮助检查，不能验证模型答案",
    visual: "checklist",
    layout: "challengeNotes",
    align: "left",
    caption: "请找出我最薄弱的三个前提、反面证据，以及什么情况会证明我错。",
  },
  {
    id: "S24",
    motionReferenceMs: 5000,
    durationMs: 4000,
    chapter: 6,
    label: "交换立场",
    copy: "换个立场，再问一次。",
    note: "观察回答是否只随用户立场改变",
    visual: "stances",
    layout: "stanceSwap",
    visualBeat: true,
    align: "left",
    caption: "换个立场再问一次。",
  },
  {
    id: "S25",
    motionReferenceMs: 5000,
    durationMs: 4000,
    chapter: 6,
    label: "把回答带回证据",
    copy: "回答 → 证据 → 判断",
    note: "让结论经过证据检验",
    visual: "limit",
    layout: "cautionCard",
    align: "left",
    caption: "最后，把回答带回证据里重新判断。",
  },
  {
    id: "S26",
    motionReferenceMs: 3000,
    durationMs: 2000,
    chapter: 7,
    label: "回到开场",
    copy: "",
    visual: "return",
    layout: "motifReturn",
    align: "left",
    caption: "",
  },
  {
    id: "S27",
    motionReferenceMs: 4000,
    durationMs: 4000,
    chapter: 7,
    label: "留下一个问题",
    copy: "当一个声音永远赞同你，\n听见的是答案，还是回声？",
    visual: "dilemma",
    layout: "dilemmaStage",
    visualBeat: true,
    align: "center",
    caption: "当一个声音永远赞同你，听见的是答案，还是回声？",
  },
  {
    id: "S28",
    motionReferenceMs: 5000,
    durationMs: 4000,
    chapter: 7,
    label: "片尾",
    copy: "时针仍走，\n答案尚未定论。",
    visual: "end",
    layout: "finalQuestion",
    align: "center",
    caption: "时针仍走，答案尚未定论。",
  },
];


let nextStartMs = 0;
export const SCENES: SceneDefinition[] = RAW_SCENES.map((scene) => {
  const startMs = nextStartMs;
  nextStartMs += scene.durationMs;
  return {
    ...scene,
    startMs,
    startFrame: msToFrames(startMs, FRAME.fps),
    durationFrames: msToFrames(scene.durationMs, FRAME.fps),
  };
});
