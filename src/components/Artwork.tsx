import React from "react";
import { interpolate } from "remotion";
import type { SceneDefinition, VisualKind } from "../data/scenes";
import { clamp, reveal, smooth } from "../animation/motion";
import { COLORS, TYPE } from "../styles/tokens";

type Props = {
  scene: SceneDefinition;
  frame: number;
};

const serif: Pick<React.CSSProperties, "fontFamily"> = { fontFamily: TYPE.serif };
const hairline = { stroke: COLORS.line, strokeWidth: 2, fill: "none" };
const goldline = { stroke: COLORS.gold, strokeWidth: 2, fill: "none" };

const GuideLabel: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({
  x,
  y,
  children,
}) => (
  <text
    x={x}
    y={y}
    fill={COLORS.muted}
    fontFamily={TYPE.sans}
    fontSize={18}
    letterSpacing={2}
  >
    {children}
  </text>
);

const ClockFace: React.FC<{ frame: number; duration: number }> = ({
  frame,
  duration,
}) => {
  const hand = interpolate(frame, [0, duration], [-22, 14], clamp);
  return (
    <g>
      <circle cx="360" cy="300" r="170" {...hairline} />
      <circle cx="360" cy="300" r="153" {...goldline} opacity={0.72} />
      {Array.from({ length: 12 }, (_, index) => (
        <line
          key={index}
          x1="360"
          y1="144"
          x2="360"
          y2={index % 3 === 0 ? 164 : 154}
          stroke={index % 3 === 0 ? COLORS.gold : COLORS.line}
          strokeWidth={index % 3 === 0 ? 3 : 2}
          transform={"rotate(" + index * 30 + " 360 300)"}
        />
      ))}
      <path d="M255 143 Q258 95 299 123 L322 145" {...hairline} />
      <path d="M465 143 Q462 95 421 123 L398 145" {...hairline} />
      <line
        x1="360"
        y1="300"
        x2="360"
        y2="203"
        stroke={COLORS.ivory}
        strokeWidth="5"
        strokeLinecap="round"
        transform={"rotate(" + hand + " 360 300)"}
      />
      <line
        x1="360"
        y1="300"
        x2="425"
        y2="338"
        stroke={COLORS.gold}
        strokeWidth="4"
        strokeLinecap="round"
        transform={"rotate(" + hand * -0.7 + " 360 300)"}
      />
      <circle cx="360" cy="300" r="7" fill={COLORS.gold} />
      <GuideLabel x={303} y={525}>
        早晨 · 07:00
      </GuideLabel>
    </g>
  );
};

const OutlineCard: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  accent?: boolean;
}> = ({ x, y, width, height, title, accent }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx="4"
      fill={accent ? "rgba(197,165,116,0.035)" : "rgba(232,224,209,0.015)"}
      stroke={accent ? COLORS.gold : COLORS.line}
      strokeWidth="2"
    />
    <line
      x1={x + 24}
      y1={y + 32}
      x2={x + width - 24}
      y2={y + 32}
      stroke={accent ? COLORS.gold : COLORS.line}
      strokeWidth="2"
      opacity="0.8"
    />
    <text
      x={x + 24}
      y={y + 76}
      fill={accent ? COLORS.ivory : COLORS.muted}
      fontSize="26"
      {...serif}
    >
      {title}
    </text>
  </g>
);

const draw = (
  kind: VisualKind,
  frame: number,
  duration: number,
): React.ReactNode => {
  const p = reveal(frame, 8, 28);
  const dash = 920 * (1 - p);
  switch (kind) {
    case "clock":
    case "return":
    case "end":
      return <ClockFace frame={frame} duration={duration} />;
    case "dialogue":
      return (
        <g>
          <path d="M86 152 H488 Q514 152 514 178 V278 Q514 304 488 304 H240 L178 353 V304 H86 Q60 304 60 278 V178 Q60 152 86 152Z" {...hairline} />
          <path d="M268 286 H610 Q636 286 636 312 V410 Q636 436 610 436 H520 L465 476 V436 H268 Q242 436 242 410 V312 Q242 286 268 286Z" {...goldline} />
          <text x="325" y="370" fill={COLORS.ivory} fontSize="36" {...serif}>
            保护边界
          </text>
          <circle cx="536" cy="236" r="22" {...goldline} />
          <line x1="536" y1="224" x2="536" y2="248" {...goldline} />
          <line x1="524" y1="236" x2="548" y2="236" {...goldline} />
        </g>
      );
    case "turn":
      return (
        <g>
          <circle cx="130" cy="305" r="46" {...hairline} />
          <path d="M130 259 V210 M130 351 V400" {...hairline} />
          <path d="M130 210 C270 210 292 385 430 385 C500 385 532 340 548 286" {...goldline} strokeDasharray="920" strokeDashoffset={dash} />
          <path d="M526 294 L550 280 L558 309" {...goldline} />
          <circle cx="570" cy="250" r="12" fill={COLORS.gold} />
          <GuideLabel x={78} y={486}>
            闹钟
          </GuideLabel>
          <GuideLabel x={492} y={486}>
            回答转弯
          </GuideLabel>
        </g>
      );
    case "gentle":
      return (
        <g>
          <path d="M360 115 C278 205 258 276 360 378 C462 276 442 205 360 115Z" {...goldline} />
          <path d="M360 150 V381 M280 240 Q360 270 440 240 M302 316 Q360 330 418 316" {...hairline} />
          <circle cx="360" cy="408" r="6" fill={COLORS.gold} />
          <GuideLabel x={289} y={478}>
            语气 ≠ 立场
          </GuideLabel>
        </g>
      );
    case "contrast":
      return (
        <g>
          <line x1="350" y1="118" x2="350" y2="506" {...hairline} />
          <GuideLabel x={122} y={145}>
            表达理解
          </GuideLabel>
          <GuideLabel x={414} y={145}>
            替事实下结论
          </GuideLabel>
          <OutlineCard x={88} y={194} width={236} height={142} title="我理解你很生气" />
          <OutlineCard x={378} y={194} width={252} height={142} title="你完全正确" accent />
          <path d="M102 396 H302" {...hairline} />
          <path d="M392 396 H610" stroke={COLORS.danger} strokeWidth="2" />
          <text x="394" y="440" fill={COLORS.danger} fontSize="20" fontFamily={TYPE.sans}>
            结论缺少证据
          </text>
        </g>
      );
    case "belief":
      return (
        <g>
          <text x="110" y="220" fill={COLORS.muted} fontSize="22" fontFamily={TYPE.sans}>
            用户立场
          </text>
          <text x="460" y="220" fill={COLORS.ivory} fontSize="22" fontFamily={TYPE.sans}>
            可核对的事实
          </text>
          <rect x="86" y="250" width="220" height="170" rx="4" {...hairline} />
          <rect x="394" y="250" width="220" height="170" rx="4" {...goldline} />
          <text x="140" y="347" fill={COLORS.ivory} fontSize="34" {...serif}>
            我觉得
          </text>
          <text x="445" y="347" fill={COLORS.gold} fontSize="34" {...serif}>
            证据呢？
          </text>
          <path d="M308 335 H388" stroke={COLORS.danger} strokeWidth="2" strokeDasharray="8 8" />
          <GuideLabel x={245} y={475}>
            不能省略验证
          </GuideLabel>
        </g>
      );
    case "equation":
      return (
        <g>
          <circle cx="350" cy="300" r="178" {...hairline} />
          <path d="M218 300 H480" {...goldline} />
          <circle cx="350" cy="300" r="145" stroke={COLORS.gold} strokeWidth="1" fill="none" opacity="0.35" />
          <GuideLabel x={283} y={510}>
            观点与事实之间
          </GuideLabel>
        </g>
      );
    case "definition":
      return (
        <g>
          <path d="M85 170 H615 M85 340 H615 M85 510 H615" {...hairline} />
          <text x="106" y="260" fill={COLORS.muted} fontSize="26" fontFamily={TYPE.sans}>
            用户的信念
          </text>
          <path d="M300 250 C400 250 398 420 510 420" {...goldline} strokeDasharray="920" strokeDashoffset={dash} />
          <text x="386" y="475" fill={COLORS.ivory} fontSize="30" {...serif}>
            回答的方向
          </text>
          <path d="M104 458 H300" stroke={COLORS.danger} strokeWidth="2" />
          <GuideLabel x={105} y={493}>
            准确性需要保留
          </GuideLabel>
        </g>
      );
    case "fork":
      return (
        <g>
          <rect x="190" y="106" width="320" height="86" rx="4" {...hairline} />
          <text x="270" y="160" fill={COLORS.ivory} fontSize="25" {...serif}>
            同一个问题
          </text>
          <path d="M350 194 V278 M350 278 L160 366 M350 278 L540 366" {...goldline} strokeDasharray="920" strokeDashoffset={dash} />
          <OutlineCard x={42} y={365} width={262} height={112} title="检查证据" />
          <OutlineCard x={396} y={365} width={262} height={112} title="顺着立场" accent />
          <circle cx="350" cy="278" r="10" fill={COLORS.gold} />
        </g>
      );
    case "answers":
      return (
        <g>
          <OutlineCard x={50} y={178} width={278} height={188} title="答案 A" />
          <OutlineCard x={372} y={178} width={278} height={188} title="答案 B" accent />
          <text x="95" y="285" fill={COLORS.ivory} fontSize="26" {...serif}>
            也许只是按设定响
          </text>
          <text x="417" y="285" fill={COLORS.gold} fontSize="26" {...serif}>
            你完全正确
          </text>
          <path d="M188 432 H500" {...hairline} />
          <circle cx="496" cy="432" r="14" fill={COLORS.gold} />
          <GuideLabel x={254} y={487}>
            比较 · 选择 · 反馈
          </GuideLabel>
        </g>
      );
    case "scale":
      return (
        <g>
          <path d="M360 158 V430 M255 430 H465 M245 190 H475" {...hairline} />
          <circle cx="360" cy="190" r="18" fill={COLORS.gold} />
          <path d="M255 190 L190 332 H320 Z M475 190 L410 332 H540 Z" {...goldline} />
          <line x1="180" y1="332" x2="330" y2="332" {...goldline} />
          <line x1="400" y1="332" x2="550" y2="332" {...goldline} />
          <circle cx={interpolate(frame, [20, duration - 12], [278, 442], clamp)} cy="305" r="10" fill={COLORS.gold} />
          <GuideLabel x={235} y={486}>
            偏好是一种信号
          </GuideLabel>
        </g>
      );
    case "feedback":
      return (
        <g>
          <circle cx="350" cy="300" r="174" stroke={COLORS.line} strokeWidth="2" fill="none" />
          <circle cx="350" cy="300" r="174" stroke={COLORS.gold} strokeWidth="2" fill="none" strokeDasharray="920" strokeDashoffset={920 * (1 - p)} transform="rotate(-90 350 300)" />
          <path d="M470 173 L500 186 L480 208" {...goldline} />
          <circle cx="350" cy="126" r="18" fill={COLORS.gold} />
          <circle cx="500" cy="387" r="18" fill={COLORS.background} stroke={COLORS.gold} strokeWidth="3" />
          <circle cx="200" cy="387" r="18" fill={COLORS.background} stroke={COLORS.ivory} strokeWidth="3" />
          <text x="305" y="245" fill={COLORS.muted} fontSize="22" fontFamily={TYPE.sans}>
            评价
          </text>
          <text x="282" y="314" fill={COLORS.ivory} fontSize="32" {...serif}>
            调整倾向
          </text>
          <GuideLabel x={268} y={530}>
            简化反馈关系示意
          </GuideLabel>
        </g>
      );
    case "boundary":
      return (
        <g>
          <circle cx="350" cy="300" r="170" {...hairline} />
          <circle cx="350" cy="300" r="122" {...goldline} />
          <text x="284" y="309" fill={COLORS.gold} fontSize="32" {...serif}>
            可能
          </text>
          <path d="M350 118 V190 M532 300 H462 M350 482 V410 M168 300 H238" {...hairline} />
          <GuideLabel x={300} y={92}>
            数据
          </GuideLabel>
          <GuideLabel x={544} y={307}>
            指令
          </GuideLabel>
          <GuideLabel x={294} y={520}>
            评测
          </GuideLabel>
          <GuideLabel x={70} y={307}>
            场景
          </GuideLabel>
          <line x1="216" y1="435" x2="484" y2="165" stroke={COLORS.danger} strokeWidth="2" opacity="0.78" />
        </g>
      );
    case "year":
      return (
        <g>
          <path d="M74 416 H646" stroke={COLORS.gold} strokeWidth="2" strokeDasharray="920" strokeDashoffset={dash} />
          <circle cx="180" cy="416" r="8" fill={COLORS.gold} />
          <GuideLabel x={100} y={470}>
            04
          </GuideLabel>
          <GuideLabel x={586} y={470}>
            05
          </GuideLabel>
          <path d="M180 390 V442" {...goldline} />
        </g>
      );
    case "archive":
      return (
        <g>
          <rect x="100" y="140" width="520" height="350" fill="none" stroke={COLORS.line} strokeWidth="2" />
          <GuideLabel x={130} y={188}>
            更新记录
          </GuideLabel>
          <text x="130" y="278" fill={COLORS.ivory} fontSize="42" {...serif}>
            GPT-4o
          </text>
          <path d="M130 313 H574 M130 355 H530 M130 397 H590" {...hairline} />
          <path d="M130 444 H410" stroke={COLORS.danger} strokeWidth="2" />
          <text x="130" y="474" fill={COLORS.danger} fontSize="21" fontFamily={TYPE.sans}>
            用户报告：回答过度赞同
          </text>
          <circle cx={interpolate(frame, [10, duration - 10], [130, 570], clamp)} cy="313" r="6" fill={COLORS.gold} />
        </g>
      );
    case "factors":
      return (
        <g>
          <OutlineCard x={42} y={118} width={240} height={92} title="用户反馈" />
          <OutlineCard x={42} y={254} width={240} height={92} title="记忆" />
          <OutlineCard x={42} y={390} width={240} height={92} title="较新数据" />
          <path d="M282 164 H380 Q422 164 422 300 V300 H468 M282 300 H468 M282 436 H380 Q422 436 422 300" {...goldline} strokeDasharray="920" strokeDashoffset={dash} />
          <circle cx="476" cy="300" r="10" fill={COLORS.gold} />
          <rect x="492" y="250" width="154" height="100" rx="4" {...hairline} />
          <text x="518" y="309" fill={COLORS.ivory} fontSize="25" {...serif}>
            可能共同
          </text>
          <GuideLabel x={270} y={526}>
            官方早期判断 · 不等于单一确定原因
          </GuideLabel>
        </g>
      );
    case "timeline":
      return (
        <g>
          <path d="M72 302 H646" stroke={COLORS.gold} strokeWidth="2" strokeDasharray="920" strokeDashoffset={dash} />
          {[
            { x: 128, date: "04.28", title: "开始回滚" },
            { x: 350, date: "04.29", title: "初次说明" },
            { x: 572, date: "05.02", title: "深入复盘" },
          ].map((item) => (
            <g key={item.date}>
              <circle cx={item.x} cy="302" r="10" fill={COLORS.background} stroke={COLORS.gold} strokeWidth="3" />
              <line x1={item.x} y1="313" x2={item.x} y2="372" {...hairline} />
              <text x={item.x - 44} y="416" fill={COLORS.gold} fontSize="24" fontFamily={TYPE.latin}>
                {item.date}
              </text>
              <text x={item.x - 44} y="458" fill={COLORS.ivory} fontSize="20" fontFamily={TYPE.sans}>
                {item.title}
              </text>
            </g>
          ))}
          <path d="M72 226 H128 V280" stroke={COLORS.danger} strokeWidth="2" fill="none" strokeDasharray="6 7" />
          <GuideLabel x={72} y={202}>
            专门部署评测缺席
          </GuideLabel>
        </g>
      );
    case "mirror":
      return (
        <g>
          <circle cx="350" cy="300" r="170" {...goldline} />
          <circle cx="350" cy="300" r="138" {...hairline} />
          <path d="M350 132 V468" stroke={COLORS.line} strokeWidth="2" />
          <path d="M266 230 Q350 190 434 230 M266 366 Q350 406 434 366" {...hairline} />
          <text x="275" y="309" fill={COLORS.ivory} fontSize="30" {...serif}>
            被理解
          </text>
          <text x="438" y="309" fill={COLORS.muted} fontSize="30" {...serif} opacity="0.65">
            被理解
          </text>
        </g>
      );
    case "study":
      return (
        <g>
          {Array.from({ length: 11 }, (_, index) => {
            const row = index < 6 ? 0 : 1;
            const column = index < 6 ? index : index - 6;
            const x = 134 + column * 88 + (row ? 44 : 0);
            const y = row ? 272 : 172;
            return (
              <g key={index}>
                <circle cx={x} cy={y} r="23" fill="none" stroke={COLORS.line} strokeWidth="2" />
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill={COLORS.gold}
                  opacity={reveal(frame, 8 + index * 3, 12)}
                />
              </g>
            );
          })}
          <path d="M142 382 H566" {...hairline} />
          <text x="175" y="442" fill={COLORS.muted} fontSize="24" fontFamily={TYPE.sans}>
            人际建议 · 肯定用户频率比较
          </text>
          <GuideLabel x={210} y={496}>
            Cheng et al. · Science · 2026
          </GuideLabel>
        </g>
      );
    case "needle":
      return (
        <g>
          <path d="M155 410 A205 205 0 0 1 565 410" {...hairline} />
          {Array.from({ length: 9 }, (_, index) => (
            <line
              key={index}
              x1="360"
              y1="205"
              x2="360"
              y2="224"
              stroke={COLORS.line}
              strokeWidth="2"
              transform={"rotate(" + (index * 22.5 - 90) + " 360 410)"}
            />
          ))}
          <line
            x1="360"
            y1="410"
            x2="475"
            y2="290"
            stroke={COLORS.gold}
            strokeWidth="4"
            strokeLinecap="round"
            transform={"rotate(" + interpolate(frame, [16, duration - 12], [0, 14], clamp) + " 360 410)"}
          />
          <circle cx="360" cy="410" r="11" fill={COLORS.gold} />
          <GuideLabel x={138} y={468}>
            重新检查
          </GuideLabel>
          <GuideLabel x={498} y={468}>
            自我确信
          </GuideLabel>
        </g>
      );
    case "echo":
      return (
        <g>
          {[0, 1, 2, 3].map((index) => {
            const radius = 82 + index * 60;
            const opacity = 0.9 - index * 0.15;
            return (
              <g key={index} opacity={opacity}>
                <ellipse
                  cx="350"
                  cy="300"
                  rx={radius + 38}
                  ry={radius}
                  transform={"rotate(" + index * 18 + " 350 300)"}
                  fill="none"
                  stroke={index === 0 ? COLORS.gold : COLORS.line}
                  strokeWidth="2"
                />
                <text
                  x={350 + radius * 0.6}
                  y={300 - radius * 0.45}
                  fill={index === 0 ? COLORS.ivory : COLORS.muted}
                  fontSize={index === 0 ? 24 : 18}
                  {...serif}
                >
                  你说得对
                </text>
              </g>
            );
          })}
          <circle cx="350" cy="300" r="12" fill={COLORS.gold} />
          <GuideLabel x={235} y={535}>
            三项预注册实验 · N = 2,405
          </GuideLabel>
        </g>
      );
    case "question":
      return (
        <g>
          <path d="M110 180 H580 V397 H110Z" {...hairline} />
          <path d="M110 180 H580" {...goldline} />
          <text x="145" y="264" fill={COLORS.muted} fontSize="22" fontFamily={TYPE.sans}>
            结论式提问
          </text>
          <text x="145" y="344" fill={COLORS.ivory} fontSize="36" {...serif}>
            我这个想法很好？
          </text>
          <line x1="145" y1="372" x2={145 + 230 * p} y2="372" stroke={COLORS.gold} strokeWidth="2" />
          <circle cx="548" cy="228" r="17" fill="none" stroke={COLORS.gold} strokeWidth="2" />
          <text x="542" y="237" fill={COLORS.gold} fontSize="25" fontFamily={TYPE.latin}>
            ?
          </text>
        </g>
      );
    case "checklist":
      return (
        <g>
          {[
            { y: 160, label: "最薄弱的前提" },
            { y: 274, label: "反面证据" },
            { y: 388, label: "什么能证明我错？" },
          ].map((row, index) => (
            <g key={row.label}>
              <circle cx="146" cy={row.y} r="20" fill="none" stroke={COLORS.gold} strokeWidth="2" />
              <path
                d={"M136 " + row.y + " L144 " + (row.y + 8) + " L159 " + (row.y - 10)}
                fill="none"
                stroke={COLORS.gold}
                strokeWidth="2"
                strokeDasharray="50"
                strokeDashoffset={50 * (1 - reveal(frame, 12 + index * 20, 18))}
              />
              <text x="194" y={row.y + 10} fill={COLORS.ivory} fontSize="30" {...serif}>
                {row.label}
              </text>
              <line x1="194" y1={row.y + 42} x2="600" y2={row.y + 42} stroke={COLORS.line} strokeWidth="1" />
            </g>
          ))}
          <GuideLabel x={196} y={485}>
            把结论变成可检查的问题
          </GuideLabel>
        </g>
      );
    case "stances":
      return (
        <g>
          <OutlineCard x={64} y={164} width={256} height={208} title="立场 A" />
          <OutlineCard x={380} y={164} width={256} height={208} title="立场 B" accent />
          <text x="114" y="282" fill={COLORS.ivory} fontSize="28" {...serif}>
            我认为 A
          </text>
          <text x="426" y="282" fill={COLORS.gold} fontSize="28" {...serif}>
            如果 B 呢？
          </text>
          <path d="M320 268 H380" {...goldline} />
          <circle cx="350" cy="268" r="9" fill={COLORS.gold} />
          <GuideLabel x={180} y={450}>
            比较证据是否随立场改变
          </GuideLabel>
        </g>
      );
    case "limit":
      return (
        <g>
          <rect x="158" y="150" width="384" height="300" rx="4" {...hairline} />
          <text x="222" y="280" fill={COLORS.ivory} fontSize="38" {...serif}>
            邀请反证
          </text>
          <text x="319" y="350" fill={COLORS.gold} fontSize="40" {...serif}>
            不等于
          </text>
          <text x="248" y="410" fill={COLORS.ivory} fontSize="38" {...serif}>
            保证正确
          </text>
          <path d="M200 432 L500 168" stroke={COLORS.danger} strokeWidth="2" />
          <GuideLabel x={245} y={505}>
            重要结论仍需核验
          </GuideLabel>
        </g>
      );
    case "dilemma":
      return (
        <g>
          <path d="M350 142 A160 160 0 0 0 350 462" {...goldline} />
          <path d="M350 142 A160 160 0 0 1 350 462" {...hairline} />
          <circle cx="350" cy="302" r="10" fill={COLORS.gold} />
          <GuideLabel x={112} y={500}>
            判断
          </GuideLabel>
          <GuideLabel x={548} y={500}>
            回声
          </GuideLabel>
        </g>
      );
    default:
      return null;
  }
};

export const Artwork: React.FC<Props> = ({ scene, frame }) => {
  const entrance = reveal(frame, 0, 34);
  const settle = interpolate(frame, [0, 46, scene.durationFrames], [22, 0, -6], {
    ...clamp,
    easing: smooth,
  });
  return (
    <svg
      viewBox="0 0 700 620"
      role="img"
      aria-label={scene.label}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        overflow: "visible",
        transform: "translateY(" + settle + "px)",
        opacity: interpolate(entrance, [0, 1], [0.35, 1]),
      }}
    >
      <g>{draw(scene.visual, frame, scene.durationFrames)}</g>
    </svg>
  );
};
