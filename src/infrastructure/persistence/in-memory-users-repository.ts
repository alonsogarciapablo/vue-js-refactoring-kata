export default class InMemoryUsersRepository {
  private users: Array<{ name: string; email: string; encryptedPassword: string }> = []

  private constructor() {}

  add({
    name,
    email,
    encryptedPassword,
  }: {
    name: string
    email: string
    encryptedPassword: string
  }) {
    this.users.push({ name, email, encryptedPassword })
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
