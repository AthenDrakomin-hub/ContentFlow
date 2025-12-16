import React, { useState, useEffect } from 'react';
import { Globe, Moon, Sun, User, ChevronDown } from 'lucide-react';

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleTheme, isDarkMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center text-primary">
              <Globe className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Ye Feng's Workbench</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">当前时间:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{formatDate(currentTime)}</span>
            </div>
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="切换主题"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:inline">内容运营</span>
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};