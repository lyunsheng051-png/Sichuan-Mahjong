<script setup lang="ts">
import { nextTick, ref } from 'vue'
import TileHand from '../components/TileHand.vue'
import TilePicker from '../components/TilePicker.vue'
import MahjongTile from '../components/MahjongTile.vue'
import { SUITS } from '../config/training'
import { useTraining } from '../composables/useTraining'
import { tileName } from '../services/mahjong'
const t = useTraining()
const { mode, info, preferences, question, rules, selected, answered, correct, assisted, hint, phase, seconds, sessionCount, sessionCorrect, received, afterExchange, explanationTile, hidden, expected, discardDetails, shape, resultText } = t
const prompts = { memory: '刚才手里，哪些牌有两张或更多？', claim: '这张出牌，你有哪些合法操作？', wait: '这手牌听什么？把所有听口选出来。', discard: '打出哪些牌可以听牌？选出所有答案。', exchange: '选出你准备换出的同花色三张。' }
const coachDialog = ref<HTMLDialogElement | null>(null)
const coachOpen = ref(false)
async function openCoach() {
  t.setStudyPaused(true)
  coachOpen.value = true
  await nextTick()
  coachDialog.value?.showModal()
  coachDialog.value?.querySelector<HTMLButtonElement>('.coach-close')?.focus()
}
function closeCoach() {
  coachDialog.value?.close()
  coachOpen.value = false
  t.setStudyPaused(false)
}
</script>
<template>
  <section class="page-heading compact training-heading"><div><p class="eyebrow">专项练习 / {{ info.short }}</p><h1>{{ info.name }}</h1><p class="muted">{{ info.description }}</p></div><div class="training-heading-actions"><div class="session-counter">本轮已练 <strong>{{ sessionCount }}</strong><span>独立答对 {{ sessionCorrect }} 次</span></div><button class="coach-toggle" @click="openCoach">提示与设置 ⚙</button></div></section>
  <div class="training-layout"><div class="training-main" :class="{ 'is-answered': answered }">
    <section class="practice-table" aria-label="手牌练习区"><div class="table-meta"><span class="table-tag">{{ mode === 'exchange' ? '换牌前 / 13张' : `你的手牌 / ${question.hand.length}张` }}</span><span v-if="mode !== 'exchange'" class="missing-badge">定缺：{{ SUITS[question.missing] }}</span><span v-else class="missing-badge">换牌后再定缺</span></div>
      <div class="table-center"><template v-if="mode === 'claim'"><span class="table-instruction">{{ phase === 'study' ? '先观察手牌，随后再看别人出牌' : '对手刚刚打出' }}</span><MahjongTile v-if="phase === 'answer' || answered" :tile="question.incoming!" /><span v-else class="incoming-placeholder">？</span><small>专练碰与直杠，暂不评估胡牌</small></template><template v-else><span class="table-watermark">{{ { memory: '记', wait: '听', discard: '打', exchange: '换' }[mode] }}</span><span class="table-instruction">{{ phase === 'study' ? `观察中 · ${seconds} 秒后收起手牌` : hidden ? '手牌已收起，试着主动回忆' : mode === 'exchange' ? '先看花色，再看组合' : '不用急，先把牌看成几组' }}</span></template></div>
      <TileHand :hand="question.hand" :hidden="hidden" :selected="selected" :interactive="mode === 'discard' || mode === 'exchange'" :by-index="mode === 'exchange'" :disabled="answered" @choose="t.toggle" />
      <div class="table-controls"><button v-if="phase === 'study'" class="table-action" @click="t.finishStudy">记好了，收起手牌 →</button><button v-else-if="hidden" class="table-action" @click="t.revealHand">再看一次手牌（计为辅助）</button><span v-else>{{ answered ? '已作答 · 对照解析，再练一题' : '选好后再提交，系统不会提前提醒答案' }}</span></div>
    </section>
    <section class="answer-panel"><div class="section-heading"><h2>{{ prompts[mode] }}</h2><span class="muted">{{ mode === 'claim' ? '多选' : mode === 'exchange' ? '选三张' : '多选，可为空' }}</span></div>
      <p v-if="phase === 'study'" class="muted">先观察，收起手牌后再作答。</p>
      <template v-else><TilePicker v-if="mode === 'memory' || mode === 'wait'" :selected="selected" :disabled="answered" @choose="t.toggle" />
      <div v-if="mode === 'claim'" class="claim-buttons"><button v-for="(label, index) in ['可以碰', '可以直杠']" :key="label" class="choice-button" :class="{ chosen: selected.includes(index + 1) }" :aria-pressed="selected.includes(index+1)" :disabled="answered" @click="t.toggle(index+1)">{{ label }}</button></div>
      <p class="answer-help">{{ mode === 'memory' ? '选牌的种类，不选张数；没有对子或刻子就留空提交。' : mode === 'claim' ? '可以碰也可以杠时，两项都选；两项都不选表示都不能。' : mode === 'wait' ? '不选任何牌并提交，表示“还没有听牌”。' : mode === 'exchange' ? `点击桌上手牌选择，已选 ${selected.length} / 3 张。这里只检验合法性，不把一种选择当成唯一最优解。` : '点击桌上的弃牌种类；同牌只算一种。留空表示没有一打即听的弃牌。' }}</p></template>
      <div v-if="hint" class="hint-box">{{ info.cue }}</div>
      <div v-if="!answered" class="answer-actions"><button class="button" :disabled="phase === 'study'" @click="t.submit">{{ selected.length ? `提交选择（${selected.length}）` : mode === 'claim' ? '都不能，提交' : mode === 'wait' ? '未听牌，提交' : mode === 'memory' ? '没有对子，提交' : '提交判断' }} →</button><button class="button-quiet" :disabled="phase === 'study'" @click="t.showHint">给我一个思路</button></div>
    </section>
    <section v-if="answered" class="feedback-panel" :class="{ incorrect: !correct }" aria-live="polite"><div class="feedback-content"><div class="feedback-title"><span>{{ correct ? '✓' : '↺' }}</span><h2>{{ correct ? mode === 'exchange' ? '换牌合法，接着观察' : '这次判断正确' : '把漏掉的线索找出来' }}</h2><span class="tag">{{ assisted ? '辅助作答' : '独立作答' }}</span></div><p>{{ resultText }}</p>
      <div v-if="mode === 'memory' && expected.length" class="expected-tiles"><TileHand :hand="expected" small /></div>
      <div v-if="mode === 'wait' || mode === 'discard'" class="explain-options"><button v-for="tile in expected" :key="tile" class="mini-option" :class="{ chosen: explanationTile === tile }" @click="explanationTile = tile">{{ mode === 'wait' ? '补入' : '打出' }} {{ tileName(tile) }}</button></div>
      <template v-if="shape"><p class="muted" v-if="mode === 'discard'">对应听口：{{ discardDetails.find(o=>o.tile===explanationTile)?.waits.map(tileName).join('、') }}。下面展示补入第一种听口后的拆法。</p><p class="shape-label">{{ shape.kind === 'sevenPairs' ? '七对 · 四张同牌可拆为两对' : '四组 + 一对将 · 一种合法拆法' }}</p><div class="shape-groups"><div v-for="(group, i) in shape.groups" :key="i"><TileHand :hand="group" small /><span>{{ shape.kind === 'sevenPairs' || group.length === 2 ? '对子' : group[0] === group[1] ? '刻子' : '顺子' }}</span></div></div></template>
      <template v-if="afterExchange.length"><p class="shape-label">模拟收到的三张（同花色，不是完整四人对局）</p><TileHand :hand="received" small /><p class="shape-label">重新整理后的13张：比较哪门牌少、哪门组合散，再考虑定缺</p><TileHand :hand="afterExchange" small /></template>
      </div><button class="button" @click="t.reset()">再练一题 →</button>
    </section>
  </div><div class="coach-host"><Teleport :to="coachDialog ?? 'body'" :disabled="!coachOpen"><aside class="coach-panel"><button class="coach-close" aria-label="关闭提示与设置" @click="closeCoach">关闭 ×</button><p class="eyebrow">练习教练</p><h3>先求看得准，<br />再求反应快。</h3><p>{{ info.cue }}</p><hr /><h4>本轮规则</h4><p>万、条、筒；定缺花色不能胡、碰、杠。练习不计番、不计算实际剩余牌。</p><p>{{ rules.sevenPairs ? '七对开启，四张同牌可作两对。' : '七对关闭，只判断普通胡。' }}</p><hr /><h4>下一题设置</h4><label class="setting"><span>七对</span><input v-model="preferences.sevenPairs" type="checkbox" /></label><label class="setting"><span>看牌时间</span><select v-model.number="preferences.studySeconds"><option :value="12">12 秒</option><option :value="8">8 秒</option><option :value="4">4 秒</option></select></label><label class="setting"><span>碰杠时收起手牌</span><input v-model="preferences.hideClaims" type="checkbox" /></label><p class="micro-copy">记忆题总会收牌。碰杠先开着手牌练准，再收牌练注意力转移。</p><RouterLink to="/records" class="text-link">去记录里重做错题 ↗</RouterLink></aside></Teleport></div></div>
  <dialog ref="coachDialog" class="coach-dialog" aria-label="练习提示与设置" @cancel.prevent="closeCoach" @click="e => { if (e.target === coachDialog) closeCoach() }"></dialog>
</template>
