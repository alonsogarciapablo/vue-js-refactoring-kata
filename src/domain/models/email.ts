export default class Email {
  private address: string

  constructor(address: string) {
    this.address = address
  }

  validate(): Array<string> {
    const errors: Array<string> = []

    if (this.address) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(this.address)) {
        errors.push('Email is not valid')
      }
    } else {
      errors.push('Email cannot be blank')
    }
    return errors
  }
}
