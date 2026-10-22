<script setup lang="ts">
import MahjongTile from './MahjongTile.vue'
defineProps<{ hand: number[]; selected?: number[]; byIndex?: boolean; interactive?: boolean; hidden?: boolean; disabled?: boolean; small?: boolean }>()
defineEmits<{ choose: [value: number] }>()
</script>
<template>
  <div class="tile-hand" role="group" aria-label="麻将牌">
    <MahjongTile v-for="(tile, i) in hand" :key="i" :tile="tile" :selected="selected?.includes(byIndex ? i : tile)" :hidden="hidden" :interactive="interactive" :disabled="disabled" :small="small" @click="$emit('choose', byIndex ? i : tile)" />
  </div>
</template>
