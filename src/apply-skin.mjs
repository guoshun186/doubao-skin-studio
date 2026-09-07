import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { CdpSession } from "./cdp-client.mjs";
import { buildSkinCss, buildHeroBg, CSS_TEMPLATE } from "./doubao-skin-template.mjs";
import { buildSkinMenuScript } from "./doubao-skin-menu.mjs";

const PORT = 9223;
const __dirname = dirname(fileURLToPath(import.meta.url));

// 内置主题：橘子洲头（深色，取自橘子洲头风景照取色）
// 注意：本主题仅在豆包工作「深色模式」下使用，浅色模式下文字可能看不清
const juzizhouColors = { accent: "#222935", surface: "#0f1017", text: "#d5d7de" };

// 内置主题背景图：从仓库相对路径 assets/juzizhou.webp 读取，注入时转 base64 dataURL
// 豆包工作页面 origin 为 doubaowork://，无法直接加载本地相对路径文件，故内嵌 dataURL
const heroImagePath = join(__dirname, "..", "assets", "juzizhou.webp");
let juzizhouHeroBg;
if (existsSync(heroImagePath)) {
  const buffer = readFileSync(heroImagePath);
  const dataUrl = `data:image/webp;base64,${buffer.toString("base64")}`;
  juzizhouHeroBg = `url(${JSON.stringify(dataUrl)}) center / cover no-repeat`;
  console.log(`Loaded built-in hero image: assets/juzizhou.webp (${(buffer.length / 1024).toFixed(1)} KB)`);
} else {
  juzizhouHeroBg = buildHeroBg(juzizhouColors);
  console.log("Built-in hero image not found (assets/juzizhou.webp), using gradient fallback.");
}

const juzizhou = {
  id: "juzizhou",
  name: "橘子洲头",
  accent: "#222935",
  surface: "#0f1017",
  css: buildSkinCss({ colors: juzizhouColors, id: "juzizhou" }),
  heroBg: juzizhouHeroBg,
};

// 清理注入骨架（早期测试皮肤）
const CLEANUP = `(() => {
  for (const id of ['dw-poc-skin', 'dw-poc-skin-style']) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
  return true;
})()`;

// 仪表盘脚本（按钮 + 面板 + 图片上传 + 主题切换）
const menuScript = buildSkinMenuScript({
  entries: [juzizhou],
  activeId: "juzizhou",
  styleId: "doubao-skin-style",
  menuId: "doubao-skin-dashboard",
  cssTemplate: CSS_TEMPLATE,
});

async function waitForPages(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = "no attempts";
  while (Date.now() < deadline) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const pages = list.filter(
        (t) =>
          t.type === "page" &&
          t.webSocketDebuggerUrl &&
          !t.url.includes("doubaowork-background"),
      );
      if (pages.length > 0) return pages;
      lastError = "no visible page targets yet";
    } catch (e) {
      lastError = e.message;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`timed out waiting for DoubaoWork pages on :${PORT} (${lastError})`);
}

const pages = await waitForPages();
console.log(`Found ${pages.length} page target(s)`);

let ok = 0;
for (const target of pages) {
  try {
    const session = new CdpSession(target.webSocketDebuggerUrl);
    await session.open();
    await session.evaluate(CLEANUP);
    const result = await session.evaluate(menuScript);
    session.close();
    ok += 1;
    console.log(`OK   [dashboard=${result}] ${target.title} | ${target.url}`);
  } catch (e) {
    console.log(`FAIL ${target.title} | ${target.url} | ${e.message}`);
  }
}
console.log(`\nSkin dashboard applied to ${ok}/${pages.length} page(s).`);
console.log("Look for the 🎨 button at the top-right of DoubaoWork.");
