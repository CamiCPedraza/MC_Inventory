const request = require("supertest");
const express = require("express");
const app = require("../src/infrastructure/http/app");

describe("API routes", () => {
  it("should return health status", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("should return empty item list initially", async () => {
    const response = await request(app).get("/inventory/items");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should update item stock via PUT", async () => {
    // create item
    const createRes = await request(app)
      .post('/inventory/items')
      .send({ name: 'Caja', sku: 'CAJ-001', stock: 5 });

    expect(createRes.status).toBe(201);
    const id = createRes.body.id;

    // update stock
    const updateRes = await request(app)
      .put(`/inventory/items/${id}`)
      .send({ stock: 12 });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.stock).toBe(12);

    // get items and verify
    const listRes = await request(app).get('/inventory/items');
    expect(listRes.body.find(i => i.id === id).stock).toBe(12);
  });

  it("should return 400 when stock is missing", async () => {
    const createRes = await request(app)
      .post('/inventory/items')
      .send({ name: 'Caja2', sku: 'CAJ-002', stock: 2 });

    expect(createRes.status).toBe(201);
    const id = createRes.body.id;

    const updateRes = await request(app)
      .put(`/inventory/items/${id}`)
      .send({});

    expect(updateRes.status).toBe(400);
    expect(updateRes.body).toHaveProperty('error');
  });

  it("should return 404 when updating non-existent item", async () => {
    const updateRes = await request(app)
      .put(`/inventory/items/nonexistent`)
      .send({ stock: 10 });

    expect(updateRes.status).toBe(404);
    expect(updateRes.body).toHaveProperty('error');
  });

  it("should generate a barcode from an item's SKU", async () => {
    const createRes = await request(app)
      .post('/inventory/items')
      .send({ name: 'Tornillo', sku: 'TOR-003', stock: 4 });

    expect(createRes.status).toBe(201);
    const id = createRes.body.id;

    const barcodeRes = await request(app)
      .get(`/inventory/items/${id}/barcode`);

    expect(barcodeRes.status).toBe(200);
    expect(barcodeRes.body.item.sku).toBe('TOR-003');
    expect(barcodeRes.body.barcodeValue).toBe('TOR-003');
    expect(barcodeRes.body.barcode).toMatch(/^data:image\/png;base64,/);
  });

  it("should return 404 when generating a barcode for a non-existent item", async () => {
    const response = await request(app).get('/inventory/items/nonexistent/barcode');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Item not found');
  });
});
