import React, { useState } from 'react';
import { X, Plus, Trash2, Users, Edit2, CheckCircle, AlertCircle, ArrowLeft, Save, RefreshCw, Link2 } from 'lucide-react';
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

  // Loading state for reconnecting
  const [reconnectingId, setReconnectingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setPlatform(PLATFORM_OPTIONS[0].value);
    setName('');
    setStatus('active');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPlatform = PLATFORM_OPTIONS.find(p => p.value === platform);
    
    const accountData = {
      platform,
      platformName: selectedPlatform?.label || '未知平台',
      name,
      status
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
        return <span className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>正常</span>;
      case 'expired':
        return <span className="flex items-center text-xs text-red-600 dark:text-red-400 font-medium px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>授权失效</span>;
      case 'connecting':
        return <span className="flex items-center text-xs text-yellow-600 dark:text-yellow-400 font-medium px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-full"><RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />连接中</span>;
    }
  };

  const getPlatformIcon = (platformValue: string) => {
    const opt = PLATFORM_OPTIONS.find(p => p.value === platformValue) || PLATFORM_OPTIONS[0];
    return (
      <div className={`w-12 h-12 rounded-xl ${opt.color} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
        {opt.icon}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl h-[650px] max-h-[90vh]">
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
                    账号管理
                  </>
                ) : (
                  <>{editingId ? '编辑账号' : '添加新账号'}</>
                )}
              </h2>
              {view === 'list' && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">管理各平台的发布权限与状态</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-900/50">
          {view === 'list' ? (
            <div className="space-y-4">
              <button 
                onClick={handleAddNew}
                className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group bg-white dark:bg-slate-800/50"
              >
                <div className="bg-gray-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 p-2 rounded-full mr-2 transition-colors">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="font-medium">添加新账号</span>
              </button>

              <div className="grid grid-cols-1 gap-4">
                {accounts.map(account => (
                  <div key={account.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getPlatformIcon(account.platform)}
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{account.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-nowrap">{account.platformName}</span>
                            <span className="text-xs text-gray-300 dark:text-gray-600">|</span>
                            {getStatusBadge(account.status)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {account.status === 'expired' && (
                          <button
                            onClick={() => handleReconnect(account)}
                            disabled={reconnectingId === account.id}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors shadow-sm mr-2"
                          >
                            <Link2 className="h-3 w-3 mr-1" />
                            {reconnectingId === account.id ? '连接中...' : '重新连接'}
                          </button>
                        )}
                        
                        <div className="flex gap-1 border-l border-gray-100 dark:border-gray-700 pl-3 ml-1">
                          <button 
                            onClick={() => handleEdit(account)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="编辑"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => onDelete(account.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="删除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {accounts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                   <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                     <Users className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                   </div>
                   <h3 className="text-lg font-medium text-gray-900 dark:text-white">暂无账号</h3>
                   <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xs">点击上方按钮添加您的第一个社交媒体账号</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto py-4">
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
                  <p className="text-xs text-gray-500 mt-1">给这个账号起一个易于识别的名称</p>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">账号状态 (模拟设置)</label>
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