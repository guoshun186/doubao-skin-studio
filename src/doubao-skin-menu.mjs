// 豆包工作换肤仪表盘：注入悬浮按钮 + 面板（内置主题 / 自定义图片 / 原生还原）

export function buildSkinMenuScript({ entries, activeId, styleId, menuId, cssTemplate }) {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error("皮肤菜单至少需要一个主题");
  }
  const themes = entries.map((entry) => {
    if (!entry?.id || typeof entry.css !== "string") throw new Error("主题条目缺少 id 或 css");
    return {
      id: String(entry.id),
      name: typeof entry.name === "string" && entry.name.trim() ? entry.name : String(entry.id),
      accent: /^#[0-9a-f]{6}$/i.test(entry.accent ?? "") ? entry.accent : "#6d8bff",
      surface: typeof entry.surface === "string" ? entry.surface : "#0e1420",
      css: entry.css,
      heroBg: typeof entry.heroBg === "string" ? entry.heroBg : "",
    };
  });
  if (activeId !== null && !themes.some((t) => t.id === activeId)) {
    throw new Error(`当前主题不在菜单列表中：${activeId}`);
  }
  const payload = JSON.stringify({
    styleId,
    menuId,
    heroId: "doubao-skin-hero",
    activeId,
    themes,
    cssTemplate,
    customId: "custom-upload",
    storageKey: "doubaoCustomSkin",
  });

  return `(() => {
  const data = ${payload};

  let style = document.getElementById(data.styleId);
  if (!style) {
    style = document.createElement("style");
    style.id = data.styleId;
    document.head.appendChild(style);
  }

  document.getElementById(data.menuId)?.remove();
  const root = document.createElement("div");
  root.id = data.menuId;
  root.style.cssText = "position:fixed;top:56px;right:16px;z-index:2147483000;font:500 13px/1.4 system-ui,'PingFang SC',sans-serif;user-select:none;";

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "\\u{1F3A8}";
  button.title = "\\u8c46\\u5305\\u5de5\\u4f5c\\u6362\\u80a4\\u4eea\\u8868\\u76d8";
  button.style.cssText = "display:block;margin-left:auto;width:38px;height:38px;border-radius:50%;border:1px solid rgba(0,0,0,.18);background:rgba(255,255,255,.92);backdrop-filter:blur(10px);box-shadow:0 3px 12px rgba(0,0,0,.24);cursor:pointer;font-size:19px;padding:0;";

  const panel = document.createElement("div");
  panel.style.cssText = "display:none;margin-top:8px;min-width:216px;padding:6px;border-radius:12px;border:1px solid rgba(0,0,0,.1);background:rgba(255,255,255,.95);backdrop-filter:blur(16px);box-shadow:0 10px 30px rgba(0,0,0,.18);color:#17344f;";

  const title = document.createElement("div");
  title.textContent = "\\u6362\\u80a4\\u4eea\\u8868\\u76d8";
  title.style.cssText = "padding:8px 10px 6px;font-weight:700;font-size:13px;color:#17344f;";
  panel.appendChild(title);

  const rows = new Map();
  const paint = (id) => {
    for (const [rowId, row] of rows) {
      row.style.background = rowId === id ? "rgba(109,139,255,.16)" : "transparent";
      row.style.fontWeight = rowId === id ? "700" : "500";
    }
  };
  const row = (label, dotColor, onPick) => {
    const item = document.createElement("div");
    item.style.cssText = "display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;cursor:pointer;";
    const dot = document.createElement("span");
    dot.style.cssText = "width:10px;height:10px;border-radius:50%;flex:none;background:" + dotColor + ";";
    const text = document.createElement("span");
    text.textContent = label;
    item.append(dot, text);
    item.addEventListener("mouseenter", () => { if (item.style.fontWeight !== "700") item.style.background = "rgba(0,0,0,.05)"; });
    item.addEventListener("mouseleave", () => paint(document.documentElement.dataset.doubaoSkin ?? null));
    item.addEventListener("click", () => onPick(item));
    panel.appendChild(item);
    return item;
  };

  const isLightSurface = (hex) => {
    const m = /^#([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return true;
    const v = parseInt(m[1], 16);
    return (0.299 * ((v >> 16) & 255) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255)) > 140;
  };
  const applyMode = (surface) => {
    const dark = !isLightSurface(surface);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  };

  // ---- 背景图片浮层：z-index 最高 + 半透明（最高层渲染已验证绝对可靠）----
  const ensureHero = () => {
    let hero = document.getElementById(data.heroId);
    if (!hero) {
      hero = document.createElement("div");
      hero.id = data.heroId;
      document.body.appendChild(hero);
    }
    // 每次注入都强制重置（防止复用旧版残留的 z-index/opacity）
    hero.style.cssText = "position:fixed;inset:0;z-index:2147483000;pointer-events:none;background:transparent;opacity:0;";
    return hero;
  };
  const setHero = (bg) => {
    const hero = ensureHero();
    if (bg) {
      hero.style.background = bg;
      hero.style.opacity = "0.4";
    } else {
      hero.style.opacity = "0";
    }
  };
  const clearHero = () => { document.getElementById(data.heroId)?.remove(); };

  const setTheme = (id) => {
    const theme = data.themes.find((candidate) => candidate.id === id);
    if (!theme) return;
    style.textContent = theme.css;
    setHero(theme.heroBg);
    document.documentElement.dataset.doubaoSkin = theme.id;
    applyMode(theme.surface);
    paint(theme.id);
  };
  const clearTheme = () => {
    style.textContent = "";
    clearHero();
    delete document.documentElement.dataset.doubaoSkin;
    document.documentElement.style.colorScheme = "light";
    paint(null);
  };

  for (const theme of data.themes) {
    rows.set(theme.id, row(theme.name, theme.accent, () => { setTheme(theme.id); panel.style.display = "none"; }));
  }

  // ---- 自定义图片：本地选图 -> 压缩 -> 取色 -> 生成 CSS -> 持久化 ----
  const buildCustomCss = (dataUrl, colors) => {
    const mixbase = isLightSurface(colors.surface) ? "#ffffff" : "#000000";
    const heroLayer = "linear-gradient(135deg, " + colors.surface + " 0%, color-mix(in srgb, " + colors.surface + " 82%, " + mixbase + ") 55%, color-mix(in srgb, " + colors.surface + " 66%, " + mixbase + ") 100%)";
    return data.cssTemplate
      .split("{HERO_LAYER}").join(heroLayer)
      .split("{MIXBASE}").join(mixbase)
      .split("{ACCENT}").join(colors.accent)
      .split("{SURFACE}").join(colors.surface)
      .split("{TEXT}").join(colors.text)
      .split("{ID}").join(data.customId);
  };

  const hex = (r, g, b) => "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

  const extractPalette = (canvas) => {
    const ctx = canvas.getContext("2d");
    const { data: px } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const buckets = new Map();
    let lumSum = 0, count = 0;
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i], g = px[i + 1], b = px[i + 2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      lumSum += lum; count += 1;
      const sat = max === 0 ? 0 : (max - min) / max;
      if (sat < 0.18 || lum < 24 || lum > 245) continue;
      const d = max - min || 1;
      let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      const bucket = Math.round(h) % 6 * 2 + (sat > 0.55 ? 1 : 0);
      const entry = buckets.get(bucket) ?? { w: 0, r: 0, g: 0, b: 0, h: h * 60 };
      const weight = sat * sat;
      entry.w += weight; entry.r += r * weight; entry.g += g * weight; entry.b += b * weight;
      buckets.set(bucket, entry);
    }
    const avgLum = count ? lumSum / count : 128;
    const ranked = [...buckets.values()].sort((a, b2) => b2.w - a.w)
      .map((e) => ({ rgb: [e.r / e.w, e.g / e.w, e.b / e.w], h: e.h, w: e.w }));
    const accent = ranked[0]?.rgb ?? [109, 139, 255];
    const light = avgLum > 128;
    const surface = light ? mix(accent, [252, 252, 255], 0.92) : mix(accent, [12, 12, 18], 0.86);
    const text = light ? mix(accent, [16, 24, 40], 0.82) : mix(accent, [244, 246, 252], 0.85);
    return { accent: hex(...accent), surface: hex(...surface), text: hex(...text) };
  };

  const applyCustomTheme = (theme) => {
    style.textContent = buildCustomCss(theme.dataUrl, theme.colors);
    setHero("url(" + JSON.stringify(theme.dataUrl) + ") center / cover no-repeat");
    document.documentElement.dataset.doubaoSkin = data.customId;
    applyMode(theme.colors.surface);
    ensureCustomRow(theme);
    paint(data.customId);
  };

  let customRow = null;
  const deleteCustom = () => {
    try { localStorage.removeItem(data.storageKey); } catch {}
    if (document.documentElement.dataset.doubaoSkin === data.customId) setTheme(data.themes[0]?.id ?? null);
    customRow?.remove();
    rows.delete(data.customId);
    customRow = null;
  };
  const ensureCustomRow = (theme) => {
    if (customRow) {
      customRow.querySelector("span + span").textContent = theme.name;
      customRow.firstChild.style.background = theme.colors.accent;
      return;
    }
    customRow = row(theme.name, theme.colors.accent, () => { applyCustomTheme(loadCustom() ?? theme); panel.style.display = "none"; });
    const text = customRow.querySelector("span + span");
    text.style.cssText = "flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
    const del = document.createElement("span");
    del.textContent = "\\u00d7";
    del.title = "\\u5220\\u9664\\u81ea\\u5b9a\\u4e49\\u4e3b\\u9898";
    del.style.cssText = "flex:none;width:18px;height:18px;line-height:18px;text-align:center;border-radius:50%;color:rgba(0,0,0,.45);font-size:14px;";
    del.addEventListener("mouseenter", () => { del.style.background = "rgba(220,60,60,.15)"; del.style.color = "#c03030"; });
    del.addEventListener("mouseleave", () => { del.style.background = "transparent"; del.style.color = "rgba(0,0,0,.45)"; });
    del.addEventListener("click", (event) => { event.stopPropagation(); deleteCustom(); });
    customRow.appendChild(del);
    rows.set(data.customId, customRow);
  };

  const loadCustom = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(data.storageKey) ?? "null");
      return saved && saved.dataUrl && saved.colors ? saved : null;
    } catch { return null; }
  };
  const saveCustom = (theme) => {
    try { localStorage.setItem(data.storageKey, JSON.stringify(theme)); }
    catch (error) { console.warn("DoubaoWork Skin：自定义主题图片过大，本次生效但重启后不保留", error); }
  };

  const importFromDataUrl = (dataUrl, name) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 1600 / img.width);
      const full = document.createElement("canvas");
      full.width = Math.round(img.width * scale);
      full.height = Math.round(img.height * scale);
      full.getContext("2d").drawImage(img, 0, 0, full.width, full.height);
      const sample = document.createElement("canvas");
      sample.width = 48; sample.height = Math.max(1, Math.round(48 * img.height / img.width));
      sample.getContext("2d").drawImage(img, 0, 0, sample.width, sample.height);
      const theme = {
        name: name || "\\u6211\\u7684\\u56fe\\u7247",
        dataUrl: full.toDataURL("image/webp", 0.8),
        colors: extractPalette(sample),
      };
      saveCustom(theme);
      applyCustomTheme(theme);
      resolve(theme.colors);
    };
    img.onerror = () => reject(new Error("\\u56fe\\u7247\\u8bfb\\u53d6\\u5931\\u8d25"));
    img.src = dataUrl;
  });

  const picker = document.createElement("input");
  picker.type = "file";
  picker.accept = "image/png,image/jpeg,image/webp";
  picker.style.display = "none";
  picker.addEventListener("change", () => {
    const file = picker.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => importFromDataUrl(reader.result, file.name.replace(/\\.[a-z0-9]+$/i, ""));
    reader.readAsDataURL(file);
    picker.value = "";
    panel.style.display = "none";
  });

  const uploadRow = row("\\uff0b \\u81ea\\u5b9a\\u4e49\\u56fe\\u7247", "rgba(109,139,255,.9)", () => picker.click());
  uploadRow.style.borderTop = "1px solid rgba(0,0,0,.08)";

  const native = row("\\u539f\\u751f\\u754c\\u9762", "rgba(0,0,0,.24)", () => { clearTheme(); panel.style.display = "none"; });
  rows.set(null, native);

  const saved = loadCustom();
  if (saved) ensureCustomRow(saved);

  button.addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });

  root.append(button, panel, picker);
  document.body.appendChild(root);
  if (saved) applyCustomTheme(saved);
  else setTheme(data.activeId ?? data.themes[0]?.id ?? null);

  window.__doubaoSkin = { importFromDataUrl, setTheme, clearTheme, deleteCustom };
  return true;
})()`;
}
