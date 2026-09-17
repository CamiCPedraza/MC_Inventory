class GenerateItemBarcodeUseCase {
  constructor(itemRepository, barcodeGenerator) {
    this.itemRepository = itemRepository;
    this.barcodeGenerator = barcodeGenerator;
  }

  async execute(itemId) {
    const item = this.itemRepository.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    const barcode = await this.barcodeGenerator.generate(item.sku);

    return {
      item,
      barcode,
      barcodeValue: item.sku
    };
  }
}

module.exports = GenerateItemBarcodeUseCase;
