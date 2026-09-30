import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import * as api from "./api";

function renderApp(initialRoute = "/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
}

describe("App UI", () => {
  beforeEach(() => {
    localStorage.setItem("pvcm_auth_token", "test-token");
    localStorage.setItem(
      "pvcm_auth_user",
      JSON.stringify({ id: "1", username: "admin", role: "admin" })
    );
    vi.spyOn(api, "fetchItems").mockResolvedValue([]);
    vi.spyOn(api, "fetchUsers").mockResolvedValue([
      { name: "Administrador", username: "admin", active: true }
    ]);
    vi.spyOn(api, "registerUser").mockImplementation(async (user) => ({
      id: "2",
      username: user.username,
      role: user.role,
      name: user.name,
      active: user.active
    }));
    vi.spyOn(api, "createItem").mockImplementation(async (item) => ({ id: "1", ...item }));
    vi.spyOn(api, "fetchItemQrCode").mockResolvedValue({
      qrCode: "data:image/png;base64,test",
      qrUrl: "http://localhost:3000/inventory/items/1/qr/view"
    });
    vi.spyOn(api, "fetchItemBarcode").mockResolvedValue({
      barcode: "data:image/png;base64,barcodetest",
      barcodeValue: "TOR-001"
    });
    vi.spyOn(api, "updateItem").mockImplementation(async (id, data) => ({
      id,
      name: "Tornillo",
      sku: "TOR-001",
      stock: data.stock,
      bodega: "Norte"
    }));
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders the main sections", async () => {
    renderApp();

    expect(screen.getByText("Comercializadora Quantto | Sistema de inventario")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Panel de control" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Administrar inventario/i })).toHaveAttribute("href", "/inventory");
    expect(screen.getByRole("link", { name: /Administrar usuarios/i })).toHaveAttribute("href", "/users");

    await waitFor(() => expect(api.fetchItems).toHaveBeenCalled());
  });

  it("navigates from the dashboard to independent inventory and user pages", async () => {
    renderApp();

    fireEvent.click(screen.getByRole("link", { name: /Administrar inventario/i }));
    expect(await screen.findByRole("heading", { name: "Inventario" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Agregar producto" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Agregar producto" }));
    expect(await screen.findByRole("heading", { name: "Registrar item" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Usuarios" }));
    expect(await screen.findByRole("heading", { name: "Usuarios" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Agregar usuario" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows a blank inventory screen for an observer when there are no items", async () => {
    localStorage.setItem(
      "pvcm_auth_user",
      JSON.stringify({ id: "2", username: "Bodega", role: "observer" })
    );

    renderApp("/inventory");

    await waitFor(() =>
      expect(screen.getByText(/No hay inventario registrado en este momento/i)).toBeInTheDocument()
    );

    expect(screen.queryByText(/Registrar item/i)).not.toBeInTheDocument();
  });

  it("hides create and management actions for an observer with items", async () => {
    localStorage.setItem(
      "pvcm_auth_user",
      JSON.stringify({ id: "2", username: "Bodega", role: "observer" })
    );
    vi.spyOn(api, "fetchItems").mockResolvedValue([
      { id: "1", name: "Tornillo", sku: "TOR-001", stock: 5, bodega: "Norte" }
    ]);

    renderApp("/inventory");

    await waitFor(() => expect(screen.getByText("Descripción: Tornillo")).toBeInTheDocument());

    expect(screen.queryByText(/Registrar item/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Generar QR/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Generar código de barras/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Actualizar stock/i)).not.toBeInTheDocument();
  });

  it("displays loading state then empty message", async () => {
    renderApp("/inventory");

    expect(screen.getByText(/Cargando items/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/No hay items registrados/i)).toBeInTheDocument());
  });

  it("creates a new item and displays it in the list", async () => {
    renderApp("/inventory");

    await waitFor(() => expect(api.fetchItems).toHaveBeenCalled());

    expect(screen.getByText(/No hay items registrados/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Agregar producto" }));
    const dialog = await screen.findByRole("dialog");
    const itemForm = within(dialog);

    fireEvent.change(itemForm.getByLabelText("Descripción"), {
      target: { value: "Tornillo" }
    });
    fireEvent.change(itemForm.getByLabelText("Producto"), {
      target: { value: "TOR-001" }
    });
    fireEvent.change(itemForm.getByLabelText("Cantidad (metros)"), {
      target: { value: "5" }
    });
    fireEvent.change(itemForm.getByLabelText("Bodega"), {
      target: { value: "Norte" }
    });

    fireEvent.click(itemForm.getByRole("button", { name: "Crear item" }));

    await waitFor(() =>
      expect(api.createItem).toHaveBeenCalledWith({
        name: "Tornillo",
        sku: "TOR-001",
        stock: 5,
        bodega: "Norte"
      })
    );

    expect(await screen.findByText("Bodega: Norte")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("generates and displays barcode inside its product row", async () => {
    vi.spyOn(api, "fetchItems").mockResolvedValue([
      { id: "1", name: "Tornillo", sku: "TOR-001", stock: 5, bodega: "Norte" }
    ]);

    renderApp("/inventory");

    await waitFor(() => expect(api.fetchItems).toHaveBeenCalled());

    const barcodeButtons = screen.getAllByText(/Generar código de barras/i);
    fireEvent.click(barcodeButtons[0]);

    await waitFor(() => expect(api.fetchItemBarcode).toHaveBeenCalledWith("1"));

    expect(screen.getByAltText(/Código de barras/i)).toBeInTheDocument();
    const productRow = screen.getByText("TOR-001", { selector: "strong" }).closest("li");
    expect(productRow).toHaveTextContent("Producto codificado: TOR-001");
    expect(screen.queryByText("Generar QR")).not.toBeInTheDocument();
  });

  it("updates item stock via modal", async () => {
    vi.spyOn(api, "fetchItems").mockResolvedValue([
      { id: "1", name: "Tornillo", sku: "TOR-001", stock: 5, bodega: "Norte" }
    ]);

    renderApp("/inventory");

    await waitFor(() => expect(api.fetchItems).toHaveBeenCalled());

    const updateButtons = screen.getAllByText(/Actualizar stock/i);
    fireEvent.click(updateButtons[0]);

    await waitFor(() => {
      const overlay = document.querySelector(".modal-overlay");
      expect(overlay).toBeInTheDocument();
    });

    const numberInputs = screen.getAllByDisplayValue(/5|0/);
    const stockInput = numberInputs[numberInputs.length - 1];
    fireEvent.change(stockInput, { target: { value: "15" } });

    fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }));

    await waitFor(() =>
      expect(api.updateItem).toHaveBeenCalledWith("1", { stock: 15 })
    );

    expect(screen.getByText(/Cantidad \(metros\): 15/i)).toBeInTheDocument();
  });
});
