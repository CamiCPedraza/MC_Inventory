import { renderHook, act, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useItems } from "./useItems";
import * as api from "../api";

describe("useItems hook", () => {
  beforeEach(() => {
    vi.spyOn(api, "fetchItems").mockResolvedValue([
      { id: "1", name: "Tornillo", sku: "TOR-001", stock: 5 }
    ]);
    vi.spyOn(api, "createItem").mockResolvedValue({
      id: "2",
      name: "Clavo",
      sku: "CLA-001",
      stock: 10
    });
    vi.spyOn(api, "updateItem").mockResolvedValue({
      id: "1",
      name: "Tornillo",
      sku: "TOR-001",
      stock: 8
    });
    vi.spyOn(api, "fetchItemQrCode").mockResolvedValue({
      qrCode: "data:image/png;base64,test",
      qrUrl: "http://localhost:3000/inventory/items/1/qr/view"
    });
    vi.spyOn(api, "fetchItemBarcode").mockResolvedValue({
      barcode: "data:image/png;base64,barcodetest",
      barcodeValue: "TOR-001"
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with empty state", () => {
    const { result } = renderHook(() => useItems());

    expect(result.current.items).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("");
  });

  it("loads items", async () => {
    const { result } = renderHook(() => useItems());

    await act(async () => {
      await result.current.loadItems();
    });

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].name).toBe("Tornillo");
    });
  });

  it("adds a new item", async () => {
    const { result } = renderHook(() => useItems());

    await act(async () => {
      await result.current.addItem({
        name: "Clavo",
        sku: "CLA-001",
        stock: 10
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe("Clavo");
  });

  it("updates item stock", async () => {
    const { result } = renderHook(() => useItems());

    await act(async () => {
      await result.current.loadItems();
    });

    expect(result.current.items[0].stock).toBe(5);

    await act(async () => {
      await result.current.updateItemStock("1", { stock: 8 });
    });

    expect(result.current.items[0].stock).toBe(8);
  });

  it("generates QR code", async () => {
    const { result } = renderHook(() => useItems());

    let qrResult;
    await act(async () => {
      qrResult = await result.current.generateQr("1");
    });

    expect(qrResult.qrCode).toContain("data:image/png;base64");
  });

  it("generates barcode", async () => {
    const { result } = renderHook(() => useItems());

    let barcodeResult;
    await act(async () => {
      barcodeResult = await result.current.generateBarcode("1");
    });

    expect(barcodeResult.barcode).toContain("data:image/png;base64");
    expect(barcodeResult.barcodeValue).toBe("TOR-001");
  });

  it("handles errors", async () => {
    vi.spyOn(api, "fetchItems").mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useItems());

    await act(async () => {
      await result.current.loadItems();
    });

    expect(result.current.error).toBe("API Error");
  });
});
