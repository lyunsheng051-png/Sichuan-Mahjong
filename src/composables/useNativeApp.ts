import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { ref } from 'vue'

const isAndroidApp = Capacitor.getPlatform() === 'android'
const exitPromptOpen = ref(false)
const exiting = ref(false)
const exitError = ref('')

export function useNativeApp() {
  function requestExit() { exitError.value = ''; exitPromptOpen.value = true }
  function cancelExit() { if (!exiting.value) exitPromptOpen.value = false }
  async function confirmExit() {
    if (!isAndroidApp || exiting.value) return
    exiting.value = true
    exitError.value = ''
    try { await App.exitApp() }
    catch { exitError.value = '暂时无法退出，请使用手机的返回键或主页手势。' }
    finally { exiting.value = false }
  }
  return { isAndroidApp, exitPromptOpen, exiting, exitError, requestExit, cancelExit, confirmExit }
}
