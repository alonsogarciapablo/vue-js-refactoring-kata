import Email from './email'

export default class User {
  name: string
  emailVO: Email
  birthDate: string
  encryptedPassword: string

  constructor(attrs: {
    name: string
    email: string
    birthDate: string
    encryptedPassword: string
  }) {
    this.name = attrs.name
    this.emailVO = new Email(attrs.email)
    this.birthDate = attrs.birthDate
    this.encryptedPassword = attrs.encryptedPassword
  }

  get email(): string {
    return this.emailVO.toString()
  }

  set email(emailVO: Email) {
    this.emailVO = emailVO
  }

  validate(): Array<string> {
    const errors = []
    if (!this.name) {
      errors.push('Name cannot be blank')
    }

    errors.push(...this.emailVO.validate())

    if (!this.birthDate) {
      errors.push('Birthday cannot be blank')
    }
    if (this.birthDate && this.calculateAge() < 18) {
      errors.push('You must be older than 18')
    }
    return errors
  }

  calculateAge() {
    const today = new Date()
    const birth = new Date(this.birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDifference = today.getMonth() - birth.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }
}
