// 豆包工作皮肤 CSS 模板（哨兵替换生成，内置主题与自定义主题同源）

export const CSS_SENTINELS = {
  id: "doubao-custom-sentinel-id",
  hero: "data:image/png;base64,DOUBAOHEROSENTINEL",
  accent: "#010203",
  surface: "#070809",
  text: "#0a0b0c",
  mixbase: "#000000",
};

export const CSS_TEMPLATE = `/* DOUBAO_SKIN:{ID} */
html[data-theme] {
  /* 品牌主色 */
  --s-color-brand-primary-default: {ACCENT} !important;
  --s-color-brand-primary-hover: color-mix(in srgb, {ACCENT} 88%, {MIXBASE}) !important;
  --s-color-brand-primary-pressed: color-mix(in srgb, {ACCENT} 76%, {MIXBASE}) !important;
  --s-color-brand-primary-disable: color-mix(in srgb, {ACCENT} 38%, transparent) !important;
  --s-color-brand-primary-transparent-1: color-mix(in srgb, {ACCENT} 8%, transparent) !important;
  --s-color-brand-primary-transparent-2: color-mix(in srgb, {ACCENT} 12%, transparent) !important;
  --s-color-brand-primary-transparent-3: color-mix(in srgb, {ACCENT} 18%, transparent) !important;

  /* Semi 主色 */
  --semi-color-primary: {ACCENT} !important;
  --semi-color-primary-hover: color-mix(in srgb, {ACCENT} 88%, {MIXBASE}) !important;
  --semi-color-primary-active: color-mix(in srgb, {ACCENT} 76%, {MIXBASE}) !important;
  --semi-color-primary-disabled: color-mix(in srgb, {ACCENT} 38%, transparent) !important;
  --semi-color-primary-light-default: color-mix(in srgb, {ACCENT} 14%, transparent) !important;
  --semi-color-primary-light-hover: color-mix(in srgb, {ACCENT} 20%, transparent) !important;
  --semi-color-primary-light-active: color-mix(in srgb, {ACCENT} 10%, transparent) !important;

  /* 背景色阶 */
  --semi-color-bg-0: {SURFACE} !important;
  --semi-color-bg-1: color-mix(in srgb, {SURFACE} 93%, {MIXBASE}) !important;
  --semi-color-bg-2: color-mix(in srgb, {SURFACE} 86%, {MIXBASE}) !important;
  --semi-color-bg-3: color-mix(in srgb, {SURFACE} 79%, {MIXBASE}) !important;
  --semi-color-bg-4: color-mix(in srgb, {SURFACE} 72%, {MIXBASE}) !important;
  --s-color-bg-body: {SURFACE} !important;
  --dbx-bg-body-launcher: {SURFACE} !important;
  --dbx-bg-body-white: {SURFACE} !important;
  --dbx-bg-body-overlay-launcher: color-mix(in srgb, {SURFACE} 92%, transparent) !important;
  --dbx-bg-float: color-mix(in srgb, {SURFACE} 93%, {MIXBASE}) !important;
  --dbx-bg-base-5: color-mix(in srgb, {SURFACE} 93%, {MIXBASE}) !important;
  --dbx-bg-mask: color-mix(in srgb, {MIXBASE} 50%, transparent) !important;

  /* 文字色阶 */
  --semi-color-text-0: {TEXT} !important;
  --semi-color-text-1: color-mix(in srgb, {TEXT} 86%, transparent) !important;
  --semi-color-text-2: color-mix(in srgb, {TEXT} 66%, transparent) !important;
  --semi-color-text-3: color-mix(in srgb, {TEXT} 45%, transparent) !important;
  --dbx-text-markdown: {TEXT} !important;
  --dbx-text-tertiary: color-mix(in srgb, {TEXT} 60%, transparent) !important;
  --dbx-text-disable: color-mix(in srgb, {TEXT} 30%, transparent) !important;

  /* 边框 / 填充 */
  --semi-color-border: color-mix(in srgb, {TEXT} 14%, transparent) !important;
  --semi-color-fill-0: color-mix(in srgb, {TEXT} 6%, transparent) !important;
  --semi-color-fill-1: color-mix(in srgb, {TEXT} 9%, transparent) !important;
  --semi-color-fill-2: color-mix(in srgb, {TEXT} 13%, transparent) !important;
}

/* 根背景 = 主题渐变（永远渲染）；body 透明防止盖层 */
html {
  background: {HERO_LAYER} !important;
}
body {
  background: transparent !important;
}

/* 内容容器半透明磨砂，透出底图（背景图由 JS 注入的 #doubao-skin-hero 固定层承载） */
#chat-route-main {
  background: color-mix(in srgb, {SURFACE} 56%, transparent) !important;
  backdrop-filter: blur(14px) saturate(1.05);
}
#chat-route-layout main {
  background: color-mix(in srgb, {SURFACE} 52%, transparent) !important;
}
header {
  background: color-mix(in srgb, {SURFACE} 74%, transparent) !important;
  backdrop-filter: blur(12px);
}

/* 输入框外壳（豆包工作硬编码 #232528，强制跟随主题） */
[class*="guidance-input-surface"] {
  background: color-mix(in srgb, {SURFACE} 82%, {MIXBASE}) !important;
  border-color: color-mix(in srgb, {TEXT} 12%, transparent) !important;
}

/* 输入引擎容器 */
[data-testid="chat_input"] {
  background: color-mix(in srgb, {SURFACE} 64%, transparent) !important;
}

/* 右侧面板（硬编码 #1f1f1f） */
[data-testid="flow_chat_sidebar"] {
  background: color-mix(in srgb, {SURFACE} 80%, {MIXBASE}) !important;
}

/* 消息区外层可能的不透明容器（哈希 class 前缀匹配） */
#chat-route-layout section[class*="container-"] {
  background: color-mix(in srgb, {SURFACE} 52%, transparent) !important;
}
#chat-route-layout nav[class*="panel-"] {
  background: color-mix(in srgb, {SURFACE} 58%, transparent) !important;
}

/* 滚动条 */
*::-webkit-scrollbar { width: 8px; height: 8px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: color-mix(in srgb, {TEXT} 18%, transparent); border-radius: 4px; }
*::-webkit-scrollbar-thumb:hover { background: color-mix(in srgb, {TEXT} 28%, transparent); }
`;

function hexOk(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

// 背景层（JS 注入的 #doubao-skin-hero 固定层）：有图 -> 图片；无图 -> 主题渐变
export function buildHeroBg(colors, heroDataUrl = "") {
  const surface = hexOk(colors?.surface) ? colors.surface : "#0e1420";
  const m = /^#([0-9a-f]{6})$/i.exec(surface);
  const lum = m
    ? 0.299 * parseInt(m[1].slice(0, 2), 16) +
      0.587 * parseInt(m[1].slice(2, 4), 16) +
      0.114 * parseInt(m[1].slice(4, 6), 16)
    : 128;
  const mixbase = lum > 140 ? "#ffffff" : "#000000";
  if (heroDataUrl && /^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(heroDataUrl)) {
    return `url(${JSON.stringify(heroDataUrl)}) center / cover no-repeat`;
  }
  return `linear-gradient(135deg, ${surface} 0%, color-mix(in srgb, ${surface} 82%, ${mixbase}) 55%, color-mix(in srgb, ${surface} 66%, ${mixbase}) 100%)`;
}

export function buildSkinCss({ colors, id = "custom" }) {
  const accent = hexOk(colors?.accent) ? colors.accent : "#6d8bff";
  const surface = hexOk(colors?.surface) ? colors.surface : "#0e1420";
  const text = hexOk(colors?.text) ? colors.text : "#ebf0fa";
  // 明度决定向深色还是向浅色派生
  const m = /^#([0-9a-f]{6})$/i.exec(surface);
  const lum = m
    ? 0.299 * parseInt(m[1].slice(0, 2), 16) +
      0.587 * parseInt(m[1].slice(2, 4), 16) +
      0.114 * parseInt(m[1].slice(4, 6), 16)
    : 128;
  const mixbase = lum > 140 ? "#ffffff" : "#000000";

  const heroLayer = `linear-gradient(135deg, ${surface} 0%, color-mix(in srgb, ${surface} 82%, ${mixbase}) 55%, color-mix(in srgb, ${surface} 66%, ${mixbase}) 100%)`;

  const safeId = String(id).replace(/[^a-z0-9_-]/gi, "");
  return CSS_TEMPLATE
    .split("{ID}").join(safeId)
    .split("{ACCENT}").join(accent)
    .split("{SURFACE}").join(surface)
    .split("{TEXT}").join(text)
    .split("{MIXBASE}").join(mixbase)
    .split("{HERO_LAYER}").join(heroLayer);
}
