export default interface UsersRepository {
  add: ({
    name,
    email,
    birthDate,
    encryptedPassword,
  }: {
    name: string
    email: string
    birthDate: string
    encryptedPassword: string
  }) => void

  deleteAll: () => void

  findByEmail: (email: string) =>
    | {
        name: string
        email: string
        birthDate: string
        encryptedPassword: string
      }
    | undefined
}
