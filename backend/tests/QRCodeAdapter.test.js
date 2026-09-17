const QRCodeAdapter = require("../src/infrastructure/adapters/QRCodeAdapter");

describe("QRCodeAdapter", () => {
  it("should generate a data URL for a QR code", async () => {
    const adapter = new QRCodeAdapter();
    const result = await adapter.generate("Test QR Content");

    expect(result).toMatch(/^data:image\/png;base64,/);
    expect(result.length).toBeGreaterThan(50);
  });
});
