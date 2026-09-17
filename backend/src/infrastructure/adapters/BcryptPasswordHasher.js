const bcrypt = require("bcryptjs");
const PasswordHasher = require("../../domain/ports/PasswordHasher");

const SALT_ROUNDS = 10;

class BcryptPasswordHasher extends PasswordHasher {
  async hash(plainText) {
    return bcrypt.hash(plainText, SALT_ROUNDS);
  }

  async compare(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  }
}

module.exports = BcryptPasswordHasher;
