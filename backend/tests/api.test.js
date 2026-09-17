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
      .send({ name: 'Caja', sku: 'CAJ-001', stock: 5 });

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
      .send({ name: 'Caja2', sku: 'CAJ-002', stock: 2 });

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
      .send({ name: 'Tornillo', sku: 'TOR-003', stock: 4 });

    expect(createRes.status).toBe(201);
    const id = createRes.body.id;

    const barcodeRes = await request(app)
      .get(`/inventory/items/${id}/barcode`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(barcodeRes.status).toBe(200);
    expect(barcodeRes.body.item.sku).toBe('TOR-003');
    expect(barcodeRes.body.barcodeValue).toBe('TOR-003');
    expect(barcodeRes.body.barcode).toMatch(/^data:image\/png;base64,/);
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
    expect(response.body.user).toEqual({ id: "seed-admin", username: "admin", role: "admin" });
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
    expect(response.body).toEqual({ id: expect.any(String), username: "newadmin", role: "admin" });
  });

  it("should reject registration without a valid token", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ username: "anotheradmin", password: "newpass123" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
});
