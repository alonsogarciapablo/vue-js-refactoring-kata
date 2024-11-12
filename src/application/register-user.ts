import InMemoryUsersRepository from '../infrastructure/persistence/in-memory-users-repository'
import LogToConsoleEmailSender from '../infrastructure/email/log-to-console-email-sender'
import encrypt from '../utils/encrypt'

type User = {
  name: string
  email: string
  password: string
}

export default class RegisterUser {
  private readonly usersRepository = InMemoryUsersRepository.getInstance()
  private readonly emailService = new LogToConsoleEmailSender()

  constructor() {}

  execute(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ): { errors: Array<string> } {
    const errors = this.validateInput(name, email, password, passwordConfirmation)

    if (errors.length === 0) {
      const user: User = {
        name: name,
        email,
        password: encrypt(password),
      }

      // persist user
      this.usersRepository.add(user)

      // send an email to confirm email
      this.emailService.sendEmail({
        from: 'no-reply@tinderella.com',
        to: email,
        subject: 'Please validate your email',
        body: `Click here to validate your email: <a href="https://tinderella.com/validate?email=${email}">validate</a>`,
      })
    }

    return { errors }
  }

  private validateInput(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) {
    const errors = []

    if (!name) {
      errors.push('Name cannot be blank')
    }
    if (!email) {
      errors.push('Email cannot be blank')
    }
    if (this.usersRepository.findByEmail(email)) {
      errors.push('Email has already been used')
    }
    if (password.length < 8) {
      errors.push('Password must have 8 digits')
    }
    if (password !== passwordConfirmation) {
      errors.push("Passwords don't match")
    }
    return errors
  }
}
