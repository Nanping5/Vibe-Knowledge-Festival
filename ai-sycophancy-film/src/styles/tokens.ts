export const COLORS = {
  background: "#0D0C09",
  backgroundSoft: "#191710",
  gold: "#C5A574",
  ivory: "#E8E0D1",
  muted: "#8D877B",
  line: "#51483B",
  danger: "#A34D40",
  paper: "#D7CDBB",
} as const;

export const TYPE = {
  serif: '"Noto Serif SC", serif',
  sans: '"Noto Sans SC", sans-serif',
  latin: '"Cormorant Garamond", serif',
  englishNote: '"EB Garamond", serif',
  calligraphy: '"Ma Shan Zheng", cursive',
} as const;

export const FRAME = {
  width: 1920,
  height: 1080,
  fps: 60,
  duration: 7200,
  marginX: 128,
  marginY: 92,
} as const;

export const CHAPTERS = [
  "荒诞的赞美",
  "礼貌与谄媚",
  "偏好如何塑造回答",
  "一次真实的更新事件",
  "赞同为何容易被相信",
  "邀请反证",
  "答案，还是回声",
] as const;
