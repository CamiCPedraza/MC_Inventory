const JwtTokenService = require("../src/infrastructure/adapters/JwtTokenService");

describe("JwtTokenService", () => {
  it("signs and verifies a token round-trip", () => {
    const service = new JwtTokenService("test-secret");
    const token = service.sign({ sub: "1", username: "admin", role: "admin" });

    const payload = service.verify(token);

    expect(payload.sub).toBe("1");
    expect(payload.username).toBe("admin");
    expect(payload.role).toBe("admin");
  });

  it("throws when verifying a token signed with a different secret", () => {
    const service = new JwtTokenService("test-secret");
    const otherService = new JwtTokenService("other-secret");
    const token = otherService.sign({ sub: "1", username: "admin", role: "admin" });

    expect(() => service.verify(token)).toThrow();
  });
});
