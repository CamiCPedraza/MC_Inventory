const API_BASE = "";

const TOKEN_STORAGE_KEY = "pvcm_auth_token";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function storeToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function authHeaders() {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(credentials) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error || "Error al iniciar sesión");
  }

  storeToken(body.token);
  return body;
}

export async function fetchItems() {
  const response = await fetch(`${API_BASE}/inventory/items`, {
    headers: authHeaders()
  });
  if (!response.ok) {
    throw new Error("No se pudieron cargar los items");
  }
  return response.json();
}

export async function createItem(item) {
  const response = await fetch(`${API_BASE}/inventory/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
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
  const response = await fetch(`${API_BASE}/inventory/items/${itemId}/qr`, {
    headers: authHeaders()
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error || "Error al generar el QR");
  }
  return body;
}

export async function fetchItemBarcode(itemId) {
  const response = await fetch(`${API_BASE}/inventory/items/${itemId}/barcode`, {
    headers: authHeaders()
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error || "Error al generar el código de barras");
  }
  return body;
}

export async function updateItem(itemId, data) {
  const response = await fetch(`${API_BASE}/inventory/items/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data)
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error || "Error al actualizar el item");
  }

  return body;
}
