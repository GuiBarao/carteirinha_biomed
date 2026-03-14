import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { UserCircle2, CreditCard, Handshake, Home, Shield } from "lucide-react";

type MainLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

const navItems = [
  { to: "/dashboard", label: "Início", icon: Home },
  { to: "/carteirinha", label: "Carteirinha", icon: CreditCard },
  { to: "/parcerias", label: "Parcerias", icon: Handshake },
  { to: "/admin", label: "ADM", icon: Shield }
];

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-green-cracked text-slate-50">
      <header className="page-padding pb-3">
        <div className="page-grid flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center overflow-hidden">
              <img
                src="/imagens/logo-biomed.png"
                alt="Atlética Patológicos"
                className="h-8 w-8 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.75)]"
              />
            </div>
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-300/80 font-semibold">
                Atlética Patológicos
              </p>
              <p className="text-sm sm:text-base font-semibold text-slate-50">
                Biomedicina – UNIGRAN Dourados
              </p>
            </div>
          </div>
          <button className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-100 shadow-soft-card/60 hover:bg-emerald-500/20 transition-colors">
            <UserCircle2 className="h-4 w-4" />
            <span>Perfil</span>
          </button>
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

      <main className="flex-1 page-padding pt-3 pb-24 sm:pb-10">
        <div className="page-grid">{children}</div>
      </main>

      <nav className="fixed bottom-3 left-0 right-0 px-4 sm:px-0 sm:static sm:mt-4">
        <div className="max-w-sm mx-auto sm:max-w-2xl sm:mx-auto glass-panel bg-slate-950/85 sm:bg-slate-950/60 border-emerald-500/25">
          <div className="flex justify-between px-3 py-2 sm:px-5 sm:py-3">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "flex flex-1 flex-col items-center gap-1 text-[10px] sm:text-xs font-medium rounded-2xl px-2 py-1.5 transition-all",
                    isActive
                      ? "text-emerald-300 bg-emerald-500/10 shadow-soft-card"
                      : "text-slate-300/80 hover:text-emerald-200 hover:bg-emerald-500/5"
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
