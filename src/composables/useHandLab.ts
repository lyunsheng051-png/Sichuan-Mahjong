import { computed, ref, watch } from 'vue'
import { discardOptions, sortHand, waitingTiles, winningShape } from '../services/mahjong'
import { useProgress } from './useProgress'
import type { Suit } from '../types/mahjong'

export function useHandLab() {
  const { preferences } = useProgress()
  const hand = ref<number[]>([])
  const missing = ref<Suit>(2)
  const analyzed = ref(false)
  const message = ref('')
  const page = ref(1)
  const size = ref(10)
  const picked = ref<number | null>(null)
  const pickedDiscard = ref<number | null>(null)
  const resultTab = ref<'result' | 'shape'>('result')
  const waits = computed(() => waitingTiles(hand.value, missing.value, preferences.value))
  const discards = computed(() => discardOptions(hand.value, missing.value, preferences.value))
  const visibleDiscards = computed(() => discards.value.slice((page.value - 1) * size.value, page.value * size.value))
  const win = computed(() => winningShape(hand.value, missing.value, preferences.value))
  const shape = computed(() => hand.value.length === 13 && picked.value !== null ? winningShape([...hand.value, picked.value], missing.value, preferences.value) : null)
  const focusedDiscard = computed(() => discards.value.find(option => option.tile === pickedDiscard.value))
  const resultWaits = computed(() => hand.value.length === 13 ? waits.value : focusedDiscard.value?.waits ?? [])
  const focusedShape = computed(() => {
    if (hand.value.length === 13) return shape.value
    if (pickedDiscard.value === null) return win.value
    if (!focusedDiscard.value || picked.value === null) return null
    const next = [...hand.value]
    next.splice(next.indexOf(focusedDiscard.value.tile), 1)
    return winningShape([...next, picked.value], missing.value, preferences.value)
  })
  function invalidate() {
    analyzed.value = false; picked.value = null; pickedDiscard.value = null
    message.value = ''; resultTab.value = 'result'; page.value = 1
  }
  watch([missing, () => preferences.value.sevenPairs], invalidate)
  function add(tile: number) {
    if (hand.value.length >= 14) { message.value = '最多14张，请先点手牌移除一张。'; return }
    if (hand.value.filter(t => t === tile).length >= 4) { message.value = '同一种牌最多4张。'; return }
    hand.value = sortHand([...hand.value, tile]); invalidate()
  }
  function remove(index: number) { hand.value.splice(index, 1); invalidate() }
  function clear() { hand.value = []; invalidate() }
  function analyze() {
    if (![13, 14].includes(hand.value.length)) { message.value = '请录入13张查听口，或14张查胡牌与弃牌。'; return }
    pickedDiscard.value = hand.value.length === 14 && !win.value ? discards.value[0]?.tile ?? null : null
    picked.value = resultWaits.value[0] ?? null
    analyzed.value = true; message.value = ''; page.value = 1
    resultTab.value = hand.value.length === 14 && win.value ? 'shape' : 'result'
  }
  function chooseDiscard() { picked.value = resultWaits.value[0] ?? null; resultTab.value = pickedDiscard.value === null && win.value ? 'shape' : 'result' }
  function chooseWait(tile: number) { picked.value = tile; resultTab.value = 'shape' }
  function demo() { hand.value = [0, 1, 2, 3, 4, 5, 9, 10, 11, 13, 13, 15, 16]; missing.value = 2; invalidate() }
  return { preferences, hand, missing, analyzed, message, page, size, picked, pickedDiscard, resultTab, waits, discards, visibleDiscards, win, shape, resultWaits, focusedShape, add, remove, clear, analyze, chooseDiscard, chooseWait, demo }
}
