<script setup lang="ts">
import { ref } from 'vue'
import TileHand from './TileHand.vue'
import { allTiles } from '../services/mahjong'
import { SUITS } from '../config/training'
defineProps<{ selected: number[]; disabled?: boolean }>()
defineEmits<{ choose: [tile: number] }>()
const activeSuit = ref(0)
</script>
<template>
  <div class="tile-picker">
    <div class="suit-tabs" role="group" aria-label="选择作答花色"><button v-for="(name, suit) in SUITS" :key="name" :aria-pressed="activeSuit === suit" :aria-label="`选择${name}子`" :class="{ chosen: activeSuit === suit }" @click="activeSuit = suit">{{ name }}<span v-if="selected.some(t => Math.floor(t / 9) === suit)">{{ selected.filter(t => Math.floor(t / 9) === suit).length }}</span></button></div>
    <div v-for="(name, suit) in SUITS" :key="name" class="picker-row" :class="{ 'is-active': activeSuit === suit }"><span class="suit-label">{{ name }}</span><TileHand :hand="allTiles.slice(suit * 9, suit * 9 + 9)" :selected="selected" interactive :disabled="disabled" small @choose="$emit('choose', $event)" /></div>
  </div>
</template>
