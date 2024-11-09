let users: Array<{ name: string; email: string; password: string }> = []

export const inMemoryUsersRepository = {
  add: ({ name, email, password }: { name: string; email: string; password: string }) => {
    users.push({ name, email, password })
  },
  deleteAll: () => {
    users = []
  },
  findByEmail: (email: string) => {
    return users.find((user) => user.email === email)
  },
}
