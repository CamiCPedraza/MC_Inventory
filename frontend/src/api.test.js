import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearStoredToken,
  clearStoredUser,
  fetchUsers,
  getStoredToken,
  getStoredUser,
  login,
  registerUser,
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

  it("registers a user with auth token and all form fields", async () => {
    storeToken("admin-token");
    const user = {
      id: "7",
      username: "bodega",
      password: "secret",
      role: "observer",
      name: "Bodega",
      active: false
    };
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ ...user, password: undefined })
    });

    await registerUser(user);

    expect(fetch).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer admin-token"
      },
      body: JSON.stringify(user)
    });
  });

  it("fetches the user list with the stored authorization token", async () => {
    storeToken("admin-token");
    const users = [{ name: "Bodega Central", username: "bodega", active: true }];
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => users
    });

    await expect(fetchUsers()).resolves.toEqual(users);
    expect(fetch).toHaveBeenCalledWith("/auth/users", {
      headers: { Authorization: "Bearer admin-token" }
    });
  });
});
