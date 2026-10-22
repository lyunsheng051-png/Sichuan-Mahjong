<script setup lang="ts">
import { computed, watch } from 'vue'
const props = defineProps<{ total: number }>()
const page = defineModel<number>('page', { required: true })
const size = defineModel<number>('size', { required: true })
const pages = computed(() => Math.max(1, Math.ceil(props.total / size.value)))
watch([size, () => props.total], () => { page.value = Math.min(page.value, pages.value) })
watch(size, () => { page.value = 1 })
</script>
<template>
  <div class="pagination"><span>共 {{ total }} 条</span><label>每页 <select v-model.number="size"><option :value="10">10</option><option :value="20">20</option><option :value="50">50</option></select> 条</label><button :disabled="page <= 1" @click="page--" aria-label="上一页">←</button><span>{{ page }} / {{ pages }}</span><button :disabled="page >= pages" @click="page++" aria-label="下一页">→</button></div>
</template>
