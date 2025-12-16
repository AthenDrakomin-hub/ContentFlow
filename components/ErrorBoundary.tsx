import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 text-center animate-fade-in my-4">
          <div className="bg-red-100 dark:bg-red-800 p-3 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-200" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">模块加载遇到问题</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
            无法显示此内容。可能是由于网络连接中断、资源加载超时或组件内部发生了错误。
          </p>
          <button
            onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
            }}
            className="flex items-center px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新页面重试
          </button>
          {this.state.error && (
            <details className="mt-6 text-left w-full max-w-lg">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 outline-none">点击查看错误详情 (技术信息)</summary>
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-black/50 rounded-lg text-[10px] text-red-500 font-mono overflow-auto max-h-32 border border-gray-200 dark:border-gray-800">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}