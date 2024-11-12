<script setup lang="ts">
  import { ref } from 'vue'
  import RegisterUser from '../application/register-user'

  const nameRef = ref('')
  const emailRef = ref('')
  const passwordRef = ref('')
  const passwordConfirmationRef = ref('')
  const isUserCreatedRef = ref(false)
  const errorsRef = ref<Array<string>>([])

  function submit() {
    const { errors } = new RegisterUser().execute(
      nameRef.value,
      emailRef.value,
      passwordRef.value,
      passwordConfirmationRef.value,
    )

    isUserCreatedRef.value = errors.length === 0
    errorsRef.value = errors
  }
</script>

<template>
  <h2>Sign up</h2>
  <template v-if="isUserCreatedRef">
    <p>Please check your email to finish the signup process.</p>
    <button @click="isUserCreatedRef = false">Restart</button>
  </template>
  <template v-else>
    <p>We promise you'll find the love of you life here.</p>
    <div v-if="errorsRef.length" class="errors">
      <p>Oooops! Check these errors:</p>
      <ul>
        <li v-for="error in errorsRef" :key="error">{{ error }}</li>
      </ul>
    </div>
    <form @submit.prevent="submit">
      <label>
        Name
        <input type="text" v-model="nameRef" data-test="name" />
      </label>
      <label>
        Email
        <input type="email" v-model="emailRef" data-test="email" />
      </label>
      <label>
        Password
        <input type="password" v-model="passwordRef" data-test="password" />
      </label>
      <label>
        Password confirmation
        <input type="password" v-model="passwordConfirmationRef" data-test="passwordConfirmation" />
      </label>
      <button type="submit" data-test="submit">💖 Sign up 💖</button>
    </form>
  </template>
</template>

<style scoped>
  label {
    display: block;
    margin-bottom: 10px;
  }
  input {
    display: block;
  }
  button {
    margin-top: 10px;
    font-size: 18px;
    padding: 8px 10px;
  }
  .errors {
    color: red;
  }
</style>
