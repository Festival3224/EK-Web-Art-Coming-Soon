<template>
  <div class="relative min-h-screen bg-static-bg bg-cover bg-center">
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>

    <!-- Header -->
    <header 
      class="absolute w-full z-10 py-10 transition-opacity duration-1000"
      :class="showHeaderFooter ? 'opacity-100' : 'opacity-0'"
    >
      <nav class="container flex items-center mx-auto">
        <p class="text-white text-3xl font-Marcellus font-medium">EK Web Art</p>
        <div class="flex flex-auto justify-end gap-4">
          <button v-for="lang in languages" :key="lang" @click="changeLanguage(lang)" :class="{
                'bg-orange-400 text-black font-bold border-orange-400': lang === currentLanguage,
                'border border-gray-300 text-white hover:border-gray-800 hover:bg-black hover:opacity-60 hover:text-orange-300': lang !== currentLanguage
              }" class="px-4 py-2 rounded transition">
            {{ lang.toUpperCase() }}
          </button>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main 
      class="relative container min-h-screen pb-20 pt-36 lg:py-20 mx-10 lg:mx-auto flex flex-col items-start justify-center text-left transition-opacity duration-1000"
      :class="showMainContent ? 'opacity-100' : 'opacity-0'"
    >        
      <h1 class="w-3/4 md:w-3/5 xl:w-1/2 tracking-tight text-5xl md:text-7xl xl:text-8xl font-medium mb-4 text-white"
          :class="isCyrillic($t('headline')) ? 'font-cyrillic' : 'font-latin'">{{ $t('headline') }}</h1>
      <p class="w-1/2 mt-20 text-3xl text-gray-200 mb-8">{{ $t('description') }}</p>

      <!-- Signup Form -->
      <form @submit.prevent="submitForm" class="mt-12 w-1/2 flex flex-col gap-4" novalidate>
        <div class="flex items-start gap-4 w-full">

          <BaseInput
             v-model="state.name"
             :placeholder="$t('form.namePlaceholder')"
             :errorMessage="v$.name.$errors[0]?.$message"
             :hasError="v$.name.$error"
          />

          <BaseInput
              v-model="state.email"
              :placeholder="$t('form.placeholder')"
              :errorMessage="v$.email.$errors[0]?.$message"
              :hasError="v$.email.$error"
           />

          <button
             type="submit"
             :disabled="!state.name || !state.email"
             class="h-[42px] px-6 py-2 rounded-r border-l-0 bg-orange-400 text-white font-medium 
                  hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 
                  disabled:bg-black disabled:border disabled:opacity-60 disabled:text-orange-300 disabled:cursor-not-allowed">
            {{ $t('form.submit') }}
          </button>
        </div>
        <div class="text-gray-400 w-5/6 text-sm">
          <p>{{ $t('form.agreement') }}</p>
        </div>

      </form>
    </main>

    <!-- Footer -->
    <footer 
      class="absolute bottom-0 w-full text-center py-4 text-gray-400 text-sm transition-opacity duration-1000"
      :class="showHeaderFooter ? 'opacity-100' : 'opacity-0'">
        <p>{{ $t('footer') }}</p>
    </footer>

    <Notification v-if="notification.message" 
                  :message="notification.message" 
                  :type="notification.type" 
                  @clear="notification.message = ''" />

  </div>
</template>

<script>

import { reactive, computed, ref, onMounted } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import BaseInput from './components/BaseInput.vue';
import Notification from './components/Notification.vue';

export default {
  components: { BaseInput, Notification },
  methods: {
    isCyrillic(text) {
      return /[а-яА-ЯЁё]/.test(text);
    }
  },
  setup() {
    const { locale, t } = useI18n();
        
    const supportedLanguages = ['en', 'es', 'ru'];
    const userLang = navigator.language.slice(0, 2); 
    if (supportedLanguages.includes(userLang)) {
      locale.value = userLang;
      } else {
        locale.value = 'en';
      }
    const currentLanguage = ref(locale.value);
    const languages = supportedLanguages;
    const changeLanguage = (lang) => {
      locale.value = lang;
      currentLanguage.value = lang;
    };

    // Form state
    const state = reactive({
      name: '',
      email: '',
    });

    // Notification state
    const notification = reactive({
      message: '',
      type: '',
    });

    // Animation flags
    const showHeaderFooter = ref(false);
    const showMainContent = ref(false);

    // Animate Page Loading
    onMounted(() => {
      console.log("onMounted executed!");
      setTimeout(() => {
        showHeaderFooter.value = true;
      }, 1000); // Через 1 секунду появляется header

       setTimeout(() => {
        showMainContent.value = true;
      }, 1800);  // Через 2 секунды появляется main content (заголовок и форма)

    });

    // Validation rules
    const rules = computed(() => ({
      name: {
        required: helpers.withMessage(() => t('form.errors.name'), required),
      },
      email: {
        required: helpers.withMessage(() => t('form.errors.required'), required),
        email: helpers.withMessage(() => t('form.errors.email'), email),
      },
    }));

    const v$ = useVuelidate(rules, state);

    //  Подключение к бэкенду
    const submitForm = async () => {
      const isValid = await v$.value.$validate();
      if (isValid) 

      try {
        const response = await fetch('http://localhost:5000/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: state.name,
            email: state.email,
          }),
        });

        if (!response.ok) {
          throw new Error(t('form.error'));
        }
        notification.message = t('form.success');
        notification.type = 'success';
        resetForm();
      } catch (error) {
          notification.message = t('form.error');
          notification.type = 'error';
      } else {
        notification.message = t('form.error');
        notification.type = 'error';
      }
    };


    const resetForm = () => {
      state.name = '';
      state.email = '';
      v$.value.$reset();
    };

    console.log('Initial state:', state);

    return {
      languages,
      currentLanguage,
      changeLanguage,
      state,
      v$,
      submitForm,
      resetForm,
      showHeaderFooter,
      showMainContent,
      notification,
    };
  },
};
</script>