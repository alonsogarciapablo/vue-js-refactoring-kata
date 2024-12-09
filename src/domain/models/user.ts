import Email from './email'

export default class User {
  name: string
  private emailVO: Email
  birthDate: string
  encryptedPassword: string

  constructor(attrs: { name: string; email: Email; birthDate: string; encryptedPassword: string }) {
    this.name = attrs.name
    this.emailVO = attrs.email
    this.birthDate = attrs.birthDate
    this.encryptedPassword = attrs.encryptedPassword
  }

  get email(): string {
    return this.emailVO.address
  }

  set email(newEmailVO: Email) {
    this.emailVO = newEmailVO
  }

  validate(): Array<string> {
    const errors: Array<string> = []

    if (!this.name) {
      errors.push('Name cannot be blank')
    }
    errors.push(...this.emailVO.validate())
    if (!this.birthDate) {
      errors.push('Birthday cannot be blank')
    }
    if (this.birthDate && this.calculateAge(this.birthDate) < 18) {
      errors.push('You must be older than 18')
    }
    return errors
  }

  private calculateAge(birthDate: string) {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDifference = today.getMonth() - birth.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }
}
