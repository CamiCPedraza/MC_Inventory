const User = require("../domain/User");

class RegisterUserUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ username, password, role = "admin" }) {
    if (!username || !password) {
      throw new Error("username and password are required");
    }

    if (this.userRepository.findByUsername(username)) {
      throw new Error("Username already exists");
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const user = new User({
      id: Date.now().toString(),
      username,
      passwordHash,
      role
    });

    this.userRepository.save(user);
    return { id: user.id, username: user.username, role: user.role };
  }
}

module.exports = RegisterUserUseCase;
