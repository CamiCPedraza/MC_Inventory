const GenerateItemQrCodeUseCase = require("../src/application/GenerateItemQrCodeUseCase");

class TestRepository {
  constructor(items) {
    this.items = items || [];
  }

  findById(id) {
    return this.items.find((item) => item.id === id);
  }
}

class TestQrGenerator {
  async generate(text) {
    return `data:image/png;base64,${Buffer.from(text).toString("base64")}`;
  }
}

describe("GenerateItemQrCodeUseCase", () => {
  it("should generate a QR code for an existing item", async () => {
    const item = { id: "1", name: "Tornillo", sku: "TOR-001", stock: 10 };
    const repository = new TestRepository([item]);
    const qrGenerator = new TestQrGenerator();
    const useCase = new GenerateItemQrCodeUseCase(repository, qrGenerator, "http://localhost:3000");

    const result = await useCase.execute("1", "http://localhost:3000");

    expect(result.item).toBe(item);
    expect(result.qrCode).toMatch(/^data:image\/png;base64,/);
    expect(result.qrUrl).toBe("http://localhost:3000/inventory/items/1/qr/view");
  });

  it("should throw when item does not exist", async () => {
    const repository = new TestRepository([]);
    const qrGenerator = new TestQrGenerator();
    const useCase = new GenerateItemQrCodeUseCase(repository, qrGenerator, "http://localhost:3000");

    await expect(useCase.execute("123", "http://localhost:3000")).rejects.toThrow("Item not found");
  });
});
