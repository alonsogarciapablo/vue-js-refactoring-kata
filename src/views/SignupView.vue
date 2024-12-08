<script setup lang="ts">
  import { ref } from 'vue'
  import encrypt from '../utils/encrypt'
  import InMemoryUsersRepository from '../infrastructure/persistence/in-memory-users-repository'

  const inMemoryUsersRepository = InMemoryUsersRepository.getInstance()
  const nameRef = ref('')
  const emailRef = ref('')
  const birthDateRef = ref('')
  const passwordRef = ref('')
  const passwordConfirmationRef = ref('')
  const isUserCreatedRef = ref(false)
  const errorsRef = ref<Array<string>>([])

  function submit() {
    errorsRef.value = []

    if (!nameRef.value) {
      errorsRef.value.push('Name cannot be blank')
    }
    if (!emailRef.value) {
      errorsRef.value.push('Email cannot be blank')
    }
    if (!birthDateRef.value) {
      errorsRef.value.push('Birthday cannot be blank')
    }
    if (birthDateRef.value && calculateAge(birthDateRef.value) < 18) {
      errorsRef.value.push('You must be older than 18')
    }
    if (inMemoryUsersRepository.findByEmail(emailRef.value)) {
      errorsRef.value.push('Email has already been used')
    }
    if (passwordRef.value.length < 8) {
      errorsRef.value.push('Password must have 8 digits')
    }
    if (passwordRef.value !== passwordConfirmationRef.value) {
      errorsRef.value.push("Passwords don't match")
    }

    if (errorsRef.value.length === 0) {
      // persist user
      inMemoryUsersRepository.add({
        name: nameRef.value,
        email: emailRef.value,
        birthDate: birthDateRef.value,
        encryptedPassword: encrypt(passwordRef.value),
      })

      // send a confirmation email to the user
      sendEmail({
        from: 'no-reply@tinderella.com',
        to: emailRef.value,
        subject: 'Please validate your email',
        body: `Click here to validate your email: <a href="https://tinderella.com/validate?email=${emailRef.value}">validate</a>`,
      })

      isUserCreatedRef.value = true
    }
  }

  function calculateAge(birthDate: string) {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDifference = today.getMonth() - birth.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  function sendEmail({
    from,
    to,
    subject,
    body,
  }: {
    from: string
    to: string
    subject: string
    body: string
  }): void {
    console.log('Sending email')
    console.log('- From: ', from)
    console.log('- To: ', to)
    console.log('- Subject: ', subject)
    console.log('- Body: ', body)
    console.log('Email sent')
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
        Birthdate
        <input type="date" v-model="birthDateRef" data-test="birthday" />
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
