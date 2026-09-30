import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ItemList from "./ItemList";

describe("ItemList", () => {
  const mockItems = [
    { id: "1", name: "Tornillo rosca", sku: "TOR-001", stock: 5, bodega: "Norte" },
    { id: "2", name: "Clavo", sku: "CLA-001", stock: 10, bodega: "Central" }
  ];

  const mockHandlers = {
    onGenerateBarcode: vi.fn().mockResolvedValue({
      barcode: "data:image/png;base64,test",
      barcodeValue: "TOR-001"
    }),
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

    expect(screen.getByText("TOR-001", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("Descripción: Tornillo rosca")).toBeInTheDocument();
    expect(screen.getByText("Descripción: Clavo")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Productos" })).toBeInTheDocument();
    expect(screen.getByText("Cantidad (metros): 5")).toBeInTheDocument();
    expect(screen.getByText("Bodega: Norte")).toBeInTheDocument();
  });

  it("hides action buttons when readOnly is true", () => {
    render(
      <ItemList
        items={mockItems}
        loading={false}
        onGenerateQr={mockHandlers.onGenerateQr}
        onGenerateBarcode={mockHandlers.onGenerateBarcode}
        onUpdateStock={mockHandlers.onUpdateStock}
        readOnly
      />
    );

    expect(screen.getByText("TOR-001", { selector: "strong" })).toBeInTheDocument();
    expect(screen.queryByText("Generar QR")).not.toBeInTheDocument();
    expect(screen.queryByText("Generar código de barras")).not.toBeInTheDocument();
    expect(screen.queryByText("Actualizar stock")).not.toBeInTheDocument();
  });

  it("does not show the QR generation button", () => {
    render(
      <ItemList
        items={mockItems}
        loading={false}
        onGenerateBarcode={mockHandlers.onGenerateBarcode}
        onUpdateStock={mockHandlers.onUpdateStock}
      />
    );

    expect(screen.queryByText("Generar QR")).not.toBeInTheDocument();
  });

  it("shows the generated barcode below its product", async () => {
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
    const itemRow = screen.getByText("TOR-001", { selector: "strong" }).closest("li");
    const barcodeImage = await screen.findByAltText("Código de barras");
    expect(itemRow).toContainElement(barcodeImage);
    expect(itemRow).toHaveTextContent("Producto codificado: TOR-001");
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
