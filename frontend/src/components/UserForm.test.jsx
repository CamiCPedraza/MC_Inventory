import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { vi } from "vitest";
import UserFormModal from "./UserFormModal";

describe("UserFormModal", () => {
  it("submits user fields as active and notifies the parent", async () => {
    const onUserCreated = vi.fn().mockResolvedValue({ username: "bodega" });
    const onUserCreatedSuccessfully = vi.fn();
    render(
      <UserFormModal
        onUserCreated={onUserCreated}
        onUserCreatedSuccessfully={onUserCreatedSuccessfully}
        onError={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    const form = within(screen.getByRole("dialog"));

    fireEvent.change(form.getByLabelText("Nombre de usuario"), { target: { value: "bodega" } });
    fireEvent.change(form.getByLabelText("Contraseña"), { target: { value: "secret123" } });
    fireEvent.change(form.getByLabelText("Rol"), { target: { value: "observer" } });
    fireEvent.change(form.getByLabelText("Nombre"), { target: { value: "Bodega" } });
    fireEvent.click(form.getByRole("button", { name: "Crear usuario" }));

    await waitFor(() => {
      expect(onUserCreated).toHaveBeenCalledWith({
        username: "bodega",
        password: "secret123",
        role: "observer",
        name: "Bodega",
        active: true
      });
    });
    expect(onUserCreatedSuccessfully).toHaveBeenCalledWith({ username: "bodega" });
    expect(form.queryByText("Activo")).not.toBeInTheDocument();
  });

  it("shows the password while hovering the eye icon", () => {
    render(
      <UserFormModal
        onUserCreated={vi.fn()}
        onUserCreatedSuccessfully={vi.fn()}
        onError={vi.fn()}
        onCancel={vi.fn()}
      />
    );

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
    render(
      <UserFormModal
        onUserCreated={onUserCreated}
        onUserCreatedSuccessfully={vi.fn()}
        onError={onError}
        onCancel={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("Nombre de usuario"), { target: { value: "bodega" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "secret123" } });
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Bodega" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear usuario" }));

    await waitFor(() => expect(onError).toHaveBeenCalledWith("Username already exists"));
  });
});