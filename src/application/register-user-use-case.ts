import UserFactory from '../domain/models/user-factory'
import type UsersRepository from '../domain/repositories/users-repository'
import UserRegistrationService from '../domain/services/user-registration-service'
import encrypt from '../utils/encrypt'

export default class RegisterUserUseCase {
  execute(args: {
    name: string
    email: string
    birthDate: string
    password: string
    passwordConfirmation: string
    usersRepository: UsersRepository
  }): { errors: Array<string> } {
    return registerUser(args)
  }
}

function registerUser({
  name,
  email,
  birthDate,
  password,
  passwordConfirmation,
  usersRepository,
}: {
  name: string
  email: string
  birthDate: string
  password: string
  passwordConfirmation: string
  usersRepository: UsersRepository
}): { errors: Array<string> } {
  const encryptedPassword = encrypt(password)
  const user = UserFactory.create({
    name: name,
    email: email,
    birthDate: birthDate,
    encryptedPassword,
  })

  const errors = user.validate()

  const userRegistrationService = new UserRegistrationService({
    usersRepository,
  })
  if (userRegistrationService.isEmailAlreadyTaken(email)) {
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
    usersRepository.add(user)

    // send a confirmation email to the user
    sendEmail({
      from: 'no-reply@tinderella.com',
      to: email,
      subject: 'Please validate your email',
      body: `Click here to validate your email: <a href="https://tinderella.com/validate?email=${email}">validate</a>`,
    })
  }

  return { errors }
}

// TODO: Extract to an email service
function sendEmail({
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
