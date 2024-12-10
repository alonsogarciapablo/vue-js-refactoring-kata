import type InMemoryUsersRepository from '../../infrastructure/persistence/in-memory-users-repository'

export default class UserRegistrationService {
  private usersRepository: InMemoryUsersRepository

  constructor(usersRepository: InMemoryUsersRepository) {
    this.usersRepository = usersRepository
  }

  isEmailTaken(email: string): boolean {
    return !!this.usersRepository.findByEmail(email)
  }
}
