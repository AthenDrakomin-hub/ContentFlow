import React, { useState } from 'react';
import { X, Sparkles, Save, FileText, Loader2, Copy, Check } from 'lucide-react';
import { CourseScript } from '../types';
import { generateCourseScript } from '../services/geminiService';

interface CourseEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (script: CourseScript) => void;
  initialScript?: CourseScript | null;
}

export const CourseEditorModal: React.FC<CourseEditorModalProps> = ({ isOpen, onClose, onSave, initialScript }) => {
  const [formData, setFormData] = useState<Partial<CourseScript>>(
    initialScript || {
      topic: '',
      marketSentiment: 'neutral',
      keyPoints: [],
      scriptContent: '',
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      platform: 'feishu'
    }
  );
  const [pointInput, setPointInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleAddPoint = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pointInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        keyPoints: [...(prev.keyPoints || []), pointInput.trim()]
      }));
      setPointInput('');
    }
  };

  const removePoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyPoints: prev.keyPoints?.filter((_, i) => i !== index)
    }));
  };

  const handleGenerate = async () => {
    if (!formData.topic) return;
    setIsGenerating(true);
    try {
      const script = await generateCourseScript(
        formData.topic, 
        formData.marketSentiment || 'neutral', 
        formData.keyPoints || []
      );
      setFormData(prev => ({ ...prev, scriptContent: script }));
    } catch (e) {
      console.error(e);
      alert('生成失败，请检查API Key');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      id: formData.id || Date.now().toString(),
      keyPoints: formData.keyPoints || [],
      scriptContent: formData.scriptContent || '',
      status: formData.status || 'draft',
      date: formData.date || new Date().toISOString().split('T')[0],
      platform: 'feishu',
      marketSentiment: formData.marketSentiment || 'neutral',
      topic: formData.topic || '未命名课程'
    } as CourseScript);
    onClose();
  };

  const handleCopyToClipboard = () => {
      if(formData.scriptContent) {
          navigator.clipboard.writeText(formData.scriptContent);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
      }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
             <FileText className="w-5 h-5 mr-2 text-primary" />
             {initialScript ? '编辑图文讲义' : '新建图文讲义'}
          </h2>
          <div className="flex items-center gap-2">
             <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
               <X className="h-5 w-5" />
             </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Left Config Panel */}
            <div className="w-1/3 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-gray-50 dark:bg-slate-900/50">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">讲义主题</label>
                        <input 
                            type="text" 
                            value={formData.topic}
                            onChange={e => setFormData({...formData, topic: e.target.value})}
                            placeholder="例如：周五收盘总结与下周展望"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">市场情绪基调</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['bullish', 'neutral', 'bearish'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFormData({...formData, marketSentiment: s as any})}
                                    className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                                        formData.marketSentiment === s 
                                        ? s === 'bullish' ? 'bg-red-50 border-red-500 text-red-600 dark:bg-red-900/20' 
                                        : s === 'bearish' ? 'bg-green-50 border-green-500 text-green-600 dark:bg-green-900/20'
                                        : 'bg-gray-100 border-gray-400 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
                                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {s === 'bullish' ? '看多 🐂' : s === 'bearish' ? '看空 🐻' : '震荡 ⚖️'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">核心知识点 (回车添加)</label>
                        <input 
                            type="text" 
                            value={pointInput}
                            onChange={e => setPointInput(e.target.value)}
                            onKeyDown={handleAddPoint}
                            placeholder="输入要点..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none mb-2"
                        />
                        <div className="flex flex-wrap gap-2">
                            {formData.keyPoints?.map((p, i) => (
                                <span key={i} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs flex items-center">
                                    {p}
                                    <button onClick={() => removePoint(i)} className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"><X className="w-3 h-3" /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                         <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || !formData.topic}
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
                         >
                             {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />}
                             AI 一键生成讲义
                         </button>
                         <p className="text-xs text-center text-gray-400 mt-2">基于 Gemini 2.5 Flash • 针对飞书排版优化</p>
                    </div>
                </div>
            </div>

            {/* Right Editor Panel */}
            <div className="w-2/3 p-6 flex flex-col bg-white dark:bg-slate-800">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">讲义内容 (自动优化排版)</label>
                    <button 
                        onClick={handleCopyToClipboard}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isCopied ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-200'}`}
                    >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {isCopied ? '已复制' : '复制到飞书'}
                    </button>
                </div>
                <textarea 
                    value={formData.scriptContent}
                    onChange={e => setFormData({...formData, scriptContent: e.target.value})}
                    placeholder="在此撰写或等待 AI 生成..."
                    className="flex-1 w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-slate-900/50 text-gray-800 dark:text-gray-200 resize-none outline-none focus:border-primary font-mono text-base leading-relaxed"
                />
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 font-medium transition-all">取消</button>
            <button onClick={handleSubmit} className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium shadow-md transition-all flex items-center">
                <Save className="w-4 h-4 mr-2" />
                保存讲义
            </button>
        </div>
      </div>
    </div>
  );
};