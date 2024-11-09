<script setup lang="ts">
  import { ref } from 'vue'
  import { inMemoryUsersRepository } from '../infrastructure/persistence/in-memory-users-repository'

  const emailSender = {
    sendEmail: ({
      from,
      to,
      subject,
      body,
    }: {
      from: string
      to: string
      subject: string
      body: string
    }) => {
      console.log('Sending email')
      console.log('- From: ', from)
      console.log('- To: ', to)
      console.log('- Subject: ', subject)
      console.log('- Body: ', body)
      console.log('Email sent')
    },
  }

  const name = ref('')
  const email = ref('')
  const password = ref('')
  const passwordConfirmation = ref('')
  const isUserCreated = ref(false)
  const errors = ref<Array<string>>([])

  function submit() {
    errors.value = []

    if (!name.value) {
      errors.value.push('Name cannot be blank')
    }
    if (!email.value) {
      errors.value.push('Email cannot be blank')
    }
    if (inMemoryUsersRepository.findByEmail(email.value)) {
      errors.value.push('Email has already been used')
    }
    if (password.value.length < 8) {
      errors.value.push('Password must have 8 digits')
    }
    if (password.value !== passwordConfirmation.value) {
      errors.value.push("Passwords don't match")
    }

    if (errors.value.length === 0) {
      // persist user
      inMemoryUsersRepository.add({
        name: name.value,
        email: email.value,
        password: encrypt(password.value),
      })

      // send an email to confirm email
      emailSender.sendEmail({
        from: 'no-reply@tinderella.com',
        to: email.value,
        subject: 'Please validate your email',
        body: `Click here to validate your email: <a href="https://tinderella.com/validate?email=${email.value}">validate</a>`,
      })

      isUserCreated.value = true
    }

    function encrypt(password: string): string {
      return btoa(password)
    }
  }
</script>

<template>
  <h2>Sign up</h2>
  <template v-if="isUserCreated">
    <p>Please check your email to finish the signup process.</p>
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
