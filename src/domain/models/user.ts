export default class User {
  name: string
  email: string
  birthDate: string
  encryptedPassword: string

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
    this.email = email
    this.birthDate = birthDate
    this.encryptedPassword = encryptedPassword
  }

  validate(): Array<string> {
    const errors: Array<string> = []

    if (!this.name) {
      errors.push('Name cannot be blank')
    }

    if (this.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(this.email)) {
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
