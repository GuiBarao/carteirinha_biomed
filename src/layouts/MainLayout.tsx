import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CreditCard, Handshake, Home, Shield, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type MainLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const navItems = [
    { to: "/dashboard", label: "Início", icon: Home },
    { to: "/carteirinha", label: "Carteirinha", icon: CreditCard },
    { to: "/parcerias", label: "Parcerias", icon: Handshake },
    ...(user?.role === "ADMIN" ? [{ to: "/admin", label: "ADM", icon: Shield }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-green-cracked text-slate-50">
      <header className="page-padding pb-3">
        <div className="page-grid flex items-center gap-3">
            <img
              src="/imagens/pato-biomed.png"
              alt="Atlética Patológicos"
              className="h-[120px] w-[120px] drop-shadow-[0_0_10px_rgba(16,185,129,0.75)]"
            />
          <div className="leading-tight">
            <p className="text-[20px] uppercase tracking-[0.22em] text-emerald-300/80 font-semibold">
              Atlética Patológicos
            </p>
            <p className="text-[20px] font-semibold text-slate-50">
              Biomedicina – Unigran Dourados
            </p>
          </div>
        </div>
      </header>

      {(title || subtitle) && (
        <section className="page-padding pt-1 pb-2">
          <div className="page-grid">
            {title && <h1 className="text-xl sm:text-2xl font-semibold text-slate-50">{title}</h1>}
            {subtitle && <p className="text-sm text-emerald-100/80 mt-1">{subtitle}</p>}
          </div>
        </section>
      )}

      <main className="flex-1 page-padding pt-3 pb-24">
        <div className="page-grid">{children}</div>
      </main>

      <nav className="fixed bottom-3 left-0 right-0 px-4">
        <div className="max-w-sm mx-auto glass-panel bg-slate-950/85 border-emerald-500/25">
          <div className="flex justify-between px-3 py-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "flex flex-1 flex-col items-center gap-1 text-[10px] font-medium rounded-2xl px-2 py-1.5 transition-all",
                    isActive
                      ? "text-emerald-300 bg-emerald-500/10 shadow-soft-card"
                      : "text-slate-300/80 hover:text-emerald-200 hover:bg-emerald-500/5",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="flex flex-1 flex-col items-center gap-1 text-[10px] font-medium rounded-2xl px-2 py-1.5 transition-all text-slate-300/80 hover:text-red-400 hover:bg-red-500/5"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
