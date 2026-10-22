import { computed, ref, watch } from 'vue'
import { readState, writeState } from '../api/storage'
import type { Attempt } from '../types/mahjong'

const initial = readState()
const attempts = ref(initial.attempts)
const preferences = ref(initial.preferences)
const storageFailed = ref(false)
watch([attempts, preferences], () => { storageFailed.value = !writeState({ attempts: attempts.value, preferences: preferences.value }) }, { deep: true })
const unassisted = computed(() => attempts.value.filter(a => !a.assisted && a.question.mode !== 'exchange'))
const today = () => new Date().toLocaleDateString('sv-SE')
export function useProgress() {
  return {
    attempts, preferences, storageFailed, unassisted,
    todayCount: computed(() => attempts.value.filter(a => new Date(a.time).toLocaleDateString('sv-SE') === today()).length),
    accuracy: computed(() => unassisted.value.length ? Math.round(unassisted.value.filter(a => a.correct).length / unassisted.value.length * 100) : null),
    addAttempt(attempt: Attempt) { attempts.value = [attempt, ...attempts.value].slice(0,300) },
    clearAttempts() { attempts.value = [] },
  }
}
