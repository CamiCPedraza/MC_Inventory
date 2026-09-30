const Item = require("../domain/Item");

class RegisterItemUseCase {
  constructor(itemRepository) {
    this.itemRepository = itemRepository;
  }

  execute({ name, sku, stock, bodega }) {
    if (!bodega) {
      throw new Error("Bodega es obligatoria");
    }

    const item = new Item({
      id: Date.now().toString(),
      name,
      sku,
      stock,
      bodega
    });

    this.itemRepository.save(item);
    return item;
  }
}

module.exports = RegisterItemUseCase;
