const Item = require("../domain/Item");

class RegisterItemUseCase {
  constructor(itemRepository) {
    this.itemRepository = itemRepository;
  }

  execute({ name, sku, stock }) {
    const item = new Item({
      id: Date.now().toString(),
      name,
      sku,
      stock
    });

    this.itemRepository.save(item);
    return item;
  }
}

module.exports = RegisterItemUseCase;
