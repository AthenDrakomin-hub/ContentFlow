import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { CreateTaskModal } from './components/CreateTaskModal';
import { StatusModal } from './components/StatusModal';
import { AccountManagerModal } from './components/AccountManagerModal';
import { Toast } from './components/Toast';
import { Task, Stats, FilterState, Account } from './types';

// Mock Data
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: '2025年最新科技趋势分析报告',
    summary: '本文将深入分析2025年全球科技发展趋势，包括人工智能、区块链、元宇宙等前沿技术的最新进展和应用前景。',
    content: '本文将深入分析2025年全球科技发展趋势，包括人工智能、区块链、元宇宙等前沿技术的最新进展和应用前景。这里是详细内容...',
    wordCount: 1500,
    tags: ['科技', '趋势'],
    platform: '百家号 - 账号1',
    publishDate: '2025-12-16',
    publishTime: '14:30',
    status: 'pending',
    isFocus: true
  },
  {
    id: '2',
    title: '本周产品更新公告',
    summary: '本周我们发布了重要产品更新，新增了多项实用功能，提升了用户体验。详细更新内容请查看正文。',
    content: '本周我们发布了重要产品更新，新增了多项实用功能...',
    wordCount: 800,
    tags: ['产品', '更新'],
    platform: '服务号 - 官方服务号',
    publishDate: '2025-12-16',
    publishTime: '16:00',
    status: 'pending'
  },
  {
    id: '3',
    title: '区块链技术在供应链管理中的应用',
    summary: '区块链技术为供应链管理带来了革命性的变化，实现了全程可追溯、透明化管理。',
    content: '区块链技术详细分析...',
    wordCount: 1800,
    tags: ['区块链', '供应链'],
    platform: '百家号 - 账号2',
    publishDate: '2025-12-15',
    publishTime: '10:30',
    status: 'published',
    publishLink: 'https://example.com'
  },
  {
    id: '4',
    title: '人工智能在医疗领域的应用前景',
    summary: '人工智能技术正在改变医疗行业的方方面面，从疾病诊断到药物研发。',
    content: '人工智能医疗应用...',
    wordCount: 2200,
    tags: ['AI', '医疗'],
    platform: '百家号 - 账号3',
    publishDate: '2025-12-17',
    publishTime: '09:00',
    status: 'pending'
  }
];

const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', platform: 'baijiahao', platformName: '百家号', name: '科技资讯号', status: 'active' },
  { id: '2', platform: 'baijiahao', platformName: '百家号', name: '生活百科', status: 'active' },
  { id: '3', platform: 'baijiahao', platformName: '百家号', name: '财经观察', status: 'expired' },
  { id: '4', platform: 'wechat-service', platformName: '微信服务号', name: '官方服务号', status: 'active' },
];

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(MOCK_TASKS);
  
  // Stats derivation
  const stats: Stats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    published: tasks.filter(t => t.status === 'published').length,
    todayPlan: tasks.filter(t => {
      return t.publishDate === '2025-12-16'; 
    }).length,
    managedAccounts: accounts.length
  };
  
  // Modals & Popups
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [toast, setToast] = useState({ message: '', isVisible: false });

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    platform: 'all',
    time: 'all',
    viewMode: 'list'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Effects
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    let result = tasks;

    // Search
    if (searchTerm) {
      result = result.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filters
    if (filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters.platform !== 'all') {
      result = result.filter(t => t.platform.includes(filters.platform));
    }

    setFilteredTasks(result);
  }, [tasks, filters, searchTerm]);

  // Handlers
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
  };

  // Account Handlers
  const handleAddAccount = (newAccount: Omit<Account, 'id'>) => {
    const account = { ...newAccount, id: Date.now().toString() };
    setAccounts([...accounts, account]);
    showToast(`已添加账号: ${account.name}`);
  };

  const handleUpdateAccount = (updatedAccount: Account) => {
    setAccounts(accounts.map(a => a.id === updatedAccount.id ? updatedAccount : a));
    showToast(`账号 ${updatedAccount.name} 更新成功`);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
    showToast('账号已删除');
  };

  const handleCreateTask = (taskData: Partial<Task>) => {
    if (currentTask) {
      // Edit mode
      setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, ...taskData } as Task : t));
      showToast('任务已更新');
    } else {
      // Create mode
      const newTask: Task = {
        ...taskData as Task,
        id: Date.now().toString(),
        wordCount: taskData.content?.length || 0,
        tags: taskData.tags || [],
        status: 'pending'
      };
      setTasks(prev => [newTask, ...prev]);
      showToast('新任务创建成功');
    }
    setCurrentTask(null);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('确定要删除此任务吗？')) {
      setTasks(prev => prev.filter(t => t.id !== id));
      showToast('任务已删除');
    }
  };

  const handleStatusConfirm = (data: any) => {
    if (currentTask) {
      setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, status: 'published', publishLink: data.publishLink } : t));
      setIsStatusModalOpen(false);
      setCurrentTask(null);
      showToast('任务标记为已发布');
    }
  };

  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setIsCreateModalOpen(true);
  };

  const openStatusModal = (task: Task) => {
    setCurrentTask(task);
    setIsStatusModalOpen(true);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    showToast('内容已复制到剪贴板');
  };

  // Extract unique platforms for filter
  const uniquePlatforms = Array.from(new Set(accounts.map(a => a.platformName)));

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-inter ${isDarkMode ? 'dark' : ''}`}>
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">ContentFlow 内容指挥中心</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">海外准备 · 国内发布 · 全程可控</p>
        </div>

        <StatsOverview 
          stats={stats} 
          onManageAccounts={() => setIsAccountModalOpen(true)}
        />
        
        {/* Today's Focus Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white shadow-lg animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">今日重点提醒</h3>
              <p className="text-blue-100 text-sm">以下任务需要在今天完成发布</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              {tasks.filter(t => t.isFocus).length} 个紧急任务
            </div>
          </div>
        </div>

        <TaskFilters 
          filters={filters} 
          setFilters={setFilters} 
          onSearch={setSearchTerm} 
          onRefresh={() => showToast('数据已刷新')} 
          onCreateNew={() => { setCurrentTask(null); setIsCreateModalOpen(true); }}
          platforms={uniquePlatforms}
        />

        <TaskList 
          tasks={filteredTasks} 
          onEdit={openEditModal} 
          onStatusUpdate={openStatusModal}
          onDelete={handleDeleteTask}
          onCopy={copyToClipboard}
        />
      </div>

      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSave={handleCreateTask}
        initialTask={currentTask}
        showToast={showToast}
        accounts={accounts}
      />

      <StatusModal 
        isOpen={isStatusModalOpen} 
        onClose={() => setIsStatusModalOpen(false)} 
        onConfirm={handleStatusConfirm}
        task={currentTask}
      />

      <AccountManagerModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        accounts={accounts}
        onAdd={handleAddAccount}
        onUpdate={handleUpdateAccount}
        onDelete={handleDeleteAccount}
      />

      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </div>
  );
};

export default App;