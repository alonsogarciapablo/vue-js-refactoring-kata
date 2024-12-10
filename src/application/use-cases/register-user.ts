import User from '../../domain/models/user'
import type UsersRepository from '../../domain/repositories/users-repository'
import UserRegistrationService from '../../domain/services/user-registration-service'
import encrypt from '../../utils/encrypt'

export default class RegisterUser {
  private usersRepository: UsersRepository
  private userRegistrationService: UserRegistrationService

  constructor(usersRepository: UsersRepository, userRegistrationService: UserRegistrationService) {
    this.usersRepository = usersRepository
    this.userRegistrationService = userRegistrationService
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
  }): Array<string> {
    const user = new User({
      name,
      email,
      birthDate,
      encryptedPassword: encrypt(password),
    })
    const errors = user.validate()

    if (this.userRegistrationService.isEmailTaken(email)) {
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
      const subject = 'Please validate your email'
      const url = `https://tinderella.com/validate?email=${email}`
      const body = `Click here to validate your email: <a href="${url}">validate</a>`
      this.sendEmail({
        from: 'no-reply@tinderella.com',
        to: email,
        subject: subject,
        body: body,
      })
    }
    return errors
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
