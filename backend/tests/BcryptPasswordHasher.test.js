const BcryptPasswordHasher = require("../src/infrastructure/adapters/BcryptPasswordHasher");

describe("BcryptPasswordHasher", () => {
  it("hashes a password and verifies it correctly", async () => {
    const hasher = new BcryptPasswordHasher();
    const hash = await hasher.hash("mySecret123");

    expect(hash).not.toBe("mySecret123");
    await expect(hasher.compare("mySecret123", hash)).resolves.toBe(true);
    await expect(hasher.compare("wrongPassword", hash)).resolves.toBe(false);
  });
});
