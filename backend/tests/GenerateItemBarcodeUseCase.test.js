const GenerateItemBarcodeUseCase = require("../src/application/GenerateItemBarcodeUseCase");

class TestRepository {
  constructor(items) {
    this.items = items || [];
  }

  findById(id) {
    return this.items.find((item) => item.id === id);
  }
}

class TestBarcodeGenerator {
  async generate(value) {
    return `data:image/png;base64,${Buffer.from(value).toString("base64")}`;
  }
}

describe("GenerateItemBarcodeUseCase", () => {
  it("should generate a barcode from the item SKU", async () => {
    const item = { id: "1", name: "Tornillo", sku: "TOR-001", stock: 10 };
    const repository = new TestRepository([item]);
    const barcodeGenerator = new TestBarcodeGenerator();
    const useCase = new GenerateItemBarcodeUseCase(repository, barcodeGenerator);

    const result = await useCase.execute("1");

    expect(result.item).toBe(item);
    expect(result.barcode).toMatch(/^data:image\/png;base64,/);
    expect(result.barcodeValue).toBe("TOR-001");
  });

  it("should throw when item does not exist", async () => {
    const repository = new TestRepository([]);
    const barcodeGenerator = new TestBarcodeGenerator();
    const useCase = new GenerateItemBarcodeUseCase(repository, barcodeGenerator);

    await expect(useCase.execute("123")).rejects.toThrow("Item not found");
  });
});
