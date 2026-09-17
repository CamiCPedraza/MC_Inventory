const jwt = require("jsonwebtoken");
const TokenService = require("../../domain/ports/TokenService");

class JwtTokenService extends TokenService {
  constructor(secret, expiresIn = "8h") {
    super();
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  sign(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }
}

module.exports = JwtTokenService;
