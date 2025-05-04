<template>
  <a
    v-if="href"
    :href="href"
  >
    <code>{{ inject }}</code>
  </a>
  <code v-else>InjectRef: Cannot resolve inject: `{{ inject }}`</code>
</template>

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as injects } from '../data/injects.data'

const props = defineProps({
  inject: String
})

const href = computed(() => {
  const href = injects[props.inject]
  return href ? withBase(href) : null
})
</script>
