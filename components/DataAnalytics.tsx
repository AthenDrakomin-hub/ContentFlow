import React, { useMemo } from 'react';
import { BarChart2, TrendingUp, Users, Eye, ArrowUp, ArrowDown, Calendar, PieChart, Layers, Download, Star } from 'lucide-react';
import { Task, Account } from '../types';

interface DataAnalyticsProps {
  tasks: Task[];
  accounts: Account[];
}

interface AnalyticsData {
  totalViews: number;
  totalFans: number;
  trendData: number[];
  maxVal: number;
  platforms: Record<string, number>;
  topContent: {
    title: string;
    views: number;
    platform: string;
    rate: string;
  }[];
}

export const DataAnalytics: React.FC<DataAnalyticsProps> = ({ tasks, accounts }) => {
  // Generate Data based on real state
  const analyticsData: AnalyticsData = useMemo(() => {
    // 1. Total Views: Sum of 'views' from all tasks
    const totalViews = tasks.reduce((sum, task) => sum + (task.views || 0), 0);
    
    // 2. Total Fans: Sum of 'fans' from all accounts
    const totalFans = accounts.reduce((sum, acc) => sum + (acc.fans || 0), 0);
    
    // 3. Trend Data: Group views by publishDate (Last 7 days logic simulated from existing tasks)
    // Since we don't have a daily_stats table, we aggregate tasks by date.
    const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });
    
    const trendData = last7Days.map(date => {
        // Find tasks published on this date and sum their views
        const dayViews = tasks
            .filter(t => t.publishDate === date)
            .reduce((sum, t) => sum + (t.views || 0), 0);
        return dayViews; 
    });

    const maxVal = Math.max(...trendData) || 10; // Default scale if no data
    
    // 4. Platform distribution
    const platforms: Record<string, number> = accounts.reduce((acc, curr) => {
      const name = curr.platformName;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // 5. Top Content: Sort by views
    const topContent = [...tasks]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map(t => ({
            title: t.title,
            views: t.views || 0,
            platform: t.platform.split('-')[0],
            rate: (t.ctr || 0).toFixed(1) + '%'
        }));

    return { totalViews, totalFans, trendData, maxVal, platforms, topContent };
  }, [tasks, accounts]);

  // Helper for SVG path
  const generatePath = (data: number[], width: number, height: number) => {
    if (data.length === 0) return '';
    const stepX = width / (data.length - 1);
    const max = analyticsData.maxVal;
    const scaleY = (val: number) => height - (val / (max * 1.2)) * height;
    
    return data.map((val, i) => 
      `${i === 0 ? 'M' : 'L'} ${i * stepX},${scaleY(val)}`
    ).join(' ');
  };
  
  const generateAreaPath = (data: number[], width: number, height: number) => {
      const line = generatePath(data, width, height);
      return `${line} L ${width},${height} L 0,${height} Z`;
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <BarChart2 className="w-6 h-6 mr-2 text-primary" />
            全网数据罗盘
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">实时追踪多平台内容表现与粉丝增长</p>
        </div>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            导出周报
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4 relative z-10">
                 <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                     <Eye className="w-5 h-5" />
                 </div>
                 <span className="flex items-center text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded font-medium">
                     <ArrowUp className="w-3 h-3 mr-0.5" /> 实时
                 </span>
             </div>
             <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 relative z-10">
                {analyticsData.totalViews > 10000 ? (analyticsData.totalViews / 10000).toFixed(2) + 'w' : analyticsData.totalViews}
             </h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 relative z-10">累计阅读量 (Total Views)</p>
             <div className="absolute -bottom-4 -right-4 text-blue-50 dark:text-slate-700/50 opacity-50 group-hover:scale-110 transition-transform">
                 <Eye className="w-24 h-24" />
             </div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4 relative z-10">
                 <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                     <Users className="w-5 h-5" />
                 </div>
                 <span className="flex items-center text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded font-medium">
                     <ArrowUp className="w-3 h-3 mr-0.5" /> 存量
                 </span>
             </div>
             <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 relative z-10">
                 {analyticsData.totalFans > 1000 ? (analyticsData.totalFans / 1000).toFixed(1) + 'k' : analyticsData.totalFans}
             </h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 relative z-10">全网粉丝数 (Total Fans)</p>
             <div className="absolute -bottom-4 -right-4 text-purple-50 dark:text-slate-700/50 opacity-50 group-hover:scale-110 transition-transform">
                 <Users className="w-24 h-24" />
             </div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4 relative z-10">
                 <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                     <TrendingUp className="w-5 h-5" />
                 </div>
                 <span className="flex items-center text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-medium">
                     <ArrowUp className="w-3 h-3 mr-0.5" /> -
                 </span>
             </div>
             <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 relative z-10">{tasks.filter(t => t.status === 'published').length}</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 relative z-10">累计发布文章</p>
             <div className="absolute -bottom-4 -right-4 text-orange-50 dark:text-slate-700/50 opacity-50 group-hover:scale-110 transition-transform">
                 <TrendingUp className="w-24 h-24" />
             </div>
         </div>

         <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-xl shadow-lg text-white relative overflow-hidden">
             <div className="flex justify-between items-start mb-4 relative z-10">
                 <div className="p-2 bg-white/20 rounded-lg text-white">
                     <Layers className="w-5 h-5" />
                 </div>
                 <span className="flex items-center text-xs text-white/90 bg-white/20 px-1.5 py-0.5 rounded font-medium">
                     活跃
                 </span>
             </div>
             <h3 className="text-3xl font-bold mb-1 relative z-10">{Object.keys(analyticsData.platforms).length}</h3>
             <p className="text-sm text-indigo-100 relative z-10">覆盖平台矩阵</p>
             <div className="absolute -bottom-4 -right-4 text-white opacity-10">
                 <Layers className="w-24 h-24" />
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart (SVG) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                    近7日流量趋势 (Views Trend)
                </h3>
                <div className="flex gap-2 text-xs">
                    <span className="flex items-center text-gray-500"><div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div> 阅读量</span>
                </div>
             </div>
             
             <div className="w-full h-64 relative">
                {analyticsData.totalViews === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
                        <BarChart2 className="w-10 h-10 mb-2 opacity-30" />
                        <p className="text-sm">暂无流量数据，请在“账号矩阵”或“内容分发”中录入数据</p>
                    </div>
                ) : (
                    <>
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 800 300" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            {[0, 1, 2, 3, 4].map(i => (
                                <line key={i} x1="0" y1={i * 75} x2="800" y2={i * 75} stroke="currentColor" className="text-gray-100 dark:text-gray-700" strokeWidth="1" />
                            ))}
                            
                            {/* Area fill */}
                            <path 
                                d={generateAreaPath(analyticsData.trendData, 800, 300)} 
                                className="fill-blue-500/10 dark:fill-blue-500/20"
                            />
                            
                            {/* Line */}
                            <path 
                                d={generatePath(analyticsData.trendData, 800, 300)} 
                                fill="none" 
                                stroke="currentColor" 
                                className="text-blue-500" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />

                            {/* Points */}
                            {analyticsData.trendData.map((val, i) => {
                                const x = i * (800 / 6);
                                const max = analyticsData.maxVal;
                                const y = 300 - (val / (max * 1.2)) * 300;
                                return (
                                    <g key={i} className="group">
                                        <circle cx={x} cy={y} r="4" className="fill-blue-500 stroke-white dark:stroke-slate-800 stroke-2" />
                                        <rect x={x - 20} y={y - 35} width="40" height="20" rx="4" className="fill-gray-900 dark:fill-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <text x={x} y={y - 21} textAnchor="middle" className="text-[10px] fill-white dark:fill-gray-900 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{val}</text>
                                    </g>
                                )
                            })}
                        </svg>
                        {/* X Axis Labels */}
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                                <span key={i}>{d}</span>
                            ))}
                        </div>
                    </>
                )}
             </div>
        </div>

        {/* Platform Distribution & Top Content */}
        <div className="space-y-6">
             {/* Distribution */}
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-purple-500" />
                    平台贡献占比
                 </h3>
                 <div className="space-y-4">
                     {Object.keys(analyticsData.platforms).length === 0 ? (
                         <div className="text-center text-gray-400 text-sm py-4">暂无接入账号</div>
                     ) : (
                         Object.entries(analyticsData.platforms).map(([name, count], idx) => {
                             const total = accounts.length || 1;
                             const percent = (count / total) * 100;
                             const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500'];
                             return (
                                 <div key={name}>
                                     <div className="flex justify-between text-xs mb-1">
                                         <span className="text-gray-600 dark:text-gray-300">{name}</span>
                                         <span className="font-bold text-gray-800 dark:text-white">{Math.round(percent)}%</span>
                                     </div>
                                     <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                         <div className={`h-full rounded-full ${colors[idx % colors.length]}`} style={{ width: `${percent}%` }}></div>
                                     </div>
                                 </div>
                             )
                         })
                     )}
                 </div>
             </div>

             {/* Top Content */}
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex-1">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    流量内容 TOP 5
                 </h3>
                 <div className="space-y-4">
                     {analyticsData.topContent.length === 0 ? (
                         <div className="text-center text-gray-400 py-4 text-sm">暂无数据</div>
                     ) : (
                         analyticsData.topContent.map((item, i) => (
                             <div key={i} className="flex items-center justify-between group">
                                 <div className="flex items-center gap-3 overflow-hidden">
                                     <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${
                                         i === 0 ? 'bg-red-100 text-red-600' :
                                         i === 1 ? 'bg-orange-100 text-orange-600' :
                                         i === 2 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'
                                     }`}>
                                         {i + 1}
                                     </div>
                                     <div className="truncate">
                                         <p className="text-sm text-gray-800 dark:text-gray-200 truncate group-hover:text-primary transition-colors">{item.title}</p>
                                         <p className="text-[10px] text-gray-400">{item.platform}</p>
                                     </div>
                                 </div>
                                 <div className="text-right flex-shrink-0">
                                     <p className="text-sm font-bold text-gray-900 dark:text-white">{item.views}</p>
                                     <p className="text-[10px] text-green-500">CTR {item.rate}</p>
                                 </div>
                             </div>
                         ))
                     )}
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};