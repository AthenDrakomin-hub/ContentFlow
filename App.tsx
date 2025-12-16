import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { StatsOverview } from './components/StatsOverview';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { CreateTaskModal } from './components/CreateTaskModal';
import { StatusModal } from './components/StatusModal';
import { AccountManagerModal } from './components/AccountManagerModal';
import { TodaySchedule } from './components/TodaySchedule';
import { CourseManager } from './components/CourseManager';
import { DocumentLibrary } from './components/DocumentLibrary';
import { DevToolbox } from './components/DevToolbox';
import { ContentSchedule } from './components/ContentSchedule';
import { Toast } from './components/Toast';
import { Task, Stats, FilterState, Account } from './types';
import { supabase } from './services/supabaseClient';

// Helper to get relative dates for mock data fallback if needed
const getRelativeDate = (diff: number) => {
  const date = new Date();
  date.setDate(date.getDate() + diff);
  return date.toISOString().split('T')[0];
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  // Stats derivation with dynamic date
  const todayStr = new Date().toISOString().split('T')[0];
  const stats: Stats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    published: tasks.filter(t => t.status === 'published').length,
    todayPlan: tasks.filter(t => t.publishDate === todayStr).length,
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

  // Fetch Data from Supabase
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (tasksError) throw tasksError;
      if (tasksData) setTasks(tasksData as Task[]);

      // Fetch Accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: true });

      if (accountsError) throw accountsError;
      if (accountsData) setAccounts(accountsData as Account[]);

    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('数据加载失败，请检查网络');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    // Time filter logic improvement
    if (filters.time !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = getRelativeDate(1);
      
      if (filters.time === 'today') {
        result = result.filter(t => t.publishDate === today);
      } else if (filters.time === 'tomorrow') {
        result = result.filter(t => t.publishDate === tomorrow);
      } 
      // Simplified week/month logic for demo
    }

    setFilteredTasks(result);
  }, [tasks, filters, searchTerm]);

  // Handlers
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
  };

  // Account Handlers
  const handleAddAccount = async (newAccount: Omit<Account, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .insert([newAccount])
        .select()
        .single();
        
      if (error) throw error;
      if (data) {
        setAccounts(prev => [...prev, data as Account]);
        showToast(`已添加账号: ${data.name}`);
      }
    } catch (error) {
      console.error(error);
      showToast('添加账号失败');
    }
  };

  const handleUpdateAccount = async (updatedAccount: Account) => {
    try {
      const { error } = await supabase
        .from('accounts')
        .update(updatedAccount)
        .eq('id', updatedAccount.id);

      if (error) throw error;
      setAccounts(accounts.map(a => a.id === updatedAccount.id ? updatedAccount : a));
      showToast(`账号 ${updatedAccount.name} 更新成功`);
    } catch (error) {
      console.error(error);
      showToast('更新账号失败');
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      setAccounts(accounts.filter(a => a.id !== id));
      showToast('账号已删除');
    } catch (error) {
      console.error(error);
      showToast('删除账号失败');
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      if (currentTask) {
        // Edit mode
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', currentTask.id);
          
        if (error) throw error;
        
        setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, ...taskData } as Task : t));
        showToast('任务已更新');
      } else {
        // Create mode
        const newTaskPayload = {
          ...taskData,
          wordCount: taskData.content?.length || 0,
          tags: taskData.tags || [],
          status: 'pending'
        };
        // Remove ID if present to let DB generate UUID
        delete (newTaskPayload as any).id;

        const { data, error } = await supabase
          .from('tasks')
          .insert([newTaskPayload])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setTasks(prev => [data as Task, ...prev]);
          showToast('新任务创建成功');
        }
      }
      setCurrentTask(null);
    } catch (error) {
      console.error(error);
      showToast('操作失败，请重试');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('确定要删除此任务吗？')) {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        setTasks(prev => prev.filter(t => t.id !== id));
        showToast('任务已删除');
      } catch (error) {
        console.error(error);
        showToast('删除失败');
      }
    }
  };

  const handleStatusConfirm = async (data: any) => {
    if (currentTask) {
      try {
        const updates = { status: 'published', publishLink: data.publishLink };
        const { error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', currentTask.id);

        if (error) throw error;

        setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, ...updates } as Task : t));
        setIsStatusModalOpen(false);
        setCurrentTask(null);
        showToast('任务标记为已发布');
      } catch (error) {
        console.error(error);
        showToast('状态更新失败');
      }
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
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-inter text-slate-900 dark:text-slate-50 overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Left Sidebar */}
      <Sidebar 
        onCreateNew={() => { setCurrentTask(null); setIsCreateModalOpen(true); }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <TopBar 
          toggleTheme={toggleTheme} 
          isDarkMode={isDarkMode} 
          onSearch={setSearchTerm}
          toggleSidebar={() => {}} 
        />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
           <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
              {activeTab === 'dashboard' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">欢迎回来，夜风 👋</h1>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {isLoading ? '正在从数据库同步数据...' : '今天又是高效产出的一天，看看有什么新任务吧。'}
                      </p>
                    </div>
                  </div>

                  <StatsOverview 
                    stats={stats} 
                    onManageAccounts={() => setIsAccountModalOpen(true)}
                  />
                  
                  <TodaySchedule 
                    tasks={tasks} 
                    onEdit={openEditModal} 
                    onCreateToday={() => { setCurrentTask(null); setIsCreateModalOpen(true); }}
                  />

                  <div className="bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 p-1">
                    <TaskFilters 
                      filters={filters} 
                      setFilters={setFilters} 
                      onSearch={setSearchTerm} 
                      onRefresh={fetchData} 
                      onCreateNew={() => { setCurrentTask(null); setIsCreateModalOpen(true); }}
                      platforms={uniquePlatforms}
                    />

                    <div className="px-4 pb-4">
                      {isLoading ? (
                        <div className="py-10 text-center text-gray-500">加载中...</div>
                      ) : (
                        <TaskList 
                          tasks={filteredTasks} 
                          onEdit={openEditModal} 
                          onStatusUpdate={openStatusModal}
                          onDelete={handleDeleteTask}
                          onCopy={copyToClipboard}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">内容分发管理</h2>
                        <button onClick={() => { setCurrentTask(null); setIsCreateModalOpen(true); }} className="bg-primary text-white px-4 py-2 rounded-lg">新建文章</button>
                    </div>
                    
                    {/* Inserted Schedule Here */}
                    <ContentSchedule />

                    <TaskFilters 
                      filters={filters} 
                      setFilters={setFilters} 
                      onSearch={setSearchTerm} 
                      onRefresh={fetchData} 
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
              )}

              {activeTab === 'courses' && <CourseManager />}
              
              {activeTab === 'documents' && <DocumentLibrary />}
              
              {activeTab === 'devtools' && <DevToolbox />}

              {activeTab !== 'dashboard' && activeTab !== 'content' && activeTab !== 'courses' && activeTab !== 'documents' && activeTab !== 'devtools' && (
                 <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-6xl mb-4">🚧</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">模块建设中</h2>
                    <p className="text-gray-500 mt-2">"{activeTab}" 功能模块正在开发中，请先使用工作台。</p>
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      返回工作台
                    </button>
                 </div>
              )}
           </div>
        </main>
      </div>

      {/* Modals */}
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