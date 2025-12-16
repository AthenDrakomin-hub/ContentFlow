
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Moon, Sun, User, Menu, Settings, LogOut, Info } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface TopBarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
  onSearch: (term: string) => void;
  toggleSidebar?: () => void;
  onNavigate: (tab: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ toggleTheme, isDarkMode, onSearch, toggleSidebar, onNavigate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
            setShowNotifications(false);
        }
        if (userRef.current && !userRef.current.contains(event.target as Node)) {
            setShowUserMenu(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if(window.confirm('确定要退出登录吗？')) {
        await supabase.auth.signOut();
    }
  };

  const timeString = currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  const dateString = currentTime.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
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

        {/* Notification Dropdown */}
        <div className="relative" ref={notifRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 relative transition-colors ${showNotifications ? 'bg-gray-100 dark:bg-slate-800 text-primary' : ''}`}
            >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            </button>

            {showNotifications && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in z-50">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">通知中心</h4>
                        <span className="text-xs text-primary cursor-pointer hover:underline">全部已读</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        <div className="p-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">周报已自动生成</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">您的《第42周内容运营数据报告》已准备就绪，点击查看详情。</p>
                                    <p className="text-[10px] text-gray-400 mt-1">10分钟前</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">合规提醒</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">检测到草稿箱中"早盘策略"包含敏感词"稳赚"，建议立即修改。</p>
                                    <p className="text-[10px] text-gray-400 mt-1">2小时前</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-slate-700/30 text-center">
                        <button className="text-xs text-gray-500 hover:text-primary transition-colors">查看历史通知</button>
                    </div>
                </div>
            )}
        </div>

        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userRef}>
            <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 p-1 pl-2 rounded-full border border-transparent transition-all ${showUserMenu ? 'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-gray-700' : 'hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block select-none">内容运营</span>
                <div className="w-8 h-8 bg-gradient-to-tr from-primary to-blue-400 rounded-full flex items-center justify-center text-white shadow-md">
                    <User className="w-4 h-4" />
                </div>
            </button>

            {showUserMenu && (
                <div className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in z-50">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400">当前身份</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">管理员 (Admin)</p>
                    </div>
                    <div className="p-1">
                        <button 
                            onClick={() => { onNavigate('settings'); setShowUserMenu(false); }}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <Settings className="w-4 h-4 text-gray-400" />
                            系统设置
                        </button>
                        <button 
                            onClick={() => alert('版本 v1.0.0')}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <Info className="w-4 h-4 text-gray-400" />
                            关于我们
                        </button>
                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            退出登录
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};
