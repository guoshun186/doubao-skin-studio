# 内置主题背景图

本目录存放内置主题的背景图片和效果预览截图。

## 橘子洲头 (juzizhou)

- **文件名**：`juzizhou.webp`
- **格式**：WebP（推荐），也支持 PNG/JPG（需同步修改 `src/apply-skin.mjs` 中的 MIME 类型）
- **建议尺寸**：宽度 ≥ 1600px，保持原始比例
- **建议大小**：< 500KB（注入时会内嵌为 base64 dataURL，过大会增加注入时间）

## 工作原理

`src/apply-skin.mjs` 启动时从相对路径 `../assets/juzizhou.webp` 读取图片，转为 base64 dataURL，内嵌到注入的 CSS 中。

豆包工作页面的 origin 为 `doubaowork://`，无法直接加载本地文件系统的相对路径图片，因此必须内嵌为 dataURL。

## 替换图片

1. 将新图片命名为 `juzizhou.webp` 放入本目录
2. 重新运行 `start-with-skin.bat` 即可生效
3. 如需更换格式（如 PNG），修改 `src/apply-skin.mjs` 中：
   ```js
   const dataUrl = `data:image/png;base64,${buffer.toString("base64")}`;
   ```

## 回退

如果 `assets/juzizhou.webp` 不存在，内置主题会自动回退为 CSS 渐变背景（使用橘子洲头配色），不会报错。

## 效果预览截图

`screenshots/` 目录存放皮肤效果预览截图，用于 README 展示：
- `chat-home.png` — 主对话页面效果
- `skills-page.png` — 技能·连接器页面效果
