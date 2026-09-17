const RegisterItemUseCase = require("../src/application/RegisterItemUseCase");
const Item = require("../src/domain/Item");

class TestRepository {
  constructor() {
    this.saved = [];
  }

  save(item) {
    this.saved.push(item);
    return item;
  }
}

describe("RegisterItemUseCase", () => {
  it("should save a new item with generated id", () => {
    const repository = new TestRepository();
    const useCase = new RegisterItemUseCase(repository);

    const itemData = { name: "Tornillo", sku: "TOR-001", stock: 12 };
    const item = useCase.execute(itemData);

    expect(item).toBeInstanceOf(Item);
    expect(item.name).toBe("Tornillo");
    expect(item.sku).toBe("TOR-001");
    expect(item.stock).toBe(12);
    expect(item.id).toEqual(expect.any(String));
    expect(repository.saved).toHaveLength(1);
    expect(repository.saved[0]).toBe(item);
  });

  it("should preserve item values when saving", () => {
    const repository = new TestRepository();
    const useCase = new RegisterItemUseCase(repository);

    const itemData = { name: "Caja", sku: "CAJ-123", stock: 3 };
    const item = useCase.execute(itemData);

    expect(item.name).toBe("Caja");
    expect(item.sku).toBe("CAJ-123");
    expect(item.stock).toBe(3);
  });
});
