import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onStatusUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onStatusUpdate, onDelete, onCopy }) => {
  return (
    <div className="space-y-4 mb-12">
      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">未找到符合筛选条件的任务。</p>
        </div>
      ) : (
        tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEdit={onEdit}
            onStatusUpdate={onStatusUpdate}
            onDelete={onDelete}
            onCopy={onCopy}
          />
        ))
      )}
    </div>
  );
};