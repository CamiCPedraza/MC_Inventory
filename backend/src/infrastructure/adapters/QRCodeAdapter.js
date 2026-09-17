const QRCode = require("qrcode");
const QrCodeGenerator = require("../../domain/ports/QrCodeGenerator");

class QRCodeAdapter extends QrCodeGenerator {
  async generate(text) {
    return await QRCode.toDataURL(text);
  }
}

module.exports = QRCodeAdapter;
