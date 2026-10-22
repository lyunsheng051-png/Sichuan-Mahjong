<script setup lang="ts">
import { useProgress } from '../composables/useProgress'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NativeExitButton from '../components/NativeExitButton.vue'
import { useLandscapeLayout } from '../composables/useLandscapeLayout'
const { todayCount, storageFailed } = useProgress()
const route = useRoute()
const isTraining = computed(() => route.path.startsWith('/train/'))
const { compact } = useLandscapeLayout()
const oneScreen = computed(() => compact.value && ['/', '/records', '/lab'].includes(route.path))
const trainingLinks = [
  { to: '/', icon: '⌂', label: '今日练习', short: '首页' },
  { to: '/train/memory', icon: '▦', label: '手牌快照', short: '记牌' },
  { to: '/train/claim', icon: '↗', label: '碰杠反应', short: '碰杠' },
  { to: '/train/wait', icon: '◎', label: '听牌侦探', short: '听牌' },
  { to: '/train/discard', icon: '⇄', label: '打哪张能听', short: '弃牌' },
  { to: '/train/exchange', icon: '↻', label: '换三张练习', short: '换牌' },
]
const toolLinks = [
  { to: '/records', icon: '▤', label: '练习记录', short: '记录' },
  { to: '/lab', icon: '⊞', label: '手牌实验室', short: '验牌' },
  { to: '/guide', icon: '☷', label: '上桌手册', short: '手册' },
]
</script>
<template>
  <div class="app-shell" :class="{ 'is-training': isTraining, 'landscape-shell': compact, 'workspace-fit': oneScreen }">
    <aside class="sidebar">
      <div class="sidebar-navigation">
      <RouterLink to="/" class="brand"><span class="brand-seal">上</span><span>上桌<span class="brand-sub">川麻练习室</span></span></RouterLink>
      <div class="nav-caption">把规则，练成反应</div>
      <nav aria-label="主导航">
        <RouterLink v-for="item in trainingLinks" :key="item.to" :to="item.to" class="nav-link" exact-active-class="active" :aria-label="item.label" :title="item.label"><span aria-hidden="true">{{ item.icon }}</span><span class="nav-label">{{ item.label }}</span><span class="nav-short" aria-hidden="true">{{ item.short }}</span></RouterLink>
      </nav>
      <div class="nav-divider"></div>
      <nav aria-label="学习工具">
        <RouterLink v-for="item in toolLinks" :key="item.to" :to="item.to" class="nav-link" exact-active-class="active" :aria-label="item.label" :title="item.label"><span aria-hidden="true">{{ item.icon }}</span><span class="nav-label">{{ item.label }}</span><span class="nav-short" aria-hidden="true">{{ item.short }}</span></RouterLink>
      </nav>
      </div>
      <NativeExitButton />
      <div class="sidebar-bottom"><span class="status-dot"></span>只和昨天的自己比<p>今天已经主动判断 {{ todayCount }} 次</p></div>
    </aside>
    <div class="main-shell"><header class="topbar"><span>四川麻将 / 缺一门 · 换三张</span><RouterLink to="/guide">慢一点，看清楚，再出手 <span>↗</span></RouterLink></header><main><p v-if="storageFailed" class="notice" role="alert">本机暂时无法保存记录，本次仍可练习；请检查存储空间。</p><slot /></main><footer class="app-footer">上桌 SHANGZHUO <span>练的是判断，不是输赢。进度保存在当前设备，App与浏览器分别保存。</span></footer></div>
  </div>
</template>
