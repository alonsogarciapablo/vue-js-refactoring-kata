export default class Email {
  address: string

  private readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  constructor(address: string) {
    this.address = address
  }

  validate(): Array<string> {
    const errors: Array<string> = []
    if (this.address) {
      if (!this.EMAIL_REGEX.test(this.address)) {
        errors.push('Email is not valid')
      }
    } else {
      errors.push('Email cannot be blank')
    }
    return errors
  }
}
