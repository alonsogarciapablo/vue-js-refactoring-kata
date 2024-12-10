import User from '../../domain/models/user'
import type UsersRepository from '../../domain/repositories/users-repository'
import UserRegistrationService from '../../domain/services/user-registration-service'
import encrypt from '../../utils/encrypt'

export default class RegisterUser {
  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  execute({
    name,
    email,
    birthDate,
    password,
    passwordConfirmation,
  }: {
    name: string
    email: string
    birthDate: string
    password: string
    passwordConfirmation: string
  }): { errors: Array<string> } {
    const encryptedPassword = encrypt(password)
    const user = new User({
      name,
      email,
      birthDate,
      encryptedPassword,
    })
    const errors: Array<string> = user.validate()

    const userRegistrationService = new UserRegistrationService(this.usersRepository)

    if (userRegistrationService.isEmailTaken(email)) {
      errors.push('Email has already been used')
    }
    if (password.length < 8) {
      errors.push('Password must have 8 digits')
    }
    if (password !== passwordConfirmation) {
      errors.push("Passwords don't match")
    }

    if (errors.length === 0) {
      // persist user
      this.usersRepository.add(user)

      // send a confirmation email to the user
      this.sendEmail({
        from: 'no-reply@tinderella.com',
        to: email,
        subject: 'Please validate your email',
        body: `Click here to validate your email: <a href="https://tinderella.com/validate?email=${email}">validate</a>`,
      })
    }

    return { errors }
  }

  private sendEmail({
    from,
    to,
    subject,
    body,
  }: {
    from: string
    to: string
    subject: string
    body: string
  }): void {
    console.log('Sending email')
    console.log('- From: ', from)
    console.log('- To: ', to)
    console.log('- Subject: ', subject)
    console.log('- Body: ', body)
    console.log('Email sent')
  }
}
