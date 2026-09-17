const BarcodeAdapter = require("../src/infrastructure/adapters/BarcodeAdapter");

describe("BarcodeAdapter", () => {
  it("should generate a PNG data URL for a Code 128 barcode", async () => {
    const adapter = new BarcodeAdapter();
    const result = await adapter.generate("TOR-001");

    expect(result).toMatch(/^data:image\/png;base64,/);
    expect(result.length).toBeGreaterThan(50);
  });
});
