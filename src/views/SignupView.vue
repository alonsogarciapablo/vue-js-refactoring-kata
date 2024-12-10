<script setup lang="ts">
  import { inject, ref } from 'vue'
  import RegisterUser from '../application/use-cases/register-user'
  import type UsersRepository from '../domain/repositories/users-repository'

  const name = ref('')
  const email = ref('')
  const birthDate = ref('')
  const password = ref('')
  const passwordConfirmation = ref('')
  const isUserCreated = ref(false)
  const errors = ref<Array<string>>([])

  const userRepository = inject<UsersRepository>('usersRepository')

  function submit() {
    if (!userRepository) {
      throw new Error('usersRepository must be injected')
    }
    errors.value = new RegisterUser(userRepository).execute({
      name: name.value,
      email: email.value,
      birthDate: birthDate.value,
      password: password.value,
      passwordConfirmation: passwordConfirmation.value,
    })

    if (errors.value.length === 0) {
      isUserCreated.value = true
    }
  }
</script>

<template>
  <h2>Sign up</h2>
  <template v-if="isUserCreated">
    <p>We sent you an email to {{ email }} to complete the registration process.</p>
    <button @click="isUserCreated = false">Restart</button>
  </template>
  <template v-else>
    <p>We promise you'll find the love of you life here.</p>
    <div v-if="errors.length" class="errors">
      <p>Oooops! Check these errors:</p>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>
    <form @submit.prevent="submit">
      <label>
        Name
        <input type="text" v-model="name" data-test="name" />
      </label>
      <label>
        Email
        <input type="email" v-model="email" data-test="email" />
      </label>
      <label>
        Birthdate
        <input type="date" v-model="birthDate" data-test="birthday" />
      </label>
      <label>
        Password
        <input type="password" v-model="password" data-test="password" />
      </label>
      <label>
        Password confirmation
        <input type="password" v-model="passwordConfirmation" data-test="passwordConfirmation" />
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
