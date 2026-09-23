const User = require("../domain/User");
const { ADMIN, ALL_ROLES } = require("../domain/Roles");

class RegisterUserUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ username, password, role = ADMIN }) {
    if (!username || !password) {
      throw new Error("username and password are required");
    }

    if (!ALL_ROLES.includes(role)) {
      throw new Error(`Invalid role. Allowed roles: ${ALL_ROLES.join(", ")}`);
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
