<script setup lang="ts">
import { computed, ref } from 'vue'
import TilePicker from '../components/TilePicker.vue'
import TileHand from '../components/TileHand.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { discardOptions, sortHand, waitingTiles, winningShape } from '../services/mahjong'
import { SUITS } from '../config/training'
import { useProgress } from '../composables/useProgress'
import type { Suit } from '../types/mahjong'
const { preferences } = useProgress()
const hand = ref<number[]>([])
const missing = ref<Suit>(2)
const analyzed = ref(false)
const message = ref('')
const page = ref(1)
const size = ref(10)
const waits = computed(() => waitingTiles(hand.value, missing.value, preferences.value))
const discards = computed(() => discardOptions(hand.value, missing.value, preferences.value))
const visibleDiscards = computed(() => discards.value.slice((page.value-1)*size.value, page.value*size.value))
const win = computed(() => winningShape(hand.value, missing.value, preferences.value))
const picked = ref<number | null>(null)
const shape = computed(() => picked.value === null ? null : winningShape([...hand.value, picked.value], missing.value, preferences.value))
function add(tile: number) {
  if (hand.value.length >= 14) { message.value='最多14张，请先点手牌移除一张。'; return }
  if (hand.value.filter(t=>t===tile).length >= 4) { message.value='同一种牌最多4张。'; return }
  hand.value = sortHand([...hand.value, tile]); analyzed.value=false; message.value=''; picked.value=null
}
function remove(index: number) { hand.value.splice(index,1); analyzed.value=false; picked.value=null; message.value='' }
function analyze() { if (![13,14].includes(hand.value.length)) { message.value='请录入13张（查听口）或14张（查胡牌与弃牌）。'; return } analyzed.value=true; message.value=''; page.value=1; picked.value=waits.value[0] ?? null }
function demo() { hand.value=[0,1,2,3,4,5,9,10,11,13,13,15,16]; missing.value=2; analyzed.value=false; picked.value=null; message.value='' }
</script>
<template>
  <section class="page-heading compact"><div><p class="eyebrow">把实物牌搬过来，自己验一遍</p><h1>手牌实验室</h1><p class="muted">先在心里判断，再点分析。此处仅支持没有碰杠的13 / 14张暗手牌。</p></div><button class="button-quiet" @click="demo">载入两面听示例</button></section>
  <section class="white-panel"><div class="lab-settings"><label>定缺 <select v-model.number="missing" @change="analyzed=false"><option v-for="(s,i) in SUITS" :key="s" :value="i">{{ s }}</option></select></label><label>允许七对 <input v-model="preferences.sevenPairs" type="checkbox" @change="analyzed=false" /></label><span>{{ hand.length }} / 14 张</span></div><div class="lab-hand"><TileHand v-if="hand.length" :hand="hand" interactive by-index @choose="remove" /><p v-else class="muted">点击下方牌面添加手牌，点击已录入的牌移除。</p></div><TilePicker :selected="[]" @choose="add" /><p v-if="message" class="notice" role="alert">{{ message }}</p><div class="answer-actions"><button class="button" @click="analyze">我判断好了，分析 →</button><button class="button-quiet" @click="hand=[]; analyzed=false; message=''">清空手牌</button></div></section>
  <section v-if="analyzed" class="white-panel lab-result" aria-live="polite"><h2>{{ hand.length === 13 ? waits.length ? '已听牌 · 这些牌补入可胡' : '尚未听牌' : win ? '已经可以胡牌' : discards.length ? '这些弃牌可以让你听牌' : '没有一打即听的弃牌' }}</h2><TileHand v-if="hand.length===13 && waits.length" :hand="waits" interactive :selected="picked === null ? [] : [picked]" @choose="picked=$event" /><template v-if="hand.length===14"><p v-if="win">{{ win.kind==='sevenPairs' ? '七对' : '普通胡：四组加一对' }}</p><div class="shape-groups" v-if="win"><TileHand v-for="(group,i) in win.groups" :key="i" :hand="group" small /></div><p v-if="win && discards.length">若选择继续出牌，以下弃牌可保留结构听口：</p><div v-for="option in visibleDiscards" :key="option.tile" class="discard-row"><span>打</span><TileHand :hand="[option.tile]" small /><span>听</span><TileHand :hand="option.waits" small /></div><PaginationBar v-if="discards.length" v-model:page="page" v-model:size="size" :total="discards.length" /></template><div v-if="shape" class="shape-groups"><TileHand v-for="(group,i) in shape.groups" :key="i" :hand="group" small /></div><p class="muted">显示结构听口，不考虑牌河、过水、番数、查叫和实际剩余张数。含定缺花色不能胡。</p></section>
</template>
