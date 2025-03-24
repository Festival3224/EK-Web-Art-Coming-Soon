<template>
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed bottom-5 right-5 px-6 py-4 rounded shadow-lg text-white"
        :class="type === 'success' ? 'bg-green-500' : 'bg-red-500'"
      >
        {{ message }}
      </div>
    </transition>
  </template>
  
  <script>
  import { ref, watchEffect } from "vue";
  
  export default {
    props: {
      message: String,
      type: String, // 'success' or 'error'
      duration: {
        type: Number,
        default: 3000, // 3 seconds
      },
    },
    setup(props, { emit }) {
      const visible = ref(false);
  
      watchEffect(() => {
        if (props.message) {
          visible.value = true;
          setTimeout(() => {
            visible.value = false;
            emit("clear");
          }, props.duration);
        }
      });
  
      return { visible };
    },
  };
  </script>
  
  <style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
  