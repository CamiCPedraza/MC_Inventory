const API_BASE = "";

export async function fetchItems() {
  const response = await fetch(`${API_BASE}/inventory/items`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar los items");
  }
  return response.json();
}

export async function createItem(item) {
  const response = await fetch(`${API_BASE}/inventory/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error || "Error al crear el item");
  }

  return body;
}

export async function fetchItemQrCode(itemId) {
  const response = await fetch(`${API_BASE}/inventory/items/${itemId}/qr`);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error || "Error al generar el QR");
  }
  return body;
}

export async function fetchItemBarcode(itemId) {
  const response = await fetch(`${API_BASE}/inventory/items/${itemId}/barcode`);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error || "Error al generar el código de barras");
  }
  return body;
}

export async function updateItem(itemId, data) {
  const response = await fetch(`${API_BASE}/inventory/items/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error || "Error al actualizar el item");
  }

  return body;
}
