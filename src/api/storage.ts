import type { Attempt, Preferences } from '../types/mahjong'
import { DEFAULT_PREFERENCES, STORAGE_KEY } from '../config/training'

export interface SavedState { attempts: Attempt[]; preferences: Preferences }
export function readState(): SavedState {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (!raw || typeof raw !== 'object') throw new Error('empty')
    const saved = raw as Partial<SavedState>
    const p = saved.preferences
    const attempts = Array.isArray(saved.attempts) ? saved.attempts.filter(isAttempt).slice(0,300) : []
    return { attempts, preferences: { sevenPairs: typeof p?.sevenPairs === 'boolean' ? p.sevenPairs : true, hideClaims: p?.hideClaims === true, studySeconds: [4,8,12].includes(p?.studySeconds ?? 0) ? p!.studySeconds : 8 } }
  } catch { return { attempts: [], preferences: { ...DEFAULT_PREFERENCES } } }
}
function isAttempt(value: unknown): value is Attempt {
  if (!value || typeof value !== 'object') return false
  const a = value as Attempt
  const q = a.question
  return typeof a.id === 'string' && typeof a.time === 'string' && !Number.isNaN(Date.parse(a.time)) && typeof a.correct === 'boolean' && typeof a.assisted === 'boolean' && Number.isFinite(a.elapsed) && a.elapsed >= 0 &&
    Array.isArray(a.selected) && a.selected.every(Number.isInteger) && !!a.rules && typeof a.rules.sevenPairs === 'boolean' && !!q && typeof q.id === 'string' &&
    ['memory','claim','wait','discard','exchange'].includes(q.mode) && [0,1,2].includes(q.missing) && Array.isArray(q.hand) && [13,14].includes(q.hand.length) &&
    q.hand.every(t => Number.isInteger(t) && t >= 0 && t < 27 && q.hand.filter(v=>v===t).length<=4) && Array.isArray(q.melds) && q.melds.length === 0 &&
    (q.mode !== 'claim' || (Number.isInteger(q.incoming) && q.incoming! >= 0 && q.incoming! < 27 && q.hand.filter(t=>t===q.incoming).length<4))
}
export function writeState(state: SavedState): boolean {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true } catch { return false }
}
