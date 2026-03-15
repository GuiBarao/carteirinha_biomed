import { createContext, useContext, useState, type ReactNode } from "react";
import type { Associated } from "../services/userService";

type AuthContextType = {
  user: Associated | null;
  login: (user: Associated) => void;
  updateUser: (partial: Partial<Associated>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "patologicos_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Associated | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Associated) : null;
    } catch {
      return null;
    }
  });

  function login(u: Associated) {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  }

  function updateUser(partial: Partial<Associated>) {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
