import React from 'react';
import { Clock, CheckCircle, Calendar, Users, ArrowUp, Settings } from 'lucide-react';
import { Stats } from '../types';

interface StatsOverviewProps {
  stats: Stats;
  onManageAccounts: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, onManageAccounts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">待发布内容</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.pending}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-primary">
            <Clock className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-500 flex items-center">
            <ArrowUp className="h-4 w-4 mr-1" />
            5 个新增
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">已发布内容</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.published}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-success">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-500 flex items-center">
            <ArrowUp className="h-4 w-4 mr-1" />
            18% 增长
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">今日计划</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.todayPlan}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-warning">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            进行中: 3/{stats.todayPlan}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative group">
        <button 
          onClick={onManageAccounts}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
          title="管理账号"
        >
          <Settings className="h-4 w-4" />
        </button>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">管理账号</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.managedAccounts}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Users className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm cursor-pointer hover:text-primary transition-colors" onClick={onManageAccounts}>
          <span className="text-gray-500 dark:text-gray-400 flex items-center">
            点击管理平台与账号
          </span>
        </div>
      </div>
    </div>
  );
};