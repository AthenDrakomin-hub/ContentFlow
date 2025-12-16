import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, TrendingDown, Minus, FileText, MoreVertical, MessageSquare, Play, Edit, PieChart, Users, AlertCircle, Globe, ExternalLink, Bookmark, PenTool, Save, LayoutGrid, List, RefreshCw } from 'lucide-react';
import { CourseScript } from '../types';
import { CourseEditorModal } from './CourseEditorModal';
import { supabase } from '../services/supabaseClient';

// Curated Research Sources
const RESEARCH_SOURCES = [
    { name: '金十数据', url: 'https://www.jin10.com', category: '快讯', desc: '7x24小时全球财经快讯', color: 'blue' },
    { name: '财联社', url: 'https://www.cls.cn', category: 'A股', desc: '追踪主力动向与电报', color: 'red' },
    { name: '东方财富网', url: 'https://www.eastmoney.com', category: '综合', desc: '最全的个股行情与F10', color: 'orange' },
    { name: '雪球', url: 'https://xueqiu.com', category: '社区', desc: '观察散户情绪与大V观点', color: 'blue' },
    { name: '华尔街见闻', url: 'https://wallstreetcn.com', category: '深度', desc: '全球宏观视角分析', color: 'indigo' },
    { name: '巨潮资讯', url: 'http://www.cninfo.com.cn', category: '公告', desc: '上市公司官方公告查询', color: 'emerald' },
];

export const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<CourseScript[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentScript, setCurrentScript] = useState<CourseScript | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'research'>('list');
  const [scratchpad, setScratchpad] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch courses from Supabase
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setCourses(data as CourseScript[]);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateNew = () => {
    setCurrentScript(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (script: CourseScript) => {
    setCurrentScript(script);
    setIsEditorOpen(true);
  };

  const handleSave = async (script: CourseScript) => {
    try {
      if (currentScript) {
        // Update
        const { error } = await supabase
          .from('courses')
          .update({
            topic: script.topic,
            marketSentiment: script.marketSentiment,
            keyPoints: script.keyPoints,
            scriptContent: script.scriptContent,
            status: script.status,
            date: script.date
          })
          .eq('id', script.id);
        
        if (error) throw error;
        setCourses(prev => prev.map(c => c.id === script.id ? script : c));
      } else {
        // Create
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...newScript } = script;
        const { data, error } = await supabase
          .from('courses')
          .insert([newScript])
          .select()
          .single();

        if (error) throw error;
        if (data) setCourses(prev => [data as CourseScript, ...prev]);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('保存失败，请检查网络');
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">股票课程管理</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">集资讯研判、讲义制作、学员问答于一体</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-xl">
             <button 
                onClick={() => setActiveTab('list')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-white dark:bg-slate-600 text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
             >
                <LayoutGrid className="w-4 h-4 mr-2" />
                课程列表
             </button>
             <button 
                onClick={() => setActiveTab('research')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'research' ? 'bg-white dark:bg-slate-600 text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
             >
                <Globe className="w-4 h-4 mr-2" />
                投研情报台
             </button>
        </div>

        {activeTab === 'list' && (
             <div className="flex gap-2">
                 <button 
                  onClick={fetchCourses}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                  title="刷新"
                 >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                 </button>
                 <button 
                  onClick={handleCreateNew}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  新建讲义
                </button>
             </div>
        )}
      </div>

      {/* View: Course List */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {/* Report Insights Dashboard */}
            <div className="col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <PieChart className="w-32 h-32" />
                </div>
                <h3 className="font-bold text-lg mb-6 flex items-center relative z-10">
                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
                    调研数据透视
                </h3>
                <div className="space-y-6 relative z-10">
                    <div>
                        <div className="flex justify-between text-xs mb-2 text-gray-400">
                            <span>资金&lt;10万 亏损比例</span>
                            <span className="text-red-400 font-mono">98.7%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-red-500 w-[98.7%] h-full"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-2 text-gray-400">
                            <span>高频交易(>20次/月) 亏损率</span>
                            <span className="text-orange-400 font-mono">82%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-orange-500 w-[82%] h-full"></div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">新入市用户画像</span>
                            <span className="text-sm font-bold mt-1">急于回本 / 频繁操作</span>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Course List */}
            <div className="col-span-1 md:col-span-2 space-y-4">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">正在从数据库加载课程...</div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 dark:bg-slate-700/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-600">
                        <p className="text-gray-500">暂无课程讲义</p>
                    </div>
                ) : (
                    courses.map(course => (
                        <div key={course.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md ${
                                        course.marketSentiment === 'bullish' ? 'bg-red-500' : 
                                        course.marketSentiment === 'bearish' ? 'bg-green-500' : 'bg-gray-400'
                                    }`}>
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors cursor-pointer" onClick={() => handleEdit(course)}>
                                            {course.topic}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">飞书群</span>
                                            <span>•</span>
                                            <span>{course.date}</span>
                                            <span>•</span>
                                            <span className={`px-2 py-0.5 rounded ${course.status === 'ready' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {course.status === 'ready' ? '已完成' : '草稿中'}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {course.keyPoints?.map((point, idx) => (
                                                <span key={idx} className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-md">
                                                    #{point}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(course)} className="text-gray-400 hover:text-primary p-2">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-1">学员问答库 (Q&A)</h3>
                        <p className="text-indigo-100 text-sm">已收录 128 个高频痛点问题。</p>
                    </div>
                    <button className="relative z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        查看问答
                    </button>
                    <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
                        <MessageSquare className="w-40 h-40" />
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* View: Research Hub */}
      {activeTab === 'research' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in h-[calc(100vh-200px)]">
            {/* Left: Sources Grid */}
            <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {RESEARCH_SOURCES.map((source, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md bg-${source.color}-500`}>
                                        {source.name.substring(0, 1)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            {source.name}
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-full font-normal">
                                                {source.category}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{source.desc}</p>
                                    </div>
                                </div>
                                <a 
                                    href={source.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    ))}
                    
                    <div className="bg-gray-50 dark:bg-slate-700/30 p-5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                            <PlusIcon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">添加自定义网站</span>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
                    <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                        <Bookmark className="w-4 h-4 mr-2" />
                        备课提示
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                        浏览网站时，可以使用 <span className="font-mono bg-white dark:bg-slate-800 px-1 rounded">Win + Shift + S</span> 快速截图，或者将关键数据直接复制到右侧的【灵感速记板】中。
                    </p>
                </div>
            </div>

            {/* Right: Scratchpad */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center">
                        <PenTool className="w-4 h-4 mr-2 text-primary" />
                        灵感速记板
                    </h3>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => {
                                handleCreateNew();
                            }}
                            className="text-xs bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:text-primary transition-colors"
                         >
                             转为讲义
                         </button>
                    </div>
                </div>
                <textarea 
                    value={scratchpad}
                    onChange={e => setScratchpad(e.target.value)}
                    placeholder="在此粘贴新闻摘要、市场数据或突发灵感..."
                    className="flex-1 w-full p-4 resize-none outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed"
                />
                <div className="p-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 flex justify-between px-4">
                    <span>{scratchpad.length} 字</span>
                    <span>自动保存中...</span>
                </div>
            </div>
        </div>
      )}

      <CourseEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        initialScript={currentScript}
      />
    </div>
  );
};

// Helper Icon for the "Add New" button
const PlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);