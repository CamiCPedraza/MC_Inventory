const ItemRepository = require("../../domain/ports/ItemRepository");

class InMemoryItemRepository extends ItemRepository {
  constructor() {
    super();
    this.items = [];
  }

  save(item) {
    this.items.push(item);
    return item;
  }

  findById(id) {
    return this.items.find(item => item.id === id);
  }

  findAll() {
    return this.items;
  }

  update(id, fields) {
    const item = this.findById(id);
    if (!item) return undefined;
    Object.assign(item, fields);
    return item;
  }
}

module.exports = InMemoryItemRepository;
