class LoginUseCase {
  constructor(userRepository, passwordHasher, tokenService) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute({ username, password }) {
    const user = this.userRepository.findByUsername(username);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = this.tokenService.sign({
      sub: user.id,
      username: user.username,
      role: user.role
    });

    return {
      token,
      user: { id: user.id, username: user.username, role: user.role }
    };
  }
}

module.exports = LoginUseCase;
