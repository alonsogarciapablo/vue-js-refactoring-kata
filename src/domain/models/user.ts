class Email {
  private address: string

  constructor(address: string) {
    this.address = address
  }

  validate(): Array<string> {
    const errors: Array<string> = []
    return errors
  }
}

export default class User {
  name: string
  email: string
  birthDate: string
  encryptedPassword: string

  constructor(attrs: {
    name: string
    email: string
    birthDate: string
    encryptedPassword: string
  }) {
    this.name = attrs.name
    this.email = attrs.email
    this.birthDate = attrs.birthDate
    this.encryptedPassword = attrs.encryptedPassword
  }

  validate(): Array<string> {
    const errors = []
    if (!this.name) {
      errors.push('Name cannot be blank')
    }

    const email = new Email(this.email)
    errors.push(...email.validate())

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
