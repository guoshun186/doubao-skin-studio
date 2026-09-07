---
name: doubao-skin-studio
description: >-
  Apply a reversible theme/skin to the DoubaoWork desktop app (ByteDance AI
  office agent) via local Chromium DevTools Protocol (CDP) injection. Use when
  the user wants to change DoubaoWork's appearance/theme/skin, upload a custom
  image as background, or revert to native. Never modifies the install directory,
  app resources, or code signing.
---

# DoubaoWork Skin Studio

Reversible DoubaoWork desktop theming through local CDP injection. The tool
restarts DoubaoWork with `--remote-debugging-port=9223`, discovers its page
renderers, and injects CSS + a 🎨 theme dashboard into the live UI. No official
files are touched.

## When this skill applies

- The user wants to change DoubaoWork's look (color theme, background image,
  custom uploaded image) without editing the official app.
- The user references an open-source theming project (e.g. workbuddy-skin-studio)
  and asks to adapt it for DoubaoWork.
- The user reports the theme disappeared after a DoubaoWork restart and wants it
  reapplied, or wants to revert to the native look.

## Prerequisites

- **DoubaoWork desktop installed** (default: `E:\Program Files (x86)\DoubaoWork\Application\DoubaoWork\app\DoubaoWork.exe`).
- **Node.js 18+** on PATH.
- **Windows** only (DoubaoWork desktop is Windows-only).
- Warn the user once: applying **restarts DoubaoWork** and any unsaved in-app
  work is lost. Ask them to save first.

## Workflow

1. From the repo directory, double-click `start-with-skin.bat` (or run in
   PowerShell):

   ```powershell
   .\start-with-skin.bat
   ```

   This quits DoubaoWork, relaunches it with the CDP port, waits for the
   debugger, and injects the skin + dashboard.

2. Verify: a 🎨 button appears at the top-right of DoubaoWork.

3. Tell the user they can switch themes, upload a custom image, or revert to
   native from that menu.

### Manual injection (if auto-inject missed a page)

```powershell
node src\apply-skin.mjs
```

### Restore native

```powershell
.\restore.bat
```

This removes all injection and relaunches DoubaoWork normally.

## Choosing a theme

- **Built-in**: `starlight` (星夜 Starlight — deep space blue-purple dark theme).
- **Custom image**: click 🎨 → "＋ 自定义图片", select a local PNG/JPG/WebP.
  The tool compresses it to 1600px width (WebP 0.8), extracts dominant colors,
  and generates a full theme. Persisted to `localStorage` (`doubaoCustomSkin`).
- If the user names a mood/color, map to the closest built-in or just apply
  starlight and let them pick from the 🎨 menu.

## Guardrails

- Never replace, edit, or take ownership of the DoubaoWork install directory or
  its resources. This tool only injects into the live renderer.
- CDP binds to loopback `127.0.0.1` only. Tell the user not to run untrusted
  local software while a skin is active (Chromium CDP has no same-user auth).
- Injection lives for the renderer's lifetime. After a **manual** DoubaoWork
  restart the skin disappears by design — re-run `start-with-skin.bat`.
- Custom image themes are per-origin (`localStorage`): the chat window and
  launcher window do not share custom themes.
- Background image renders as a 40%-opacity overlay (z-index top layer) to
  guarantee visibility across DoubaoWork's complex stacking contexts. Adjust
  `opacity` in `src/doubao-skin-menu.mjs` `setHero()` if too strong/weak.

## Checks (sanity before reporting done)

```powershell
node --check src\apply-skin.mjs
node --check src\doubao-skin-template.mjs
node --check src\doubao-skin-menu.mjs
node --check src\cdp-client.mjs
```

All should pass. After injection, `http://127.0.0.1:9223/json/list` should
list page targets (excluding `doubaowork-background`).

## Resources

- `src/apply-skin.mjs` — main injector: discover pages → inject dashboard.
- `src/cdp-client.mjs` — CDP WebSocket session + command wrapper.
- `src/doubao-skin-template.mjs` — CSS template (sentinel replacement) + theme builders.
- `src/doubao-skin-menu.mjs` — 🎨 dashboard generator (button/panel/image upload/persistence).
- `start-with-skin.bat` — one-click start with skin.
- `restore.bat` — restore native appearance.
- `doubaowork-debug-start.bat` — start with CDP port only (no auto-inject).
- `README.md` — full human-readable documentation.

## One-line summary for the user

> "I restarted DoubaoWork in debug mode and injected the skin. Use the 🎨 button
> (top-right) to switch themes, upload a custom image, or revert. Re-run
> start-with-skin.bat if you restart DoubaoWork manually."
