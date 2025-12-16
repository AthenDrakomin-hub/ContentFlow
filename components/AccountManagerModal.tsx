
import React, { useState } from 'react';
import { X, Plus, Trash2, Users, Edit2, CheckCircle, AlertCircle, ArrowLeft, Save, RefreshCw, Link2, BarChart2, TrendingUp } from 'lucide-react';
import { Account, AccountStatus } from '../types';

interface AccountManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onAdd: (account: Omit<Account, 'id'>) => void;
  onUpdate: (account: Account) => void;
  onDelete: (id: string) => void;
}

const PLATFORM_OPTIONS = [
  { value: 'baijiahao', label: '百家号', color: 'bg-blue-600', icon: 'B' },
  { value: 'wechat-service', label: '微信服务号', color: 'bg-green-600', icon: 'W' },
  { value: 'wechat-sub', label: '微信订阅号', color: 'bg-green-500', icon: 'W' },
  { value: 'toutiao', label: '今日头条', color: 'bg-red-500', icon: 'T' },
  { value: 'zhihu', label: '知乎', color: 'bg-blue-500', icon: 'Z' },
  { value: 'xiaohongshu', label: '小红书', color: 'bg-rose-500', icon: 'X' },
];

export const AccountManagerModal: React.FC<AccountManagerModalProps> = ({
  isOpen, onClose, accounts, onAdd, onUpdate, onDelete
}) => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [platform, setPlatform] = useState(PLATFORM_OPTIONS[0].value);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<AccountStatus>('active');
  
  // New Stats Fields
  const [fans, setFans] = useState<string>('0');
  const [reads, setReads] = useState<string>('0');
  const [weight, setWeight] = useState<string>('1');
  const [growth, setGrowth] = useState<string>('0');

  // Loading state for reconnecting
  const [reconnectingId, setReconnectingId] = useState<string | null>(null);
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const resetForm = () => {
    setPlatform(PLATFORM_OPTIONS[0].value);
    setName('');
    setStatus('active');
    setFans('0');
    setReads('0');
    setWeight('1');
    setGrowth('0');
    setEditingId(null);
  };

  const handleAddNew = () => {
    resetForm();
    setView('form');
  };

  const handleEdit = (account: Account) => {
    setEditingId(account.id);
    setPlatform(account.platform);
    setName(account.name);
    setStatus(account.status);
    setFans(account.fans?.toString() || '0');
    setReads(account.reads?.toString() || '0');
    setWeight(account.weight?.toString() || '1');
    setGrowth(account.growth?.toString() || '0');
    setView('form');
  };

  const handleReconnect = (account: Account) => {
    setReconnectingId(account.id);
    // Update status to connecting immediately
    onUpdate({ ...account, status: 'connecting' });

    // Simulate API delay
    setTimeout(() => {
      onUpdate({ ...account, status: 'active' });
      setReconnectingId(null);
    }, 2000);
  };

  const handleSync = (id: string) => {
      setSyncingIds(prev => new Set(prev).add(id));
      // Simulate sync delay
      setTimeout(() => {
          setSyncingIds(prev => {
              const next = new Set(prev);
              next.delete(id);
              return next;
          });
      }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPlatform = PLATFORM_OPTIONS.find(p => p.value === platform);
    
    const accountData = {
      platform,
      platformName: selectedPlatform?.label || '未知平台',
      name,
      status,
      fans: parseInt(fans) || 0,
      reads: parseInt(reads) || 0,
      weight: parseInt(weight) || 1,
      growth: parseFloat(growth) || 0.0
    };

    if (editingId) {
      onUpdate({ ...accountData, id: editingId });
    } else {
      onAdd(accountData);
    }
    
    setView('list');
    resetForm();
  };

  const getStatusBadge = (status: AccountStatus) => {
    switch(status) {
      case 'active':
        return <span className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium px-2 py-0.5 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-100 dark:border-green-900/30">正常</span>;
      case 'expired':
        return <span className="flex items-center text-xs text-red-600 dark:text-red-400 font-medium px-2 py-0.5 bg-red-50 dark:bg-red-900/20 rounded-full border border-red-100 dark:border-red-900/30">失效</span>;
      case 'connecting':
        return <span className="flex items-center text-xs text-yellow-600 dark:text-yellow-400 font-medium px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-full border border-yellow-100 dark:border-yellow-900/30">连接中</span>;
    }
  };

  const getPlatformIcon = (platformValue: string) => {
    const opt = PLATFORM_OPTIONS.find(p => p.value === platformValue) || PLATFORM_OPTIONS[0];
    return (
      <div className={`w-10 h-10 rounded-lg ${opt.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
        {opt.icon}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl h-[700px] max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center">
            {view === 'form' && (
              <button 
                onClick={() => setView('list')}
                className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                {view === 'list' ? (
                  <>
                    <Users className="h-6 w-6 mr-2 text-primary" />
                    账号矩阵管理
                  </>
                ) : (
                  <>{editingId ? '编辑账号信息' : '添加新账号'}</>
                )}
              </h2>
              {view === 'list' && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">管理各平台的发布权限与运营数据</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-900/50">
          {view === 'list' ? (
            <div className="space-y-6">
              {/* Add New Button */}
              <button 
                onClick={handleAddNew}
                className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group bg-white dark:bg-slate-800/50 shadow-sm"
              >
                <div className="bg-gray-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 p-2 rounded-full mr-3 transition-colors">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="font-medium">接入新媒体账号</span>
              </button>

              {/* Account List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accounts.map(account => (
                  <div key={account.id} className="group bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all shadow-sm hover:shadow-md overflow-hidden flex flex-col">
                    {/* Status Strip */}
                    <div className={`h-1 w-full ${account.status === 'active' ? 'bg-green-500' : account.status === 'expired' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    
                    <div className="p-5 flex-1 flex flex-col">
                        {/* Header Section */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    {getPlatformIcon(account.platform)}
                                    {/* Status Dot */}
                                    <span className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white dark:border-slate-800 rounded-full ${account.status === 'active' ? 'bg-green-500' : account.status === 'expired' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-base truncate" title={account.name}>{account.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{account.platformName}</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                {getStatusBadge(account.status)}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-2 mb-5 py-3 border-y border-gray-50 dark:border-gray-700/50">
                            <div className="text-center">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">粉丝</div>
                                <div className="font-bold text-gray-800 dark:text-white text-sm">
                                    {account.fans ? (account.fans > 10000 ? (account.fans/10000).toFixed(1)+'w' : account.fans) : '-'}
                                </div>
                            </div>
                            <div className="text-center border-l border-gray-100 dark:border-gray-700">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">阅读</div>
                                <div className="font-bold text-gray-800 dark:text-white text-sm">
                                    {account.reads ? (account.reads > 10000 ? (account.reads/10000).toFixed(1)+'w' : account.reads) : '-'}
                                </div>
                            </div>
                            <div className="text-center border-l border-gray-100 dark:border-gray-700">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">权重</div>
                                <div className="font-bold text-yellow-500 text-sm">Lv.{account.weight || 1}</div>
                            </div>
                            <div className="text-center border-l border-gray-100 dark:border-gray-700">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">增长</div>
                                <div className={`font-bold text-sm flex items-center justify-center ${account.growth && account.growth > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                    {account.growth ? (
                                        <>
                                            {account.growth > 0 && <TrendingUp className="w-3 h-3 mr-0.5" />}
                                            {account.growth}%
                                        </>
                                    ) : '-'}
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="mt-auto flex items-center justify-between gap-2">
                            {account.status === 'expired' ? (
                                 <button
                                    onClick={() => handleReconnect(account)}
                                    disabled={reconnectingId === account.id}
                                    className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                  >
                                    <Link2 className={`h-3.5 w-3.5 mr-1.5 ${reconnectingId === account.id ? 'animate-spin' : ''}`} />
                                    {reconnectingId === account.id ? '连接中...' : '重新授权'}
                                  </button>
                            ) : (
                                <button 
                                    onClick={() => handleSync(account.id)}
                                    className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group/sync"
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${syncingIds.has(account.id) ? 'animate-spin' : 'group-hover/sync:rotate-180 transition-transform duration-500'}`} />
                                    {syncingIds.has(account.id) ? '同步中...' : '同步数据'}
                                </button>
                            )}
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleEdit(account)}
                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    title="编辑配置"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button 
                                    onClick={() => onDelete(account.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="解除绑定"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto py-4 animate-slide-up">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">选择平台</label>
                  <div className="grid grid-cols-2 gap-3">
                    {PLATFORM_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPlatform(opt.value)}
                        className={`flex items-center p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                          platform === opt.value
                            ? 'border-primary bg-blue-50 dark:bg-blue-900/20 ring-1 ring-primary'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg ${opt.color} flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0`}>
                          {opt.icon}
                        </div>
                        <span className={`text-sm font-medium ${platform === opt.value ? 'text-primary' : 'text-gray-700 dark:text-gray-200'}`}>
                          {opt.label}
                        </span>
                        {platform === opt.value && (
                          <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-bl-lg flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">账号名称</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="例如：科技观察号"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                        <BarChart2 className="w-4 h-4 mr-2" />
                        运营数据 (手动录入)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">粉丝数</label>
                            <input type="number" value={fans} onChange={e => setFans(e.target.value)} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">昨日阅读</label>
                            <input type="number" value={reads} onChange={e => setReads(e.target.value)} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:border-primary" />
                        </div>
                         <div>
                            <label className="block text-xs text-gray-500 mb-1">权重(1-5)</label>
                            <input type="number" max="5" min="1" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">周增长率 (%)</label>
                            <input type="number" step="0.1" value={growth} onChange={e => setGrowth(e.target.value)} className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:border-primary" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">账号状态</label>
                   <div className="flex space-x-4">
                      <label className={`flex-1 flex items-center justify-center cursor-pointer p-3 rounded-lg border transition-all ${status === 'active' ? 'bg-white dark:bg-slate-700 border-green-500 text-green-700 dark:text-green-400 shadow-sm' : 'border-transparent hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500'}`}>
                        <input 
                          type="radio" 
                          name="status" 
                          value="active" 
                          checked={status === 'active'} 
                          onChange={() => setStatus('active')}
                          className="sr-only" 
                        />
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium">正常</span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center cursor-pointer p-3 rounded-lg border transition-all ${status === 'expired' ? 'bg-white dark:bg-slate-700 border-red-500 text-red-700 dark:text-red-400 shadow-sm' : 'border-transparent hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500'}`}>
                        <input 
                          type="radio" 
                          name="status" 
                          value="expired" 
                          checked={status === 'expired'} 
                          onChange={() => setStatus('expired')}
                          className="sr-only" 
                        />
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm font-medium">授权失效</span>
                      </label>
                   </div>
                </div>

                <div className="pt-4 flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 font-medium transition-all"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={!name}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center shadow-lg shadow-primary/30"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    <span>{editingId ? '保存更改' : '添加账号'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
