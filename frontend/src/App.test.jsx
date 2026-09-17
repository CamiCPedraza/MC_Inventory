import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";
import * as api from "./api";

describe("App UI", () => {
  beforeEach(() => {
    vi.spyOn(api, "fetchItems").mockResolvedValue([]);
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
      stock: data.stock
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the main sections", async () => {
    render(<App />);

    expect(screen.getByText(/Inventario PVCM/i)).toBeInTheDocument();
    expect(screen.getByText(/Registrar item/i)).toBeInTheDocument();

    await waitFor(() => expect(api.fetchItems).toHaveBeenCalled());
  });

  it("displays loading state then empty message", async () => {
    render(<App />);

    expect(screen.getByText(/Cargando items/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/No hay items registrados/i)).toBeInTheDocument());
  });

  it("creates a new item and displays it in the list", async () => {
    render(<App />);

    await waitFor(() => expect(api.fetchItems).toHaveBeenCalled());

    fireEvent.change(screen.getByLabelText(/Nombre/i), {
      target: { value: "Tornillo" }
    });
    fireEvent.change(screen.getByLabelText(/SKU/i), {
      target: { value: "TOR-001" }
    });
    fireEvent.change(screen.getByLabelText(/Stock/i), {
      target: { value: "5" }
    });

    fireEvent.click(screen.getByText(/Crear item/i));

    await waitFor(() =>
      expect(api.createItem).toHaveBeenCalledWith({
        name: "Tornillo",
        sku: "TOR-001",
        stock: 5
      })
    );

    expect(screen.getByText(/Tornillo/i)).toBeInTheDocument();
  });

  it("generates and displays QR code", async () => {
    vi.spyOn(api, "fetchItems").mockResolvedValue([
      { id: "1", name: "Tornillo", sku: "TOR-001", stock: 5 }
    ]);

    render(<App />);

    await waitFor(() => expect(api.fetchItems).toHaveBeenCalled());

    const qrButtons = screen.getAllByText(/Generar QR/i);
    fireEvent.click(qrButtons[0]);

    await waitFor(() => expect(api.fetchItemQrCode).toHaveBeenCalledWith("1"));

    expect(screen.getByAltText(/Código QR/i)).toBeInTheDocument();
    expect(screen.getByText(/Abrir información/i)).toBeInTheDocument();
  });

  it("generates and displays barcode", async () => {
    vi.spyOn(api, "fetchItems").mockResolvedValue([
      { id: "1", name: "Tornillo", sku: "TOR-001", stock: 5 }
    ]);

    render(<App />);

    await waitFor(() => expect(api.fetchItems).toHaveBeenCalled());

    const barcodeButtons = screen.getAllByText(/Generar código de barras/i);
    fireEvent.click(barcodeButtons[0]);

    await waitFor(() => expect(api.fetchItemBarcode).toHaveBeenCalledWith("1"));

    expect(screen.getByAltText(/Código de barras/i)).toBeInTheDocument();
    expect(screen.getByText(/Valor codificado \(SKU\): TOR-001/i)).toBeInTheDocument();
  });

  it("updates item stock via modal", async () => {
    vi.spyOn(api, "fetchItems").mockResolvedValue([
      { id: "1", name: "Tornillo", sku: "TOR-001", stock: 5 }
    ]);

    render(<App />);

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

    expect(screen.getByText(/Stock: 15/i)).toBeInTheDocument();
  });
});
