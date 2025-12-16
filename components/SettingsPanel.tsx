
import React, { useState, useEffect, useRef } from 'react';
import { Save, User, Bell, Shield, Database, Moon, Sun, Smartphone, Mail, Trash2, LogOut, Download, RefreshCw, Loader2, Camera, Upload } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface SettingsPanelProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  showToast: (msg: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isDarkMode, toggleTheme, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState({
    name: '夜风',
    title: '资深内容运营',
    bio: '专注金融投资领域内容创作',
    email: 'yefeng@example.com',
    avatar: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklyReport: true
  });

  // Fetch Profile on Mount
  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
         setProfile(prev => ({...prev, email: user.email || ''}));
         
         const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
         
         if (data) {
           setProfile({
              name: data.name || '',
              title: data.title || '',
              bio: data.bio || '',
              email: user.email || '',
              avatar: data.avatar || ''
           });
           if (data.notificationPreferences) {
              setNotifications(data.notificationPreferences);
           }
         }
      }
    };
    getProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');

        const updates = {
            id: user.id,
            name: profile.name,
            title: profile.title,
            bio: profile.bio,
            avatar: profile.avatar,
            notificationPreferences: notifications,
            updated_at: new Date()
        };

        const { error } = await supabase.from('profiles').upsert(updates);
        if (error) throw error;
        
        showToast('设置已保存');
    } catch (error: any) {
        console.error(error);
        showToast('保存失败: ' + error.message);
    } finally {
        setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('请选择图片');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('未登录');

      const filePath = `avatars/${user.id}/${fileName}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('documents') // Reusing the documents bucket as setup in README
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // 3. Update Local State & Auto Save to DB
      setProfile(prev => ({ ...prev, avatar: publicUrl }));
      
      // Auto-save the avatar URL to profile immediately
      await supabase.from('profiles').upsert({
          id: user.id,
          avatar: publicUrl,
          updated_at: new Date()
      });

      showToast('头像更新成功');
    } catch (error: any) {
      console.error(error);
      showToast('头像上传失败: ' + error.message);
    } finally {
      setUploading(false);
      // Clear input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLogout = async () => {
     if(window.confirm('确定要退出登录吗？')) {
         await supabase.auth.signOut();
     }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">系统设置</h2>
           <p className="text-gray-500 dark:text-gray-400 mt-1">管理您的个人资料、偏好设置与系统配置</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {loading ? '保存中...' : '保存更改'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
               <User className="w-5 h-5 mr-2 text-primary" />
               个人资料
             </h3>
             <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-3">
                   <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                       {profile.avatar ? (
                           <img 
                              src={profile.avatar} 
                              alt="Avatar" 
                              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
                           />
                       ) : (
                           <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white dark:border-slate-700">
                              {profile.name.charAt(0)}
                           </div>
                       )}
                       
                       {/* Hover Overlay */}
                       <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           {uploading ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Camera className="w-8 h-8 text-white" />}
                       </div>
                   </div>
                   
                   <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleAvatarUpload}
                   />
                   
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="text-sm text-primary font-medium hover:underline flex items-center"
                     disabled={uploading}
                   >
                     {uploading ? '上传中...' : '更换头像'}
                   </button>
                </div>

                <div className="flex-1 space-y-4 w-full">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">昵称</label>
                        <input 
                          type="text" 
                          value={profile.name}
                          onChange={e => setProfile({...profile, name: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">职位头衔</label>
                        <input 
                          type="text" 
                          value={profile.title}
                          onChange={e => setProfile({...profile, title: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                   </div>
                   <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">个人简介</label>
                        <textarea 
                          value={profile.bio}
                          onChange={e => setProfile({...profile, bio: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 h-24 resize-none"
                        />
                   </div>
                   <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">登录邮箱 (只读)</label>
                        <input 
                          type="text" 
                          value={profile.email}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed"
                        />
                   </div>
                </div>
             </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
               <Bell className="w-5 h-5 mr-2 text-primary" />
               偏好设置
             </h3>
             
             <div className="space-y-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700/50">
                   <div>
                      <div className="font-medium text-gray-900 dark:text-white">外观模式</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">切换浅色/深色主题界面</div>
                   </div>
                   <button 
                      onClick={toggleTheme}
                      className="flex items-center bg-gray-100 dark:bg-slate-700 p-1 rounded-lg border border-gray-200 dark:border-gray-600"
                   >
                      <div className={`p-2 rounded-md transition-all ${!isDarkMode ? 'bg-white shadow text-yellow-500' : 'text-gray-400'}`}>
                         <Sun className="w-4 h-4" />
                      </div>
                      <div className={`p-2 rounded-md transition-all ${isDarkMode ? 'bg-slate-600 shadow text-blue-400' : 'text-gray-400'}`}>
                         <Moon className="w-4 h-4" />
                      </div>
                   </button>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700/50">
                   <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 mt-1">
                         <Mail className="w-4 h-4" />
                      </div>
                      <div>
                         <div className="font-medium text-gray-900 dark:text-white">邮件通知</div>
                         <div className="text-sm text-gray-500 dark:text-gray-400">接收任务提醒和周报</div>
                      </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                   </label>
                </div>

                 <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700/50">
                   <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400 mt-1">
                         <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                         <div className="font-medium text-gray-900 dark:text-white">推送通知</div>
                         <div className="text-sm text-gray-500 dark:text-gray-400">浏览器桌面通知</div>
                      </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notifications.push} onChange={() => setNotifications({...notifications, push: !notifications.push})} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                   </label>
                </div>
             </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
           {/* Data Management */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
               <Database className="w-5 h-5 mr-2 text-primary" />
               数据管理
             </h3>
             <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors group">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">导出所有数据 (JSON)</span>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors group">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">清理本地缓存</span>
                    <RefreshCw className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                </button>
             </div>
           </div>

           {/* Security / Danger Zone */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
               <Shield className="w-5 h-5 mr-2 text-primary" />
               账户安全
             </h3>
             <div className="space-y-4">
                 <button className="w-full py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                     修改密码
                 </button>
                 
                 <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center py-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        退出登录
                    </button>
                 </div>
                 
                 <div className="pt-2">
                    <button className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-red-500 transition-colors text-xs">
                        <Trash2 className="w-3 h-3 mr-1" />
                        注销账户 (慎用)
                    </button>
                 </div>
             </div>
           </div>

           {/* Info */}
           <div className="text-center text-xs text-gray-400">
               <p>Ye Feng's Workbench v1.0.0</p>
               <p className="mt-1">Build 2025.12.16</p>
           </div>
        </div>
      </div>
    </div>
  );
};
