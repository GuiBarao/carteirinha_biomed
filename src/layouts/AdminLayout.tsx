import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Users, Handshake, LogOut, Shield, ArrowLeft } from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">

      <div className="flex-1 flex flex-col min-h-screen bg-green-cracked">
        <header className="md:hidden page-padding pb-3 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center overflow-hidden">
              <img
                src="public/imagens/pato-biomed.png"
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
          <div className="page-grid">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar para o Dashboard
            </button>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
