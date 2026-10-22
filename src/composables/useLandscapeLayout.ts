import { Capacitor } from '@capacitor/core'
import { onMounted, onUnmounted, ref } from 'vue'

/** 安卓横屏始终使用紧凑布局；浏览器的小高度横屏也可预览相同布局。 */
export function useLandscapeLayout() {
  const landscape = window.matchMedia('(orientation: landscape)')
  const shortWindow = window.matchMedia('(max-height: 650px)')
  const isAndroid = Capacitor.getPlatform() === 'android'
  const compact = ref(landscape.matches && (isAndroid || shortWindow.matches))
  const update = () => { compact.value = landscape.matches && (isAndroid || shortWindow.matches) }
  onMounted(() => {
    landscape.addEventListener('change', update)
    shortWindow.addEventListener('change', update)
    update()
  })
  onUnmounted(() => {
    landscape.removeEventListener('change', update)
    shortWindow.removeEventListener('change', update)
  })
  return { compact }
}
