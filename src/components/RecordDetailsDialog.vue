<script setup lang="ts">
import { nextTick, ref } from 'vue'
import TileHand from './TileHand.vue'
import { MODES, SUITS } from '../config/training'
import type { Attempt } from '../types/mahjong'

const dialog = ref<HTMLDialogElement | null>(null)
const record = ref<Attempt | null>(null)
async function open(attempt: Attempt) {
  record.value = attempt
  await nextTick()
  dialog.value?.showModal()
}
function close() { dialog.value?.close() }
defineExpose({ open })
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="record-dialog" aria-labelledby="record-detail-title" @cancel.prevent="close" @click="e => { if (e.target === dialog) close() }">
      <template v-if="record">
        <header><h2 id="record-detail-title">{{ MODES.find(m => m.id === record?.question.mode)?.name }} · 原题手牌</h2><button class="button-quiet" aria-label="关闭记录详情" @click="close">关闭 ×</button></header>
        <p class="muted">{{ new Date(record.time).toLocaleString('zh-CN', { hour12: false }) }} · {{ record.elapsed }} 秒 · {{ record.assisted ? '辅助作答' : '独立作答' }}</p>
        <TileHand :hand="record.question.hand" />
        <p>定缺：{{ SUITS[record.question.missing] }} · 七对{{ record.rules.sevenPairs ? '开启' : '关闭' }} · {{ record.correct ? record.question.mode === 'exchange' ? '换牌合法' : '回答正确' : '待巩固' }}</p>
        <RouterLink :to="`/train/${record.question.mode}?retry=${record.id}`" class="button" @click="close">用这手牌重练 →</RouterLink>
      </template>
    </dialog>
  </Teleport>
</template>
