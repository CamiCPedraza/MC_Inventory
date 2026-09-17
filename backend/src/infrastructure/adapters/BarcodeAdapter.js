const bwipjs = require("bwip-js");
const BarcodeGenerator = require("../../domain/ports/BarcodeGenerator");

class BarcodeAdapter extends BarcodeGenerator {
  async generate(value) {
    const png = await bwipjs.toBuffer({
      bcid: "code128",
      text: value,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center"
    });

    return `data:image/png;base64,${png.toString("base64")}`;
  }
}

module.exports = BarcodeAdapter;
