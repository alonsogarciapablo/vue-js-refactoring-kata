import type User from '../../domain/models/user'
import type UsersRepository from '../../domain/repositories/users-repository'

export default class InMemoryUsersRepository implements UsersRepository {
  private users: Array<User> = []

  private constructor() {}

  add(user: User) {
    this.users.push(user)
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
