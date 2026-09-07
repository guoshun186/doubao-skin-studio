# DoubaoWork Skin Studio

为**豆包工作桌面客户端**（DoubaoWork）提供可逆的换肤能力——通过本机 Chromium DevTools Protocol (CDP) 注入，不修改安装目录、不碰 app.asar、不影响代码签名。

启动后窗口右上角出现 🎨 换肤仪表盘按钮，支持：
- **内置主题**：橘子洲头（深色，取自橘子洲头风景照取色）
- **自定义图片**：上传本地图片作为界面背景，自动取色生成配色
- **一键还原**：恢复原生界面

> **⚠️ 重要：本皮肤仅在豆包工作「深色模式」下使用。浅色模式下文字对比度不足，可能看不清。** 使用前请在豆包工作设置中切换到深色主题。

## 工作原理

豆包工作是基于定制 Chromium 壳的桌面应用（非标准 Electron），UI 为 Web 技术栈。本工具：

1. 以 `--remote-debugging-port=9223` 重启豆包工作（仅绑定本机 127.0.0.1）
2. 通过 CDP 发现所有页面渲染目标（排除后台页）
3. 向每个页面注入：
   - CSS 变量覆盖（Semi Design `--semi-color-*` + 豆包专属 `--dbx-*` + `--s-color-brand-*` 体系）
   - 硬编码背景容器覆盖（输入框、侧边栏等不跟随变量的区域）
   - 🎨 仪表盘脚本（按钮 + 面板 + 图片上传取色 + localStorage 持久化）
   - 背景图片浮层（z-index 最高层 + 40% 透明度，确保图片可见且文字可读）

## 快速开始

### 前置条件

- 豆包工作桌面客户端已安装（默认路径 `E:\Program Files (x86)\DoubaoWork\Application\DoubaoWork\app\DoubaoWork.exe`）
- Node.js 18+ 已加入 PATH
- Windows 系统

### 一键启动（带皮肤）

双击 `start-with-skin.bat`：

1. 关闭正在运行的豆包工作
2. 以 CDP 调试端口 9223 重启
3. 自动注入皮肤和仪表盘
4. 启动完成后窗口右上角出现 🎨 按钮

### 还原原生界面

双击 `restore.bat`：关闭豆包工作 → 以普通模式重启（无调试端口、无注入）。

### 仅启动调试模式（手动注入）

双击 `doubaowork-debug-start.bat`：仅以 9223 端口启动豆包工作，不自动注入。可手动运行 `node src/apply-skin.mjs` 注入。

## 功能说明

### 🎨 仪表盘

点击右上角 🎨 按钮展开面板：

| 选项 | 说明 |
|------|------|
| 橘子洲头 | 内置深色主题（取自橘子洲头风景照取色） |
| ＋ 自定义图片 | 上传本地图片（PNG/JPG/WebP），自动压缩取色，生成专属主题 |
| 原生界面 | 一键还原，移除所有注入 |

自定义图片主题会持久化到 `localStorage`（键 `doubaoCustomSkin`），下次注入时自动恢复。图片压缩至 1600px 宽、WebP 0.8 质量，受浏览器 5MB 存储限制。

### 自定义图片取色逻辑

上传图片后：
1. 压缩至 1600px 宽，转 WebP
2. 取 48px 缩略图，按色相/饱和度分桶统计主色
3. 主色 → accent（强调色）
4. 平均亮度决定深浅 → surface（背景色）+ text（文字色）
5. 生成 CSS 变量覆盖 + 背景图片浮层

## 目录结构

```
doubao-skin-studio/
├── SKILL.md                      # Skill 规范说明
├── README.md                     # 本文档
├── package.json                  # 项目信息
├── LICENSE                       # MIT 协议
├── .gitignore
├── start-with-skin.bat           # 一键启动（带皮肤）
├── restore.bat                   # 还原原生
├── doubaowork-debug-start.bat   # 仅调试模式启动
└── src/
    ├── cdp-client.mjs            # CDP 会话（WebSocket 连接 + 命令封装）
    ├── doubao-skin-template.mjs  # CSS 模板（哨兵替换）+ 主题构建函数
    ├── doubao-skin-menu.mjs      # 仪表盘脚本生成器（按钮/面板/图片上传/持久化）
    └── apply-skin.mjs            # 主注入器（发现页面 → 注入仪表盘）
```

## 注意事项

### 重启失效（设计如此）

CDP 注入仅在当前渲染进程生命周期内有效。**手动重启豆包工作后皮肤会消失**，需要重新运行 `start-with-skin.bat`。这是 CDP 方案的天性，不是 bug。

### 安全提示

- CDP 端口仅绑定 `127.0.0.1`，不对外暴露
- Chromium CDP **没有同用户认证**：皮肤生效期间，本机其他恶意程序理论上可通过 9223 端口接管页面
- 建议不要在皮肤生效期间运行不可信的本地软件
- 还原原生（`restore.bat`）后端口关闭，风险消除

### 不修改官方文件

本工具绝不：
- 修改豆包工作安装目录下的任何文件
- 替换 `app.asar` 或资源包
- 修改代码签名
- 写入额外账号/仓库/云盘

所有注入仅存在于运行时内存中。

### 仅支持深色模式

**本皮肤专为豆包工作「深色模式」设计。** 浅色模式下文字对比度不足，可能看不清。使用前请在豆包工作设置中切换到深色主题。

### 已知限制

- 仅支持 Windows（豆包工作桌面端当前仅 Windows）
- 自定义图片主题的 `localStorage` 按页面 origin 隔离：对话窗口和主窗口的自定义主题不互通
- 背景图片以 40% 透明度浮层显示，过浓/过淡可在 `src/doubao-skin-menu.mjs` 的 `setHero` 函数中调整 `opacity` 值
- 豆包工作版本更新可能改变 DOM 结构或 CSS 变量名，导致部分区域覆盖失效

## 故障排查

### 启动后看不到 🎨 按钮

1. 确认豆包工作以 9223 端口启动：浏览器访问 `http://127.0.0.1:9223/json/version`，应返回 JSON
2. 确认 Node.js 可用：`node --version`
3. 手动运行注入：`node src/apply-skin.mjs`，查看输出是否有 `OK`
4. 如果页面目标为空，等待几秒后重试（豆包工作 UI 加载需要时间）

### 自定义图片上传后不显示

1. 确认图片格式为 PNG/JPG/WebP
2. 确认图片大小未超限（压缩后应 < 5MB）
3. 检查浏览器控制台是否有 `DoubaoWork Skin` 相关警告
4. 背景浮层透明度可在 `src/doubao-skin-menu.mjs` 中调整

### 注入后界面异常

1. 点击 🎨 → 「原生界面」还原
2. 或运行 `restore.bat` 完全重启
3. 还原后所有注入清除，界面恢复官方状态

### 端口被占用

如果 9223 端口被其他程序占用，修改以下文件中的端口号：
- `src/apply-skin.mjs`：`const PORT = 9223`
- `start-with-skin.bat`：`--remote-debugging-port=9223`
- `doubaowork-debug-start.bat`：`--remote-debugging-port=9223`

三处必须保持一致。

## 许可证

MIT License
