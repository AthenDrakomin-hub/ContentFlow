import React, { useState } from 'react';
import { Calendar, Clock, Layers, Zap, ShieldAlert, Sun, Activity, Coffee, Flag, BookOpen, Moon, CheckCircle, BarChart, Star, AlertTriangle } from 'lucide-react';
import { TimeSlot, ScheduleItem, DayPlan } from '../types';

// --- Static Configuration (Frontend Only) ---

const FINANCIAL_WEEKLY_PLAN: DayPlan[] = [
  {
    day: '周一',
    focus: '市场资讯 & 深度研究',
    items: [
      { timeSlot: 'early', timeRange: '07:00-07:30', platform: 'wechat-sub', accountName: '财经早报', category: '市场资讯', content: '【早报】全球隔夜行情+今日事件预告' },
      { timeSlot: 'trading', timeRange: '09:45/10:45', platform: 'baijiahao', accountName: '盘中快讯', category: '实时行情', content: '【异动】热点板块资金流向+技术分析' },
      { timeSlot: 'noon', timeRange: '12:00-12:30', platform: 'wechat-sub', accountName: '午间分析', category: '市场分析', content: '【复盘】上午行情总结+午后策略', isImportant: true },
      { timeSlot: 'close', timeRange: '15:30-16:00', platform: 'wechat-serv', accountName: '收盘点评', category: '收盘分析', content: '【点评】全天回顾+明日展望' },
      { timeSlot: 'evening', timeRange: '19:00-20:00', platform: 'baijiahao', accountName: '深度研究', category: '行业研究', content: '【深度】新能源产业链投资机会' },
      { timeSlot: 'late', timeRange: '23:00+', platform: 'baijiahao', accountName: '海外动态', category: '国际市场', content: '【海外】美股三大指数收盘行情' },
    ]
  },
  {
    day: '周二',
    focus: '政策解读 & 个股研究',
    items: [
      { timeSlot: 'early', timeRange: '07:00-07:30', platform: 'wechat-sub', accountName: '政策解读', category: '政策分析', content: '【政策】央行货币政策最新动向解读' },
      { timeSlot: 'trading', timeRange: '盘中多时段', platform: 'baijiahao', accountName: '热点追踪', category: '板块轮动', content: '【热点】人工智能板块资金大举流入' },
      { timeSlot: 'close', timeRange: '15:30-16:00', platform: 'wechat-serv', accountName: '技术分析', category: '技术指标', content: '【技术】上证指数关键支撑位分析', isImportant: true },
      { timeSlot: 'evening', timeRange: '19:00-20:00', platform: 'baijiahao', accountName: '公司研究', category: '个股分析', content: '【个股】龙头公司财报业绩超预期解读' },
    ]
  },
  {
    day: '周三',
    focus: '投资策略 & 人物访谈 (黄金日)',
    items: [
      { timeSlot: 'early', timeRange: '07:00-07:30', platform: 'wechat-sub', accountName: '投资策略', category: '策略建议', content: '【策略】本周投资主线和配置建议', isImportant: true },
      { timeSlot: 'noon', timeRange: '12:00-12:30', platform: 'wechat-sub', accountName: '政策解读', category: '政策分析', content: '【政策】全面注册制影响解读' },
      { timeSlot: 'close', timeRange: '15:30-16:00', platform: 'wechat-serv', accountName: '机构观点', category: '机构分析', content: '【机构】主流券商明日策略观点汇总' },
      { timeSlot: 'evening', timeRange: '20:00-21:00', platform: 'baijiahao', accountName: '财经人物', category: '人物访谈', content: '【访谈】知名基金经理投资理念分享' },
    ]
  },
  {
    day: '周四',
    focus: '数据前瞻 & 技巧分享',
    items: [
      { timeSlot: 'early', timeRange: '07:00-07:30', platform: 'wechat-sub', accountName: '数据前瞻', category: '数据预告', content: '【预告】今日重要经济数据发布时间表' },
      { timeSlot: 'trading', timeRange: '盘中多时段', platform: 'baijiahao', accountName: '技术分析', category: '技术指标', content: '【技术】KDJ指标金叉买入信号' },
      { timeSlot: 'close', timeRange: '15:30-16:00', platform: 'wechat-serv', accountName: '行业轮动', category: '板块分析', content: '【轮动】周期股崛起背后的逻辑' },
      { timeSlot: 'evening', timeRange: '19:00-20:00', platform: 'baijiahao', accountName: '投资技巧', category: '技巧分享', content: '【技巧】如何把握波段操作机会' },
    ]
  },
  {
    day: '周五',
    focus: '周度总结 & 周末策略',
    items: [
      { timeSlot: 'early', timeRange: '07:00-07:30', platform: 'wechat-sub', accountName: '一周回顾', category: '周度总结', content: '【周评】本周行情回顾与下周展望' },
      { timeSlot: 'close', timeRange: '15:30-16:00', platform: 'wechat-serv', accountName: '一周策略', category: '策略汇总', content: '【汇总】本周主流机构策略观点集锦', isImportant: true },
      { timeSlot: 'evening', timeRange: '19:00-20:00', platform: 'baijiahao', accountName: '理财知识', category: '理财教育', content: '【理财】基金定投策略详解' },
      { timeSlot: 'late', timeRange: '23:00+', platform: 'baijiahao', accountName: '下周展望', category: '前瞻分析', content: '【展望】下周重要事件日程安排' },
    ]
  },
  {
    day: '周六',
    focus: '深度研究 & 经验分享',
    items: [
      { timeSlot: 'early', timeRange: '10:00', platform: 'wechat-sub', accountName: '深度研究', category: '行业深研', content: '【深度】行业发展趋势深度研报' },
      { timeSlot: 'noon', timeRange: '14:00', platform: 'wechat-serv', accountName: '案例分析', category: '案例研究', content: '【案例】成功投资案例深度剖析' },
      { timeSlot: 'evening', timeRange: '16:00', platform: 'baijiahao', accountName: '投资心得', category: '经验分享', content: '【心得】资深投资者实战经验分享' },
    ]
  },
  {
    day: '周日',
    focus: '宏观分析 & 政策策略',
    items: [
      { timeSlot: 'early', timeRange: '10:00', platform: 'wechat-sub', accountName: '宏观分析', category: '宏观研究', content: '【宏观】全球经济形势分析与展望', isImportant: true },
      { timeSlot: 'noon', timeRange: '14:00', platform: 'wechat-serv', accountName: '投资策略', category: '策略规划', content: '【策略】下周投资组合配置建议' },
      { timeSlot: 'evening', timeRange: '15:00', platform: 'baijiahao', accountName: '政策解读', category: '政策研究', content: '【政策】周末重要政策影响深度解读' },
    ]
  },
];

const TIME_SLOT_STRATEGIES = [
    { slot: '早盘前 (6-9点)', target: '专业/机构投资者', icon: <Sun className="w-4 h-4 text-orange-500" />, desc: '准备当日策略，需提供新闻摘要、隔夜动态、板块提示。' },
    { slot: '盘中 (9:30-15:00)', target: '交易员/盯盘散户', icon: <Activity className="w-4 h-4 text-red-500" />, desc: '需实时指导，提供异动提醒、资金流向、技术分析。' },
    { slot: '午盘后 (11:30-13:00)', target: '上班族/散户', icon: <Coffee className="w-4 h-4 text-brown-500" />, desc: '资讯消化，提供上午总结、热点深度分析、午后策略。' },
    { slot: '收盘后 (15:00-18:00)', target: '全员复盘', icon: <Flag className="w-4 h-4 text-blue-500" />, desc: '黄金窗口，提供全天总结、涨跌分析、明日展望。' },
    { slot: '晚间 (18:00-23:00)', target: '深度阅读者', icon: <BookOpen className="w-4 h-4 text-indigo-500" />, desc: '流量最高(24%)，适合发布深度研报、策略分享、人物访谈。' },
    { slot: '深夜 (23:00+)', target: '海外关注者', icon: <Moon className="w-4 h-4 text-slate-400" />, desc: '关注海外动态，提供美股行情、国际新闻、深度数据。' },
];

const PLATFORM_RULES = [
    { name: '微信公众号', rules: ['订阅号每日1次群发', '服务号每月4次', '商业推广必标"广告"', '财经内容原创权重30%'] },
    { name: '百家号', rules: ['转正号每日5篇', '原创号10篇', '财经需申请领域且持续产出', '恢复期7-30天'] },
    { name: '抖音/小红书', rules: ['必须专业资质认证', '禁止非法荐股/预测价位', '新笔记有1小时黄金观察期'] },
    { name: '今日头条', rules: ['首发激励需>100字', '财经资质要求严格', '新手期每日至少1篇'] },
];

// --- Component ---

export const ContentSchedule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'strategy' | 'compliance'>('schedule');

  const getPlatformStyle = (platform: string) => {
    switch(platform) {
        case 'wechat-sub': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200';
        case 'wechat-serv': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200';
        case 'baijiahao': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch(platform) {
        case 'wechat-sub': return '订阅号';
        case 'wechat-serv': return '服务号';
        case 'baijiahao': return '百家号';
        default: return platform;
    }
  };

  const getSlotColor = (slot: TimeSlot) => {
      switch(slot) {
          case 'early': return 'border-l-4 border-l-orange-400';
          case 'trading': return 'border-l-4 border-l-red-500';
          case 'noon': return 'border-l-4 border-l-yellow-400';
          case 'close': return 'border-l-4 border-l-blue-500';
          case 'evening': return 'border-l-4 border-l-indigo-500';
          case 'late': return 'border-l-4 border-l-slate-500';
          default: return '';
      }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-8 animate-fade-in flex flex-col overflow-hidden">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50">
        <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            财经内容分发指挥中心 (配置模式)
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            覆盖六大活跃时段 • 多平台合规运营 • 周期性SOP
            </p>
        </div>
        
        <div className="flex bg-white dark:bg-slate-700 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
            {[
                { id: 'schedule', label: '周期排期表', icon: <Layers className="w-4 h-4" /> },
                { id: 'strategy', label: '时段策略', icon: <Zap className="w-4 h-4" /> },
                { id: 'compliance', label: '合规红线', icon: <ShieldAlert className="w-4 h-4" /> }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
                    }`}
                >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 bg-gray-50 dark:bg-slate-900/20">
        
        {/* VIEW 1: SCHEDULE */}
        {activeTab === 'schedule' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {FINANCIAL_WEEKLY_PLAN.map((day, idx) => (
                    <div key={idx} className="flex flex-col min-w-[140px]">
                        {/* Day Header */}
                        <div className={`p-3 rounded-t-xl border-t border-x border-gray-200 dark:border-gray-700 text-center ${
                            idx >= 5 ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-white dark:bg-slate-800'
                        }`}>
                            <div className="font-bold text-gray-900 dark:text-white">{day.day}</div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 px-1 py-0.5 bg-gray-100 dark:bg-slate-700 rounded-full inline-block truncate max-w-full">
                                {day.focus}
                            </div>
                        </div>

                        {/* Items Container */}
                        <div className="flex-1 bg-white dark:bg-slate-800 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-xl p-2 space-y-2">
                            {day.items.map((item, i) => (
                                <div 
                                    key={i} 
                                    className={`relative p-2 rounded-lg border bg-white dark:bg-slate-700 hover:shadow-md transition-all group cursor-default ${getSlotColor(item.timeSlot)} ${item.isImportant ? 'ring-1 ring-yellow-400 dark:ring-yellow-500/50' : 'border-gray-100 dark:border-gray-600'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-mono text-gray-400">{item.timeRange}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${getPlatformStyle(item.platform)}`}>
                                            {getPlatformLabel(item.platform)}
                                        </span>
                                    </div>
                                    <div className="font-bold text-xs text-gray-800 dark:text-gray-200 mb-1 line-clamp-2" title={item.content}>
                                        {item.content}
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                         <span className="text-[10px] text-gray-500 bg-gray-50 dark:bg-slate-800 px-1 rounded">{item.category}</span>
                                         {item.isImportant && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* VIEW 2: STRATEGY */}
        {activeTab === 'strategy' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-primary" />
                        六大黄金时段用户画像
                    </h4>
                    <div className="space-y-4">
                        {TIME_SLOT_STRATEGIES.map((slot, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="mt-1 bg-gray-100 dark:bg-slate-700 p-2 rounded-lg">
                                    {slot.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{slot.slot}</span>
                                        <span className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                            {slot.target}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                        {slot.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                         <h4 className="font-bold mb-2 flex items-center"><BarChart className="w-5 h-5 mr-2" /> 爆款内容创作技巧</h4>
                         <ul className="space-y-3 text-sm text-indigo-100">
                             <li className="flex items-start gap-2">
                                 <span className="bg-white/20 p-1 rounded mt-0.5">1</span>
                                 <div>
                                    <strong className="text-white">数据可视化：</strong>
                                    <p>用动态图表呈现"近十年行业轮动规律"，关键数据加粗标注。</p>
                                 </div>
                             </li>
                             <li className="flex items-start gap-2">
                                 <span className="bg-white/20 p-1 rounded mt-0.5">2</span>
                                 <div>
                                    <strong className="text-white">场景化叙事：</strong>
                                    <p>把专业内容通俗化，如"从5万到500万的交易员日记"。</p>
                                 </div>
                             </li>
                             <li className="flex items-start gap-2">
                                 <span className="bg-white/20 p-1 rounded mt-0.5">3</span>
                                 <div>
                                    <strong className="text-white">热点借势：</strong>
                                    <p>政策发布24小时内出解读，如"央行降准的3个直接影响"。</p>
                                 </div>
                             </li>
                         </ul>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">周末策略差异</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">工作日特征</div>
                                <div className="font-bold text-sm text-gray-800 dark:text-white">流量与交易时间绑定</div>
                                <div className="text-xs text-green-600 mt-1">周三 20:00 为黄金推送点</div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">周末特征</div>
                                <div className="font-bold text-sm text-gray-800 dark:text-white">流量下降 40%-50%</div>
                                <div className="text-xs text-blue-600 mt-1">适合深度复盘与宏观分析</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* VIEW 3: COMPLIANCE */}
        {activeTab === 'compliance' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                 <div className="lg:col-span-2 space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-5">
                         <h4 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center">
                             <AlertTriangle className="w-5 h-5 mr-2" />
                             2025年财经新规红线 (重点必看)
                         </h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                             <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-red-100 dark:border-red-900/30">
                                 <div className="font-bold text-gray-800 dark:text-gray-200 mb-1">资质认证强更</div>
                                 <p className="text-gray-600 dark:text-gray-400 text-xs">抖音/小红书必须完成专业资质认证。个人号不得自称分析师，机构需上传牌照。</p>
                             </div>
                             <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-red-100 dark:border-red-900/30">
                                 <div className="font-bold text-gray-800 dark:text-gray-200 mb-1">非法荐股严打</div>
                                 <p className="text-gray-600 dark:text-gray-400 text-xs">严禁预测个股买卖价位、鼓吹未来走势。严打"加群"、"私发代码"行为。</p>
                             </div>
                             <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-red-100 dark:border-red-900/30">
                                 <div className="font-bold text-gray-800 dark:text-gray-200 mb-1">广告标注新规</div>
                                 <p className="text-gray-600 dark:text-gray-400 text-xs">所有商业推广必须标注"广告"，字样需在正文开头或标题下方，字号不小于正文。</p>
                             </div>
                              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-red-100 dark:border-red-900/30">
                                 <div className="font-bold text-gray-800 dark:text-gray-200 mb-1">AI内容规范</div>
                                 <p className="text-gray-600 dark:text-gray-400 text-xs">AI辅助生成内容必须显式标注。禁止利用AI编造虚假财经新闻。</p>
                             </div>
                         </div>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">各平台财经类特殊规则</h4>
                    <div className="space-y-4">
                        {PLATFORM_RULES.map((p, i) => (
                            <div key={i} className="flex flex-col sm:flex-row gap-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                <div className="w-32 font-bold text-primary flex-shrink-0">{p.name}</div>
                                <div className="flex flex-wrap gap-2">
                                    {p.rules.map((rule, idx) => (
                                        <span key={idx} className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs flex items-center">
                                            <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                            {rule}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 dark:bg-slate-900/50 p-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-400">
         <div className="flex items-center">
             <Flag className="w-3 h-3 mr-1" />
             建议根据每周五的数据复盘动态调整下周策略
         </div>
         <div>更新于: 2025.12.16</div>
      </div>
    </div>
  );
};