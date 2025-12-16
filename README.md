# Ye Feng's Workbench (夜风的工作台)

Ye Feng's Workbench 是一个综合性的跨境内容发布仪表板，专为内容创作者设计。它集成了任务跟踪、AI 辅助内容生成（基于 Google Gemini）、多平台调度策略管理以及数据看板功能。

## 🚀 部署到 Vercel (详细指南)

本项目已配置为标准的 Vite React 应用，非常适合部署到 Vercel。

### 1. 导入项目
1. 将代码推送到 GitHub、GitLab 或 Bitbucket。
2. 登录 [Vercel 仪表板](https://vercel.com/dashboard)。
3. 点击 **"Add New..."** -> **"Project"**。
4. 选择您的 `contentflow-app` 仓库并点击 **"Import"**。

### 2. 构建配置 (Build Settings)
Vercel 通常会自动检测 Vite 框架，默认配置如下（无需修改）：
*   **Framework Preset**: `Vite`
*   **Root Directory**: `./`
*   **Build Command**: `npm run build`
*   **Output Directory**: `dist`

### 3. 环境变量配置 (关键步骤！)
为了让 AI 接口和数据库正常工作，您**必须**在 Vercel 项目设置的 **"Environment Variables"** 部分添加以下变量：

| 变量名 (Key) | 示例值 (Value) | 说明 |
| :--- | :--- | :--- |
| `VITE_API_KEY` | `AIzaSy...` | **Google Gemini API Key** (用于 AI 写作与审核) |
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` | **Supabase Project URL** (数据库连接地址) |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1Ni...` | **Supabase Anon / Public Key** (客户端访问密钥) |

> **⚠️ 注意**: 环境变量必须以 `VITE_` 开头，否则前端代码无法读取。

---

## 🗄️ 数据库初始化 (Supabase Setup)

本项目依赖 Supabase 进行数据存储。请登录您的 Supabase 面板，进入 **SQL Editor**，依次运行以下三个步骤的脚本。

### 第一步：创建表结构 (Schema)

此脚本将创建应用所需的 5 张核心数据表。注意：为了匹配前端驼峰命名法，部分字段使用了双引号。

```sql
-- 1. 任务表 (Tasks)
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  title text,
  summary text,
  content text,
  "wordCount" integer,
  tags text[],
  platform text,
  "publishDate" text,
  "publishTime" text,
  status text default 'pending',
  "publishLink" text,
  "isFocus" boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. 账号表 (Accounts)
create table if not exists public.accounts (
  id uuid default gen_random_uuid() primary key,
  platform text,
  "platformName" text,
  name text,
  status text,
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. 股票课程表 (Courses)
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  topic text,
  "marketSentiment" text,
  "keyPoints" text[],
  status text,
  date text,
  platform text,
  "scriptContent" text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. 开发工具表 (DevTools)
create table if not exists public.dev_tools (
  id uuid default gen_random_uuid() primary key,
  name text,
  url text,
  description text,
  type text default 'custom',
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. 文档表 (Documents)
create table if not exists public.documents (
  id uuid default gen_random_uuid() primary key,
  name text,
  type text,
  size text,
  "updatedAt" text,
  author text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### 第二步：配置访问权限 (RLS Policies)

Supabase 默认开启行级安全（RLS）。为了让前端能读写数据，需要添加策略。
*注意：以下策略允许公开读写（适用于演示）。生产环境建议配置 Auth 并限制写入权限。*

```sql
-- 启用 RLS
alter table public.tasks enable row level security;
alter table public.accounts enable row level security;
alter table public.courses enable row level security;
alter table public.dev_tools enable row level security;
alter table public.documents enable row level security;

-- 创建允许所有操作的策略 (CRUD)
create policy "Allow all access to tasks" on public.tasks for all using (true) with check (true);
create policy "Allow all access to accounts" on public.accounts for all using (true) with check (true);
create policy "Allow all access to courses" on public.courses for all using (true) with check (true);
create policy "Allow all access to dev_tools" on public.dev_tools for all using (true) with check (true);
create policy "Allow all access to documents" on public.documents for all using (true) with check (true);
```

### 第三步：注入种子数据 (Seed Data)

执行此脚本，让您的仪表板在初次加载时拥有丰富的演示数据。

```sql
-- 插入示例账号
insert into public.accounts (platform, "platformName", name, status) values
('baijiahao', '百家号', '夜风财经观察', 'active'),
('wechat-service', '微信服务号', '夜风投资笔记', 'active'),
('toutiao', '今日头条', '夜风看盘', 'active');

-- 插入示例任务
insert into public.tasks (title, summary, content, "wordCount", tags, platform, "publishDate", "publishTime", status, "isFocus") values
('2025年Q1宏观经济展望', '分析美联储降息预期对A股的影响...', '详细内容...', 1200, ARRAY['宏观','A股'], '百家号 - 夜风财经观察', to_char(now(), 'YYYY-MM-DD'), '09:00', 'published', false),
('新能源板块回调机会分析', '光伏与锂电板块近期回调深度解析...', '详细内容...', 800, ARRAY['新能源','抄底'], '微信服务号 - 夜风投资笔记', to_char(now(), 'YYYY-MM-DD'), '14:30', 'pending', true),
('本周主力资金流向复盘', '北向资金连续3日净流入...', '详细内容...', 1500, ARRAY['资金流','复盘'], '今日头条 - 夜风看盘', to_char(now() + interval '1 day', 'YYYY-MM-DD'), '18:00', 'draft', false);

-- 插入示例开发工具
insert into public.dev_tools (name, url, description, type, status) values
('ChatGPT', 'https://chat.openai.com', 'AI 助手', 'custom', 'active'),
('TradingView', 'https://cn.tradingview.com', '看盘工具', 'custom', 'active');

-- 插入示例课程
insert into public.courses (topic, "marketSentiment", "keyPoints", status, date, platform) values
('MACD底背离实战教学', 'bullish', ARRAY['MACD','技术指标','实战'], 'ready', to_char(now(), 'YYYY-MM-DD'), 'feishu');
```

## 🛠 本地开发 (Local Development)

如果您想在本地运行项目：

1.  **安装依赖**
    ```bash
    npm install
    ```

2.  **配置环境变量**
    在项目根目录创建 `.env.local` 文件，并填入您的 Key：
    ```env
    VITE_API_KEY=您的_Google_Gemini_Key
    VITE_SUPABASE_URL=您的_Supabase_URL
    VITE_SUPABASE_ANON_KEY=您的_Supabase_Anon_Key
    ```

3.  **启动开发服务器**
    ```bash
    npm run dev
    ```

4.  **构建生产版本**
    ```bash
    npm run build
    ```
