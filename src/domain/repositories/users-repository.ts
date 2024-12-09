import type User from '../models/user'

export default interface UsersRepository {
  add: (user: User) => void

  deleteAll: () => void

  findByEmail: (email: string) => User | undefined
}
