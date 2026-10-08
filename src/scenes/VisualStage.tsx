import React from "react";
import { Easing, interpolate } from "remotion";
import type { SceneDefinition, VisualLayout } from "../data/scenes";
import { COLORS, TYPE } from "../styles/tokens";

type Props = { scene: SceneDefinition; frame: number };

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.bezier(0.2, 0.72, 0.24, 1);
const p = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], { ...clamp, easing: ease });

const Text: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  family?: string;
  anchor?: "start" | "middle" | "end";
  spacing?: number;
  weight?: number;
  opacity?: number;
}> = ({
  x,
  y,
  children,
  size = 28,
  color = COLORS.ivory,
  family = TYPE.serif,
  anchor = "start",
  spacing = 0,
  weight = 400,
  opacity = 1,
}) => (
  <text
    x={x}
    y={y}
    fill={color}
    fontFamily={family}
    fontSize={size}
    fontWeight={weight}
    letterSpacing={spacing}
    textAnchor={anchor}
    opacity={opacity}
  >
    {children}
  </text>
);

const Label: React.FC<{ x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end" }> = ({
  x,
  y,
  children,
  anchor = "start",
}) => (
  <Text x={x} y={y} size={19} color={COLORS.gold} family={TYPE.sans} spacing={2.5} anchor={anchor}>
    {children}
  </Text>
);

const Path: React.FC<{
  d: string;
  progress: number;
  color?: string;
  width?: number;
  opacity?: number;
  dash?: string;
}> = ({ d, progress, color = COLORS.gold, width = 2, opacity = 1, dash }) => (
  <path
    d={d}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeDasharray={dash ?? "1"}
    strokeDashoffset={1 - progress}
    pathLength={1}
    opacity={opacity}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  body?: string;
  accent?: boolean;
  progress?: number;
}> = ({ x, y, w, h, title, body, accent = false, progress = 1 }) => (
  <g opacity={progress}>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx="3"
      fill={accent ? "rgba(197,165,116,0.045)" : "rgba(232,224,209,0.018)"}
      stroke={accent ? COLORS.gold : COLORS.line}
      strokeWidth="2"
    />
    <line x1={x + 26} y1={y + 32} x2={x + w - 26} y2={y + 32} stroke={accent ? COLORS.gold : COLORS.line} />
    <Text x={x + 30} y={y + 76} size={24} color={accent ? COLORS.gold : COLORS.muted} family={TYPE.sans} spacing={1.5}>
      {title}
    </Text>
    {body ? <Text x={x + 30} y={y + 125} size={30}>{body}</Text> : null}
  </g>
);

const Clock: React.FC<{
  frame: number;
  duration: number;
  x: number;
  y: number;
  r: number;
  opacity?: number;
  impact?: boolean;
}> = ({
  frame,
  duration,
  x,
  y,
  r,
  opacity = 1,
  impact = false,
}) => {
  const hand = interpolate(frame, [0, duration], [-28, 24], clamp);
  const joltX = impact ? interpolate(frame, [8, 10, 12, 15], [0, -18, 7, 0], clamp) : 0;
  const joltRotation = impact ? interpolate(frame, [8, 10, 12, 15], [0, -2.5, 1, 0], clamp) : 0;
  const impactProgress = impact ? p(frame, 8, 20) : 0;
  const impactOpacity = impact ? 0.38 * (1 - p(frame, 8, 20)) : 0;
  return (
    <g opacity={opacity}>
      {impact ? (
        <circle
          cx={x}
          cy={y}
          r={r + 18 + impactProgress * 58}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="3"
          opacity={impactOpacity * 1.4}
        />
      ) : null}
      <g transform={`translate(${joltX} 0) rotate(${joltRotation} ${x} ${y})`}>
        <circle cx={x} cy={y} r={r} fill="none" stroke={COLORS.line} strokeWidth="3" />
        <circle cx={x} cy={y} r={r - 17} fill="none" stroke={COLORS.gold} strokeWidth="2" opacity="0.78" />
        {Array.from({ length: 60 }, (_, i) => {
          const major = i % 5 === 0;
          const angle = (i * 6 * Math.PI) / 180;
          const outer = r - 28;
          const inner = r - (major ? 68 : 46);
          return (
            <line
              key={i}
              x1={x + Math.sin(angle) * inner}
              y1={y - Math.cos(angle) * inner}
              x2={x + Math.sin(angle) * outer}
              y2={y - Math.cos(angle) * outer}
              stroke={major ? COLORS.gold : COLORS.line}
              strokeWidth={major ? 3 : 1.4}
              opacity={major ? 0.9 : 0.7}
            />
          );
        })}
        <line x1={x} y1={y} x2={x} y2={y - r * 0.5} stroke={COLORS.ivory} strokeWidth="6" strokeLinecap="round" transform={`rotate(${hand} ${x} ${y})`} />
        <line x1={x} y1={y} x2={x + r * 0.38} y2={y + r * 0.24} stroke={COLORS.gold} strokeWidth="4" strokeLinecap="round" transform={`rotate(${-hand * 0.6} ${x} ${y})`} />
        <circle cx={x} cy={y} r="9" fill={COLORS.gold} />
      </g>
    </g>
  );
};

const renderLayout = (layout: VisualLayout, scene: SceneDefinition, frame: number) => {
  const d = scene.motionReferenceMs * 0.03;
  const reveal = p(frame, 5, Math.min(48, d - 8));

  switch (layout) {
    case "clockCloseup":
      return (
        <g>
          <Clock frame={frame} duration={d} x={1320} y={510} r={520} impact />
          <Label x={142} y={132}>清晨 / 07:00</Label>
          <path d="M110 819 H610" stroke={COLORS.line} strokeWidth="2" />
          <Path d="M110 819 H610" progress={p(frame, 15, 88)} width={3} />
          <Label x={132} y={788}>07:00 / MORNING</Label>
          <Text x={1290} y={520} size={28} color={COLORS.muted} anchor="middle">时间继续向前</Text>
        </g>
      );
    case "diagonalDialogue": {
      const userX = interpolate(frame, [0, 42], [-560, 90], { ...clamp, easing: ease });
      const answerX = interpolate(frame, [30, 92], [2070, 1070], { ...clamp, easing: ease });
      return (
        <g>
          <Path d="M118 828 C420 790 530 598 820 527 S1240 385 1670 234" progress={p(frame, 8, 106)} color={COLORS.line} width={3} />
          <circle cx={interpolate(frame, [8, 108], [150, 1660], clamp)} cy={interpolate(frame, [8, 108], [824, 240], clamp)} r="8" fill={COLORS.gold} />
          <g transform={`translate(${userX} 0) rotate(-6 350 687)`}>
            <rect x="112" y="566" width="650" height="232" rx="4" fill={COLORS.backgroundSoft} stroke={COLORS.line} strokeWidth="2" />
            <Label x={150} y={610}>用户立场</Label>
            <Text x={150} y={687} size={31}>闹钟总在早上打断我。</Text>
            <Text x={150} y={742} size={25} color={COLORS.muted}>所以我砸了它。</Text>
          </g>
          <g transform={`translate(${answerX - 1070} 0) rotate(5 1400 365)`}>
            <rect x="1030" y="202" width="750" height="260" rx="4" fill="rgba(197,165,116,0.035)" stroke={COLORS.gold} strokeWidth="2" />
            <Label x={1070} y={248}>回应</Label>
            <Text x={1070} y={338} size={39}>你是在保护自己的边界。</Text>
            <Path d="M1100 375 H1570" progress={p(frame, 63, 106)} width={2} />
          </g>
        </g>
      );
    }
    case "pathTurn": {
      const dot = p(frame, 0, d - 14);
      return (
        <g>
          <Path d="M128 590 H690 C810 590 800 310 1040 310 H1770" progress={reveal} width={4} />
          <Path d="M128 615 H690" progress={p(frame, 7, 55)} color={COLORS.line} width={1} />
          <circle cx={interpolate(frame, [0, 70, 145], [128, 790, 1770], clamp)} cy={interpolate(frame, [0, 70, 145], [590, 590, 310], clamp)} r="12" fill={COLORS.gold} />
          <Text x={240} y={533} size={29}>闹钟</Text>
          <Text x={1080} y={248} size={28} color={COLORS.muted}>回答改变了问题的意义</Text>
          <Label x={142} y={450}>立场转向</Label>
          <path d="M1070 350 C1250 350 1410 350 1660 350" fill="none" stroke={COLORS.line} strokeWidth="1" strokeDasharray="4 10" opacity={dot} />
        </g>
      );
    }
    case "quietType":
      return (
        <g>
          <path d="M130 724 H1790" stroke={COLORS.line} strokeWidth="1" />
          <Path d="M130 724 H1790" progress={p(frame, 14, 92)} width={2} />
          <path d="M450 190 A520 520 0 0 1 960 55" fill="none" stroke={COLORS.line} strokeWidth="2" />
          <path d="M960 55 A520 520 0 0 1 1470 190" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p(frame, 22, 110)} />
          <Label x={960} y={680} anchor="middle">语气温和，不等于判断可靠</Label>
        </g>
      );
    case "splitVerdict": {
      const scanX = interpolate(frame, [35, 104], [948, 964], clamp);
      return (
        <g>
          <Label x={960} y={116} anchor="middle">同一情境 / 两种表达</Label>
          <rect x="112" y="148" width="824" height="638" fill="rgba(232,224,209,0.012)" stroke={COLORS.line} strokeWidth="2" />
          <rect x="984" y="148" width="824" height="638" fill="rgba(197,165,116,0.025)" stroke={COLORS.line} strokeWidth="2" />
          <Path d="M960 148 V786" progress={p(frame, 0, 20)} width={2} />
          <Label x={160} y={212}>回应 A / 理解感受</Label>
          <Text x={160} y={378} size={42}>我理解你很生气。</Text>
          <Text x={160} y={472} size={27} color={COLORS.muted}>承认情绪，不替事实下结论</Text>
          <Label x={1032} y={212}>回应 B / 替事实定论</Label>
          <Text x={1032} y={356} size={36}>你完全正确，</Text>
          <Text x={1032} y={414} size={36}>闹钟就是不尊重你。</Text>
          <path d="M1034 438 H1450" fill="none" stroke={COLORS.danger} strokeWidth={3} strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p(frame, 62, 112)} />
          <Label x={1032} y={512}>判断缺少证据</Label>
          <line x1={scanX} y1="142" x2={scanX} y2="790" stroke={COLORS.gold} strokeWidth="1" opacity="0.38" />
        </g>
      );
    }
    case "evidenceRuler":
      return (
        <g>
          <path d="M180 548 H1740" fill="none" stroke={COLORS.line} strokeWidth="3" />
          {[260, 960, 1660].map((x, i) => (
            <g key={x}>
              <line x1={x} y1="488" x2={x} y2="608" stroke={i === 1 ? COLORS.danger : COLORS.gold} strokeWidth="3" />
              <circle cx={x} cy="548" r="12" fill={i === 1 ? COLORS.danger : COLORS.gold} />
            </g>
          ))}
          <Text x={260} y={474} size={38} anchor="middle">立场</Text>
          <Text x={960} y={474} size={38} color={COLORS.danger} anchor="middle">证据</Text>
          <Text x={1660} y={474} size={38} anchor="middle">事实</Text>
          <path d="M460 548 H754 M1165 548 H1455" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeDasharray="7 10" opacity={p(frame, 16, 92)} />
          <rect x="788" y="518" width="344" height="60" fill={COLORS.background} opacity="0.98" />
          <Text x={960} y={700} size={25} color={COLORS.muted} anchor="middle">判断从你的立场跳向事实，中间缺了检验。</Text>
          <Path d="M960 578 V654" progress={p(frame, 60, 95)} width={2} color={COLORS.danger} />
        </g>
      );
    case "equationStage": {
      const slash = p(frame, 54, 78);
      return (
        <g>
          <circle cx="960" cy="516" r="340" fill="none" stroke={COLORS.line} strokeWidth="1" opacity="0.5" />
          <path d="M960 108 V924" fill="none" stroke={COLORS.line} strokeWidth="1" strokeDasharray="4 12" />
          <Text x={520} y={560} size={98} anchor="middle" weight={500}>赞同</Text>
          <Text x={1400} y={560} size={98} anchor="middle" weight={500}>正确</Text>
          <line x1="855" y1="482" x2="1065" y2="482" stroke={COLORS.gold} strokeWidth="8" strokeLinecap="round" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p(frame, 16, 42)} />
          <line x1="855" y1="552" x2="1065" y2="552" stroke={COLORS.gold} strokeWidth="8" strokeLinecap="round" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p(frame, 26, 52)} />
          <line x1="1060" y1={565 - 180 * slash} x2="860" y2={440 + 180 * slash} stroke={COLORS.ivory} strokeWidth="7" strokeLinecap="round" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - slash} />
          <Label x={520} y={638} anchor="middle">回应方式</Label>
          <Label x={1400} y={638} anchor="middle">事实判断</Label>
        </g>
      );
    }
    case "definitionReveal":
      return (
        <g>
          <path d="M140 598 C430 598 542 362 790 362 S1250 600 1740 366" fill="none" stroke={COLORS.line} strokeWidth="2" />
          <Path d="M140 598 C430 598 542 362 790 362 S1250 600 1740 366" progress={p(frame, 8, 100)} width={3} />
          <circle cx={interpolate(frame, [8, 106], [140, 1740], clamp)} cy={interpolate(frame, [8, 106], [598, 366], clamp)} r="9" fill={COLORS.gold} />
          <Label x={192} y={666}>用户信念</Label>
          <Label x={910} y={320} anchor="middle">回答倾向</Label>
          <Label x={1690} y={438} anchor="end">准确性可能受损</Label>
          <path d="M894 285 V230 H1390" fill="none" stroke={COLORS.line} strokeWidth="1" />
        </g>
      );
    case "questionFork":
      return (
        <g>
          <Text x={960} y={266} size={31} color={COLORS.gold} anchor="middle">问题进入当前对话</Text>
          <Path d="M320 336 H1600" progress={p(frame, 8, 38)} color={COLORS.line} width={2} />
          <Text x={960} y={510} size={58} anchor="middle">我觉得 17 是偶数，对吗？</Text>
          <Path d="M960 574 C960 665 960 708 960 800" progress={p(frame, 46, 125)} width={3} />
          <circle cx="960" cy="800" r="10" fill={COLORS.gold} opacity={p(frame, 95, 118)} />
          <Text x={960} y={876} size={27} color={COLORS.muted} anchor="middle">这句话成为本轮对话上下文</Text>
        </g>
      );
    case "contextResponse": {
      const reveal = p(frame, 50, 94);
      return (
        <g>
          <Text x={960} y={224} size={32} color={COLORS.gold} anchor="middle">当前对话 · 这一轮的回答</Text>
          <path d="M180 310 H780 M180 310 V738 H780" fill="none" stroke={COLORS.line} strokeWidth="2" />
          <Text x={228} y={390} size={27} color={COLORS.muted}>对话上下文</Text>
          <Text x={228} y={510} size={36}>我觉得 17 是偶数</Text>
          <Text x={228} y={584} size={25} color={COLORS.muted}>用户在本轮对话中的观点</Text>
          <Path d="M790 522 C900 522 1005 522 1110 522" progress={p(frame, 20, 82)} color={COLORS.gold} width={3} />
          <path d="M1084 508 L1110 522 L1084 536" fill="none" stroke={COLORS.gold} strokeWidth="3" opacity={p(frame, 72, 84)} />
          <g opacity={reveal}>
            <path d="M1140 310 H1740 M1740 310 V738 H1140" fill="none" stroke={COLORS.gold} strokeWidth="2" />
            <Text x={1190} y={390} size={27} color={COLORS.gold}>本轮回应</Text>
            <Text x={1190} y={530} size={53}>你说得对。</Text>
            <line x1="1190" y1="588" x2="1620" y2="588" stroke={COLORS.line} strokeWidth="2" />
            <Text x={1190} y={650} size={26} color={COLORS.muted}>回答会参考刚才的对话上下文</Text>
          </g>
        </g>
      );
    }
    case "preferenceBalance": {
      const tilt = interpolate(frame, [15, d - 20], [-2, 2], clamp);
      return (
        <g>
          <Text x={960} y={204} size={30} color={COLORS.gold} anchor="middle">训练阶段 · 偏好比较</Text>
          <Text x={560} y={386} size={28} anchor="middle">A / 纠正错误前提</Text>
          <Text x={1360} y={386} size={28} anchor="middle">B / 顺着用户立场</Text>
          <Text x={960} y={428} size={25} color={COLORS.muted} anchor="middle">比较不同回答的偏好信号</Text>
          <g transform={`rotate(${tilt} 960 486)`}>
            <line x1="410" y1="474" x2="1510" y2="474" stroke={COLORS.gold} strokeWidth="4" />
            <line x1="560" y1="474" x2="560" y2="680" stroke={COLORS.line} strokeWidth="2" />
            <line x1="1360" y1="474" x2="1360" y2="680" stroke={COLORS.line} strokeWidth="2" />
            <path d="M416 686 H704 L666 766 H454Z" fill="rgba(232,224,209,0.02)" stroke={COLORS.line} strokeWidth="2" />
            <path d="M1216 686 H1504 L1466 766 H1254Z" fill="rgba(197,165,116,0.035)" stroke={COLORS.gold} strokeWidth="2" />
            <path d="M960 478 L876 710 H1044Z" fill="none" stroke={COLORS.line} strokeWidth="2" />
          </g>
          <circle cx="560" cy="474" r="11" fill={COLORS.background} stroke={COLORS.ivory} strokeWidth="3" />
          <circle cx="1360" cy="474" r="11" fill={COLORS.background} stroke={COLORS.gold} strokeWidth="3" />
          <Text x={560} y={828} size={27} color={COLORS.muted} anchor="middle">事实准确</Text>
          <Text x={1360} y={828} size={27} color={COLORS.muted} anchor="middle">表达更顺耳</Text>
        </g>
      );
    }
    case "feedbackSequence": {
      const input = p(frame, 8, 36);
      const answers = p(frame, 37, 71);
      const compare = p(frame, 72, 108);
      const choose = p(frame, 112, 145);
      const feedback = p(frame, 150, 198);
      const later = p(frame, 204, 240);
      const markerX = interpolate(frame, [112, 145], [895, 1470], { ...clamp, easing: ease });
      const feedbackDotX = interpolate(frame, [145, 165, 190, 213], [1470, 1270, 965, 1368], clamp);
      const feedbackDotY = interpolate(frame, [145, 165, 190, 213], [390, 600, 760, 830], clamp);
      return (
        <g>
          <Text x={960} y={92} size={27} color={COLORS.gold} anchor="middle">训练阶段 · 候选回答与偏好反馈</Text>
          <Text x={120} y={158} size={25} color={COLORS.gold} family={TYPE.sans}>01 / 训练样本</Text>
          <Card x={120} y={180} w={400} h={176} title="样本中的用户立场" body="我觉得 17 是偶数" progress={input} />
          <Path d="M520 268 H680 C720 268 700 238 740 238 M680 268 C720 268 700 378 740 378" progress={p(frame, 25, 54)} color={COLORS.line} width={3} />
          <Text x={740} y={158} size={25} color={COLORS.gold} family={TYPE.sans}>02 / 生成候选回答</Text>
          <Card x={740} y={180} w={430} h={176} title="A / 纠正" body="17 不是偶数" progress={answers} />
          <Card x={1260} y={180} w={520} h={176} title="B / 迎合" body="你说得对" accent progress={answers} />
          <line x1="720" y1="410" x2={720 + 1060 * compare} y2="410" stroke={COLORS.gold} strokeWidth="2" />
          <Text x={740} y={458} size={25} color={COLORS.gold} family={TYPE.sans}>03 / 比较与偏好</Text>
          <path d="M740 475 H1780" stroke={COLORS.line} strokeWidth="2" />
          <circle cx={markerX} cy="475" r="13" fill={COLORS.background} stroke={COLORS.gold} strokeWidth="4" />
          <rect x="1260" y="170" width="520" height="196" fill="none" stroke={COLORS.gold} strokeWidth={2 + choose * 2} opacity={choose} />
          <Text x={120} y={660} size={25} color={COLORS.gold} family={TYPE.sans}>04 / 偏好反馈进入后续训练</Text>
          <circle cx="965" cy="752" r="116" fill="rgba(197,165,116,0.025)" stroke={COLORS.line} strokeWidth="2" />
          <circle cx="965" cy="752" r={78 + feedback * 9} fill="none" stroke={COLORS.gold} strokeWidth="2" opacity={0.35 + feedback * 0.55} />
          <Text x={965} y={765} size={28} anchor="middle">偏好信号</Text>
          <Path d="M1518 366 C1600 516 1380 662 1080 738" progress={feedback} color={COLORS.gold} width={3} />
          <Path d="M1080 782 C1180 844 1280 858 1370 830" progress={later} color={COLORS.gold} width={3} />
          {feedback > 0 ? <circle cx={feedbackDotX} cy={feedbackDotY} r="9" fill={COLORS.gold} /> : null}
          <Text x={1440} y={682} size={25} color={COLORS.gold} family={TYPE.sans}>05 / 后续模型倾向</Text>
          <g opacity={later} transform={`translate(${(1 - later) * 35} 0)`}>
            <rect x="1370" y="704" width="420" height="126" fill="rgba(197,165,116,0.028)" stroke={COLORS.gold} strokeWidth="2" />
            <Text x={1400} y={758} size={25} color={COLORS.muted} family={TYPE.sans}>类似的肯定式表达</Text>
            <Text x={1400} y={802} size={28}>可能更常见</Text>
          </g>
        </g>
      );
    }
    case "causalBranches":
      return (
        <g>
          <circle cx="960" cy="485" r="150" fill="none" stroke={COLORS.gold} strokeWidth="2" />
          <Text x={960} y={478} size={40} anchor="middle">回答</Text>
          <Text x={960} y={530} size={40} color={COLORS.gold} anchor="middle">倾向</Text>
          {[
            { x: 250, y: 250, title: "数据" },
            { x: 1660, y: 265, title: "指令" },
            { x: 280, y: 745, title: "反馈" },
            { x: 1640, y: 735, title: "评测" },
          ].map((node, i) => (
            <g key={node.title}>
              <Path
                d={`M${node.x} ${node.y} Q${(node.x + 960) / 2} ${(node.y + 485) / 2} ${node.x < 960 ? 810 : 1110} 485`}
                progress={p(frame, 14 + i * 7, 76 + i * 7)}
                color={COLORS.line}
                width={2}
              />
              <circle cx={node.x} cy={node.y} r="9" fill={COLORS.gold} opacity={reveal} />
              <Text x={node.x} y={node.y - 28} size={28} anchor="middle">{node.title}</Text>
            </g>
          ))}
        </g>
      );
    case "yearMonument":
      return (
        <g>
          <defs>
            <clipPath id="year-mask"><rect x="0" y="160" width={1920 * reveal} height="610" /></clipPath>
          </defs>
          <Text x={960} y={626} size={360} color={COLORS.gold} family={TYPE.latin} anchor="middle" spacing={14} weight={400}>
            <tspan clipPath="url(#year-mask)">2025</tspan>
          </Text>
          <Path d="M128 790 H1792" progress={p(frame, 48, 120)} width={2} />
          <circle cx="528" cy="790" r="11" fill={COLORS.gold} />
          <line x1="528" y1="754" x2="528" y2="826" stroke={COLORS.gold} strokeWidth="2" />
          <Label x={528} y={878} anchor="middle">04.25</Label>
          <Text x={960} y={710} size={25} color={COLORS.muted} anchor="middle">GPT-4o / 一次产品更新引发的真实事件</Text>
        </g>
      );
    case "archiveSheet": {
      const drift = interpolate(frame, [0, d], [0, -52], clamp);
      return (
        <g transform={`translate(${drift} 0)`}>
          <path d="M160 180 H1760 V842 H160Z" fill="rgba(232,224,209,0.012)" stroke={COLORS.line} strokeWidth="2" />
          <Text x={220} y={245} size={22} color={COLORS.gold} family={TYPE.englishNote} spacing={2}>OPENAI / PUBLIC REVIEW / APR 2025</Text>
          <Text x={220} y={354} size={59} family={TYPE.latin}>GPT-4o</Text>
          <line x1="220" y1="394" x2="1670" y2="394" stroke={COLORS.line} />
          <circle cx="270" cy="486" r="9" fill={COLORS.gold} />
          <Label x={314} y={493}>04.25 / 更新</Label>
          <Text x={670} y={493} size={31}>回答风格调整后上线</Text>
          <circle cx="270" cy="600" r="9" fill={COLORS.danger} />
          <Label x={314} y={607}>随后 / 用户反馈</Label>
          <Text x={670} y={607} size={31}>出现过度赞同的表现</Text>
          <circle cx="270" cy="714" r="9" fill={COLORS.gold} />
          <Label x={314} y={721}>04.28 / 开始回滚</Label>
          <Text x={670} y={721} size={31}>官方着手撤回更新</Text>
          <Path d="M270 486 V714" progress={p(frame, 20, 114)} color={COLORS.line} width={2} />
        </g>
      );
    }
    case "factorConfluence":
      return (
        <g>
          <Path d="M122 234 C530 234 598 390 875 510" progress={p(frame, 10, 76)} color={COLORS.line} width={3} />
          <Path d="M122 520 H875" progress={p(frame, 20, 86)} color={COLORS.line} width={3} />
          <Path d="M122 806 C530 806 598 650 875 530" progress={p(frame, 30, 96)} color={COLORS.line} width={3} />
          <Label x={140} y={205}>用户反馈</Label>
          <Label x={140} y={490}>记忆</Label>
          <Label x={140} y={776}>较新数据</Label>
          <circle cx="910" cy="520" r="18" fill={COLORS.gold} />
          <Path d="M910 520 C1120 520 1230 520 1390 520" progress={p(frame, 70, 123)} width={3} />
          <circle cx="1500" cy="520" r="146" fill="rgba(197,165,116,0.025)" stroke={COLORS.gold} strokeWidth="2" />
          <Text x={1500} y={503} size={39} anchor="middle">共同作用</Text>
          <Text x={1500} y={558} size={26} color={COLORS.muted} anchor="middle">官方复盘中的判断</Text>
        </g>
      );
    case "rollbackTimeline": {
      const camera = interpolate(frame, [0, d], [0, -90], clamp);
      return (
        <g transform={`translate(${camera} 0)`}>
          <Path d="M120 512 H1800" progress={p(frame, 8, 78)} width={3} />
          <path d="M120 446 H390" fill="none" stroke={COLORS.danger} strokeWidth="2" strokeDasharray="5 10" />
          <Label x={120} y={406}>专门部署评测当时未覆盖</Label>
          {[
            { x: 485, date: "04.28", title: "开始回滚" },
            { x: 1000, date: "04.29", title: "初次说明" },
            { x: 1515, date: "05.02", title: "深入复盘" },
          ].map((item, i) => {
            const on = p(frame, 18 + i * 22, 34 + i * 22);
            return (
              <g key={item.date} opacity={on}>
                <circle cx={item.x} cy="512" r="15" fill={COLORS.background} stroke={COLORS.gold} strokeWidth="4" />
                <line x1={item.x} y1="528" x2={item.x} y2="638" stroke={COLORS.line} strokeWidth="2" />
                <Text x={item.x} y={710} size={36} color={COLORS.gold} family={TYPE.latin} anchor="middle">{item.date}</Text>
                <Text x={item.x} y={770} size={29} anchor="middle">{item.title}</Text>
              </g>
            );
          })}
          <circle cx={interpolate(frame, [0, d], [485, 1515], clamp)} cy="512" r="7" fill={COLORS.ivory} />
        </g>
      );
    }
    case "mirrorRoom":
      return (
        <g>
          <circle cx="960" cy="510" r="390" fill="none" stroke={COLORS.line} strokeWidth="2" />
          <circle cx="960" cy="510" r="350" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p(frame, 8, 98)} />
          <path d="M960 165 V855" stroke={COLORS.line} strokeWidth="2" />
          <path d="M960 170 C750 320 750 700 960 850" fill="rgba(197,165,116,0.025)" stroke="none" />
          <path d="M960 170 C1170 320 1170 700 960 850" fill="rgba(232,224,209,0.01)" stroke="none" />
          <Text x={840} y={526} size={52} anchor="middle">被理解</Text>
          <Text x={1092} y={526} size={52} anchor="middle" color={COLORS.muted}>被理解</Text>
          <line x1="840" y1="563" x2="965" y2="563" stroke={COLORS.gold} strokeWidth="2" />
          <Label x={960} y={222} anchor="middle">心理隐喻</Label>
        </g>
      );
    case "studyField": {
      const points = Array.from({ length: 11 }, (_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 11;
        return { x: 960 + Math.cos(a) * 400, y: 495 + Math.sin(a) * 330, i };
      });
      return (
        <g>
          {points.map(({ x, y, i }) => {
            const r = interpolate(frame, [9 + i * 4, 20 + i * 4], [0, 18], clamp);
            return <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={COLORS.gold} strokeWidth="2" />;
          })}
          <circle cx="960" cy="478" r="190" fill={COLORS.background} stroke={COLORS.line} strokeWidth="1" opacity="0.97" />
          <Text x={960} y={350} size={30} color={COLORS.ivory} anchor="middle">特定人际建议任务</Text>
          <Text x={960} y={480} size={108} color={COLORS.gold} family={TYPE.latin} anchor="middle">49%</Text>
          <Text x={960} y={548} size={28} color={COLORS.ivory} anchor="middle">模型肯定用户行为频率比人类高</Text>
          <Text x={960} y={612} size={26} color={COLORS.ivory} family={TYPE.sans} anchor="middle">11 个模型 · Cheng 等 · Science · 2026</Text>
        </g>
      );
    }
    case "judgmentGauge": {
      const pointX = interpolate(frame, [16, d - 24], [610, 1110], { ...clamp, easing: ease });
      const direction = p(frame, 12, d - 20);
      return (
        <g>
          <Text x={960} y={252} size={30} color={COLORS.gold} anchor="middle">实验中的判断变化</Text>
          <Text x={350} y={520} size={31} anchor="middle">接触谄媚式回答</Text>
          <Path d="M590 520 H1270" progress={direction} color={COLORS.gold} width={4} />
          <path d="M1234 497 L1272 520 L1234 543" fill="none" stroke={COLORS.gold} strokeWidth="4" opacity={direction} />
          <circle cx={pointX} cy="520" r="10" fill={COLORS.ivory} />
          <path d="M1320 420 H1730 V620 H1320" fill="none" stroke={COLORS.line} strokeWidth="2" />
          <Text x={1525} y={500} size={37} anchor="middle">更确信自己正确</Text>
          <Text x={1525} y={548} size={27} color={COLORS.muted} anchor="middle">参与者自我判断</Text>
        </g>
      );
    }
    case "echoChamber": {
      const response = p(frame, 14, 40);
      const branchA = p(frame, 54, 92);
      const branchB = p(frame, 74, 112);
      return (
        <g>
          <Text x={960} y={186} size={28} color={COLORS.gold} anchor="middle">一轮回答之后</Text>
          <path d="M620 250 H1300 V448 H620Z" fill="rgba(197,165,116,0.018)" stroke={COLORS.line} strokeWidth="2" opacity={response} />
          <Text x={960} y={322} size={26} color={COLORS.muted} anchor="middle" opacity={response}>谄媚式回答</Text>
          <Text x={960} y={392} size={43} anchor="middle" opacity={response}>你说得对。</Text>
          <Path d="M960 448 V520 C960 562 600 542 600 610" progress={branchA} color={COLORS.gold} width={3} />
          <Path d="M960 520 C960 562 1320 542 1320 610" progress={branchB} color={COLORS.line} width={3} />
          <circle cx="960" cy="520" r="9" fill={COLORS.gold} opacity={Math.max(branchA, branchB)} />
          <path d="M170 630 H850 L910 690 V820 H170Z" fill="rgba(232,224,209,0.012)" stroke={COLORS.line} strokeWidth="2" opacity={branchA} />
          <path d="M1010 690 L1070 630 H1750 V820 H1010Z" fill="rgba(197,165,116,0.018)" stroke={COLORS.gold} strokeWidth="2" opacity={branchB} />
          <Text x={540} y={736} size={34} anchor="middle" opacity={branchA}>更确信自己正确</Text>
          <Text x={1380} y={736} size={32} anchor="middle" opacity={branchB}>较不愿修复冲突</Text>
          <Text x={960} y={848} size={26} color={COLORS.ivory} family={TYPE.sans} anchor="middle">三项预注册实验 · N=2,405</Text>
        </g>
      );
    }
    case "promptCloseup": {
      const cursor = interpolate(frame, [12, 88], [500, 1472], clamp);
      return (
        <g>
          <path d="M154 272 H1766" stroke={COLORS.line} strokeWidth="2" />
          <Label x={160} y={232}>结论式提问</Label>
          <rect x="158" y="320" width="1604" height="382" fill="rgba(232,224,209,0.01)" stroke={COLORS.line} strokeWidth="2" />
          <Text x={250} y={528} size={64}>我这个想法很好，对吧？</Text>
          <line x1={cursor} y1="564" x2={cursor} y2="630" stroke={COLORS.gold} strokeWidth="3" opacity={p(frame, 18, 34) * (1 - p(frame, 82, 118) * 0.6)} />
          <path d="M250 748 H1670" stroke={COLORS.gold} strokeWidth="2" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p(frame, 52, 102)} />
          <Text x={960} y={642} size={25} color={COLORS.muted} anchor="middle">把想要的答案，藏进了问题里。</Text>
        </g>
      );
    }
    case "challengeNotes": {
      const rows = [
        { y: 304, label: "找出最薄弱的三个前提" },
        { y: 500, label: "寻找反面证据" },
        { y: 696, label: "什么情况会证明我错？" },
      ];
      return (
        <g transform={`rotate(-1.2 960 540)`}>
          <path d="M210 190 H1710 V836 H210Z" fill="rgba(232,224,209,0.012)" stroke={COLORS.line} strokeWidth="2" />
          {rows.map((row, i) => {
            const on = p(frame, 15 + i * 28, 35 + i * 28);
            return (
              <g key={row.label} opacity={on}>
                <circle cx="314" cy={row.y - 14} r="22" fill="none" stroke={COLORS.gold} strokeWidth="2" />
                <path d={`M302 ${row.y - 13} L311 ${row.y - 3} L329 ${row.y - 27}`} fill="none" stroke={COLORS.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - on} />
                <Text x={376} y={row.y} size={37}>{row.label}</Text>
                <line x1="376" y1={row.y + 44} x2="1588" y2={row.y + 44} stroke={COLORS.line} strokeWidth="1" />
              </g>
            );
          })}
        </g>
      );
    }
    case "stanceSwap": {
      const swap = p(frame, 38, 103);
      const leftX = interpolate(frame, [38, 103], [430, 1490], { ...clamp, easing: ease });
      const rightX = interpolate(frame, [38, 103], [1490, 430], { ...clamp, easing: ease });
      const lane = Math.sin(Math.PI * swap) * 92;
      return (
        <g>
          <line x1="960" y1="140" x2="960" y2="800" stroke={COLORS.line} strokeWidth="2" />
          <path d="M300 255 H770 M300 255 V718 M1620 255 H1150 M1620 255 V718" fill="none" stroke={COLORS.line} strokeWidth="2" />
          <Text x={540} y={330} size={26} color={COLORS.muted} anchor="middle">立场 A</Text>
          <Text x={1380} y={330} size={26} color={COLORS.gold} anchor="middle">立场 B</Text>
          <Text x={leftX} y={410 - lane} size={50} anchor="middle">我认为 A</Text>
          <Text x={rightX} y={410 + lane} size={50} color={COLORS.gold} anchor="middle">如果 B 呢？</Text>
          <Path d="M490 548 H1430" progress={p(frame, 22, 62)} color={COLORS.ivory} width={2} />
          <circle cx="960" cy="548" r="11" fill={COLORS.gold} />
          <Text x={960} y={678} size={26} color={COLORS.ivory} anchor="middle">证据保持不变 · 观察答案是否随立场改变</Text>
        </g>
      );
    }
    case "cautionCard": {
      const pathProgress = p(frame, 12, 104);
      const evidenceProgress = p(frame, 42, 78);
      const judgmentProgress = p(frame, 82, 128);
      const markerX = interpolate(frame, [20, 58, 98, 136], [360, 960, 960, 1560], {
        ...clamp,
        easing: ease,
      });
      return (
        <g>
          <Text x={960} y={216} size={46} anchor="middle">把结论带回证据里</Text>
          <Path d="M360 530 H1560" progress={pathProgress} color={COLORS.line} width={3} />
          <Path d="M360 530 H960 M960 530 H1560" progress={pathProgress} color={COLORS.gold} width={2} />
          {[
            { x: 360, label: "模型回答", detail: "先听见一个结论", reveal: pathProgress },
            { x: 960, label: "反面证据", detail: "寻找能推翻它的事实", reveal: evidenceProgress },
            { x: 1560, label: "重新判断", detail: "让结论经受检验", reveal: judgmentProgress },
          ].map((node) => (
            <g key={node.label} opacity={node.reveal}>
              <circle cx={node.x} cy="530" r="32" fill={COLORS.background} stroke={node.x === 960 ? COLORS.gold : COLORS.line} strokeWidth="3" />
              <circle cx={node.x} cy="530" r="8" fill={COLORS.gold} />
              <Text x={node.x} y={650} size={34} anchor="middle" color={node.x === 960 ? COLORS.gold : COLORS.ivory}>{node.label}</Text>
              <Text x={node.x} y={706} size={23} anchor="middle" color={COLORS.muted}>{node.detail}</Text>
            </g>
          ))}
          <circle cx={markerX} cy="530" r="9" fill={COLORS.ivory} opacity={pathProgress} />
        </g>
      );
    }
    case "motifReturn": {
      const shrink = interpolate(frame, [0, d - 14], [1.25, 0.92], { ...clamp, easing: ease });
      const traces = 1 - p(frame, 46, 78);
      return (
        <g>
          <g opacity={traces}>
            <Path d="M140 248 C430 380 560 580 960 540 S1460 680 1780 820" progress={p(frame, 8, 78)} color={COLORS.line} width={2} />
            <Path d="M160 836 C530 770 690 490 960 540 S1440 310 1760 228" progress={p(frame, 18, 76)} width={2} />
          </g>
          <circle cx="960" cy="540" r="12" fill={COLORS.gold} />
          <g transform={`translate(960 540) scale(${shrink}) translate(-960 -540)`}>
            <Clock frame={frame} duration={d} x={960} y={540} r={345} opacity={0.78} />
          </g>
        </g>
      );
    }
    case "dilemmaStage": {
      const close = p(frame, 42, 102);
      return (
        <g>
          <path d="M960 168 A372 372 0 0 0 960 910" fill="none" stroke={COLORS.gold} strokeWidth="3" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p(frame, 0, 88)} />
          <path d="M960 168 A372 372 0 0 1 960 910" fill="none" stroke={COLORS.line} strokeWidth="3" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p(frame, 12, 100)} />
          <line x1="960" y1="256" x2="960" y2="838" stroke={COLORS.line} strokeWidth="1" opacity={1 - close * 0.6} />
          <circle cx="960" cy="540" r="12" fill={COLORS.gold} opacity={p(frame, 92, 130)} />
        </g>
      );
    }
    case "finalQuestion":
      return (
        <g>
          <path d="M640 250 A420 420 0 0 0 640 830" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p(frame, 10, 62)} />
          <path d="M1280 250 A420 420 0 0 1 1280 830" fill="none" stroke={COLORS.line} strokeWidth="2" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - p(frame, 28, 82)} />
          <circle cx="960" cy="540" r="7" fill={COLORS.gold} opacity={1 - p(frame, d - 100, d - 68) * 0.55} />
          <line x1="720" y1="700" x2="1200" y2="700" stroke={COLORS.line} strokeWidth="1" opacity={p(frame, 26, 62)} />
        </g>
      );
    default:
      return null;
  }
};

const cameraFor = (layout: VisualLayout, frame: number, duration: number) => {
  switch (layout) {
    case "clockCloseup":
      return { scale: interpolate(frame, [0, duration], [1.14, 1.09], clamp), x: -25, y: 8 };
    case "pathTurn":
      return { scale: interpolate(frame, [0, duration], [1.02, 1.07], clamp), x: 0, y: -4 };
    case "yearMonument":
      return { scale: interpolate(frame, [0, duration], [0.96, 1.04], clamp), x: 0, y: 4 };
    case "rollbackTimeline":
      return { scale: interpolate(frame, [0, duration], [1, 1.035], clamp), x: 0, y: 0 };
    case "echoChamber":
      return { scale: interpolate(frame, [0, duration], [1.035, 0.965], clamp), x: 0, y: 0 };
    case "finalQuestion":
      return { scale: interpolate(frame, [0, duration * 0.5], [1.035, 1], clamp), x: 0, y: 0 };
    case "quietType":
    case "studyField":
    case "promptCloseup":
      return { scale: interpolate(frame, [0, duration], [1.045, 1.015], clamp), x: 0, y: 0 };
    case "evidenceRuler":
    case "challengeNotes":
      return {
        scale: 1.025,
        x: interpolate(frame, [0, duration], [-18, 18], clamp),
        y: 0,
      };
    case "definitionReveal":
    case "feedbackSequence":
    case "stanceSwap":
      return { scale: interpolate(frame, [0, duration], [0.99, 1.035], clamp), x: 0, y: 0 };
    case "contextResponse":
    case "preferenceBalance":
    case "judgmentGauge":
      return { scale: interpolate(frame, [0, duration], [1.035, 0.99], clamp), x: 0, y: 0 };
    case "splitVerdict":
    case "mirrorRoom":
      return { scale: interpolate(frame, [0, duration], [1.02, 1.055], clamp), x: 0, y: -3 };
    case "questionFork":
    case "causalBranches":
    case "cautionCard":
      return { scale: interpolate(frame, [0, duration], [1.04, 0.995], clamp), x: 0, y: 0 };
    case "archiveSheet":
    case "factorConfluence":
      return { scale: interpolate(frame, [0, duration], [1.015, 1.045], clamp), x: 0, y: 0 };
    default:
      return { scale: interpolate(frame, [0, duration], [1, 1.018], clamp), x: 0, y: 0 };
  }
};

const HandoffTrace: React.FC<{ sceneId: string; frame: number; duration: number }> = ({
  sceneId,
  frame,
  duration,
}) => {
  const bridgeB = "M528 790 C450 690 355 570 270 486";
  if (sceneId === "S12") {
    const progress = p(frame, duration - 18, duration - 1);
    const x = interpolate(frame, [duration - 18, duration - 1], [1370, 960], clamp);
    const y = interpolate(frame, [duration - 18, duration - 1], [830, 485], clamp);
    return (
      <g opacity={progress}>
        <circle cx={x} cy={y} r="6" fill={COLORS.gold} />
      </g>
    );
  }
  if (sceneId === "S13") {
    const opacity = 1 - p(frame, 0, 24);
    return (
      <g opacity={opacity}>
        <circle cx="960" cy="485" r="6" fill={COLORS.gold} />
      </g>
    );
  }
  if (sceneId === "S14") {
    const progress = p(frame, duration - 18, duration - 1);
    const x = interpolate(frame, [duration - 18, duration - 1], [528, 270], clamp);
    const y = interpolate(frame, [duration - 18, duration - 1], [790, 486], clamp);
    return (
      <g opacity={progress}>
        <Path d={bridgeB} progress={progress} color={COLORS.gold} width={3} />
        <circle cx={x} cy={y} r="8" fill={COLORS.ivory} />
      </g>
    );
  }
  if (sceneId === "S15") {
    const opacity = 1 - p(frame, 0, 24);
    return (
      <g opacity={opacity}>
        <Path d={bridgeB} progress={1} color={COLORS.gold} width={3} />
        <circle cx="270" cy="486" r="8" fill={COLORS.ivory} />
      </g>
    );
  }
  return null;
};

export const VisualStage: React.FC<Props> = ({ scene, frame }) => {
  const motionDuration = scene.motionReferenceMs * 0.03;
  const camera = cameraFor(scene.layout, frame, motionDuration);
  return (
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
        transformOrigin: "50% 50%",
      }}
    >
      <HandoffTrace sceneId={scene.id} frame={frame} duration={motionDuration} />
      {renderLayout(scene.layout, scene, frame)}
    </svg>
  );
};
