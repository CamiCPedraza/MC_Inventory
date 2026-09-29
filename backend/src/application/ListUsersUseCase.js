class ListUsersUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute() {
    return this.userRepository.findAll().map(({ name, username, role, active }) => ({
      name,
      username,
      role,
      active
    }));
  }
}

module.exports = ListUsersUseCase;