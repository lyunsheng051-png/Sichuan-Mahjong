<script setup lang="ts">
import { useProgress } from '../composables/useProgress'
const { todayCount, storageFailed } = useProgress()
</script>
<template>
  <div class="app-shell">
    <aside class="sidebar">
      <RouterLink to="/" class="brand"><span class="brand-seal">上</span><span>上桌<span class="brand-sub">川麻练习室</span></span></RouterLink>
      <div class="nav-caption">把规则，练成反应</div>
      <nav aria-label="主导航">
        <RouterLink to="/" class="nav-link" exact-active-class="active"><span>⌂</span>今日练习</RouterLink>
        <RouterLink to="/train/memory" class="nav-link" active-class="active"><span>▦</span>手牌快照</RouterLink>
        <RouterLink to="/train/claim" class="nav-link" active-class="active"><span>↗</span>碰杠反应</RouterLink>
        <RouterLink to="/train/wait" class="nav-link" active-class="active"><span>◎</span>听牌侦探</RouterLink>
        <RouterLink to="/train/discard" class="nav-link" active-class="active"><span>⇄</span>打哪张能听</RouterLink>
        <RouterLink to="/train/exchange" class="nav-link" active-class="active"><span>↻</span>换三张练习</RouterLink>
      </nav>
      <div class="nav-divider"></div>
      <nav aria-label="学习工具">
        <RouterLink to="/records" class="nav-link" active-class="active"><span>▤</span>练习记录</RouterLink>
        <RouterLink to="/lab" class="nav-link" active-class="active"><span>⊞</span>手牌实验室</RouterLink>
        <RouterLink to="/guide" class="nav-link" active-class="active"><span>☷</span>上桌手册</RouterLink>
      </nav>
      <div class="sidebar-bottom"><span class="status-dot"></span>只和昨天的自己比<p>今天已经主动判断 {{ todayCount }} 次</p></div>
    </aside>
    <div class="main-shell"><header class="topbar"><span>四川麻将 / 缺一门 · 换三张</span><RouterLink to="/guide">慢一点，看清楚，再出手 <span>↗</span></RouterLink></header><main><p v-if="storageFailed" class="notice" role="alert">浏览器无法保存记录，本次仍可练习；请检查存储空间或隐私设置。</p><slot /></main><footer class="app-footer">上桌 SHANGZHUO <span>练的是判断，不是输赢。进度仅保存在当前浏览器。</span></footer></div>
  </div>
</template>
