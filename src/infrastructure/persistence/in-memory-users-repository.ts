import type User from '../../domain/models/user'

export default class InMemoryUsersRepository {
  private users: Array<User> = []

  private constructor() {}

  add(user: User) {
    this.users.push(user)
  }

  deleteAll() {
    this.users = []
  }

  findByEmail(email: string) {
    return this.users.find((user) => user.email === email)
  }

  private static instance: InMemoryUsersRepository

  static getInstance(): InMemoryUsersRepository {
    if (!this.instance) {
      this.instance = new InMemoryUsersRepository()
    }
    return this.instance
  }
}
