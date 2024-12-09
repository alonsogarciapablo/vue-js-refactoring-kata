import type UsersRepository from '../repositories/users-repository'

export default class UserRegistrationService {
  private usersRepository: UsersRepository

  constructor({ usersRepository }: { usersRepository: UsersRepository }) {
    this.usersRepository = usersRepository
  }

  isEmailAlreadyTaken(email: string): boolean {
    return !!this.usersRepository.findByEmail(email)
  }
}
