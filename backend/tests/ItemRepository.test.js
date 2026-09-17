const InMemoryItemRepository = require("../src/infrastructure/repositories/InMemoryItemRepository");

describe("InMemoryItemRepository", () => {
  it("should save and retrieve items", () => {
    const repository = new InMemoryItemRepository();
    const item = { id: "42", name: "Caja", sku: "CAJ-001", stock: 5 };

    repository.save(item);
    expect(repository.findById("42")).toBe(item);
    expect(repository.findAll()).toEqual([item]);
  });

  it("should return undefined for missing item", () => {
    const repository = new InMemoryItemRepository();
    expect(repository.findById("missing")).toBeUndefined();
  });

  it("should update an existing item", () => {
    const repository = new InMemoryItemRepository();
    const item = { id: "42", name: "Caja", sku: "CAJ-001", stock: 5 };
    repository.save(item);

    const updated = repository.update("42", { stock: 8 });
    expect(updated.stock).toBe(8);
    expect(repository.findById("42").stock).toBe(8);
  });
});
