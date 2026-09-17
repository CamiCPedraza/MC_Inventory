import { useState, useCallback } from "react";
import { fetchItems, createItem, updateItem, fetchItemQrCode, fetchItemBarcode } from "../api";

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (itemData) => {
    setError("");
    try {
      const item = await createItem(itemData);
      setItems((current) => [...current, item]);
      return item;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateItemStock = useCallback(async (itemId, data) => {
    setError("");
    try {
      const updated = await updateItem(itemId, data);
      setItems((current) =>
        current.map((it) => (it.id === itemId ? updated : it))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const generateQr = useCallback(async (itemId) => {
    setError("");
    try {
      return await fetchItemQrCode(itemId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const generateBarcode = useCallback(async (itemId) => {
    setError("");
    try {
      return await fetchItemBarcode(itemId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    items,
    loading,
    error,
    loadItems,
    addItem,
    updateItemStock,
    generateQr,
    generateBarcode,
    setError
  };
}
