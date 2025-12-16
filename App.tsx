
import React, { useState, useEffect, Suspense } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { StatsOverview } from './components/StatsOverview';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { CreateTaskModal } from './components/CreateTaskModal';
import { StatusModal } from './components/StatusModal';
import { AccountManagerModal } from './components/AccountManagerModal';
import { TodaySchedule } from './components/TodaySchedule';
import { Toast } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoginPage } from './components/LoginPage'; // Import LoginPage
import { Task, Stats, FilterState, Account } from './types';
import { supabase } from './services/supabaseClient';
import { Loader2 } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

// --- Lazy Load Heavy Components ---
const CourseManager = React.lazy(() => import('./components/CourseManager').then(module => ({ default: module.CourseManager })));
const DocumentLibrary = React.lazy(() => import('./components/DocumentLibrary').then(module => ({ default: module.DocumentLibrary })));
const DevToolbox = React.lazy(() => import('./components/DevToolbox').then(module => ({ default: module.DevToolbox })));
const ContentSchedule = React.lazy(() => import('./components/ContentSchedule').then(module => ({ default: module.ContentSchedule })));
const AccountMatrix = React.lazy(() => import('./components/AccountMatrix').then(module => ({ default: module.AccountMatrix })));
const DataAnalytics = React.lazy(() => import('./components/DataAnalytics').then(module => ({ default: module.DataAnalytics })));
const SettingsPanel = React.lazy(() => import('./components/SettingsPanel').then(module => ({ default: module.SettingsPanel })));

// Helper to get relative dates for mock data fallback if needed
const getRelativeDate = (diff: number) => {
  const date = new Date();
  date.setDate(date.getDate() + diff);
  return date.toISOString().split('T')[0];
};

// Loading Fallback Component
const TabLoading = () => (
  <div className="flex flex-col items-center justify-center h-64 text-primary animate-pulse">
    <Loader2 className="w-10 h-10 animate-spin mb-4" />
    <p className="text-sm font-medium">正在加载模块资源...</p>
  </div>
);

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // App State
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

  // 1. Auth Check Effect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Theme Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 3. Data Fetching Effect (Only when logged in)
  const fetchData = async () => {
    if (!session) return; // Don't fetch if not logged in

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
    if (session) {
        fetchData();
    }
  }, [session]);

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

  // Quick Filter Handler from StatsOverview
  const handleQuickFilter = (type: 'pending' | 'published' | 'today') => {
    setFilters(prev => {
        setSearchTerm(''); // Clear search
        if (type === 'today') {
            return { ...prev, time: 'today', status: 'all', platform: 'all' };
        } else {
            return { ...prev, status: type, time: 'all', platform: 'all' };
        }
    });
    // Scroll to list section
    setTimeout(() => {
        document.getElementById('task-list-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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

  // AUTH LOADING STATE
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // NOT AUTHENTICATED -> LOGIN PAGE
  if (!session) {
    return (
      <>
        <LoginPage />
        <Toast 
          message={toast.message} 
          isVisible={toast.isVisible} 
          onClose={() => setToast({ ...toast, isVisible: false })} 
        />
      </>
    );
  }

  // AUTHENTICATED -> MAIN APP
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
                      <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">欢迎回来，{session.user.email?.split('@')[0] || '夜风'} 👋</h1>
                      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
                        {isLoading ? '正在从数据库同步数据...' : '今天又是高效产出的一天，看看有什么新任务吧。'}
                      </p>
                    </div>
                  </div>

                  <StatsOverview 
                    stats={stats} 
                    onManageAccounts={() => setIsAccountModalOpen(true)}
                    onQuickFilter={handleQuickFilter}
                  />
                  
                  <TodaySchedule 
                    tasks={tasks} 
                    onEdit={openEditModal} 
                    onCreateToday={() => { setCurrentTask(null); setIsCreateModalOpen(true); }}
                  />

                  <div id="task-list-section" className="bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 p-1">
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
                    
                    {/* Inserted Schedule Here with Suspense & ErrorBoundary */}
                    <ErrorBoundary>
                      <Suspense fallback={<TabLoading />}>
                          <ContentSchedule />
                      </Suspense>
                    </ErrorBoundary>

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

              {activeTab === 'courses' && (
                <ErrorBoundary>
                  <Suspense fallback={<TabLoading />}>
                      <CourseManager />
                  </Suspense>
                </ErrorBoundary>
              )}
              
              {activeTab === 'documents' && (
                <ErrorBoundary>
                  <Suspense fallback={<TabLoading />}>
                      <DocumentLibrary />
                  </Suspense>
                </ErrorBoundary>
              )}
              
              {activeTab === 'devtools' && (
                <ErrorBoundary>
                  <Suspense fallback={<TabLoading />}>
                      <DevToolbox />
                  </Suspense>
                </ErrorBoundary>
              )}
              
              {activeTab === 'accounts' && (
                <ErrorBoundary>
                  <Suspense fallback={<TabLoading />}>
                      <AccountMatrix 
                        accounts={accounts} 
                        onManage={() => setIsAccountModalOpen(true)}
                        onCreateTask={() => { setCurrentTask(null); setIsCreateModalOpen(true); }}
                      />
                  </Suspense>
                </ErrorBoundary>
              )}

              {activeTab === 'analytics' && (
                <ErrorBoundary>
                  <Suspense fallback={<TabLoading />}>
                      <DataAnalytics tasks={tasks} accounts={accounts} />
                  </Suspense>
                </ErrorBoundary>
              )}

              {activeTab === 'settings' && (
                <ErrorBoundary>
                  <Suspense fallback={<TabLoading />}>
                      <SettingsPanel 
                        isDarkMode={isDarkMode} 
                        toggleTheme={toggleTheme} 
                        showToast={showToast}
                      />
                  </Suspense>
                </ErrorBoundary>
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
