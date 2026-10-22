import type { Meld, Rules, Suit, Tile, WinShape } from '../types/mahjong'
import { SUITS } from '../config/training'

export const allTiles = Array.from({ length: 27 }, (_, i) => i)
export const suitOf = (tile: Tile) => Math.floor(tile / 9) as Suit
export const rankOf = (tile: Tile) => tile % 9 + 1
export const tileName = (tile: Tile) => `${rankOf(tile)}${SUITS[suitOf(tile)]}`
export const tileImage = (tile: Tile) => `/tiles/${['Man', 'Sou', 'Pin'][suitOf(tile)]}${rankOf(tile)}.svg`
export const sortHand = (hand: Tile[]) => [...hand].sort((a, b) => a - b)
export function countsOf(hand: Tile[]): number[] {
  const counts = Array<number>(27).fill(0)
  for (const tile of hand) {
    if (!Number.isInteger(tile) || tile < 0 || tile > 26) throw new Error('牌面必须为万、条、筒的一至九。')
    counts[tile]++
  }
  return counts
}
export function physicalCounts(hand: Tile[], melds: Meld[] = []) {
  const counts = countsOf(hand)
  for (const meld of melds) counts[meld.tile] += meld.kind === 'kong' ? 4 : 3
  return counts
}
function extractMelds(counts: number[]): Tile[][] | null {
  const first = counts.findIndex(n => n > 0)
  if (first === -1) return []
  if (counts[first] >= 3) {
    counts[first] -= 3
    const rest = extractMelds(counts)
    counts[first] += 3
    if (rest) return [[first, first, first], ...rest]
  }
  if (first % 9 <= 6 && counts[first + 1] && counts[first + 2]) {
    counts[first]--; counts[first + 1]--; counts[first + 2]--
    const rest = extractMelds(counts)
    counts[first]++; counts[first + 1]++; counts[first + 2]++
    if (rest) return [[first, first + 1, first + 2], ...rest]
  }
  return null
}
/** 完整回溯，不用贪心拆顺子，以免漏掉复合听口。返回一种合法拆法。 */
export function winningShape(hand: Tile[], missing: Suit, rules: Rules, melds: Meld[] = []): WinShape | null {
  if (melds.length > 4 || hand.length !== 14 - melds.length * 3) return null
  if (hand.some(t => suitOf(t) === missing) || melds.some(m => suitOf(m.tile) === missing)) return null
  const counts = countsOf(hand)
  if (physicalCounts(hand, melds).some(n => n > 4)) return null
  if (rules.sevenPairs && !melds.length && counts.every(n => n % 2 === 0)) {
    return { kind: 'sevenPairs', groups: allTiles.flatMap(t => Array.from({ length: counts[t] / 2 }, () => [t, t])) }
  }
  for (const pair of allTiles) {
    if (counts[pair] < 2) continue
    counts[pair] -= 2
    const groups = extractMelds(counts)
    counts[pair] += 2
    if (groups) return { kind: 'standard', groups: [...groups, [pair, pair]] }
  }
  return null
}
/** 只计算结构听口。牌河信息未传入时不推断实际剩余张数。 */
export function waitingTiles(hand: Tile[], missing: Suit, rules: Rules, melds: Meld[] = []): Tile[] {
  if (hand.length !== 13 - melds.length * 3) return []
  const counts = physicalCounts(hand, melds)
  return allTiles.filter(t => suitOf(t) !== missing && counts[t] < 4 && winningShape([...hand, t], missing, rules, melds))
}
export function discardOptions(hand: Tile[], missing: Suit, rules: Rules, melds: Meld[] = []) {
  if (hand.length !== 14 - melds.length * 3) return []
  const hasMissing = hand.some(t => suitOf(t) === missing)
  return [...new Set(hand)].filter(t => !hasMissing || suitOf(t) === missing).flatMap(tile => {
    const rest = [...hand]; rest.splice(rest.indexOf(tile), 1)
    const waits = waitingTiles(rest, missing, rules, melds)
    return waits.length ? [{ tile, waits }] : []
  })
}
/** 对手刚打出的牌：本题只评估碰、直杠，不评估胡或策略收益。 */
export function claimOptions(hand: Tile[], incoming: Tile, missing: Suit): number[] {
  if (suitOf(incoming) === missing) return []
  const count = hand.filter(t => t === incoming).length
  return count >= 3 ? [1, 2] : count >= 2 ? [1] : []
}
export const sameSet = (a: number[], b: number[]) => a.length === b.length && [...a].sort((x,y) => x-y).every((n, i) => n === [...b].sort((x,y) => x-y)[i])
export function exchangeLegal(hand: Tile[], indices: number[]) {
  return indices.length === 3 && new Set(indices).size === 3 && indices.every(i => i >= 0 && i < hand.length) && new Set(indices.map(i => suitOf(hand[i]))).size === 1
}
