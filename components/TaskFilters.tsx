import React from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { FilterState } from '../types';

interface TaskFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSearch: (term: string) => void;
  onRefresh: () => void;
  onCreateNew: () => void;
  platforms: string[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, setFilters, onSearch, onRefresh, onCreateNew, platforms }) => {
  return (
    <>
      {/* Actions Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button 
          onClick={onCreateNew}
          className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center shadow-md hover:shadow-lg transform active:scale-95"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span>创建发布任务</span>
        </button>
        <button 
          onClick={onRefresh}
          className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          <span>刷新</span>
        </button>
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="搜索任务..." 
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">状态</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            >
              <option value="all">全部状态</option>
              <option value="pending">待发布</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
              <option value="failed">发布失败</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">目标平台</label>
            <select 
              value={filters.platform}
              onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            >
              <option value="all">全部平台</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">发布时间</label>
            <select 
              value={filters.time}
              onChange={(e) => setFilters(prev => ({ ...prev, time: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            >
              <option value="all">全部时间</option>
              <option value="today">今天</option>
              <option value="tomorrow">明天</option>
              <option value="week">本周</option>
              <option value="month">本月</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">视图模式</label>
            <select 
              value={filters.viewMode}
              onChange={(e) => setFilters(prev => ({ ...prev, viewMode: e.target.value as any }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            >
              <option value="list">列表视图</option>
              <option value="calendar">日历视图</option>
              <option value="platform">按平台分组</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};