const UserRepository = require("../../domain/ports/UserRepository");

class InMemoryUserRepository extends UserRepository {
  constructor() {
    super();
    this.users = [];
  }

  save(user) {
    this.users.push(user);
    return user;
  }

  findByUsername(username) {
    return this.users.find((user) => user.username === username);
  }

  findById(id) {
    return this.users.find((user) => user.id === id);
  }
}

module.exports = InMemoryUserRepository;
