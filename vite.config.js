import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量，允许 VITE_ 前缀
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      // 关键配置：将 process.env.API_KEY 映射到 Vercel 的环境变量 VITE_API_KEY
      // 这样可以无需修改您的业务代码即可在浏览器中使用
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY)
    }
  }
})