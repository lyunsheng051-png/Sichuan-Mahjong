<script setup lang="ts">
import { tileImage, tileName } from '../services/mahjong'
defineProps<{ tile: number; selected?: boolean; hidden?: boolean; disabled?: boolean; small?: boolean; interactive?: boolean }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button v-if="interactive" type="button" class="tile" :class="{ selected, small }" :disabled="disabled" :aria-label="tileName(tile)" :aria-pressed="selected ?? false" @click="$emit('click')">
    <img :src="hidden ? '/tiles/Back.svg' : tileImage(tile)" :alt="hidden ? '牌背' : tileName(tile)" draggable="false" />
  </button>
  <span v-else class="tile" :class="{ selected, small }"><img :src="hidden ? '/tiles/Back.svg' : tileImage(tile)" :alt="hidden ? '牌背' : tileName(tile)" draggable="false" /></span>
</template>
