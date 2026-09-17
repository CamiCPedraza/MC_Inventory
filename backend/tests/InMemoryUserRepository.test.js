const InMemoryUserRepository = require("../src/infrastructure/repositories/InMemoryUserRepository");
const User = require("../src/domain/User");

describe("InMemoryUserRepository", () => {
  it("saves and retrieves a user by username and id", () => {
    const repository = new InMemoryUserRepository();
    const user = new User({ id: "1", username: "admin", passwordHash: "hash", role: "admin" });

    repository.save(user);

    expect(repository.findByUsername("admin")).toBe(user);
    expect(repository.findById("1")).toBe(user);
  });

  it("returns undefined when user is not found", () => {
    const repository = new InMemoryUserRepository();

    expect(repository.findByUsername("ghost")).toBeUndefined();
    expect(repository.findById("ghost")).toBeUndefined();
  });
});
