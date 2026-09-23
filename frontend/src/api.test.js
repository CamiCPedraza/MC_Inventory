import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearStoredToken,
  clearStoredUser,
  getStoredToken,
  getStoredUser,
  login,
  storeToken,
  storeUser
} from "./api";

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

  it("stores and clears the user", () => {
    storeUser({ id: "2", username: "Bodega", role: "observer" });
    expect(getStoredUser()).toEqual({ id: "2", username: "Bodega", role: "observer" });

    clearStoredUser();
    expect(getStoredUser()).toBeNull();
  });

  it("logs in and stores the returned token and user", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ token: "jwt-token", user: { username: "admin", role: "admin" } })
    });

    const result = await login({ username: "admin", password: "admin123" });

    expect(result.token).toBe("jwt-token");
    expect(getStoredToken()).toBe("jwt-token");
    expect(getStoredUser()).toEqual({ username: "admin", role: "admin" });
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
