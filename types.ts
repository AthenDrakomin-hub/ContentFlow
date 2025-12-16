export type TaskStatus = 'pending' | 'published' | 'draft' | 'failed';
export type AccountStatus = 'active' | 'expired' | 'connecting';

export interface Account {
  id: string;
  platform: string; // e.g., 'baijiahao', 'wechat-service', 'toutiao'
  platformName: string; // e.g., '百家号', '微信服务号'
  name: string;
  status: AccountStatus;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  summary: string;
  content: string;
  wordCount: number;
  tags: string[];
  platform: string;
  publishDate: string; // ISO date string YYYY-MM-DD
  publishTime: string; // HH:mm
  status: TaskStatus;
  publishLink?: string;
  notes?: string;
  isFocus?: boolean;
}

export interface Stats {
  pending: number;
  published: number;
  todayPlan: number;
  managedAccounts: number;
}

export type FilterState = {
  status: string;
  platform: string;
  time: string;
  viewMode: 'list' | 'calendar' | 'platform';
};

export interface Template {
  id: string;
  title: string;
  content: string; // HTML string
  platform: 'baijiahao' | 'wechat' | 'all';
  name: string;
  description: string;
  tags: { text: string; color: string }[];
  rules: string[];
  icon: string;
  color: string;
}

export interface AuditResult {
  type: string;
  content: string;
  suggestion: string;
}