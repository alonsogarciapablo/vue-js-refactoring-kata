import type UsersRepository from '../../domain/repositories/users-repository'

export default class InMemoryUsersRepository implements UsersRepository {
  private users: Array<{
    name: string
    email: string
    birthDate: string
    encryptedPassword: string
  }> = []

  private constructor() {}

  add({
    name,
    email,
    birthDate,
    encryptedPassword,
  }: {
    name: string
    email: string
    birthDate: string
    encryptedPassword: string
  }) {
    this.users.push({ name, email, birthDate, encryptedPassword })
  }

  deleteAll() {
    this.users = []
  }

  findByEmail(email: string) {
    return this.users.find((user: { email: string }) => user.email === email)
  }

  private static instance: InMemoryUsersRepository

  static getInstance(): InMemoryUsersRepository {
    if (!this.instance) {
      this.instance = new InMemoryUsersRepository()
    }
    return this.instance
  }
}
