import React from 'react';
import { Clock, Check, FileText, Tag, Pencil, Copy, Trash2, Share2, AlertTriangle, AlertCircle, ExternalLink, Flame } from 'lucide-react';
import { Task, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onStatusUpdate, onDelete, onCopy }) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'published': return '已发布';
      case 'draft': return '草稿';
      case 'failed': return '发布失败';
      default: return '待发布';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'published': return <Check className="h-3 w-3 mr-1" />;
      case 'draft': return <Pencil className="h-3 w-3 mr-1" />;
      case 'failed': return <AlertTriangle className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  // Logic for Today's Focus
  const today = new Date().toISOString().split('T')[0];
  const isTodayPending = task.publishDate === today && task.status === 'pending';
  const isHighlighted = task.isFocus || isTodayPending;

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
      isHighlighted 
        ? 'border-orange-400 dark:border-orange-500 shadow-md ring-1 ring-orange-100 dark:ring-orange-900/20' 
        : 'border-gray-100 dark:border-gray-700 shadow-sm'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
              {getStatusIcon(task.status)}
              {getStatusText(task.status)}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {task.platform}
            </span>
            {isHighlighted && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-sm animate-pulse">
                <Flame className="h-3 w-3 mr-1 fill-white" />
                今日重点
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            {task.status === 'failed' ? (
               <span className="text-red-500 flex items-center">
                 <AlertCircle className="h-4 w-4 mr-1" />
                 {task.publishDate}
               </span>
            ) : (
              <>
                <Clock className={`h-4 w-4 mr-1 ${isHighlighted ? 'text-orange-500' : ''}`} />
                <span className={isHighlighted ? 'text-orange-600 dark:text-orange-400 font-medium' : ''}>
                  {task.publishDate} {task.publishTime}
                </span>
              </>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{task.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {task.summary || task.content.substring(0, 150)}...
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {task.wordCount} 字
            </span>
            {task.publishLink ? (
               <a href={task.publishLink} target="_blank" rel="noreferrer" className="flex items-center text-primary hover:underline">
                 <ExternalLink className="h-4 w-4 mr-1" />
                 查看链接
               </a>
            ) : (
              <span className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                {task.tags.join(', ')}
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            <button onClick={() => onEdit(task)} className="text-primary hover:text-primary/80 p-2 rounded-full hover:bg-primary/10 transition-colors" title="编辑">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => onCopy(task.content)} className="text-green-500 hover:text-green-600 p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors" title="复制内容">
              <Copy className="h-4 w-4" />
            </button>
            {task.status !== 'published' && (
              <button onClick={() => onStatusUpdate(task)} className="text-orange-500 hover:text-orange-600 p-2 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors" title="标记为已发布">
                <Check className="h-4 w-4" />
              </button>
            )}
            {task.status === 'published' && (
              <button className="text-blue-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors" title="重新发布">
                <Share2 className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => onDelete(task.id)} className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" title="删除">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};