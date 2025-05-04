<template>
  <a
    v-if="href"
    :href="href"
  >
    <template v-if="text">{{ text }}</template>
    <code v-else>{{ parameter ?? inject }}</code>
  </a>
  <code v-else>InjectRef: Cannot resolve inject: `{{ inject }}`</code>
</template>

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as injects } from '../data/injects.data'

const props = defineProps({
  inject: String,
  text: String,
  target: String,
  parameters: Boolean,
  parameter: String,
  returns: Boolean
})

function processHref (href) {
  if (props.target != null) return href + `-${props.target}`
  if (props.parameters) return href + '-parameters'
  if (props.parameter != null) return href + `-parameters-${props.parameter}`
  if (props.returns) return href + '-returns'
  return href
}

const href = computed(() => {
  const href = injects[props.inject]
  return href ? withBase(processHref(href)) : null
})
</script>
