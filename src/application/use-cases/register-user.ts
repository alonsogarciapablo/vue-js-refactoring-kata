import type InMemoryUsersRepository from '../../infrastructure/persistence/in-memory-users-repository'
import encrypt from '../../utils/encrypt'

export default class RegisterUser {
  private usersRepository: InMemoryUsersRepository

  constructor(usersRepository: InMemoryUsersRepository) {
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
  }): Array<string> {
    const errors = []

    if (!name) {
      errors.push('Name cannot be blank')
    }
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(email)) {
        errors.push('Email is not valid')
      }
    } else {
      errors.push('Email cannot be blank')
    }
    if (!birthDate) {
      errors.push('Birthday cannot be blank')
    }
    if (birthDate && this.calculateAge(birthDate) < 18) {
      errors.push('You must be older than 18')
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

    if (errors.length === 0) {
      // persist user
      this.usersRepository.add({
        name,
        email,
        birthDate,
        encryptedPassword: encrypt(password),
      })

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

  private calculateAge(birthDate: string) {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDifference = today.getMonth() - birth.getMonth()

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
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
