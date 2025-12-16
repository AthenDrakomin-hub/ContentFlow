
import React, { useState, useEffect } from 'react';
import { Clipboard, Scissors, Calculator, Smile, Trash2, ArrowRight, Percent, Copy, Check, Stethoscope, AlertTriangle, ShieldCheck, Activity, Link, Plus, Globe, ExternalLink, RefreshCw } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { DevTool } from '../types';

export const DevToolbox: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'cleaner' | 'calc' | 'emoji' | 'diagnosis' | 'custom'>('diagnosis');
  const [calcValues, setCalcValues] = useState({ buy: '', sell: '', shares: '' });
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Custom Tools State (Now fetched from DB)
  const [customTools, setCustomTools] = useState<DevTool[]>([]);
  const [isLoadingTools, setIsLoadingTools] = useState(false);
  
  const [isAddingTool, setIsAddingTool] = useState(false);
  const [newTool, setNewTool] = useState({ name: '', url: '', description: '' });

  // Diagnosis State
  const [diagValues, setDiagValues] = useState({
    freq: 10,
    money: 5,
    fullPosition: false,
    stopLoss: true
  });

  // Fetch Tools from Supabase
  const fetchTools = async () => {
    setIsLoadingTools(true);
    try {
      const { data, error } = await supabase
        .from('dev_tools')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setCustomTools(data as DevTool[]);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setIsLoadingTools(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'custom') {
      fetchTools();
    }
  }, [activeTab]);

  // Text Cleaner Logic
  const cleanText = () => {
    // Remove empty lines, trim spaces
    const cleaned = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n\n'); // Add double spacing for readability
    setInputText(cleaned);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(id);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  // Stock Calculator Logic
  const calculateProfit = () => {
    const buy = parseFloat(calcValues.buy);
    const sell = parseFloat(calcValues.sell);
    const shares = parseFloat(calcValues.shares);
    
    if (isNaN(buy) || isNaN(sell)) return null;
    
    const diff = sell - buy;
    const percent = ((diff / buy) * 100).toFixed(2);
    const profit = isNaN(shares) ? 0 : (diff * shares).toFixed(2);
    
    return { percent, profit, diff: diff.toFixed(3) };
  };

  const profitData = calculateProfit();

  // Custom Tool Logic
  const handleAddTool = async () => {
      if(!newTool.name || !newTool.url) return;
      let formattedUrl = newTool.url;
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
          formattedUrl = 'https://' + formattedUrl;
      }
      
      try {
        const { data, error } = await supabase
          .from('dev_tools')
          .insert([{
            name: newTool.name,
            url: formattedUrl,
            description: newTool.description || '暂无描述',
            type: 'custom',
            status: 'active'
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setCustomTools(prev => [data as DevTool, ...prev]);
          setNewTool({ name: '', url: '', description: '' });
          setIsAddingTool(false);
        }
      } catch (error) {
        console.error('Error adding tool:', error);
        alert('添加失败');
      }
  };

  const handleDeleteTool = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if(window.confirm('确定删除该工具吗？')) {
          try {
            const { error } = await supabase.from('dev_tools').delete().eq('id', id);
            if (error) throw error;
            setCustomTools(prev => prev.filter(t => t.id !== id));
          } catch (error) {
            console.error('Delete failed:', error);
            alert('删除失败');
          }
      }
  };

  // Diagnosis Logic based on PDF Report
  const getDiagnosisResult = () => {
    let riskScore = 0;
    const risks = [];
    const advises = [];

    // 1. Frequency Analysis (Report 2.1 & 1.2)
    if (diagValues.freq > 20) {
      riskScore += 40;
      risks.push({ title: "高频交易陷阱", desc: "月交易大于20次，报告显示亏损率高达82%。手续费损耗约24%。" });
    } else if (diagValues.freq > 10) {
      riskScore += 20;
      risks.push({ title: "交易频率偏高", desc: "容易陷入追涨杀跌的恶性循环。" });
    } else {
      advises.push("交易频率健康，符合机构投资者特征(平均持股190天)。");
    }

    // 2. Money Analysis (Report 1.2)
    if (diagValues.money <= 10) {
      riskScore += 30;
      risks.push({ title: "小资金困境", desc: "10万以下散户亏损比例98.7%。抗风险能力弱。" });
    } else {
      advises.push("资金规模适中，更有利于资产配置。");
    }

    // 3. Position Strategy (Report 2.3)
    if (diagValues.fullPosition) {
      riskScore += 20;
      risks.push({ title: "满仓操作风险", desc: "满仓新手亏损比例76%，远高于分仓操作(31%)。" });
    }

    // 4. Stop Loss (Report 2.3)
    if (!diagValues.stopLoss) {
      riskScore += 10;
      risks.push({ title: "缺乏止损意识", desc: "超过60%散户因拒绝止损陷入'鸵鸟心态'，导致深套。" });
    }

    let level = "低风险";
    let color = "text-green-500";
    if (riskScore > 70) { level = "极高危 (韭菜王)"; color = "text-red-600"; }
    else if (riskScore > 40) { level = "高风险"; color = "text-orange-500"; }
    else if (riskScore > 20) { level = "中等风险"; color = "text-yellow-500"; }

    return { riskScore, risks, advises, level, color };
  };

  const diagResult = getDiagnosisResult();

  const STOCK_EMOJIS = [
    "📈", "📉", "🐂", "🐻", "💰", "💸", "💎", "🚀", "🛑", "⚠️", "💡", "📢", "📊", "🕯️", "✅", "❌"
  ];
  
  const STOCK_PHRASES = [
    "放量突破", "缩量回调", "多头排列", "底背离", "顶背离", "金叉", "死叉", "主力资金", "获利盘", "支撑位", "压力位"
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">实用工具箱</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">文本清洗 / 账户诊断 / 常用语速查 / 自定义工具</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tools Navigation & Calculator */}
        <div className="space-y-6">
             {/* Navigation */}
             <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-2">
                <button 
                    onClick={() => setActiveTab('diagnosis')}
                    className={`flex items-center p-3 rounded-xl transition-all ${activeTab === 'diagnosis' ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                    <Stethoscope className="w-5 h-5 mr-3" />
                    <span className="font-medium">账户体检仪</span>
                </button>
                <button 
                    onClick={() => setActiveTab('cleaner')}
                    className={`flex items-center p-3 rounded-xl transition-all ${activeTab === 'cleaner' ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                    <Scissors className="w-5 h-5 mr-3" />
                    <span className="font-medium">文本清洗站</span>
                </button>
                <button 
                    onClick={() => setActiveTab('calc')}
                    className={`flex items-center p-3 rounded-xl transition-all ${activeTab === 'calc' ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                    <Calculator className="w-5 h-5 mr-3" />
                    <span className="font-medium">股票计算器</span>
                </button>
                <button 
                    onClick={() => setActiveTab('emoji')}
                    className={`flex items-center p-3 rounded-xl transition-all ${activeTab === 'emoji' ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                    <Smile className="w-5 h-5 mr-3" />
                    <span className="font-medium">Emoji & 术语</span>
                </button>
                <button 
                    onClick={() => setActiveTab('custom')}
                    className={`flex items-center p-3 rounded-xl transition-all ${activeTab === 'custom' ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                    <Link className="w-5 h-5 mr-3" />
                    <span className="font-medium">我的收藏夹</span>
                </button>
             </div>

             {/* Mini Calculator */}
             {activeTab === 'calc' && (
                 <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                        <Percent className="w-5 h-5 mr-2 text-green-500" />
                        涨跌幅计算
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">买入价</label>
                            <input 
                                type="number" 
                                value={calcValues.buy}
                                onChange={e => setCalcValues({...calcValues, buy: e.target.value})}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">卖出价 (当前价)</label>
                            <input 
                                type="number" 
                                value={calcValues.sell}
                                onChange={e => setCalcValues({...calcValues, sell: e.target.value})}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                         <div>
                            <label className="block text-xs text-gray-500 mb-1">持仓股数 (选填)</label>
                            <input 
                                type="number" 
                                value={calcValues.shares}
                                onChange={e => setCalcValues({...calcValues, shares: e.target.value})}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        
                        {profitData && (
                            <div className={`mt-4 p-4 rounded-xl border ${parseFloat(profitData.percent) >= 0 ? 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-900/30' : 'bg-green-50 border-green-100 text-green-600 dark:bg-green-900/20 dark:border-green-900/30'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm">涨跌幅</span>
                                    <span className="text-xl font-bold">{parseFloat(profitData.percent) > 0 ? '+' : ''}{profitData.percent}%</span>
                                </div>
                                {calcValues.shares && (
                                     <div className="flex justify-between items-center text-sm opacity-80">
                                        <span>盈亏金额</span>
                                        <span>{profitData.profit}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                 </div>
             )}
        </div>

        {/* Right Column: Main Tool Area */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Account Diagnosis Tool */}
            {activeTab === 'diagnosis' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center">
                            <Stethoscope className="w-6 h-6 mr-2 text-primary" />
                            账户风险体检 (基于2025调研报告)
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">月均交易次数</label>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="range" min="0" max="50" step="1"
                                        value={diagValues.freq}
                                        onChange={e => setDiagValues({...diagValues, freq: parseInt(e.target.value)})}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <span className="w-12 text-center font-mono font-bold text-gray-800 dark:text-white">{diagValues.freq}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">报告参考值：大于 20次/月 为高危</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">资金规模 (万元)</label>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="range" min="1" max="100" step="1"
                                        value={diagValues.money}
                                        onChange={e => setDiagValues({...diagValues, money: parseInt(e.target.value)})}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <span className="w-12 text-center font-mono font-bold text-gray-800 dark:text-white">{diagValues.money}w</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">报告参考值：小于 10万 亏损率极高</p>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">习惯满仓操作?</label>
                                <button 
                                    onClick={() => setDiagValues({...diagValues, fullPosition: !diagValues.fullPosition})}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${diagValues.fullPosition ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${diagValues.fullPosition ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">严格执行止损?</label>
                                <button 
                                    onClick={() => setDiagValues({...diagValues, stopLoss: !diagValues.stopLoss})}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${diagValues.stopLoss ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${diagValues.stopLoss ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>

                        {/* Result Card */}
                        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-5 border border-gray-200 dark:border-gray-600 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">综合风险评级</div>
                                    <div className={`text-2xl font-bold mt-1 ${diagResult.color}`}>{diagResult.level}</div>
                                </div>
                                <div className={`p-2 rounded-full ${diagResult.riskScore > 40 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    <Activity className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {diagResult.risks.map((risk, i) => (
                                    <div key={i} className="flex gap-3 text-sm">
                                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-gray-800 dark:text-gray-200 block">{risk.title}</span>
                                            <span className="text-gray-500 dark:text-gray-400 text-xs">{risk.desc}</span>
                                        </div>
                                    </div>
                                ))}
                                {diagResult.advises.map((advise, i) => (
                                    <div key={i} className="flex gap-3 text-sm">
                                        <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-600 dark:text-gray-300">{advise}</span>
                                    </div>
                                ))}
                                {diagResult.risks.length === 0 && (
                                    <div className="text-center text-gray-400 text-sm py-4">您的操作习惯非常健康！请继续保持。</div>
                                )}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 text-[10px] text-gray-400 text-center">
                                数据来源:《2025年12月新入市亏损短线散户现状调研报告》
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'cleaner' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center">
                            <Scissors className="w-5 h-5 mr-2 text-primary" />
                            文本格式清洗
                        </h3>
                        <div className="flex gap-2">
                             <button 
                                onClick={() => setInputText('')}
                                className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 bg-gray-100 dark:bg-slate-700 rounded-lg transition-colors flex items-center"
                            >
                                <Trash2 className="w-3 h-3 mr-1" /> 清空
                            </button>
                            <button 
                                onClick={cleanText}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center"
                            >
                                <ArrowRight className="w-3 h-3 mr-1" /> 执行清洗
                            </button>
                        </div>
                    </div>
                    <textarea 
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder="在此粘贴乱糟糟的新闻或文本，点击清洗去除空行和格式..."
                        className="flex-1 w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-slate-900/50 text-gray-800 dark:text-gray-200 resize-none outline-none focus:border-primary font-mono text-sm leading-relaxed min-h-[400px]"
                    />
                    <div className="mt-4 flex justify-end">
                        <button 
                            onClick={() => copyText(inputText, 'cleaner-copy')}
                            className="flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium text-sm transition-transform active:scale-95"
                        >
                            {copyFeedback === 'cleaner-copy' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copyFeedback === 'cleaner-copy' ? '已复制' : '复制结果'}
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'emoji' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full animate-fade-in">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                        <Smile className="w-5 h-5 mr-2 text-yellow-500" />
                        讲课常用 Emoji & 术语
                    </h3>
                    
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">常用表情</h4>
                            <div className="grid grid-cols-8 gap-3">
                                {STOCK_EMOJIS.map((emoji, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => copyText(emoji, `emoji-${idx}`)}
                                        className="aspect-square flex items-center justify-center text-2xl bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 hover:scale-110 transition-all relative group"
                                    >
                                        {emoji}
                                        {copyFeedback === `emoji-${idx}` && (
                                            <div className="absolute inset-0 bg-primary/90 rounded-xl flex items-center justify-center">
                                                <Check className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">高频术语 (点击复制)</h4>
                            <div className="flex flex-wrap gap-3">
                                {STOCK_PHRASES.map((phrase, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => copyText(phrase, `phrase-${idx}`)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                                            copyFeedback === `phrase-${idx}`
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary'
                                        }`}
                                    >
                                        {phrase}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">💡 飞书排版小技巧</h4>
                            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                                <li>使用 **文字** 进行加粗强调</li>
                                <li>使用 &gt; 引用之前的观点</li>
                                <li>emoji 放在段落开头作为视觉索引</li>
                                <li>重要结论建议单独成行</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'custom' && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full animate-fade-in flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-white flex items-center">
                            <Link className="w-5 h-5 mr-2 text-blue-500" />
                            我的常用工具
                        </h3>
                        <div className="flex gap-2">
                             <button 
                                onClick={fetchTools} 
                                className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                             >
                                <RefreshCw className={`w-4 h-4 ${isLoadingTools ? 'animate-spin' : ''}`} />
                             </button>
                             <button 
                                onClick={() => setIsAddingTool(true)}
                                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                添加工具
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
                        {isLoadingTools ? (
                             <div className="col-span-full text-center py-10 text-gray-400">加载工具中...</div>
                        ) : customTools.length === 0 ? (
                            <div className="col-span-full text-center py-10 text-gray-400">
                                暂无收藏工具，点击上方按钮添加
                            </div>
                        ) : (
                            customTools.map(tool => (
                                <div key={tool.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all group relative bg-gray-50 dark:bg-slate-700/30">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-gray-500">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{tool.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{tool.description}</p>
                                            </div>
                                        </div>
                                        <a 
                                            href={tool.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                    <button 
                                        onClick={(e) => handleDeleteTool(tool.id, e)}
                                        className="absolute top-2 right-12 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="删除"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add Tool Modal */}
                    {isAddingTool && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md p-6 shadow-2xl animate-slide-up">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">添加新工具</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">工具名称</label>
                                        <input 
                                            type="text" 
                                            value={newTool.name}
                                            onChange={e => setNewTool({...newTool, name: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="例如: ChatGPT"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">网址 URL</label>
                                        <input 
                                            type="text" 
                                            value={newTool.url}
                                            onChange={e => setNewTool({...newTool, url: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="例如: https://openai.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">简介</label>
                                        <input 
                                            type="text" 
                                            value={newTool.description}
                                            onChange={e => setNewTool({...newTool, description: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="简短描述该工具的用途"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            onClick={() => setIsAddingTool(false)}
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
                                        >
                                            取消
                                        </button>
                                        <button 
                                            onClick={handleAddTool}
                                            disabled={!newTool.name || !newTool.url}
                                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            添加
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
