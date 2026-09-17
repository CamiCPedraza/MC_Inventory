const LoginUseCase = require("../src/application/LoginUseCase");

class TestUserRepository {
  constructor(users) {
    this.users = users || [];
  }

  findByUsername(username) {
    return this.users.find((u) => u.username === username);
  }
}

class TestPasswordHasher {
  async compare(plainText, hash) {
    return hash === `hashed:${plainText}`;
  }
}

class TestTokenService {
  sign(payload) {
    return `token-for-${payload.username}`;
  }
}

describe("LoginUseCase", () => {
  const user = { id: "1", username: "admin", passwordHash: "hashed:admin123", role: "admin" };

  it("returns a token and user info for valid credentials", async () => {
    const repository = new TestUserRepository([user]);
    const useCase = new LoginUseCase(repository, new TestPasswordHasher(), new TestTokenService());

    const result = await useCase.execute({ username: "admin", password: "admin123" });

    expect(result.token).toBe("token-for-admin");
    expect(result.user).toEqual({ id: "1", username: "admin", role: "admin" });
  });

  it("throws for an unknown username", async () => {
    const repository = new TestUserRepository([]);
    const useCase = new LoginUseCase(repository, new TestPasswordHasher(), new TestTokenService());

    await expect(useCase.execute({ username: "ghost", password: "x" })).rejects.toThrow(
      "Invalid credentials"
    );
  });

  it("throws for an incorrect password", async () => {
    const repository = new TestUserRepository([user]);
    const useCase = new LoginUseCase(repository, new TestPasswordHasher(), new TestTokenService());

    await expect(useCase.execute({ username: "admin", password: "wrong" })).rejects.toThrow(
      "Invalid credentials"
    );
  });
});
