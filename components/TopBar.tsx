import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, User, Menu } from 'lucide-react';

interface TopBarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  onSearch: (term: string) => void;
  toggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ toggleTheme, isDarkMode, onSearch, toggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const dateString = currentTime.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
        </button>
        
        <div className="relative w-full max-w-md hidden md:block group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="全局搜索任务、草稿或账号..."
            onChange={(e) => onSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white dark:focus:bg-slate-800 transition-all sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{timeString}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{dateString}</span>
        </div>

        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

        <button className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">内容运营</span>
          <div className="w-8 h-8 bg-gradient-to-tr from-primary to-blue-400 rounded-full flex items-center justify-center text-white shadow-md">
            <User className="w-4 h-4" />
          </div>
        </button>
      </div>
    </header>
  );
};