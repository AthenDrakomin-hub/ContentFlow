import React from 'react';
import { Clock, CheckCircle, Calendar, Users, ArrowUp, Settings, ChevronRight } from 'lucide-react';
import { Stats } from '../types';

interface StatsOverviewProps {
  stats: Stats;
  onManageAccounts: () => void;
  onQuickFilter: (type: 'pending' | 'published' | 'today') => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, onManageAccounts, onQuickFilter }) => {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
      {/* Pending Content Card */}
      <div 
        onClick={() => onQuickFilter('pending')}
        className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-16 h-16 md:w-24 md:h-24 -mr-6 -mt-6 text-primary" />
        </div>
        <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-primary">
                <Clock className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="flex items-center text-gray-400 group-hover:text-primary transition-colors">
                <ChevronRight className="w-4 h-4" />
            </div>
        </div>
        <div>
            <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">待发布内容</p>
            <div className="flex items-end gap-2 mt-1">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-none">{stats.pending}</h3>
                <span className="text-[10px] md:text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded mb-1">
                    Next
                </span>
            </div>
        </div>
      </div>

      {/* Published Content Card */}
      <div 
        onClick={() => onQuickFilter('published')}
        className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-green-200 dark:hover:border-green-900 transition-all duration-300 relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle className="w-16 h-16 md:w-24 md:h-24 -mr-6 -mt-6 text-success" />
        </div>
        <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-success">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
            </div>
             <div className="flex items-center text-gray-400 group-hover:text-success transition-colors">
                <ChevronRight className="w-4 h-4" />
            </div>
        </div>
        <div>
            <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">已发布内容</p>
            <div className="flex items-end gap-2 mt-1">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-none">{stats.published}</h3>
                <span className="text-[10px] md:text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded flex items-center mb-1">
                    <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                    12%
                </span>
            </div>
        </div>
      </div>

      {/* Today Plan Card */}
      <div 
        onClick={() => onQuickFilter('today')}
        className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-900 transition-all duration-300 relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-16 h-16 md:w-24 md:h-24 -mr-6 -mt-6 text-warning" />
        </div>
        <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-warning">
                <Calendar className="h-5 w-5 md:h-6 md:w-6" />
            </div>
             <div className="flex items-center text-gray-400 group-hover:text-warning transition-colors">
                <ChevronRight className="w-4 h-4" />
            </div>
        </div>
        <div>
            <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">今日计划</p>
            <div className="flex items-end gap-2 mt-1">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-none">{stats.todayPlan}</h3>
                <div className="h-1.5 w-12 bg-gray-100 dark:bg-gray-700 rounded-full mb-1.5 overflow-hidden">
                    <div className="h-full bg-warning rounded-full" style={{ width: '60%' }}></div>
                </div>
            </div>
        </div>
      </div>

      {/* Managed Accounts Card */}
      <div 
        className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-800 rounded-2xl p-4 md:p-6 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 relative overflow-hidden group cursor-pointer" 
        onClick={onManageAccounts}
      >
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
            <Users className="w-16 h-16 md:w-24 md:h-24 -mr-6 -mt-6 text-white" />
        </div>
        <div className="flex items-center justify-between mb-3 md:mb-4 relative z-10">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white">
                <Users className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="p-1.5 md:p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                <Settings className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </div>
        </div>
        <div className="relative z-10">
            <p className="text-xs md:text-sm font-medium text-indigo-100">矩阵账号</p>
            <div className="flex items-end gap-2 mt-1">
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-none">{stats.managedAccounts}</h3>
                <span className="text-[10px] md:text-xs text-indigo-100/80 mb-1">个</span>
            </div>
        </div>
      </div>
    </div>
  );
};
