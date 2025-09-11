<template>
  <button :type="type" class="inline-flex items-center justify-center rounded-3xl mb-2 bg-[#81E15E] hover:text-[#24b550] w-20 h-10 text-sm text-[#1b7511]"  @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>
<script setup>
defineProps({
  type: {
    type: String,
    default: 'button' 
  }
})
</script>
