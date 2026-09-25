class User {
  constructor({ id, username, passwordHash, role, name = username, active = true }) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role;
    this.name = name;
    this.active = active;
  }
}

module.exports = User;
