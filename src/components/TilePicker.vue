<script setup lang="ts">
import TileHand from './TileHand.vue'
import { allTiles } from '../services/mahjong'
import { SUITS } from '../config/training'
defineProps<{ selected: number[]; disabled?: boolean }>()
defineEmits<{ choose: [tile: number] }>()
</script>
<template>
  <div class="tile-picker">
    <div v-for="(name, suit) in SUITS" :key="name" class="picker-row"><span class="suit-label">{{ name }}</span><TileHand :hand="allTiles.slice(suit * 9, suit * 9 + 9)" :selected="selected" interactive :disabled="disabled" small @choose="$emit('choose', $event)" /></div>
  </div>
</template>
