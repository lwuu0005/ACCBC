<template>
  <div class="auth-view">
    <LoginForm v-if="isLogin" @switch-to-register="isLogin = false" />
    <RegisterForm v-else @switch-to-login="isLogin = true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from '../components/LoginForm.vue';
import RegisterForm from '../components/RegisterForm.vue';

const isLogin = ref(true);
</script>

<style scoped>
.auth-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
