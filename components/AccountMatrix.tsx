import React from 'react';
import { Users, Plus, ExternalLink, RefreshCw, BarChart2, AlertCircle, CheckCircle, Shield, Zap } from 'lucide-react';
import { Account } from '../types';

interface AccountMatrixProps {
  accounts: Account[];
  onManage: () => void;
  onCreateTask: () => void;
}

export const AccountMatrix: React.FC<AccountMatrixProps> = ({ accounts, onManage, onCreateTask }) => {
  // Group accounts by platform
  const groupedAccounts: Record<string, Account[]> = accounts.reduce((acc, account) => {
    const key = account.platformName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  const getPlatformConfig = (name: string) => {
    if (name.includes('微信')) return { color: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30', iconBg: 'bg-green-600' };
    if (name.includes('百家')) return { color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30', iconBg: 'bg-blue-600' };
    if (name.includes('头条')) return { color: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30', iconBg: 'bg-red-500' };
    if (name.includes('知乎')) return { color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30', iconBg: 'bg-blue-500' };
    if (name.includes('小红书')) return { color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900/30', iconBg: 'bg-rose-500' };
    return { color: 'text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700', iconBg: 'bg-gray-500' };
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    return num > 10000 ? (num / 10000).toFixed(1) + 'w' : num > 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString();
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary" />
            账号矩阵指挥中心
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            已接入 {accounts.length} 个账号，覆盖 {Object.keys(groupedAccounts).length} 个主流平台
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onManage}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 font-medium transition-colors flex items-center"
          >
            <Shield className="w-4 h-4 mr-2" />
            授权管理 / 数据录入
          </button>
          <button 
            onClick={onManage}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors flex items-center shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            接入新账号
          </button>
        </div>
      </div>

      {/* Account Groups */}
      {Object.keys(groupedAccounts).length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-700">
           <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
             <Users className="w-8 h-8" />
           </div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white">暂无接入账号</h3>
           <p className="text-gray-500 mt-2 mb-6">建立媒体矩阵是打造个人IP的第一步</p>
           <button onClick={onManage} className="bg-primary text-white px-6 py-2 rounded-lg">立即接入</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {Object.entries(groupedAccounts).map(([platform, platformAccounts]) => {
            const config = getPlatformConfig(platform);
            return (
              <div key={platform} className="space-y-4">
                 <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${config.color}`}>
                      {platform}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {platformAccounts.length} 个账号
                    </span>
                    <div className="h-px flex-grow bg-gray-200 dark:bg-gray-700 ml-2"></div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {platformAccounts.map(account => {
                      return (
                        <div key={account.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                          {/* Status Bar */}
                          <div className={`h-1.5 w-full ${account.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          
                          <div className="p-5">
                             <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm ${config.iconBg}`}>
                                    {platform.substring(0, 1)}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{account.name}</h3>
                                    <div className="flex items-center text-xs gap-2 mt-0.5">
                                      {account.status === 'active' ? (
                                        <span className="flex items-center text-green-600 dark:text-green-400">
                                          <CheckCircle className="w-3 h-3 mr-1" /> 状态正常
                                        </span>
                                      ) : (
                                        <span className="flex items-center text-red-600 dark:text-red-400">
                                          <AlertCircle className="w-3 h-3 mr-1" /> 需要重新授权
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                             </div>
  
                             {/* Stats Grid - Using Real Data */}
                             <div className="grid grid-cols-3 gap-2 mb-4">
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg text-center">
                                   <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">粉丝数</div>
                                   <div className="font-bold text-gray-800 dark:text-white">{formatNumber(account.fans || 0)}</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg text-center">
                                   <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">昨日阅读</div>
                                   <div className="font-bold text-gray-800 dark:text-white">{formatNumber(account.reads || 0)}</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg text-center">
                                   <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">平台权重</div>
                                   <div className="font-bold text-yellow-500 flex items-center justify-center">
                                     LV.{account.weight || 1}
                                   </div>
                                </div>
                             </div>
  
                             {/* Actions */}
                             <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <button 
                                  onClick={onCreateTask}
                                  className="flex-1 py-2 text-xs font-medium bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center justify-center"
                                >
                                  <Zap className="w-3 h-3 mr-1.5" />
                                  发布
                                </button>
                                <button className="flex-1 py-2 text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors flex items-center justify-center group/btn">
                                  <RefreshCw className="w-3 h-3 mr-1.5 group-hover/btn:animate-spin" />
                                  同步
                                </button>
                                <button 
                                  onClick={onManage}
                                  className="flex-1 py-2 text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors flex items-center justify-center"
                                >
                                  <BarChart2 className="w-3 h-3 mr-1.5" />
                                  录入
                                </button>
                             </div>
                             
                             {/* Growth Badge */}
                             {account.growth && account.growth > 0 && (
                               <div className="absolute top-4 right-[-30px] rotate-45 bg-red-500 text-white text-[10px] py-0.5 px-8 font-bold shadow-sm">
                                 UP
                               </div>
                             )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Add New Card Placeholder */}
                    <div 
                      onClick={onManage}
                      className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center min-h-[240px] text-gray-400 hover:text-primary hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer transition-all"
                    >
                       <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                          <Plus className="w-6 h-6" />
                       </div>
                       <span className="font-medium text-sm">绑定新{platform}账号</span>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};