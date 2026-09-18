import { afterEach, describe, expect, it, vi } from "vitest";
import { clearStoredToken, getStoredToken, login, storeToken } from "./api";

describe("auth API", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("stores and clears the token", () => {
    storeToken("token-123");
    expect(getStoredToken()).toBe("token-123");

    clearStoredToken();
    expect(getStoredToken()).toBeNull();
  });

  it("logs in and stores the returned token", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ token: "jwt-token", user: { username: "admin" } })
    });

    const result = await login({ username: "admin", password: "admin123" });

    expect(result.token).toBe("jwt-token");
    expect(getStoredToken()).toBe("jwt-token");
    expect(fetch).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123" })
    });
  });

  it("throws the backend error when login fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Invalid credentials" })
    });

    await expect(login({ username: "admin", password: "wrong" })).rejects.toThrow(
      "Invalid credentials"
    );
  });
});
