const request = require("supertest");
const express = require("express");
const app = require("../src/infrastructure/http/app");

describe("API routes", () => {
  let adminToken;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ username: "admin", password: "admin123" });

    adminToken = loginRes.body.token;
  });

  it("should return health status", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("should return empty item list initially", async () => {
    const response = await request(app)
      .get("/inventory/items")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should reject requests without a token", async () => {
    const response = await request(app).get("/inventory/items");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("should reject requests with an invalid token", async () => {
    const response = await request(app)
      .get("/inventory/items")
      .set("Authorization", "Bearer invalid-token");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("should update item stock via PUT", async () => {
    // create item
    const createRes = await request(app)
      .post('/inventory/items')
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: 'Caja', sku: 'CAJ-001', stock: 5, bodega: 'Central' });

    expect(createRes.status).toBe(201);
    const id = createRes.body.id;

    // update stock
    const updateRes = await request(app)
      .put(`/inventory/items/${id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ stock: 12 });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.stock).toBe(12);

    // get items and verify
    const listRes = await request(app)
      .get('/inventory/items')
      .set("Authorization", `Bearer ${adminToken}`);
    expect(listRes.body.find(i => i.id === id).stock).toBe(12);
  });

  it("should return 400 when stock is missing", async () => {
    const createRes = await request(app)
      .post('/inventory/items')
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: 'Caja2', sku: 'CAJ-002', stock: 2, bodega: 'Norte' });

    expect(createRes.status).toBe(201);
    const id = createRes.body.id;

    const updateRes = await request(app)
      .put(`/inventory/items/${id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(updateRes.status).toBe(400);
    expect(updateRes.body).toHaveProperty('error');
  });

  it("should return 404 when updating non-existent item", async () => {
    const updateRes = await request(app)
      .put(`/inventory/items/nonexistent`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ stock: 10 });

    expect(updateRes.status).toBe(404);
    expect(updateRes.body).toHaveProperty('error');
  });

  it("should generate a barcode from an item's SKU", async () => {
    const createRes = await request(app)
      .post('/inventory/items')
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: 'Tornillo', sku: 'TOR-003', stock: 4, bodega: 'Sur' });

    expect(createRes.status).toBe(201);
    const id = createRes.body.id;

    const barcodeRes = await request(app)
      .get(`/inventory/items/${id}/barcode`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(barcodeRes.status).toBe(200);
    expect(barcodeRes.body.item.sku).toBe('TOR-003');
    expect(barcodeRes.body.item.bodega).toBe('Sur');
    expect(barcodeRes.body.barcodeValue).toBe('TOR-003');
    expect(barcodeRes.body.barcode).toMatch(/^data:image\/png;base64,/);
  });

  it("should show the updated item properties on QR detail page", async () => {
    const createRes = await request(app)
      .post('/inventory/items')
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: 'Tornillo rosca', sku: 'TOR-004', stock: 7, bodega: 'Almacén A' });

    const response = await request(app).get(`/inventory/items/${createRes.body.id}/qr/view`);

    expect(response.status).toBe(200);
    expect(response.text).toContain("<dt>Descripción</dt>");
    expect(response.text).toContain("<dt>Producto</dt>");
    expect(response.text).toContain("<dt>Cantidad m</dt>");
    expect(response.text).toContain("<dt>Bodega</dt>");
    expect(response.text).toContain("Almacén A");
  });

  it("should return 404 when generating a barcode for a non-existent item", async () => {
    const response = await request(app)
      .get('/inventory/items/nonexistent/barcode')
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Item not found');
  });

  it("should log in with valid credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "admin", password: "admin123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toEqual({
      id: "seed-admin",
      username: "admin",
      role: "admin",
      name: "Administrador",
      active: true
    });
  });

  it("should reject login with invalid credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "admin", password: "wrong-password" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("should allow an admin to register a new user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ username: "newadmin", password: "newpass123" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      username: "newadmin",
      role: "admin",
      name: "newadmin",
      active: true
    });
  });

  it("should list users for admin without exposing password hashes", async () => {
    const createRes = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        username: "warehouse-list-test",
        password: "safe-password",
        role: "observer",
        name: "Bodega Central",
        active: false
      });
    expect(createRes.status).toBe(201);

    const response = await request(app)
      .get("/auth/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      { name: "Administrador", username: "admin", role: "admin", active: true },
      { name: "Bodega Central", username: "warehouse-list-test", role: "observer", active: true }
    ]));
    expect(JSON.stringify(response.body)).not.toContain("passwordHash");
    expect(JSON.stringify(response.body)).not.toContain("safe-password");
  });

  it("should deny user listing to observer role", async () => {
    const createRes = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ username: "observer-list-test", password: "observer-password", role: "observer" });
    expect(createRes.status).toBe(201);

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ username: "observer-list-test", password: "observer-password" });

    const response = await request(app)
      .get("/auth/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(response.status).toBe(403);
  });

  it("should reject registration without a valid token", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ username: "anotheradmin", password: "newpass123" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("should reject registration with an invalid role", async () => {
    const response = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ username: "invalidrole", password: "newpass123", role: "superadmin" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should allow an admin to register an observer user and let it view the inventory", async () => {
    const registerRes = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        username: "Bodega",
        password: "bodega123",
        role: "observer",
        name: "Bodega",
        active: true
      });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toEqual({
      id: expect.any(String),
      username: "Bodega",
      role: "observer",
      name: "Bodega",
      active: true
    });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ username: "Bodega", password: "bodega123" });

    expect(loginRes.status).toBe(200);
    const observerToken = loginRes.body.token;

    const listRes = await request(app)
      .get("/inventory/items")
      .set("Authorization", `Bearer ${observerToken}`);

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
  });

  it("should not allow an observer to create, update, or generate codes for items", async () => {
    const registerRes = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ username: "Bodega2", password: "bodega123", role: "observer" });

    expect(registerRes.status).toBe(201);

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ username: "Bodega2", password: "bodega123" });

    const observerToken = loginRes.body.token;

    const createRes = await request(app)
      .post("/inventory/items")
      .set("Authorization", `Bearer ${observerToken}`)
      .send({ name: "Tornillo", sku: "TOR-999", stock: 1, bodega: "Central" });
    expect(createRes.status).toBe(403);

    const updateRes = await request(app)
      .put("/inventory/items/any-id")
      .set("Authorization", `Bearer ${observerToken}`)
      .send({ stock: 5 });
    expect(updateRes.status).toBe(403);

    const qrRes = await request(app)
      .get("/inventory/items/any-id/qr")
      .set("Authorization", `Bearer ${observerToken}`);
    expect(qrRes.status).toBe(403);

    const barcodeRes = await request(app)
      .get("/inventory/items/any-id/barcode")
      .set("Authorization", `Bearer ${observerToken}`);
    expect(barcodeRes.status).toBe(403);
  });
});
