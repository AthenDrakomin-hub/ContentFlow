import React, { useState } from 'react';
import { Globe, Mail, Lock, Loader2, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // Login successful, session state in App.tsx will update automatically via onAuthStateChange
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || '登录失败，请检查账号密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-900 font-inter">
      {/* Left Column: Hero Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Background Image */}
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
        
        {/* Branding Content */}
        <div className="relative z-10 w-full flex flex-col justify-between p-16 text-white">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40">
                        <Globe className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Ye Feng's Workbench</span>
                </div>
            </div>
            
            <div className="space-y-6 max-w-lg">
                <h1 className="text-5xl font-extrabold leading-tight">
                    构建您的<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">数字内容矩阵</span>
                </h1>
                <p className="text-lg text-slate-300 leading-relaxed">
                    全链路内容创作与分发指挥中心。集成 AI 辅助、多平台调度与实时数据分析，让每一次发布都精准触达。
                </p>
                
                <div className="flex gap-4 pt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>数据安全加密</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>企业级 SLA</span>
                    </div>
                </div>
            </div>

            <div className="text-sm text-slate-500">
                &copy; 2025 Ye Feng Studio. All rights reserved.
            </div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-slate-900 relative">
        <div className="mx-auto w-full max-w-sm lg:w-96">
            
            {/* Mobile Header (Only visible on small screens) */}
            <div className="lg:hidden flex justify-center mb-8">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Globe className="w-7 h-7 text-white" />
                </div>
            </div>

            <div className="text-center lg:text-left mb-10">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    欢迎回来
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    请输入您的管理员凭证以访问工作台
                </p>
            </div>

            <div className="mt-8">
                <form action="#" method="POST" className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            工作邮箱
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                密码
                            </label>
                        </div>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                                记住登录状态
                            </label>
                        </div>
                        <div className="text-sm">
                             <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors" onClick={(e) => {e.preventDefault(); alert('请联系系统管理员重置密码');}}>
                                忘记密码?
                             </a>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-900/30 animate-fade-in">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">登录失败</h3>
                                    <div className="mt-1 text-sm text-red-700 dark:text-red-200">
                                        {error}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-primary/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    安全验证中...
                                </>
                            ) : (
                                <>
                                    登录工作台
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        本系统仅限内部授权人员访问。<br/>
                        如需开通权限，请联系 IT 部门或管理员。
                    </p>
                    <div className="mt-4 flex justify-center gap-4 text-xs text-slate-400">
                        <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">帮助中心</span>
                        <span>•</span>
                        <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">隐私条款</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};