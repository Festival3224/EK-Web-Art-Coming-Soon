<!-- BaseInput.vue -->
<template>
  <div class="flex-1">
    <input
      :type="type"
      :placeholder="placeholder" 
      v-bind="$attrs"
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full h-[42px] px-4 py-2 rounded-l border bg-black opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
    />
    <div v-if="hasError" class="min-h-[20px]">
      <span class="text-red-500 text-sm font-normal">{{ errorMessage }}</span>
    </div>
    
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String,  
    placeholder: { type: String, default: '' },
    type: {
      type: String,
      default: 'text'
    },
    errorMessage: String,
    hasError: Boolean,
  },
};
</script>
