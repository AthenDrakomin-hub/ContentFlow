# ContentFlow 跨境智汇

ContentFlow 是一个综合性的跨境内容发布仪表板，具有任务跟踪、AI 辅助内容生成和多平台调度功能。

## 🚀 部署到 Vercel

本项目已配置为标准的 Vite React 应用，非常适合部署到 Vercel。

1. **Push 代码**：将代码推送到 GitHub、GitLab 或 Bitbucket。
2. **导入项目**：在 Vercel 仪表板中点击 "Add New..." -> "Project"，选择您的仓库。
3. **构建配置**：
    *   Framework Preset: `Vite`
    *   Root Directory: `./` (默认)
    *   Build Command: `npm run build` (默认)
    *   Output Directory: `dist` (默认)
4. **环境变量**（重要）：见下文。

## 🔑 接口与 API Key 说明 (Interface Issues)

本项目使用 Google Gemini API (`@google/genai`) 进行内容优化。为了在 Vercel 托管的**前端环境**中安全且正确地运行，请务必阅读以下说明：

### 1. API Key 获取
您需要一个 Google Gemini API Key。
*   访问 [Google AI Studio](https://aistudio.google.com/)。
*   创建一个新的 API Key。

### 2. 环境变量配置 (Vercel)
由于这是一个纯前端单页应用 (SPA)，代码运行在用户的浏览器中。您需要在 Vercel 的项目设置中配置环境变量。

*   **Key Name**: `VITE_API_KEY`
*   **Value**: `您的_Google_Gemini_API_Key`

> **注意**：代码内部使用的是 `process.env.API_KEY`，但我们在 `vite.config.js` 中做了特殊配置，它会自动读取 `VITE_API_KEY` 并注入到代码中。请务必在 Vercel 中使用 `VITE_` 前缀，否则 Vite 默认不会将其暴露给前端代码。

### 3. 安全性提示
*   **客户端暴露**：因为本应用是纯前端架构，API Key 在运行时实际上是暴露给浏览器的（可以在 Network 面板看到）。
*   **使用建议**：对于演示或个人使用的 Dashboard，这种方式是可行的。如果是生产环境或面向公共用户的应用，建议添加一个后端 API (Serverless Function) 来代理请求，以隐藏 API Key。

### 4. 常见问题
*   **AI 优化无响应**：请检查浏览器控制台 (F12 -> Console)。如果出现 401/403 错误，通常是 API Key 未正确设置或额度已用完。
*   **构建失败**：请确保选择了 `Vite` 框架预设，并且 Node.js 版本建议选择 18.x 或 20.x。

## 🛠 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```
