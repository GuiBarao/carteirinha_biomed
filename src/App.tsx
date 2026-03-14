import { Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CarteirinhaPage } from "./pages/CarteirinhaPage";
import { ParceriasPage } from "./pages/ParceriasPage";
import { AdminPage } from "./pages/AdminPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={<LoginPage />}
      />
      <Route
        path="/dashboard"
        element={<DashboardPage />}
      />
      <Route
        path="/carteirinha"
        element={<CarteirinhaPage />}
      />
      <Route
        path="/parcerias"
        element={<ParceriasPage />}
      />
      <Route
        path="/admin/*"
        element={<AdminPage />}
      />
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;

