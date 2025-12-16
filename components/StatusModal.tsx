import React, { useState } from 'react';
import { X, CheckCircle, Check } from 'lucide-react';
import { Task } from '../types';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  task: Task | null;
}

export const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, onConfirm, task }) => {
  const [publishLink, setPublishLink] = useState('');
  
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">更新发布状态</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-500 h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">内容已发布？</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">请确认发布详情："{task.title}"</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">发布链接</label>
              <input 
                type="url" 
                value={publishLink}
                onChange={(e) => setPublishLink(e.target.value)}
                placeholder="https://..." 
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">实际发布时间</label>
              <input 
                type="datetime-local" 
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end">
          <button 
            onClick={() => onConfirm({ publishLink, status: 'published' })} 
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center"
          >
            <Check className="h-5 w-5 mr-2" />
            <span>确认已发布</span>
          </button>
        </div>
      </div>
    </div>
  );
};