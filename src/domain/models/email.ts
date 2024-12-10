export default class Email {
  address: string

  private readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  constructor(address: string) {
    this.address = address
  }

  isValid(): boolean {
    return this.EMAIL_REGEX.test(this.address)
  }

  toString(): string {
    return this.address.toString()
  }
}
