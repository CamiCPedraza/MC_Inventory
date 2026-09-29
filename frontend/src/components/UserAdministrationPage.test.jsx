import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import * as api from "../api";
import UserAdministrationPage from "./UserAdministrationPage";

describe("UserAdministrationPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows name, username, and active state in the user table", async () => {
    vi.spyOn(api, "fetchUsers").mockResolvedValue([
      { name: "Bodega Central", username: "bodega", role: "observer", active: true },
      { name: "Archivo", username: "archivo", role: "admin", active: false }
    ]);

    render(
      <MemoryRouter>
        <UserAdministrationPage onUserCreated={vi.fn()} error="" onError={vi.fn()} />
      </MemoryRouter>
    );

    const table = await screen.findByRole("table");
    expect(within(table).getByText("Bodega Central")).toBeInTheDocument();
    expect(within(table).getByText("bodega")).toBeInTheDocument();
    expect(within(table).getByText("Observador")).toBeInTheDocument();
    expect(within(table).getByText("Archivo")).toBeInTheDocument();
    expect(within(table).getByText("archivo")).toBeInTheDocument();
    expect(within(table).getByText("Administrador")).toBeInTheDocument();

    const rows = within(table).getAllByRole("row");
    expect(within(rows[1]).getAllByRole("cell").map((cell) => cell.textContent)).toEqual([
      "Bodega Central",
      "bodega",
      "Observador",
      "Sí"
    ]);
    expect(within(rows[1]).getByText("Sí")).toBeInTheDocument();
    expect(within(rows[2]).getByText("No")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Agregar usuario" })).toBeInTheDocument();
  });

  it("refreshes the user list after successful creation", async () => {
    vi.spyOn(api, "fetchUsers")
      .mockResolvedValueOnce([{ name: "Administrador", username: "admin", role: "admin", active: true }])
      .mockResolvedValueOnce([
        { name: "Administrador", username: "admin", active: true },
        { name: "Administrador", username: "admin", role: "admin", active: true },
        { name: "Bodega", username: "bodega", role: "observer", active: true }
      ]);
    const onUserCreated = vi.fn().mockResolvedValue({ username: "bodega" });

    render(
      <MemoryRouter>
        <UserAdministrationPage onUserCreated={onUserCreated} error="" onError={vi.fn()} />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole("button", { name: "Agregar usuario" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Nombre de usuario"), {
      target: { value: "bodega" }
    });
    fireEvent.change(within(dialog).getByLabelText("Contraseña"), {
      target: { value: "bodega123" }
    });
    fireEvent.change(within(dialog).getByLabelText("Nombre"), {
      target: { value: "Bodega" }
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "Crear usuario" }));

    await waitFor(() => expect(onUserCreated).toHaveBeenCalled());
    expect(await screen.findByText("Bodega")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Usuario bodega creado correctamente.");
    expect(api.fetchUsers).toHaveBeenCalledTimes(2);
  });

  it("disables the create button while the creation request is pending", async () => {
    vi.spyOn(api, "fetchUsers").mockResolvedValue([]);
    let resolveCreation;
    const onUserCreated = vi.fn(() => new Promise((resolve) => {
      resolveCreation = resolve;
    }));

    render(
      <MemoryRouter>
        <UserAdministrationPage onUserCreated={onUserCreated} error="" onError={vi.fn()} />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole("button", { name: "Agregar usuario" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Nombre de usuario"), { target: { value: "bodega" } });
    fireEvent.change(within(dialog).getByLabelText("Contraseña"), { target: { value: "bodega123" } });
    fireEvent.change(within(dialog).getByLabelText("Nombre"), { target: { value: "Bodega" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Crear usuario" }));

    expect(within(dialog).getByRole("button", { name: "Creando usuario..." })).toBeDisabled();
    resolveCreation({ username: "bodega" });

    expect(await screen.findByRole("status")).toHaveTextContent("Usuario bodega creado correctamente.");
  });
});