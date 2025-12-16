
# Ye Feng's Workbench (夜风的工作台)

Ye Feng's Workbench 是一个综合性的跨境内容发布仪表板，专为内容创作者设计。它集成了任务跟踪、智能辅助内容生成（本地规则引擎）、多平台调度策略管理以及数据看板功能。

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
为了让数据库功能正常工作，您**必须**在 Vercel 项目设置的 **"Environment Variables"** 部分添加以下变量：

| 变量名 (Key) | 示例值 (Value) | 说明 |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` | **Supabase Project URL** (数据库连接地址) |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1Ni...` | **Supabase Anon / Public Key** (客户端访问密钥) |

> **⚠️ 注意**: 
> 1. 环境变量必须以 `VITE_` 开头，否则前端代码无法读取。
> 2. 本项目已移除外部 AI API 依赖，使用内置规则引擎进行内容优化，因此不再需要配置 `VITE_API_KEY`。

---

## 🗄️ 数据库初始化 (Supabase Setup)

本项目依赖 Supabase 进行数据存储。请登录您的 Supabase 面板，进入 **SQL Editor**，依次运行以下脚本。

### 第一步：创建表结构 (Schema)

此脚本将创建应用所需的 6 张核心数据表。注意：为了匹配前端驼峰命名法，部分字段使用了双引号。

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
  -- 统计字段
  views integer default 0,
  ctr float default 0.0,
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
  -- 运营数据
  fans integer default 0,
  reads integer default 0,
  weight integer default 1,
  growth float default 0.0,
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
  "storage_path" text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. 用户资料表 (Profiles) - ⭐️ 新增
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  title text,
  bio text,
  avatar text,
  "notificationPreferences" jsonb default '{"email": true, "push": false, "weeklyReport": true}'::jsonb,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### 第二步：配置访问权限 (RLS Policies)

为了保障数据安全，我们将启用行级安全（RLS）并配置基于身份的访问策略。这意味着只有登录的管理员用户才能操作核心业务数据。

```sql
-- 1. 创建鉴权函数 (Security Definer)
-- 此函数用于统一管理管理员权限逻辑
create or replace function public.is_admin()
returns boolean as $$
begin
  -- 简单模式：任何登录用户都被视为管理员 (生产环境可在此处添加邮箱白名单检查)
  return auth.role() = 'authenticated';
end;
$$ language plpgsql security definer stable;

-- 2. 启用 RLS
alter table public.tasks enable row level security;
alter table public.accounts enable row level security;
alter table public.courses enable row level security;
alter table public.dev_tools enable row level security;
alter table public.documents enable row level security;
alter table public.profiles enable row level security;

-- 3. 配置核心业务表策略 (仅管理员可操作)
-- 适用于: tasks, accounts, courses, dev_tools, documents
create policy "Admins can select all" on public.tasks for select using (public.is_admin());
create policy "Admins can insert all" on public.tasks for insert with check (public.is_admin());
create policy "Admins can update all" on public.tasks for update using (public.is_admin());
create policy "Admins can delete all" on public.tasks for delete using (public.is_admin());

create policy "Admins can select all" on public.accounts for select using (public.is_admin());
create policy "Admins can insert all" on public.accounts for insert with check (public.is_admin());
create policy "Admins can update all" on public.accounts for update using (public.is_admin());
create policy "Admins can delete all" on public.accounts for delete using (public.is_admin());

create policy "Admins can select all" on public.courses for select using (public.is_admin());
create policy "Admins can insert all" on public.courses for insert with check (public.is_admin());
create policy "Admins can update all" on public.courses for update using (public.is_admin());
create policy "Admins can delete all" on public.courses for delete using (public.is_admin());

create policy "Admins can select all" on public.dev_tools for select using (public.is_admin());
create policy "Admins can insert all" on public.dev_tools for insert with check (public.is_admin());
create policy "Admins can update all" on public.dev_tools for update using (public.is_admin());
create policy "Admins can delete all" on public.dev_tools for delete using (public.is_admin());

create policy "Admins can select all" on public.documents for select using (public.is_admin());
create policy "Admins can insert all" on public.documents for insert with check (public.is_admin());
create policy "Admins can update all" on public.documents for update using (public.is_admin());
create policy "Admins can delete all" on public.documents for delete using (public.is_admin());

-- 4. 配置用户资料表策略 (用户仅可操作自己的资料)
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
```

### 第三步：性能优化 (创建索引)

**⭐️ 这里是您关注的重点**：除了核心业务表，我们为 `profiles` 表添加了必要的索引，特别是针对 JSONB 字段的 GIN 索引，这将极大提升未来扩展通知功能时的查询效率。

```sql
-- 1. 优化排序 (所有列表默认按创建时间倒序)
create index if not exists idx_tasks_created_at_desc on public.tasks (created_at desc);
create index if not exists idx_accounts_created_at_desc on public.accounts (created_at desc);
create index if not exists idx_courses_created_at_desc on public.courses (created_at desc);
create index if not exists idx_dev_tools_created_at_desc on public.dev_tools (created_at desc);
create index if not exists idx_documents_created_at_desc on public.documents (created_at desc);

-- 2. 任务表索引 (对应筛选器)
create index if not exists idx_tasks_tags_gin on public.tasks using gin (tags); -- 标签搜索
create index if not exists idx_tasks_publishDate on public.tasks ("publishDate"); -- 日期筛选
create index if not exists idx_tasks_publishTime on public.tasks ("publishTime"); -- 时间排序
create index if not exists idx_tasks_status on public.tasks (status); -- 状态筛选
create index if not exists idx_tasks_platform on public.tasks (platform); -- 平台筛选

-- 3. 账号表索引
create index if not exists idx_accounts_platform on public.accounts (platform);
create index if not exists idx_accounts_platformName on public.accounts ("platformName");
create index if not exists idx_accounts_status on public.accounts (status); -- 活跃状态过滤

-- 4. 课程表索引
create index if not exists idx_courses_keyPoints_gin on public.courses using gin ("keyPoints");
create index if not exists idx_courses_date on public.courses (date);
create index if not exists idx_courses_status on public.courses (status);

-- 5. 开发工具与文档索引
create index if not exists idx_dev_tools_name on public.dev_tools (name);
create index if not exists idx_dev_tools_type on public.dev_tools (type);
create index if not exists idx_documents_type on public.documents (type); -- 文件类型筛选
create index if not exists idx_documents_author on public.documents (author);

-- 6. 用户资料表索引 (Profiles) - ⭐️ 补充部分
-- 优化邮箱查找（如管理员搜索用户）
create index if not exists idx_profiles_email on public.profiles (email);
-- 优化 JSONB 查询（查询通知偏好），使用 GIN 索引
create index if not exists idx_profiles_notification_prefs on public.profiles using gin ("notificationPreferences");
```

### 第四步：注入种子数据 (Seed Data)

```sql
-- 插入示例账号
insert into public.accounts (platform, "platformName", name, status, fans, reads) values
('baijiahao', '百家号', '夜风财经观察', 'active', 12500, 3200),
('wechat-service', '微信服务号', '夜风投资笔记', 'active', 5800, 1500),
('toutiao', '今日头条', '夜风看盘', 'active', 45000, 8900);

-- 插入示例任务
insert into public.tasks (title, summary, content, "wordCount", tags, platform, "publishDate", "publishTime", status, "isFocus", views) values
('2025年Q1宏观经济展望', '分析美联储降息预期对A股的影响...', '详细内容...', 1200, ARRAY['宏观','A股'], '百家号 - 夜风财经观察', to_char(now(), 'YYYY-MM-DD'), '09:00', 'published', false, 1200),
('新能源板块回调机会分析', '光伏与锂电板块近期回调深度解析...', '详细内容...', 800, ARRAY['新能源','抄底'], '微信服务号 - 夜风投资笔记', to_char(now(), 'YYYY-MM-DD'), '14:30', 'pending', true, 0),
('本周主力资金流向复盘', '北向资金连续3日净流入...', '详细内容...', 1500, ARRAY['资金流','复盘'], '今日头条 - 夜风看盘', to_char(now() + interval '1 day', 'YYYY-MM-DD'), '18:00', 'draft', false, 0);

-- 插入示例开发工具
insert into public.dev_tools (name, url, description, type, status) values
('ChatGPT', 'https://chat.openai.com', 'AI 助手', 'custom', 'active'),
('TradingView', 'https://cn.tradingview.com', '看盘工具', 'custom', 'active');

-- 插入示例课程
insert into public.courses (topic, "marketSentiment", "keyPoints", status, date, platform) values
('MACD底背离实战教学', 'bullish', ARRAY['MACD','技术指标','实战'], 'ready', to_char(now(), 'YYYY-MM-DD'), 'feishu');
```

### 第五步：启用文件存储 (Storage Setup)

为了支持文件上传功能，您需要在 Supabase Dashboard 中进行以下配置：

1.  **创建存储桶 (Create Bucket)**
    *   在左侧菜单点击 **Storage**。
    *   点击 **New Bucket**。
    *   Name 填写: `documents`。
    *   Public bucket: **开启** (Checked)。
    *   点击 Save。

2.  **配置存储策略 (Storage Policy)**
    *   在 **SQL Editor** 中运行：
    ```sql
    -- 仅允许登录用户上传和管理文件
    create policy "Authenticated users can upload"
    on storage.objects for insert
    to authenticated
    with check ( bucket_id = 'documents' );

    -- 允许公开读取 (用于展示头像或分享文件)
    create policy "Public can view documents"
    on storage.objects for select
    to public
    using ( bucket_id = 'documents' );
    ```

### 第六步：用户自动化 (Automations)

配置数据库触发器，以便在用户注册时自动创建 Profile 记录。

```sql
-- 创建自动创建 Profile 的触发器
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, title, bio)
  values (new.id, new.email, split_part(new.email, '@', 1), '内容创作者', '暂无简介')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- 绑定触发器到 auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 🛠 本地开发 (Local Development)

如果您想在本地运行项目：

1.  **安装依赖**
    ```bash
    npm install
    ```

2.  **配置环境变量**
    在项目根目录创建 `.env.local` 文件，并填入您的 Supabase 配置：
    ```env
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
