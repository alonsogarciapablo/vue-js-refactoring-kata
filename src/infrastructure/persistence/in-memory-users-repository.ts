export default class InMemoryUsersRepository {
  private users: Array<{ name: string; email: string; password: string }> = []

  private constructor() {}

  add({ name, email, password }: { name: string; email: string; password: string }) {
    this.users.push({ name, email, password })
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
