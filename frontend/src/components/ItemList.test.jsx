import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ItemList from "./ItemList";

describe("ItemList", () => {
  const mockItems = [
    { id: "1", name: "Tornillo", sku: "TOR-001", stock: 5 },
    { id: "2", name: "Clavo", sku: "CLA-001", stock: 10 }
  ];

  const mockHandlers = {
    onGenerateQr: vi.fn(),
    onGenerateBarcode: vi.fn(),
    onUpdateStock: vi.fn()
  };

  it("shows loading message when loading is true", () => {
    render(
      <ItemList
        items={[]}
        loading={true}
        onGenerateQr={mockHandlers.onGenerateQr}
        onGenerateBarcode={mockHandlers.onGenerateBarcode}
        onUpdateStock={mockHandlers.onUpdateStock}
      />
    );
    expect(screen.getByText("Cargando items...")).toBeInTheDocument();
  });

  it("shows empty message when no items", () => {
    render(
      <ItemList
        items={[]}
        loading={false}
        onGenerateQr={mockHandlers.onGenerateQr}
        onGenerateBarcode={mockHandlers.onGenerateBarcode}
        onUpdateStock={mockHandlers.onUpdateStock}
      />
    );
    expect(screen.getByText("No hay items registrados.")).toBeInTheDocument();
  });

  it("renders list of items", () => {
    render(
      <ItemList
        items={mockItems}
        loading={false}
        onGenerateQr={mockHandlers.onGenerateQr}
        onGenerateBarcode={mockHandlers.onGenerateBarcode}
        onUpdateStock={mockHandlers.onUpdateStock}
      />
    );

    expect(screen.getByText("Tornillo")).toBeInTheDocument();
    expect(screen.getByText("Clavo")).toBeInTheDocument();
  });

  it("calls onGenerateQr when button clicked", () => {
    render(
      <ItemList
        items={mockItems}
        loading={false}
        onGenerateQr={mockHandlers.onGenerateQr}
        onGenerateBarcode={mockHandlers.onGenerateBarcode}
        onUpdateStock={mockHandlers.onUpdateStock}
      />
    );

    const qrButtons = screen.getAllByText("Generar QR");
    fireEvent.click(qrButtons[0]);

    expect(mockHandlers.onGenerateQr).toHaveBeenCalledWith("1");
  });

  it("calls onGenerateBarcode when button clicked", () => {
    render(
      <ItemList
        items={mockItems}
        loading={false}
        onGenerateQr={mockHandlers.onGenerateQr}
        onGenerateBarcode={mockHandlers.onGenerateBarcode}
        onUpdateStock={mockHandlers.onUpdateStock}
      />
    );

    const barcodeButtons = screen.getAllByText("Generar código de barras");
    fireEvent.click(barcodeButtons[0]);

    expect(mockHandlers.onGenerateBarcode).toHaveBeenCalledWith("1");
  });

  it("calls onUpdateStock when button clicked", () => {
    render(
      <ItemList
        items={mockItems}
        loading={false}
        onGenerateQr={mockHandlers.onGenerateQr}
        onGenerateBarcode={mockHandlers.onGenerateBarcode}
        onUpdateStock={mockHandlers.onUpdateStock}
      />
    );

    const updateButtons = screen.getAllByText("Actualizar stock");
    fireEvent.click(updateButtons[0]);

    expect(mockHandlers.onUpdateStock).toHaveBeenCalledWith("1");
  });
});
