import type { Mode, Question, Rules, Suit, Tile } from '../types/mahjong'
import { allTiles, countsOf, sortHand, suitOf, waitingTiles, discardOptions } from './mahjong'

const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)]
export function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]] }
  return copy
}
export function randomHand(size: number, missing?: Suit): Tile[] {
  return sortHand(shuffle(allTiles.filter(t => missing === undefined || suitOf(t) !== missing).flatMap(t => [t,t,t,t])).slice(0, size))
}
function completeHand(missing: Suit, rules: Rules): Tile[] {
  const suits = ([0,1,2] as Suit[]).filter(s => s !== missing)
  // 保留七对的专项曝光；四张同牌允许计作两对。
  if (rules.sevenPairs && Math.random() < .18) {
    return sortHand(shuffle(allTiles.filter(t => suitOf(t) !== missing)).slice(0,7).flatMap(t => [t,t]))
  }
  for (let attempt = 0; attempt < 200; attempt++) {
    const pair = pick(suits) * 9 + Math.floor(Math.random() * 9)
    const hand = [pair, pair]
    for (let i = 0; i < 4; i++) {
      const base = pick(suits) * 9
      if (Math.random() < .3) { const t = base + Math.floor(Math.random() * 9); hand.push(t,t,t) }
      else { const t = base + Math.floor(Math.random() * 7); hand.push(t,t+1,t+2) }
    }
    if (countsOf(hand).every(n => n <= 4)) return sortHand(hand)
  }
  return [0,1,2,3,4,5,6,7,8,9,9,9,10,10].map(t => {
    const permitted = suits[Math.floor(t / 9)]; return permitted * 9 + t % 9
  }).sort((a,b)=>a-b)
}
export function createQuestion(mode: Mode, rules: Rules): Question {
  const missing = pick([0,1,2] as Suit[])
  const q: Question = { id: crypto.randomUUID(), mode, missing, hand: [], melds: [] }
  if (mode === 'exchange') { q.hand = randomHand(13); return q }
  if (mode === 'memory') { q.hand = randomHand(13, missing); return q }
  if (mode === 'claim') {
    // 刻意平衡可碰、可杠、数量不足、定缺禁碰四类题。
    const category = Math.floor(Math.random() * 4)
    q.incoming = pick(allTiles.filter(t => category === 3 ? suitOf(t) === missing : suitOf(t) !== missing))
    const repeat = category === 0 ? 2 : category === 1 ? 3 : category === 3 ? 2 : Math.floor(Math.random() * 2)
    const wall = shuffle(allTiles.filter(t => t !== q.incoming).flatMap(t => [t,t,t,t]))
    q.hand = sortHand([...Array<Tile>(repeat).fill(q.incoming), ...wall.slice(0,13-repeat)])
    return q
  }
  if (mode === 'wait') {
    // 约四分之一是未听牌题，避免养成“系统出题必定有叫”的依赖。
    if (Math.random() < .25) {
      for (let i = 0; i < 150; i++) {
        const hand = randomHand(13, missing)
        if (!waitingTiles(hand, missing, rules).length) { q.hand = hand; return q }
      }
    }
    const hand = completeHand(missing, rules)
    hand.splice(Math.floor(Math.random() * hand.length), 1)
    q.hand = hand; return q
  }
  for (let i = 0; i < 100; i++) {
    const hand = completeHand(missing, rules)
    hand.splice(Math.floor(Math.random() * hand.length), 1)
    const counts = countsOf(hand)
    const draw = pick(allTiles.filter(t => suitOf(t) !== missing && counts[t] < 4))
    q.hand = sortHand([...hand, draw])
    if (discardOptions(q.hand, missing, rules).length) return q
  }
  q.hand = completeHand(missing, rules); return q
}
export function exchangeReceive(hand: Tile[], indices: number[]) {
  const counts = countsOf(hand)
  const suit = pick([0,1,2])
  const received = shuffle(allTiles.filter(t => suitOf(t) === suit).flatMap(t => Array<Tile>(4 - counts[t]).fill(t))).slice(0,3)
  return { received, hand: sortHand([...hand.filter((_,i) => !indices.includes(i)), ...received]) }
}
