import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useItemForm } from "./useItemForm";

describe("useItemForm hook", () => {
  it("initializes with empty form", () => {
    const mockOnSubmit = vi.fn();
    const { result } = renderHook(() => useItemForm(mockOnSubmit));

    expect(result.current.form.name).toBe("");
    expect(result.current.form.sku).toBe("");
    expect(result.current.form.stock).toBe("");
  });

  it("updates field values", () => {
    const mockOnSubmit = vi.fn();
    const { result } = renderHook(() => useItemForm(mockOnSubmit));

    act(() => {
      result.current.updateField("name", "Tornillo");
      result.current.updateField("sku", "TOR-001");
      result.current.updateField("stock", "5");
    });

    expect(result.current.form.name).toBe("Tornillo");
    expect(result.current.form.sku).toBe("TOR-001");
    expect(result.current.form.stock).toBe("5");
  });

  it("resets form to initial state", () => {
    const mockOnSubmit = vi.fn();
    const { result } = renderHook(() => useItemForm(mockOnSubmit));

    act(() => {
      result.current.updateField("name", "Tornillo");
      result.current.reset();
    });

    expect(result.current.form.name).toBe("");
  });

  it("validates required fields", () => {
    const mockOnSubmit = vi.fn();
    const { result } = renderHook(() => useItemForm(mockOnSubmit));

    act(() => {
      const mockEvent = { preventDefault: vi.fn() };
      result.current.handleSubmit(mockEvent).catch(() => {});
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits valid form data", async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useItemForm(mockOnSubmit));

    act(() => {
      result.current.updateField("name", "Tornillo");
      result.current.updateField("sku", "TOR-001");
      result.current.updateField("stock", "5");
    });

    const mockEvent = { preventDefault: vi.fn() };

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "Tornillo",
      sku: "TOR-001",
      stock: 5
    });
  });

  it("resets form after submit", async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useItemForm(mockOnSubmit));

    act(() => {
      result.current.updateField("name", "Tornillo");
      result.current.updateField("sku", "TOR-001");
      result.current.updateField("stock", "5");
    });

    const mockEvent = { preventDefault: vi.fn() };

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.form.name).toBe("");
    expect(result.current.form.sku).toBe("");
    expect(result.current.form.stock).toBe("");
  });
});
