import React from 'react';
import { Clock, CheckCircle, Calendar, Users, ArrowUp, Settings, Activity } from 'lucide-react';
import { Stats } from '../types';

interface StatsOverviewProps {
  stats: Stats;
  onManageAccounts: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, onManageAccounts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-24 h-24 -mr-6 -mt-6 text-primary" />
        </div>
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-primary">
                <Clock className="h-6 w-6" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                <ArrowUp className="h-3 w-3 mr-1" />
                +5
            </span>
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">待发布内容</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.pending}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle className="w-24 h-24 -mr-6 -mt-6 text-success" />
        </div>
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-success">
                <CheckCircle className="h-6 w-6" />
            </div>
            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                <ArrowUp className="h-3 w-3 mr-1" />
                +12%
            </span>
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">已发布内容</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.published}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-24 h-24 -mr-6 -mt-6 text-warning" />
        </div>
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-warning">
                <Calendar className="h-6 w-6" />
            </div>
            <span className="flex items-center text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                进度 3/{stats.todayPlan}
            </span>
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">今日计划</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.todayPlan}</h3>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-800 rounded-2xl p-6 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 relative overflow-hidden group cursor-pointer" onClick={onManageAccounts}>
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
            <Users className="w-24 h-24 -mr-6 -mt-6 text-white" />
        </div>
        <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white">
                <Users className="h-6 w-6" />
            </div>
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                <Settings className="h-4 w-4" />
            </div>
        </div>
        <div className="relative z-10">
            <p className="text-sm font-medium text-indigo-100">矩阵账号</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stats.managedAccounts}</h3>
        </div>
      </div>
    </div>
  );
};