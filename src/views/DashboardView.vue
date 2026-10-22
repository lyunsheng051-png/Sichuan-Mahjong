<script setup lang="ts">
import TileHand from '../components/TileHand.vue'
import { MODES } from '../config/training'
import { useProgress } from '../composables/useProgress'
const { todayCount, accuracy, unassisted } = useProgress()
const demoHand = [0,1,2,4,4,9,10,11,12,13,18,18,18]
function recent(mode: string) {
  const rows = unassisted.value.filter(a=>a.question.mode===mode).slice(0,20)
  return rows.length ? `最近${rows.length}次独立作答 · ${Math.round(rows.filter(a=>a.correct).length/rows.length*100)}%正确` : '还没有独立作答记录'
}
</script>
<template>
  <div class="dashboard-page">
  <section class="page-heading"><div><p class="eyebrow">每天一点，慢慢上桌</p><h1>懂规则之后，<br class="mobile-only" />练到看得出来。</h1><p class="muted">不用一次记住所有牌。今天，先让一次判断变得轻松。</p></div><span class="edition">练习册 <b>壹</b></span></section>
  <section class="hero-table">
    <div class="hero-copy"><span class="table-tag">今日主练 / 手牌快照</span><h2>先记住你的对子。<br />下一张牌，就有了线索。</h2><p>看牌 → 移开视线 → 主动回忆 → 核对<br />从“系统提醒我”，到“我自己发现”。</p><RouterLink class="button button-light" to="/train/memory">开始手牌练习 <span>↗</span></RouterLink></div>
    <div class="hero-tiles"><span class="table-mark">川</span><div class="table-note">这手牌，哪些能碰？</div><TileHand :hand="demoHand.slice(0,5)" /><TileHand :hand="demoHand.slice(5,10)" /><TileHand :hand="demoHand.slice(10)" /><span class="tile-caption">不背十三张，先看成几组。</span></div>
  </section>
  <section class="stats-strip" aria-label="练习统计"><div><span>今日主动判断</span><strong>{{ todayCount }} <small>次</small></strong></div><div><span>独立作答准确率</span><strong>{{ accuracy === null ? '—' : `${accuracy}%` }}</strong></div><div><span>已记录独立作答</span><strong>{{ unassisted.length }} <small>次</small></strong></div><p>提示后答对，值得鼓励。<br />统计基于最近300次记录。</p></section>
  <div class="section-heading"><div><p class="eyebrow">拆开练，才练得准</p><h2>你的五个小练习</h2></div><RouterLink to="/guide" class="text-link">查看进阶路线 ↗</RouterLink></div>
  <section class="drill-grid"><RouterLink v-for="(item, i) in MODES" :key="item.id" :to="`/train/${item.id}`" class="drill-card"><div class="card-top"><span class="drill-number">{{ ['记','碰','听','打','换'][i] }}</span><span class="muted">{{ item.minutes }}</span></div><h3>{{ item.name }} <span>↗</span></h3><p>{{ item.description }}</p><div class="drill-progress">{{ item.id === 'exchange' ? '练习合法换牌与重新整理' : recent(item.id) }}</div><span class="card-bottom">{{ item.short }} <span>进入练习 →</span></span></RouterLink></section>
  <section class="daily-note"><span class="note-symbol">听</span><div><h3>今天先记一个检查顺序</h3><p>别人出牌：看定缺 → 对照对子、刻子。轮到自己：看完整组 → 找将牌 → 再看剩余搭子。每次摸打后，都更新一次。</p></div><RouterLink to="/guide" class="text-link">翻开手册 ↗</RouterLink></section>
  </div>
</template>
