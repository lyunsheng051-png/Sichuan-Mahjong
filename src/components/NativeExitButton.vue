<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useNativeApp } from '../composables/useNativeApp'

const { isAndroidApp, exiting, exitError, requestExit, cancelExit, confirmExit } = useNativeApp()
const dialog = ref<HTMLDialogElement | null>(null)
function open() { requestExit(); dialog.value?.showModal() }
function close() { if (exiting.value) return; dialog.value?.close(); cancelExit() }
onUnmounted(cancelExit)
</script>

<template>
  <template v-if="isAndroidApp">
    <button class="nav-link native-exit" aria-label="退出应用" title="退出应用" data-testid="exit-app" @click="open">
      <span aria-hidden="true"><svg class="native-exit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><path d="M12 2v10" /></svg></span><span class="nav-label">退出应用</span><span class="nav-short" aria-hidden="true">退出</span>
    </button>
    <Teleport to="body">
      <dialog ref="dialog" class="exit-dialog" aria-labelledby="exit-title" aria-describedby="exit-description" @cancel.prevent="close" @click="e => { if (e.target === dialog) close() }">
        <h2 id="exit-title">退出练习室？</h2>
        <p id="exit-description">已保存的练习记录会保留，当前未提交的答案不会保存。</p>
        <p v-if="exitError" class="notice" role="alert">{{ exitError }}</p>
        <div class="exit-dialog-actions">
          <button class="button button-light" :disabled="exiting" data-testid="cancel-exit" autofocus @click="close">继续练习</button>
          <button class="button" :disabled="exiting" data-testid="confirm-exit" @click="confirmExit">{{ exiting ? '正在退出…' : '退出应用' }}</button>
        </div>
      </dialog>
    </Teleport>
  </template>
</template>
