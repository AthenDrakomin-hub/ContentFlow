
import React from 'react';
import { LayoutDashboard, FileText, Users, BarChart2, Settings, Globe, PlusCircle, LogOut, BookOpen, Terminal, FolderOpen, X } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface SidebarProps {
  onCreateNew: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCreateNew, activeTab, setActiveTab, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: '工作台', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'content', label: '内容分发', icon: <FileText className="w-5 h-5" /> },
    { id: 'courses', label: '股票课程', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'documents', label: '文档库', icon: <FolderOpen className="w-5 h-5" /> }, 
    { id: 'devtools', label: '开发工具箱', icon: <Terminal className="w-5 h-5" /> },
    { id: 'accounts', label: '账号矩阵', icon: <Users className="w-5 h-5" /> },
    { id: 'analytics', label: '数据分析', icon: <BarChart2 className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    if(window.confirm('确定要退出登录吗？')) {
        await supabase.auth.signOut();
        // State update handled in App.tsx via onAuthStateChange
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Globe className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Ye Feng's</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">WORKBENCH</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 mb-6">
          <button 
            onClick={onCreateNew}
            className="w-full bg-primary hover:bg-primary/90 text-white p-3 rounded-xl font-medium transition-all flex items-center justify-center shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 group"
          >
            <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            <span>快速发布</span>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Core</div>
          {menuItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className={`${activeTab === item.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'} transition-colors mr-3`}>
                {item.icon}
              </span>
              {item.label}
              {activeTab === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
              )}
            </button>
          ))}

          <div className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Management</div>
          {menuItems.slice(5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className={`${activeTab === item.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'} transition-colors mr-3`}>
                {item.icon}
              </span>
              {item.label}
              {activeTab === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
              )}
            </button>
          ))}

          <div className="mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Settings</div>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === 'settings'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings className={`w-5 h-5 mr-3 ${activeTab === 'settings' ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}`} />
            <span>系统设置</span>
            {activeTab === 'settings' && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
            )}
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-medium"
          >
              <LogOut className="w-4 h-4 mr-3" />
              退出登录
          </button>
        </div>
      </aside>
    </>
  );
};
