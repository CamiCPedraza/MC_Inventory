import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import UpdateStockModal from "./UpdateStockModal";

describe("UpdateStockModal", () => {
  it("renders when isOpen is true", () => {
    render(
      <UpdateStockModal
        isOpen={true}
        itemName="Tornillo"
        currentStock={5}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText(/Actualizar stock/i)).toBeInTheDocument();
    expect(screen.getByText("Tornillo")).toBeInTheDocument();
    expect(screen.getByText(/Stock actual:/i)).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <UpdateStockModal
        isOpen={false}
        itemName="Tornillo"
        currentStock={5}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.queryByText(/Actualizar stock/i)).not.toBeInTheDocument();
  });

  it("calls onConfirm with new stock value", () => {
    const onConfirm = vi.fn();
    render(
      <UpdateStockModal
        isOpen={true}
        itemName="Tornillo"
        currentStock={5}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );

    const input = screen.getByDisplayValue("5");
    fireEvent.change(input, { target: { value: "15" } });
    fireEvent.click(screen.getByText(/Confirmar/i));

    expect(onConfirm).toHaveBeenCalledWith(15);
  });

  it("calls onCancel when cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(
      <UpdateStockModal
        isOpen={true}
        itemName="Tornillo"
        currentStock={5}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByText(/Cancelar/i));

    expect(onCancel).toHaveBeenCalled();
  });

  it("shows error when stock is invalid", () => {
    render(
      <UpdateStockModal
        isOpen={true}
        itemName="Tornillo"
        currentStock={5}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const input = screen.getByDisplayValue("5");
    fireEvent.change(input, { target: { value: "-5" } });
    fireEvent.click(screen.getByText(/Confirmar/i));

    expect(screen.getByText(/Stock debe ser un número válido/i)).toBeInTheDocument();
  });

  it("confirms on Enter key", () => {
    const onConfirm = vi.fn();
    render(
      <UpdateStockModal
        isOpen={true}
        itemName="Tornillo"
        currentStock={5}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );

    const input = screen.getByDisplayValue("5");
    fireEvent.change(input, { target: { value: "20" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onConfirm).toHaveBeenCalledWith(20);
  });

  it("cancels on Escape key", () => {
    const onCancel = vi.fn();
    render(
      <UpdateStockModal
        isOpen={true}
        itemName="Tornillo"
        currentStock={5}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );

    const input = screen.getByDisplayValue("5");
    fireEvent.keyDown(input, { key: "Escape" });

    expect(onCancel).toHaveBeenCalled();
  });
});
