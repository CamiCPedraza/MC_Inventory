const RegisterUserUseCase = require("../src/application/RegisterUserUseCase");

class TestUserRepository {
  constructor(users) {
    this.users = users || [];
  }

  findByUsername(username) {
    return this.users.find((u) => u.username === username);
  }

  save(user) {
    this.users.push(user);
    return user;
  }
}

class TestPasswordHasher {
  async hash(plainText) {
    return `hashed:${plainText}`;
  }
}

describe("RegisterUserUseCase", () => {
  it("registers a new user with a hashed password", async () => {
    const repository = new TestUserRepository();
    const hasher = new TestPasswordHasher();
    const useCase = new RegisterUserUseCase(repository, hasher);

    const result = await useCase.execute({ username: "operator1", password: "secret123" });

    expect(result).toEqual({ id: expect.any(String), username: "operator1", role: "admin" });
    expect(repository.users[0].passwordHash).toBe("hashed:secret123");
  });

  it("throws when username or password are missing", async () => {
    const repository = new TestUserRepository();
    const hasher = new TestPasswordHasher();
    const useCase = new RegisterUserUseCase(repository, hasher);

    await expect(useCase.execute({ username: "", password: "" })).rejects.toThrow(
      "username and password are required"
    );
  });

  it("throws when username already exists", async () => {
    const repository = new TestUserRepository([{ username: "admin" }]);
    const hasher = new TestPasswordHasher();
    const useCase = new RegisterUserUseCase(repository, hasher);

    await expect(useCase.execute({ username: "admin", password: "secret123" })).rejects.toThrow(
      "Username already exists"
    );
  });
});
