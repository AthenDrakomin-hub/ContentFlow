import React from 'react';
import { Clock, CheckCircle, Circle, Plus, Calendar, ArrowRight } from 'lucide-react';
import { Task } from '../types';

interface TodayScheduleProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onCreateToday: () => void;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({ tasks, onEdit, onCreateToday }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks
    .filter(t => t.publishDate === today)
    .sort((a, b) => a.publishTime.localeCompare(b.publishTime));
  
  const total = todaysTasks.length;
  const completed = todaysTasks.filter(t => t.status === 'published').length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-8 border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in group">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-primary" />
            今日计划
            <span className="ml-3 text-sm font-normal px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {completed}/{total} 完成
            </span>
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-8">
            {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="flex flex-col w-full md:w-48">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">进度</span>
                    <span className="font-medium text-primary">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
            <button 
                onClick={onCreateToday}
                className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium flex items-center shadow-sm"
            >
                <Plus className="h-4 w-4 mr-1" />
                添加任务
            </button>
        </div>
      </div>

      {todaysTasks.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-600 transition-colors hover:border-primary/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer" onClick={onCreateToday}>
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">今天暂时没有安排任务</p>
            <p className="text-sm text-gray-400 mt-1">点击此处快速创建</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysTasks.map(task => (
                <div 
                    key={task.id} 
                    onClick={() => onEdit(task)}
                    className={`relative p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group/card ${
                        task.status === 'published' 
                        ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30' 
                        : 'bg-white dark:bg-slate-700/50 border-gray-200 dark:border-gray-600 hover:border-primary/30'
                    }`}
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                             <Clock className="h-3.5 w-3.5 mr-1.5" />
                             {task.publishTime}
                        </div>
                        {task.status === 'published' 
                            ? <CheckCircle className="h-5 w-5 text-green-500" /> 
                            : <Circle className="h-5 w-5 text-gray-300 group-hover/card:text-primary transition-colors" />
                        }
                    </div>
                    
                    <h4 className={`font-bold text-base mb-2 line-clamp-1 ${
                        task.status === 'published' ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'
                    }`}>
                        {task.title}
                    </h4>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-600/50">
                        <div className="flex items-center gap-2">
                             <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300 rounded-md truncate max-w-[100px]">
                                {task.platform.split('-')[0].trim()}
                            </span>
                            {task.isFocus && (
                                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md flex items-center">
                                    重点
                                </span>
                            )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover/card:opacity-100 transition-opacity -translate-x-2 group-hover/card:translate-x-0" />
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};