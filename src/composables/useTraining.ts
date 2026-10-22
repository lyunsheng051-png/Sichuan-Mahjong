import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MODES } from '../config/training'
import { claimOptions, countsOf, discardOptions, exchangeLegal, sameSet, suitOf, tileName, waitingTiles, winningShape } from '../services/mahjong'
import { createQuestion, exchangeReceive } from '../services/questions'
import type { Mode, Question, Rules } from '../types/mahjong'
import { useProgress } from './useProgress'

export function useTraining() {
  const route = useRoute()
  const { preferences, attempts, addAttempt } = useProgress()
  const mode = computed<Mode>(() => MODES.some(m => m.id === route.params.mode) ? route.params.mode as Mode : 'memory')
  const info = computed(() => MODES.find(m => m.id === mode.value)!)
  const question = ref<Question>(createQuestion(mode.value, preferences.value))
  const rules = ref<Rules>({ sevenPairs: preferences.value.sevenPairs })
  const selected = ref<number[]>([])
  const answered = ref(false)
  const correct = ref(false)
  const assisted = ref(false)
  const hint = ref(false)
  const peek = ref(false)
  const phase = ref<'study' | 'answer'>('answer')
  const seconds = ref(0)
  const studyPaused = ref(false)
  const responseStarted = ref(Date.now())
  const sessionCount = ref(0)
  const sessionCorrect = ref(0)
  const received = ref<number[]>([])
  const afterExchange = ref<number[]>([])
  const explanationTile = ref<number | null>(null)
  let timer: ReturnType<typeof setInterval> | undefined
  function finishStudy() {
    clearInterval(timer); phase.value = 'answer'; responseStarted.value = Date.now()
  }
  function reset(retry?: Question, retryRules?: Rules) {
    clearInterval(timer)
    rules.value = { sevenPairs: retryRules?.sevenPairs ?? preferences.value.sevenPairs }
    question.value = retry ? structuredClone(retry) : createQuestion(mode.value, rules.value)
    selected.value = []; answered.value = false; correct.value = false; assisted.value = false; hint.value = false; peek.value = false
    received.value = []; afterExchange.value = []; explanationTile.value = null
    const mustStudy = mode.value === 'memory' || (mode.value === 'claim' && preferences.value.hideClaims)
    phase.value = mustStudy ? 'study' : 'answer'
    seconds.value = preferences.value.studySeconds
    responseStarted.value = Date.now()
    if (mustStudy) timer = setInterval(() => { if (studyPaused.value) return; seconds.value--; if (seconds.value <= 0) finishStudy() }, 1000)
  }
  watch(() => [route.params.mode, route.query.retry], (current, previous) => {
    if (current[0] !== previous?.[0]) { sessionCount.value = 0; sessionCorrect.value = 0 }
    const retry = attempts.value.find(a => a.id === route.query.retry && a.question.mode === mode.value)
    reset(retry ? JSON.parse(JSON.stringify(retry.question)) as Question : undefined, retry?.rules)
  }, { immediate: true })
  onUnmounted(() => clearInterval(timer))
  const hidden = computed(() => !answered.value && phase.value === 'answer' && !peek.value && (mode.value === 'memory' || (mode.value === 'claim' && preferences.value.hideClaims)))
  const expected = computed<number[]>(() => {
    const q = question.value
    if (mode.value === 'memory') return countsOf(q.hand).flatMap((count,t) => count >= 2 ? [t] : [])
    if (mode.value === 'claim') return claimOptions(q.hand, q.incoming!, q.missing)
    if (mode.value === 'wait') return waitingTiles(q.hand, q.missing, rules.value, q.melds)
    if (mode.value === 'discard') return discardOptions(q.hand, q.missing, rules.value, q.melds).map(o=>o.tile)
    return []
  })
  const discardDetails = computed(() => discardOptions(question.value.hand, question.value.missing, rules.value, question.value.melds))
  const shape = computed(() => {
    if (explanationTile.value === null) return null
    const q = question.value
    let hand = [...q.hand]
    if (mode.value === 'discard') {
      const option = discardDetails.value.find(o => o.tile === explanationTile.value)
      if (!option) return null
      hand.splice(hand.indexOf(option.tile), 1)
      hand.push(option.waits[0])
    } else hand.push(explanationTile.value)
    return winningShape(hand, q.missing, rules.value, q.melds)
  })
  const resultText = computed(() => {
    const q = question.value
    const names = expected.value.map(tileName).join('、')
    if (mode.value === 'memory') return names ? `有两张或更多的牌是：${names}。每次摸打后，只更新发生变化的这一项。` : '这手没有对子或刻子。记住“暂时没有可碰的牌”，也比硬背13张轻松。'
    if (mode.value === 'claim') {
      const count = q.hand.filter(t=>t===q.incoming).length
      if (suitOf(q.incoming!) === q.missing) return `${tileName(q.incoming!)}属于定缺花色，即使手里有同牌也不碰、不杠。`
      return `手里有${count}张${tileName(q.incoming!)}。${count >= 3 ? '可以碰，也可以直杠；识别合法操作后，实战还要判断是否值得。' : count === 2 ? '加上别人打的一张，可以碰，不能直杠。' : '不够两张，不能碰或直杠。'}`
    }
    if (mode.value === 'wait') return names ? `结构上听：${names}。点击下面的听口，看看补进这张后怎么拆。` : '这手还没有听牌。逐一补入可用牌后，都不能组成四组加一对或当前规则允许的七对。'
    if (mode.value === 'discard') return names ? `能打出后听牌的牌是：${names}。点击某张弃牌查看它对应的听口。这里不比较番数或安全性。` : '目前没有一打即听的弃牌。'
    return correct.value ? '这组三张符合同花色要求。合法不等于最优：回看有没有拆掉顺子、对子，再比较其他可换花色。下面模拟收到另一家的同花色三张，练习重新整理手牌。' : '换三张必须恰好选三张，而且三张属于同一花色。下一题先按花色分组，再挑选。'
  })
  function toggle(value: number) {
    if (answered.value || phase.value === 'study') return
    selected.value = selected.value.includes(value) ? selected.value.filter(v=>v!==value) : [...selected.value, value]
  }
  function showHint() { hint.value = true; assisted.value = true }
  function revealHand() { peek.value = true; assisted.value = true }
  function submit() {
    if (answered.value || phase.value === 'study') return
    correct.value = mode.value === 'exchange' ? exchangeLegal(question.value.hand, selected.value) : sameSet(selected.value, expected.value)
    answered.value = true
    sessionCount.value++
    if (correct.value && !assisted.value) sessionCorrect.value++
    if (mode.value === 'exchange' && correct.value) {
      const result = exchangeReceive(question.value.hand, selected.value)
      received.value = result.received; afterExchange.value = result.hand
    }
    explanationTile.value = expected.value[0] ?? null
    addAttempt({ id: crypto.randomUUID(), time: new Date().toISOString(), question: JSON.parse(JSON.stringify(question.value)) as Question, rules: { ...rules.value }, selected: [...selected.value], correct: correct.value, assisted: assisted.value, elapsed: Math.round((Date.now() - responseStarted.value) / 100) / 10 })
  }
  function setStudyPaused(paused: boolean) { studyPaused.value = paused }
  return { mode, info, preferences, question, rules, selected, answered, correct, assisted, hint, peek, phase, seconds, sessionCount, sessionCorrect, received, afterExchange, explanationTile, hidden, expected, discardDetails, shape, resultText, reset, finishStudy, toggle, showHint, revealHand, submit, setStudyPaused }
}
