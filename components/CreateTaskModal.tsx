import React, { useState, useEffect } from 'react';
import { X, Bold, Italic, List, ListOrdered, Link, Eraser, Save, Eye, Copy, Check, Sparkles, Loader2, Search, Shield, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { Task, Account, Template, AuditResult } from '../types';
import { optimizeContent } from '../services/geminiService';
import { TEMPLATES, performAudit } from '../utils/compliance';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialTask?: Task | null;
  showToast: (msg: string) => void;
  accounts: Account[];
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onSave, initialTask, showToast, accounts }) => {
  const [step, setStep] = useState<'template' | 'editor'>('template');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'baijiahao' | 'wechat'>('all');
  
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    content: '',
    publishDate: new Date().toISOString().split('T')[0],
    publishTime: '12:00',
    platform: '',
    tags: [],
    status: 'pending'
  });
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<{ violations: AuditResult[], safeItems: string[], suggestions: string[] } | null>(null);

  useEffect(() => {
    if (initialTask) {
      setFormData(initialTask);
      setStep('editor');
    } else {
      setFormData({
        title: '',
        content: '',
        publishDate: new Date().toISOString().split('T')[0],
        publishTime: '12:00',
        platform: accounts.length > 0 ? `${accounts[0].platform} - ${accounts[0].name}` : '',
        tags: [],
        status: 'pending'
      });
      setStep('template');
    }
    setAuditResults(null);
  }, [initialTask, isOpen, accounts]);

  if (!isOpen) return null;

  const handleAiOptimize = async () => {
    if (!formData.title && !formData.content) {
      showToast("请输入内容以进行优化");
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await optimizeContent(formData.title || '', formData.content || '');
      setFormData(prev => ({
        ...prev,
        title: result.title,
        content: result.content
      }));
      showToast("内容已由 AI 优化！");
    } catch (error) {
      console.error(error);
      showToast("AI 优化失败，请检查 API 配置。");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleTemplateSelect = (template: Template) => {
    // Attempt to find a valid account for this template
    const validAccount = accounts.find(a => 
      a.status === 'active' && 
      ((template.platform === 'baijiahao' && a.platform.includes('百家号')) || 
       (template.platform === 'wechat' && a.platform.includes('服务号')))
    );

    const fallbackAccount = accounts.find(a => 
      (template.platform === 'baijiahao' && a.platform.includes('百家号')) || 
      (template.platform === 'wechat' && a.platform.includes('服务号'))
    );

    const selectedAccount = validAccount || fallbackAccount;
    const platformString = selectedAccount ? `${selectedAccount.platform} - ${selectedAccount.name}` : formData.platform;

    setFormData(prev => ({
      ...prev,
      title: template.title,
      content: template.content,
      platform: platformString
    }));
    setStep('editor');
    showToast(`已加载 ${template.name}`);
  };

  const handleAudit = () => {
    if (!formData.title || !formData.content) {
      showToast('请先输入标题和内容');
      return;
    }
    setIsAuditing(true);
    setTimeout(() => {
      const results = performAudit(formData.title || '', formData.content || '', formData.platform || '');
      setAuditResults(results);
      setIsAuditing(false);
      showToast('合规审核完成');
    }, 800);
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  // Helper to render platform badge
  const PlatformBadge = ({ platform, icon, label, count }: { platform: string, icon: any, label: string, count: string }) => (
    <button 
      onClick={() => setSelectedPlatform(platform as any)}
      className={`p-4 rounded-xl border transition-all flex items-center justify-center space-x-3 ${
        selectedPlatform === platform 
        ? 'bg-primary text-white border-primary shadow-lg scale-105' 
        : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
      }`}
    >
      <div className="text-2xl">{icon}</div>
      <div className="text-left">
        <div className="font-bold">{label}</div>
        <div className="text-xs opacity-80">{count}</div>
      </div>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-7xl min-h-[80vh] flex flex-col shadow-2xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {initialTask ? '编辑任务' : '创建发布任务'}
            </h2>
            {step === 'editor' && !initialTask && (
              <button onClick={() => setStep('template')} className="text-sm text-primary hover:underline flex items-center">
                <span className="mr-1">←</span> 重新选择模板
              </button>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 bg-gray-50 dark:bg-slate-900/50 overflow-y-auto">
          
          {step === 'template' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PlatformBadge 
                  platform="baijiahao" 
                  icon={<div className="font-serif">百</div>} 
                  label="百家号" 
                  count="8个账号管理" 
                />
                <PlatformBadge 
                  platform="wechat" 
                  icon={<div className="font-serif">微</div>} 
                  label="微信公众号" 
                  count="2个服务号" 
                />
                <PlatformBadge 
                  platform="all" 
                  icon={<div className="font-serif">全</div>} 
                  label="全部平台" 
                  count="统一管理" 
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">个性化模板选择</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.values(TEMPLATES).filter(t => selectedPlatform === 'all' || t.platform === selectedPlatform).map(template => (
                    <div key={template.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1 group">
                      <div className={`h-2 bg-${template.color}-500`}></div>
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className={`text-${template.color}-500 mr-3`}>
                            {/* Simple icon mapping based on color or id if specific icons not available in lucide */}
                            <Sparkles className="h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-10 line-clamp-2">{template.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.tags.map((tag, i) => (
                            <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${tag.color}-100 text-${tag.color}-800 dark:bg-${tag.color}-900/30 dark:text-${tag.color}-300`}>
                              {tag.text}
                            </span>
                          ))}
                        </div>
                        <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                          {template.rules.map((rule, i) => (
                            <div key={i} className="flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                              <span>{rule}</span>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => handleTemplateSelect(template)}
                          className={`w-full py-2 rounded-lg font-medium transition-all bg-${template.color}-500 hover:bg-${template.color}-600 text-white`}
                        >
                          选择模板
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'editor' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in h-full">
              {/* Left Column: Editor */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">计划发布时间</label>
                      <div className="flex space-x-3">
                        <input 
                          type="date" 
                          value={formData.publishDate}
                          onChange={e => setFormData({...formData, publishDate: e.target.value})}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <input 
                          type="time" 
                          value={formData.publishTime}
                          onChange={e => setFormData({...formData, publishTime: e.target.value})}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">发布账号</label>
                      <select 
                        value={formData.platform}
                        onChange={e => setFormData({...formData, platform: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 disabled:text-gray-500"
                      >
                        <option value="" disabled>选择账号</option>
                        {accounts.map(account => (
                          <option 
                            key={account.id} 
                            value={`${account.platform} - ${account.name}`}
                            disabled={account.status !== 'active'}
                          >
                            {account.platformName} - {account.name} {account.status !== 'active' ? '(授权失效)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标题</label>
                    <div className="flex gap-2">
                       <input 
                        type="text" 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="输入内容标题..." 
                        className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-primary/50 text-lg font-medium"
                      />
                       <button 
                        onClick={handleAiOptimize}
                        disabled={isAiLoading}
                        className="bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 px-4 rounded-lg font-medium transition-all flex items-center"
                        title="AI 优化标题与内容"
                      >
                        {isAiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <label className="text-sm font-medium text-gray-700 dark:text-gray-300">内容正文</label>
                       {auditResults && (
                         <span className={`text-xs px-2 py-1 rounded-full ${auditResults.violations.length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                           {auditResults.violations.length > 0 ? '发现违规' : '合规'}
                         </span>
                       )}
                    </div>
                    
                    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden flex flex-col h-[500px]">
                      <div className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-gray-600 p-2 flex flex-wrap gap-1 flex-shrink-0">
                        <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300"><Bold className="h-4 w-4" /></button>
                        <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300"><Italic className="h-4 w-4" /></button>
                        <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300"><List className="h-4 w-4" /></button>
                        <button className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300"><Link className="h-4 w-4" /></button>
                        <div className="flex-grow"></div>
                        <button onClick={() => setFormData({...formData, title: '', content: ''})} className="p-1.5 rounded hover:bg-red-100 text-red-500" title="清空"><Eraser className="h-4 w-4" /></button>
                      </div>
                      <textarea
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        className="w-full h-full p-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-200 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                        placeholder="在此输入内容..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Audit & Controls */}
              <div className="flex flex-col gap-6">
                 {/* Audit Panel */}
                 <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                      合规审核
                    </h3>
                    
                    <button 
                      onClick={handleAudit}
                      disabled={isAuditing}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center mb-6 shadow-md shadow-blue-500/20"
                    >
                      {isAuditing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Search className="h-5 w-5 mr-2" />}
                      <span>{isAuditing ? '正在审核...' : '开始合规审核'}</span>
                    </button>

                    <div className="flex-1 overflow-y-auto min-h-[300px] space-y-4 pr-1 scrollbar-thin">
                      {!auditResults ? (
                         <div className="text-center text-gray-500 dark:text-gray-400 py-10 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-dashed border-gray-200 dark:border-gray-600">
                           <Shield className="h-10 w-10 mx-auto mb-3 opacity-20" />
                           <p className="text-sm">点击上方按钮开始审核</p>
                           <p className="text-xs mt-1 opacity-70">系统将自动检测违规词汇与平台规则</p>
                         </div>
                      ) : (
                        <>
                          {auditResults.violations.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg p-4">
                              <h4 className="text-sm font-bold text-red-700 dark:text-red-300 mb-2 flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                发现违规内容 ({auditResults.violations.length})
                              </h4>
                              <div className="space-y-3">
                                {auditResults.violations.map((v, i) => (
                                  <div key={i} className="text-xs bg-white dark:bg-slate-800 p-2 rounded border border-red-100 dark:border-red-900/30">
                                    <div className="font-medium text-red-600">{v.type}</div>
                                    <div className="text-gray-600 dark:text-gray-300 my-1">"{v.content}"</div>
                                    <div className="text-red-500">建议: {v.suggestion}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {auditResults.safeItems.length > 0 && (
                             <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg p-4">
                               <h4 className="text-sm font-bold text-green-700 dark:text-green-300 mb-2 flex items-center">
                                 <Check className="h-4 w-4 mr-1" />
                                 合规项
                               </h4>
                               <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
                                 {auditResults.safeItems.map((item, i) => (
                                   <li key={i} className="flex items-center">
                                     <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                                     {item}
                                   </li>
                                 ))}
                               </ul>
                             </div>
                          )}

                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4">
                            <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                              <Lightbulb className="h-4 w-4 mr-1" />
                              优化建议
                            </h4>
                            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                              {auditResults.suggestions.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                 </div>

                 <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-1" />
                      平台规则提醒
                    </h4>
                    <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
                       {formData.platform.includes('百家号') ? (
                         <>
                           <li>• 禁止使用"最"、"第一"等极限用语</li>
                           <li>• 电话信息必须真实有效并标注</li>
                         </>
                       ) : formData.platform.includes('服务号') ? (
                         <>
                           <li>• AI生成内容必须标注说明</li>
                           <li>• 每月仅4次群发机会</li>
                         </>
                       ) : (
                         <li>• 请遵守相关法律法规与平台规范</li>
                       )}
                    </ul>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-slate-800 z-10 rounded-b-2xl">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            {step === 'editor' && (
              <span>字数统计: {formData.content?.length || 0} 字</span>
            )}
          </div>
          <div className="flex space-x-3">
             <button onClick={onClose} className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-all">
                取消
             </button>
             {step === 'editor' && (
               <>
                 <button className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-all flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">预览</span>
                 </button>
                 <button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center shadow-lg shadow-primary/30">
                    <Check className="h-5 w-5 mr-2" />
                    <span>{initialTask ? '更新任务' : '创建任务'}</span>
                 </button>
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};