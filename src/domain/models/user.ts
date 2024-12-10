import Email from './email'

export default class User {
  name: string
  birthDate: string
  encryptedPassword: string
  emailVO: Email | undefined

  constructor({
    name,
    email,
    birthDate,
    encryptedPassword,
  }: {
    name: string
    email: string
    birthDate: string
    encryptedPassword: string
  }) {
    this.name = name
    if (email) {
      this.emailVO = new Email(email)
    }
    this.birthDate = birthDate
    this.encryptedPassword = encryptedPassword
  }

  get email(): string {
    return this.emailVO?.toString() ?? ''
  }

  set email(email: Email) {
    this.emailVO = email
  }

  validate(): Array<string> {
    const errors: Array<string> = []

    if (!this.name) {
      errors.push('Name cannot be blank')
    }

    if (this.emailVO) {
      if (!this.emailVO.isValid()) {
        errors.push('Email is not valid')
      }
    } else {
      errors.push('Email cannot be blank')
    }

    if (!this.birthDate) {
      errors.push('Birthday cannot be blank')
    }
    if (this.birthDate && this.calculateAge() < 18) {
      errors.push('You must be older than 18')
    }

    return errors
  }

  private calculateAge() {
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
