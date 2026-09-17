class GenerateItemQrCodeUseCase {
  constructor(itemRepository, qrCodeGenerator, baseUrl = "http://localhost:3000") {
    this.itemRepository = itemRepository;
    this.qrCodeGenerator = qrCodeGenerator;
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async execute(itemId, baseUrl = this.baseUrl) {
    const item = this.itemRepository.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    const safeBaseUrl = baseUrl.replace(/\/$/, "");
    const qrPageUrl = `${safeBaseUrl}/inventory/items/${item.id}/qr/view`;
    const qrData = await this.qrCodeGenerator.generate(qrPageUrl);

    return {
      item,
      qrCode: qrData,
      qrUrl: qrPageUrl
    };
  }
}

module.exports = GenerateItemQrCodeUseCase;
