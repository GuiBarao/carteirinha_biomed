import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Users, Handshake, LogOut, Shield } from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-emerald-500/20 bg-gradient-to-b from-slate-950 to-slate-950/70 px-5 py-6 gap-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center overflow-hidden">
            <img
              src="/imagens/logo-biomed.png"
              alt="Atlética Patológicos"
              className="h-8 w-8 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.75)]"
            />
          </div>
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-300/80 font-semibold">
              Painel Administrativo
            </p>
            <p className="text-sm font-semibold text-slate-50">Patológicos – Biomedicina</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 text-sm">
          <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-1">
            Gestão
          </span>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              [
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 transition-all",
                isActive
                  ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30 shadow-soft-card"
                  : "text-slate-200/85 hover:bg-slate-800/60"
              ].join(" ")
            }
          >
            <Shield className="h-4 w-4" />
            <span>Visão geral</span>
          </NavLink>

          <NavLink
            to="/admin/associados"
            className={({ isActive }) =>
              [
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 transition-all",
                isActive
                  ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30 shadow-soft-card"
                  : "text-slate-200/85 hover:bg-slate-800/60"
              ].join(" ")
            }
          >
            <Users className="h-4 w-4" />
            <span>Associados</span>
          </NavLink>

          <NavLink
            to="/admin/parcerias"
            className={({ isActive }) =>
              [
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 transition-all",
                isActive
                  ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30 shadow-soft-card"
                  : "text-slate-200/85 hover:bg-slate-800/60"
              ].join(" ")
            }
          >
            <Handshake className="h-4 w-4" />
            <span>Parcerias</span>
          </NavLink>
        </nav>

        <button className="inline-flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/70 transition-colors">
          <span>Sair do painel</span>
          <LogOut className="h-4 w-4" />
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen bg-green-cracked">
        <header className="md:hidden page-padding pb-3 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center overflow-hidden">
              <img
                src="/imagens/logo-biomed.png"
                alt="Atlética Patológicos"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-300/80 font-semibold">
                Painel ADM
              </p>
              <p className="text-sm font-semibold text-slate-50">Patológicos</p>
            </div>
          </div>
        </header>

        <main className="flex-1 page-padding pt-3 pb-8">
          <div className="page-grid">{children}</div>
        </main>
      </div>
    </div>
  );
}
