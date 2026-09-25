import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { vi } from "vitest";
import UserForm from "./UserForm";

describe("UserForm", () => {
  it("submits all user fields and shows confirmation", async () => {
    const onUserCreated = vi.fn().mockResolvedValue({ username: "bodega" });
    render(<UserForm onUserCreated={onUserCreated} onError={vi.fn()} />);
    const form = within(screen.getByRole("heading", { name: "Crear usuario" }).closest("section"));

    fireEvent.change(form.getByLabelText("Nombre de usuario"), { target: { value: "bodega" } });
    fireEvent.change(form.getByLabelText("Contraseña"), { target: { value: "secret123" } });
    fireEvent.change(form.getByLabelText("Rol"), { target: { value: "observer" } });
    fireEvent.change(form.getByLabelText("Nombre"), { target: { value: "Bodega" } });
    fireEvent.click(form.getByRole("radio", { name: "No" }));
    fireEvent.click(form.getByRole("button", { name: "Crear usuario" }));

    await waitFor(() => {
      expect(onUserCreated).toHaveBeenCalledWith({
        username: "bodega",
        password: "secret123",
        role: "observer",
        name: "Bodega",
        active: false
      });
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Usuario bodega creado correctamente.");
  });

  it("shows the password while hovering the eye icon", () => {
    render(<UserForm onUserCreated={vi.fn()} onError={vi.fn()} />);

    const passwordInput = screen.getByLabelText("Contraseña");
    const visibilityControl = screen.getByRole("img", { name: "ver contraseña" });

    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.mouseEnter(visibilityControl);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.mouseLeave(visibilityControl);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("forwards creation errors to the parent", async () => {
    const onError = vi.fn();
    const onUserCreated = vi.fn().mockRejectedValue(new Error("Username already exists"));
    render(<UserForm onUserCreated={onUserCreated} onError={onError} />);

    fireEvent.change(screen.getByLabelText("Nombre de usuario"), { target: { value: "bodega" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "secret123" } });
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Bodega" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));

    await waitFor(() => expect(onError).toHaveBeenCalledWith("Username already exists"));
  });
});