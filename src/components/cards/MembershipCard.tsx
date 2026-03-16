import { ShieldCheck } from "lucide-react";
import { Badge } from "../ui/Badge";

type MembershipCardProps = {
  name: string;
  rgm: string;
  status: "ativo" | "inativo";
};

export function MembershipCard({ name, rgm, status }: MembershipCardProps) {
  const isActive = status === "ativo";

  return (
    <section className="relative mx-auto w-full max-w-xs rounded-[26px] bg-gradient-to-b from-emerald-900 via-slate-950 to-emerald-800 p-[1px] shadow-[0_24px_70px_rgba(16,185,129,0.55)]">
      <div className="relative overflow-hidden rounded-[24px] bg-slate-950/95">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_0%,#34d399_0,transparent_60%),radial-gradient(circle_at_50%_100%,#22c55e_0,transparent_60%)]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-8">
          {/* Brasão */}
          <div className="h-24 w-24 rounded-full bg-slate-900/70 border-2 border-emerald-400/60 flex items-center justify-center overflow-hidden shadow-[0_0_24px_rgba(52,211,153,0.4)]">
            <img
              src="/imagens/pato-biomed.png"
              alt="Brasão Atlética Patológicos"
              className="h-20 w-20 object-contain drop-shadow-[0_0_14px_rgba(16,185,129,0.9)]"
            />
          </div>

          {/* Nome da atlética */}
          <div className="text-center space-y-0.5">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-300 leading-tight">
              Atlética Patológicos Biomedicina
            </p>
            <p className="text-xs text-emerald-100/70 tracking-widest uppercase">UNIGRAN</p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          {/* Dados do associado */}
          <div className="w-full text-center space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-200/60 mb-0.5">Nome</p>
              <p className="text-base font-semibold text-slate-50 leading-snug">{name}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-200/60 mb-0.5">RGM</p>
              <p className="text-sm font-mono font-medium text-emerald-100">{rgm}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          {/* Status */}
          <Badge tone={isActive ? "success" : "danger"}>
            <ShieldCheck className="h-3 w-3" />
            <span>{isActive ? "Associado ativo" : "Associado inativo"}</span>
          </Badge>
        </div>
      </div>
    </section>
  );
}

