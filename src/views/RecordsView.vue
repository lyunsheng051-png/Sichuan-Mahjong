<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useProgress } from '../composables/useProgress'
import { MODES } from '../config/training'
import PaginationBar from '../components/PaginationBar.vue'
import TileHand from '../components/TileHand.vue'
import RecordDetailsDialog from '../components/RecordDetailsDialog.vue'
import { useLandscapeLayout } from '../composables/useLandscapeLayout'
const { attempts, clearAttempts } = useProgress()
const filter = ref('all')
const page = ref(1)
const size = ref(10)
const { compact } = useLandscapeLayout()
const sizes = computed(() => compact.value ? [5, 10] : [10, 20, 50])
const details = ref<InstanceType<typeof RecordDetailsDialog> | null>(null)
const filtered = computed(() => attempts.value.filter(a => filter.value === 'all' || (filter.value === 'wrong' ? !a.correct : a.assisted)))
const visible = computed(() => filtered.value.slice((page.value-1)*size.value, page.value*size.value))
watch(filter, () => { page.value = 1 })
function clear() { if (window.confirm('清空当前设备中的全部练习记录？此操作无法撤销。')) clearAttempts() }
</script>
<template>
  <div class="records-page">
  <section class="page-heading compact"><div><p class="eyebrow">回看，比多刷一题更有用</p><h1>练习记录</h1><p class="muted">保留最近300次作答。重做沿用当时的手牌和七对规则。</p></div><button v-if="attempts.length" class="button-quiet" @click="clear">清空记录</button></section>
  <div class="filter-tabs" role="group" aria-label="记录筛选"><button v-for="f in [{ id:'all', label:'全部练习' },{ id:'wrong', label:'错题重练' },{ id:'assisted', label:'辅助作答' }]" :key="f.id" :class="{ chosen: filter === f.id }" :aria-pressed="filter===f.id" @click="filter=f.id">{{ f.label }}</button></div>
  <div v-if="!filtered.length" class="empty-state"><span>记</span><h2>{{ attempts.length ? '这里暂时没有记录' : '第一道题，从这里开始' }}</h2><p>每一次主动判断，都会留下可以回看的线索。</p><RouterLink to="/train/memory" class="button">练一题手牌快照 →</RouterLink></div>
  <div v-else class="records-list" :style="{ '--record-rows': Math.ceil(visible.length / 5) }"><article v-for="a in visible" :key="a.id" class="record-card"><div class="record-meta"><strong>{{ MODES.find(m=>m.id===a.question.mode)?.name }}</strong><span class="tag" :class="{ bad: !a.correct }">{{ a.correct ? a.question.mode === 'exchange' ? '合法' : '正确' : '待巩固' }} · {{ a.assisted ? '辅助' : '独立' }}</span><span class="muted">{{ a.elapsed }} 秒 · {{ new Date(a.time).toLocaleString('zh-CN', compact ? { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false } : { hour12: false }) }}</span></div><TileHand :hand="a.question.hand" small class="record-hand" /><div class="record-actions"><button v-if="compact" class="text-link" @click="details?.open(a)">牌面</button><RouterLink :to="`/train/${a.question.mode}?retry=${a.id}`" class="text-link">{{ compact ? '重练 ↗' : '用同一手牌再练一次 ↗' }}</RouterLink></div></article></div>
  <PaginationBar v-model:page="page" v-model:size="size" :total="filtered.length" :sizes="sizes" />
  </div>
  <RecordDetailsDialog ref="details" />
</template>
