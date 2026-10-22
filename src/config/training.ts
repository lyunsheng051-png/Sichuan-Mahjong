import type { Mode } from '../types/mahjong'

export const SUITS = ['万', '条', '筒'] as const
export const MODES: { id: Mode; name: string; short: string; description: string; cue: string; minutes: string }[] = [
  { id: 'memory', name: '手牌快照', short: '记得住', description: '先找对子和刻子，移开视线后主动回忆。', cue: '不用背整副牌。先记“哪些牌有两张以上”。', minutes: '3 分钟' },
  { id: 'claim', name: '碰杠反应', short: '反应快', description: '别人出牌，自己发现能不能碰、能不能杠。', cue: '先核对定缺，再找同牌：两张可碰，三张可碰也可直杠。', minutes: '3 分钟' },
  { id: 'wait', name: '听牌侦探', short: '看得出', description: '从13张手牌中，找全可以胡的牌。', cue: '普通胡找四组加一对；七对单独检查。别只看最后两张。', minutes: '5 分钟' },
  { id: 'discard', name: '打哪张能听', short: '接得上', description: '从14张牌中，选出所有能让你听牌的弃牌。', cue: '先想打完还剩什么结构，再检验所有可能的进张。', minutes: '4 分钟' },
  { id: 'exchange', name: '换三张练习', short: '开好局', description: '选出同一花色的三张，再观察换牌后的结构。', cue: '同花色三张是硬规则；少拆完整顺子、对子是观察思路。', minutes: '3 分钟' },
]
export const DEFAULT_PREFERENCES = { sevenPairs: true, studySeconds: 8, hideClaims: false }
export const STORAGE_KEY = 'shangzhuo-coach-v1'
