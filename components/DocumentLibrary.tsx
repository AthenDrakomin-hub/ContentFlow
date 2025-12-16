import React, { useState, useEffect, useRef } from 'react';
import { FileText, Image, FileSpreadsheet, File, FolderOpen, UploadCloud, Search, Download, Trash2, FileCode, HardDrive, User, RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface DocFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'img' | 'code' | 'other';
  size: string;
  updatedAt: string;
  author: string;
  storage_path?: string;
}

export const DocumentLibrary: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'doc' | 'img' | 'sheet'>('all');
  const [search, setSearch] = useState('');
  const [files, setFiles] = useState<DocFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setFiles(data as DocFile[]);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id: string, path?: string) => {
    if(window.confirm('确认删除该文件吗？此操作不可恢复。')) {
      try {
        // 1. Delete from Storage (if path exists)
        if (path) {
            const { error: storageError } = await supabase.storage.from('documents').remove([path]);
            if (storageError) console.warn('Storage delete warning:', storageError);
        }

        // 2. Delete from Database
        const { error } = await supabase.from('documents').delete().eq('id', id);
        if (error) throw error;
        
        setFiles(prev => prev.filter(f => f.id !== id));
      } catch (error) {
        console.error('Delete failed:', error);
        alert('删除失败，请检查权限');
      }
    }
  }

  const handleDownload = async (file: DocFile) => {
      if (!file.storage_path) {
          alert("此文件未关联存储路径 (可能是演示数据)");
          return;
      }
      try {
          // Create a signed URL valid for 5 minutes
          const { data, error } = await supabase.storage
              .from('documents')
              .createSignedUrl(file.storage_path, 300);
          
          if (error) throw error;
          if (data?.signedUrl) {
              window.open(data.signedUrl, '_blank');
          }
      } catch (error) {
          console.error('Download error', error);
          alert("无法获取下载链接");
      }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Simple validation (Max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert("文件大小不能超过 10MB");
        return;
    }

    setIsUploading(true);
    try {
        // 1. Upload to Supabase Storage
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'unknown';
        // Sanitize filename: timestamp + safe characters
        const sanitizedName = file.name.replace(/[^\x00-\x7F]/g, "_"); 
        const filePath = `${Date.now()}_${sanitizedName}`;

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Insert metadata into Database
        const sizeStr = file.size < 1024 * 1024 
            ? `${(file.size / 1024).toFixed(1)} KB`
            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

        const { data: userData } = await supabase.auth.getUser();
        const author = userData.user?.email?.split('@')[0] || '夜风'; // Default fallback

        // Determine type category
        let docType: any = 'other';
        if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(fileExt)) docType = 'doc';
        else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(fileExt)) docType = 'img';
        else if (['xls', 'xlsx', 'csv'].includes(fileExt)) docType = 'sheet';
        else if (['js', 'ts', 'tsx', 'py', 'json', 'sql', 'html', 'css'].includes(fileExt)) docType = 'code';
        else if (['pdf'].includes(fileExt)) docType = 'pdf';

        const newDoc = {
            name: file.name,
            type: docType,
            size: sizeStr,
            updatedAt: new Date().toISOString().split('T')[0],
            author: author,
            storage_path: filePath
        };
        
        const { data, error: dbError } = await supabase
            .from('documents')
            .insert([newDoc])
            .select()
            .single();

        if (dbError) throw dbError;
        if (data) setFiles(prev => [data as DocFile, ...prev]);
        
    } catch (error: any) {
        console.error('Upload error:', error);
        alert('上传失败: ' + (error.message || '未知错误'));
    } finally {
        setIsUploading(false);
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  const filteredFiles = files.filter(f => {
    const term = search.toLowerCase();
    const matchesSearch = 
        f.name.toLowerCase().includes(term) || 
        f.author.toLowerCase().includes(term) ||
        f.type.toLowerCase().includes(term);

    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'doc' ? ['pdf', 'doc', 'code', 'txt'].includes(f.type)
      : filter === 'img' ? ['img', 'png', 'jpg', 'jpeg'].includes(f.type)
      : filter === 'sheet' ? ['xls', 'csv', 'xlsx'].includes(f.type)
      : true;
    return matchesSearch && matchesFilter;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc': return <FileText className="w-8 h-8 text-blue-500" />;
      case 'xls': 
      case 'xlsx': return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
      case 'img': 
      case 'png':
      case 'jpg': return <Image className="w-8 h-8 text-purple-500" />;
      case 'code': return <FileCode className="w-8 h-8 text-yellow-500" />;
      default: return <File className="w-8 h-8 text-gray-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
        case 'pdf':
        case 'doc': return 'bg-blue-50 dark:bg-blue-900/20';
        case 'xls': 
        case 'xlsx': return 'bg-green-50 dark:bg-green-900/20';
        case 'img': 
        case 'png':
        case 'jpg': return 'bg-purple-50 dark:bg-purple-900/20';
        case 'code': return 'bg-yellow-50 dark:bg-yellow-900/20';
        default: return 'bg-gray-50 dark:bg-slate-700/50';
    }
  }

  return (
    <div className="animate-fade-in space-y-6 h-full flex flex-col">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileSelect} 
      />
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">文档资源库</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">集中管理课程讲义、研报与素材</p>
        </div>
        <div className="flex gap-2">
            <button onClick={fetchDocuments} className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                 <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isUploading}
                className="bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-md transition-all"
            >
                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                {isUploading ? '上传中...' : '上传文件'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Sidebar Filter */}
        <div className="col-span-1 space-y-6">
             <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="文件名 / 作者 / 类型..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white transition-all"
                    />
                </div>
                <div className="space-y-1">
                    {[
                        { id: 'all', label: '全部文件', icon: <FolderOpen className="w-4 h-4" /> },
                        { id: 'doc', label: '文档 & 代码', icon: <FileText className="w-4 h-4" /> },
                        { id: 'img', label: '图片素材', icon: <Image className="w-4 h-4" /> },
                        { id: 'sheet', label: '数据表格', icon: <FileSpreadsheet className="w-4 h-4" /> },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setFilter(item.id as any)}
                            className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === item.id 
                                ? 'bg-primary/10 text-primary' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
             </div>

             <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center text-sm font-bold text-gray-800 dark:text-white mb-4">
                    <HardDrive className="w-4 h-4 mr-2 text-gray-500" />
                    存储空间
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>已用 45.2 GB</span>
                        <span>总共 100 GB</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-[45%] h-full rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mb-2"></div>
                            <div className="text-xs text-gray-400">文档</div>
                            <div className="text-sm font-bold text-gray-800 dark:text-white">12 GB</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mb-2"></div>
                            <div className="text-xs text-gray-400">媒体</div>
                            <div className="text-sm font-bold text-gray-800 dark:text-white">28 GB</div>
                        </div>
                    </div>
                </div>
             </div>
        </div>

        {/* File Grid */}
        <div className="col-span-1 lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm overflow-y-auto min-h-[500px]">
             {isLoading ? (
                 <div className="flex flex-col items-center justify-center h-full text-gray-400">
                     <p>加载文件中...</p>
                 </div>
             ) : filteredFiles.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-gray-400">
                     <FolderOpen className="w-16 h-16 mb-4 opacity-20" />
                     <p>未找到符合条件的文件</p>
                 </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredFiles.map(file => (
                        <div key={file.id} className="group relative p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:shadow-md transition-all bg-white dark:bg-slate-800">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${getBgColor(file.type)}`}>
                                    {getFileIcon(file.type)}
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button 
                                        onClick={() => handleDownload(file)}
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-gray-400 hover:text-primary"
                                        title="下载"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(file.id, file.storage_path)} 
                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-gray-400 hover:text-red-500"
                                        title="删除"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-white truncate mb-1" title={file.name}>{file.name}</h3>
                                <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                                    <span className="flex items-center" title="作者">
                                        <User className="w-3 h-3 mr-1 opacity-70" />
                                        {file.author}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span>{file.size}</span>
                                        <span className="opacity-50">|</span>
                                        <span>{file.updatedAt?.slice(5) || ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Upload Card */}
                    <div 
                        onClick={() => fileInputRef.current?.click()} 
                        className={`border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center p-4 text-gray-400 hover:border-primary hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer min-h-[140px] ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {isUploading ? (
                             <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                        ) : (
                             <UploadCloud className="w-8 h-8 mb-2" />
                        )}
                        <span className="text-sm font-medium">{isUploading ? '正在上传...' : '点击上传新文件'}</span>
                    </div>
                </div>
             )}
        </div>
      </div>
    </div>
  );
};