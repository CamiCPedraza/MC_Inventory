const User = require("../domain/User");
const { ADMIN, ALL_ROLES } = require("../domain/Roles");

class RegisterUserUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute({ username, password, role = ADMIN, name = username, active = true }) {
    if (!username || !password) {
      throw new Error("username and password are required");
    }

    if (!ALL_ROLES.includes(role)) {
      throw new Error(`Invalid role. Allowed roles: ${ALL_ROLES.join(", ")}`);
    }

    if (typeof active !== "boolean") {
      throw new Error("active must be a boolean");
    }

    if (this.userRepository.findByUsername(username)) {
      throw new Error("Username already exists");
    }

    const passwordHash = await this.passwordHasher.hash(password);
    const user = new User({
      id: Date.now().toString(),
      username,
      passwordHash,
      role,
      name,
      active
    });

    this.userRepository.save(user);
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      active: user.active
    };
  }
}

module.exports = RegisterUserUseCase;
