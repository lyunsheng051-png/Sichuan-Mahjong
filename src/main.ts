import { createApp } from 'vue'
import { Capacitor } from '@capacitor/core'
import App from './App.vue'
import { router } from './router'
import './styles/main.css'
import './styles/landscape.css'
import './styles/workspace.css'

if (Capacitor.isNativePlatform()) document.documentElement.classList.add('native-app')

createApp(App).use(router).mount('#app')
