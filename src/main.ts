import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import InMemoryUsersRepository from './infrastructure/persistence/in-memory-users-repository'

const app = createApp(App)

app.use(router)

app.provide('usersRepository', InMemoryUsersRepository.getInstance())
app.mount('#app')
