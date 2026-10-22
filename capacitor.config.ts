import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'io.github.lyunsheng051.shangzhuo',
  appName: '上桌·川麻练习室',
  webDir: 'dist',
  backgroundColor: '#f5f7f2',
  // 打包本地资源，不依赖开发服务器或远程网站。
  server: { androidScheme: 'https' },
  android: { allowMixedContent: false, minWebViewVersion: 109 },
  plugins: {
    SystemBars: { insetsHandling: 'native', style: 'LIGHT' },
  },
}

export default config
