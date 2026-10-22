<script setup lang="ts">
import TilePicker from '../components/TilePicker.vue'
import TileHand from '../components/TileHand.vue'
import PaginationBar from '../components/PaginationBar.vue'
import { SUITS } from '../config/training'
import { tileName } from '../services/mahjong'
import { useHandLab } from '../composables/useHandLab'
import { useLandscapeLayout } from '../composables/useLandscapeLayout'

const { compact } = useLandscapeLayout()
const { preferences, hand, missing, analyzed, message, page, size, picked, pickedDiscard, resultTab, waits, discards, visibleDiscards, win, shape, resultWaits, focusedShape, add, remove, clear, analyze, chooseDiscard, chooseWait, demo } = useHandLab()
</script>
<template>
  <div class="lab-page">
    <section class="page-heading compact"><div><p class="eyebrow">把实物牌搬过来，自己验一遍</p><h1>手牌实验室</h1><p class="muted">先在心里判断，再点分析。此处仅支持没有碰杠的13 / 14张暗手牌。</p></div><button class="button-quiet" @click="demo">{{ compact ? '两面听示例' : '载入两面听示例' }}</button></section>
    <div class="lab-workbench">
      <section class="white-panel lab-input" aria-label="录入手牌">
        <div class="lab-settings"><label>定缺 <select v-model.number="missing"><option v-for="(s,i) in SUITS" :key="s" :value="i">{{ s }}</option></select></label><label>七对 <input v-model="preferences.sevenPairs" type="checkbox" /></label><span>{{ hand.length }} / 14 张</span></div>
        <div class="lab-hand"><TileHand v-if="hand.length" :hand="hand" interactive by-index @choose="remove" /><p v-else class="muted">点击牌面录入13 / 14张牌，点击手牌移除。</p></div>
        <TilePicker :selected="[]" @choose="add" />
        <p v-if="message" class="notice" role="alert">{{ message }}</p>
        <div class="answer-actions"><button class="button" @click="analyze">分析手牌 →</button><button class="button-quiet" @click="clear">清空手牌</button></div>
      </section>
      <section v-if="compact" class="white-panel lab-result lab-compact-result" aria-label="分析结果" aria-live="polite">
        <template v-if="analyzed">
          <h2>{{ hand.length === 13 ? waits.length ? '已听牌' : '尚未听牌' : win ? '已经可以胡牌' : discards.length ? '弃牌后可以听牌' : '没有一打即听的弃牌' }}</h2>
          <label v-if="hand.length === 14 && discards.length" class="lab-discard-choice">弃牌 <select v-model.number="pickedDiscard" @change="chooseDiscard"><option v-if="win" :value="null">查看当前胡牌</option><option v-for="option in discards" :key="option.tile" :value="option.tile">打 {{ tileName(option.tile) }}</option></select></label>
          <div class="lab-result-tabs" role="group" aria-label="分析内容"><button :class="{ chosen: resultTab === 'result' }" :aria-pressed="resultTab === 'result'" @click="resultTab='result'">听口{{ resultWaits.length ? ` · ${resultWaits.length}` : '' }}</button><button :disabled="!focusedShape" :class="{ chosen: resultTab === 'shape' }" :aria-pressed="resultTab === 'shape'" @click="resultTab='shape'">胡牌拆解</button></div>
          <div class="lab-result-body">
            <template v-if="resultTab === 'result'"><TileHand v-if="resultWaits.length" class="lab-wait-tiles" :hand="resultWaits" interactive :selected="picked === null ? [] : [picked]" @choose="chooseWait" /><p class="muted">{{ resultWaits.length ? '点击一张听口，查看补入后的完整拆法。' : win && pickedDiscard === null ? '当前手牌已能胡牌，切换“胡牌拆解”查看组合。' : '当前没有可用听口。调整左侧手牌后重新分析。' }}</p></template>
            <template v-else-if="focusedShape"><p class="lab-shape-kind">{{ focusedShape.kind === 'sevenPairs' ? '七对' : '四组面子 + 一对将牌' }}{{ picked !== null ? ` · 补入${tileName(picked)}` : '' }}</p><div class="shape-groups lab-shape"><TileHand v-for="(group,i) in focusedShape.groups" :key="i" :hand="group" small /></div></template>
          </div>
          <p class="lab-scope">结构听口，不计算牌河、过水和番数。</p>
        </template>
        <div v-else class="lab-result-placeholder"><span aria-hidden="true">验</span><h2>先判断，再核对</h2><p>左侧录牌并选择定缺，点击“分析手牌”。</p><p>13张查听口 · 14张查胡牌与弃牌</p></div>
      </section>
      <section v-else-if="analyzed" class="white-panel lab-result" aria-live="polite"><h2>{{ hand.length === 13 ? waits.length ? '已听牌 · 这些牌补入可胡' : '尚未听牌' : win ? '已经可以胡牌' : discards.length ? '这些弃牌可以让你听牌' : '没有一打即听的弃牌' }}</h2><TileHand v-if="hand.length===13 && waits.length" :hand="waits" interactive :selected="picked === null ? [] : [picked]" @choose="picked=$event" /><template v-if="hand.length===14"><p v-if="win">{{ win.kind==='sevenPairs' ? '七对' : '普通胡：四组加一对' }}</p><div class="shape-groups" v-if="win"><TileHand v-for="(group,i) in win.groups" :key="i" :hand="group" small /></div><p v-if="win && discards.length">若选择继续出牌，以下弃牌可保留结构听口：</p><div v-for="option in visibleDiscards" :key="option.tile" class="discard-row"><span>打</span><TileHand :hand="[option.tile]" small /><span>听</span><TileHand :hand="option.waits" small /></div><PaginationBar v-if="discards.length" v-model:page="page" v-model:size="size" :total="discards.length" /></template><div v-if="shape" class="shape-groups"><TileHand v-for="(group,i) in shape.groups" :key="i" :hand="group" small /></div><p class="muted">显示结构听口，不考虑牌河、过水、番数、查叫和实际剩余张数。含定缺花色不能胡。</p></section>
    </div>
  </div>
</template>
