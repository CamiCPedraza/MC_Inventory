const express = require("express");
const bcrypt = require("bcryptjs");
const InMemoryItemRepository = require("../repositories/InMemoryItemRepository");
const InMemoryUserRepository = require("../repositories/InMemoryUserRepository");
const QRCodeAdapter = require("../adapters/QRCodeAdapter");
const BarcodeAdapter = require("../adapters/BarcodeAdapter");
const BcryptPasswordHasher = require("../adapters/BcryptPasswordHasher");
const JwtTokenService = require("../adapters/JwtTokenService");
const RegisterItemUseCase = require("../../application/RegisterItemUseCase");
const GenerateItemQrCodeUseCase = require("../../application/GenerateItemQrCodeUseCase");
const GenerateItemBarcodeUseCase = require("../../application/GenerateItemBarcodeUseCase");
const RegisterUserUseCase = require("../../application/RegisterUserUseCase");
const LoginUseCase = require("../../application/LoginUseCase");
const User = require("../../domain/User");
const authenticate = require("./middleware/authenticate");
const authorize = require("./middleware/authorize");

const app = express();
app.use(express.json());

const itemRepository = new InMemoryItemRepository();
const userRepository = new InMemoryUserRepository();
const qrCodeGenerator = new QRCodeAdapter();
const barcodeGenerator = new BarcodeAdapter();
const passwordHasher = new BcryptPasswordHasher();

const jwtSecret = process.env.JWT_SECRET || "dev-only-insecure-secret";
if (!process.env.JWT_SECRET) {
  console.warn("[WARN] JWT_SECRET not set. Using an insecure default; set JWT_SECRET in production.");
}
const tokenService = new JwtTokenService(jwtSecret);

const registerItemUseCase = new RegisterItemUseCase(itemRepository);
const generateItemQrCodeUseCase = new GenerateItemQrCodeUseCase(itemRepository, qrCodeGenerator);
const generateItemBarcodeUseCase = new GenerateItemBarcodeUseCase(itemRepository, barcodeGenerator);
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenService);

const defaultAdminUsername = process.env.ADMIN_USERNAME || "admin";
const defaultAdminPassword = process.env.ADMIN_PASSWORD || "admin123";
if (!process.env.ADMIN_PASSWORD) {
  console.warn("[WARN] ADMIN_PASSWORD not set. Using an insecure default admin password; set it in production.");
}
userRepository.save(
  new User({
    id: "seed-admin",
    username: defaultAdminUsername,
    passwordHash: bcrypt.hashSync(defaultAdminPassword, 10),
    role: "admin"
  })
);

const requireAdmin = [authenticate(tokenService), authorize("admin")];

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/auth/login", async (req, res) => {
  try {
    const result = await loginUseCase.execute(req.body);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post("/auth/register", ...requireAdmin, async (req, res) => {
  try {
    const result = await registerUserUseCase.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/inventory/items/:id/qr/view", (req, res) => {
  const item = itemRepository.findById(req.params.id);
  if (!item) {
    return res.status(404).send("<h1>Item no encontrado</h1>");
  }

  res.send(`<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Detalle del item</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 24px; background: #f4f7fb; color: #111; }
      .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 8px 30px rgba(15, 23, 42, 0.12); }
      h1 { margin-top: 0; }
      dl { display: grid; grid-template-columns: 120px 1fr; gap: 12px 16px; }
      dt { font-weight: 700; color: #374151; }
      dd { margin: 0; color: #111827; }
      .footer { margin-top: 24px; color: #6b7280; font-size: 0.95rem; }
      a { color: #2563eb; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Detalle del item</h1>
      <dl>
        <dt>ID</dt>
        <dd>${item.id}</dd>
        <dt>Nombre</dt>
        <dd>${item.name}</dd>
        <dt>SKU</dt>
        <dd>${item.sku}</dd>
        <dt>Stock</dt>
        <dd>${item.stock}</dd>
      </dl>
      <div class="footer">
        Escaneaste el código QR del item. Si ves esta pantalla en tu teléfono, el QR está funcionando correctamente.
      </div>
    </div>
  </body>
</html>`);
});

app.get("/inventory/items", ...requireAdmin, (req, res) => {
  res.json(itemRepository.findAll());
});

app.post("/inventory/items", ...requireAdmin, (req, res) => {
  try {
    const item = registerItemUseCase.execute(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/inventory/items/:id', ...requireAdmin, (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined) {
      return res.status(400).json({ error: 'Missing stock value' });
    }

    const updated = itemRepository.update(req.params.id, { stock });
    if (!updated) return res.status(404).json({ error: 'Item not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/inventory/items/:id/qr", ...requireAdmin, async (req, res) => {
  try {
    const origin = `${req.protocol}://${req.get("host")}`;
    const result = await generateItemQrCodeUseCase.execute(req.params.id, origin);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get("/inventory/items/:id/barcode", ...requireAdmin, async (req, res) => {
  try {
    const result = await generateItemBarcodeUseCase.execute(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = app;
