import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useItems } from "./hooks/useItems";
import { clearStoredToken, clearStoredUser, getStoredToken, getStoredUser, login, registerUser } from "./api";
import AdminDashboard from "./components/AdminDashboard";
import AdminLayout from "./components/AdminLayout";
import InventoryPage from "./components/InventoryPage";
import LoginForm from "./components/LoginForm";
import EmptyInventoryScreen from "./components/EmptyInventoryScreen";
import UserAdministrationPage from "./components/UserAdministrationPage";

function App() {
  const navigate = useNavigate();
  const { items, loading, error, loadItems, addItem, updateItemStock, generateBarcode, setError } = useItems();
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getStoredToken()));
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [authError, setAuthError] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    itemId: null,
    itemName: "",
    currentStock: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadItems();
    }
  }, [isAuthenticated, loadItems]);

  const handleLogin = async (credentials) => {
    setAuthError("");
    try {
      const result = await login(credentials);
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      navigate(result.user.role === "admin" ? "/dashboard" : "/inventory", { replace: true });
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    clearStoredUser();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAuthError("");
    navigate("/", { replace: true });
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={authError} />;
  }

  const isObserver = currentUser?.role === "observer";
  const userName = currentUser?.name || currentUser?.username;

  if (isObserver && !loading && items.length === 0) {
    return <EmptyInventoryScreen onLogout={handleLogout} userName={userName} />;
  }

  const handleGenerateBarcode = (itemId) => generateBarcode(itemId);

  const handleUpdateStock = (itemId) => {
    const item = items.find((it) => it.id === itemId);
    if (!item) return;
    setModalState({
      isOpen: true,
      itemId,
      itemName: item.name,
      currentStock: item.stock
    });
  };

  const handleConfirmUpdate = async (newStock) => {
    try {
      await updateItemStock(modalState.itemId, { stock: newStock });
      setModalState({ isOpen: false, itemId: null, itemName: "", currentStock: 0 });
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleCancelUpdate = () => {
    setModalState({ isOpen: false, itemId: null, itemName: "", currentStock: 0 });
  };

  const inventoryPage = (
    <InventoryPage
      items={items}
      loading={loading}
      error={error}
      isObserver={isObserver}
      onItemCreated={addItem}
      onError={setError}
      onGenerateBarcode={handleGenerateBarcode}
      onUpdateStock={handleUpdateStock}
      modalState={modalState}
      onConfirmUpdate={handleConfirmUpdate}
      onCancelUpdate={handleCancelUpdate}
    />
  );

  if (isObserver) {
    return <AdminLayout onLogout={handleLogout} userName={userName} isObserver>{inventoryPage}</AdminLayout>;
  }

  return (
    <Routes>
      <Route element={<AdminLayout onLogout={handleLogout} userName={userName} />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/inventory" element={inventoryPage} />
        <Route
          path="/users"
          element={<UserAdministrationPage onUserCreated={registerUser} error={error} onError={setError} />}
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
