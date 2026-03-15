import { Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CarteirinhaPage } from "./pages/CarteirinhaPage";
import { ParceriasPage } from "./pages/ParceriasPage";
import { AdminPage } from "./pages/AdminPage";
import { ChangePasswordPage } from "./pages/ChangePasswordPage";
import { useAuth } from "./context/AuthContext";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
      />
      <Route
        path="/carteirinha"
        element={<ProtectedRoute><CarteirinhaPage /></ProtectedRoute>}
      />
      <Route
        path="/parcerias"
        element={<ProtectedRoute><ParceriasPage /></ProtectedRoute>}
      />
      <Route
        path="/admin/*"
        element={<AdminRoute><AdminPage /></AdminRoute>}
      />
      <Route
        path="/change-password"
        element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
