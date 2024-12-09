import Email from './email'
import User from './user'

export default class UserFactory {
  static create(attrs: {
    name: string
    email: string
    birthDate: string
    encryptedPassword: string
  }): User {
    return new User({
      name: attrs.name,
      email: new Email(attrs.email),
      birthDate: attrs.birthDate,
      encryptedPassword: attrs.encryptedPassword,
    })
  }
}
