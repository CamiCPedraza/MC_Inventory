import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  it("submits username and password", async () => {
    const onLogin = vi.fn().mockResolvedValue(undefined);
    render(<LoginForm onLogin={onLogin} error="" />);

    fireEvent.change(screen.getByLabelText("Usuario"), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "admin123" } });
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith({ username: "admin", password: "admin123" });
    });
  });

  it("displays an authentication error", () => {
    render(<LoginForm onLogin={vi.fn()} error="Credenciales inválidas" />);

    expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
  });

  it("shows the password while hovering over the eye icon", () => {
    render(<LoginForm onLogin={vi.fn()} error="" />);

    const passwordInput = screen.getByLabelText("Contraseña");
    const visibilityControl = screen.getByRole("img", { name: "ver contraseña" });
    expect(visibilityControl).toHaveAttribute("title", "ver contraseña");

    fireEvent.change(passwordInput, { target: { value: "admin123" } });
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.mouseEnter(visibilityControl);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.mouseLeave(visibilityControl);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});