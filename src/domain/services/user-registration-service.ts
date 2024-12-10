import type UsersRepository from '../repositories/users-repository'

export default class UserRegistrationService {
  usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  isEmailTaken(email: string): boolean {
    return !!this.usersRepository.findByEmail(email)
  }
}
