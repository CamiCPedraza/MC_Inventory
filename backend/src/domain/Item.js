class Item {
  constructor({ id, name, sku, stock, bodega }) {
    this.id = id;
    this.name = name;
    this.sku = sku;
    this.stock = stock;
    this.bodega = bodega;
  }
}

module.exports = Item;
