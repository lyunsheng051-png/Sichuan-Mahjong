/** 0～8：一至九万；9～17：一至九条；18～26：一至九筒。 */
export type Tile = number
export type Suit = 0 | 1 | 2
export type Mode = 'memory' | 'claim' | 'wait' | 'discard' | 'exchange'
export interface Meld { kind: 'pong' | 'kong'; tile: Tile }
export interface Rules { sevenPairs: boolean }
export interface Question {
  id: string
  mode: Mode
  hand: Tile[]
  missing: Suit
  melds: Meld[]
  incoming?: Tile
}
export interface WinShape { kind: 'standard' | 'sevenPairs'; groups: Tile[][] }
export interface Attempt {
  id: string
  time: string
  question: Question
  selected: number[]
  correct: boolean
  elapsed: number
  assisted: boolean
  rules: Rules
}
export interface Preferences extends Rules { studySeconds: number; hideClaims: boolean }
