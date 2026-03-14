import { QrCode, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/Badge";

type MembershipCardProps = {
  name: string;
  rgm: string;
  atlheticName: string;
  status: "ativo" | "inativo";
};

export function MembershipCard({ name, rgm, atlheticName, status }: MembershipCardProps) {
  const isActive = status === "ativo";

  return (
    <section className="relative mx-auto max-w-md rounded-[26px] bg-gradient-to-br from-emerald-900 via-slate-950 to-emerald-700 p-[1px] shadow-[0_24px_70px_rgba(16,185,129,0.55)]">
      <div className="relative overflow-hidden rounded-[24px] bg-slate-950/95">
        <div className="absolute inset-0 opacity-50 mix-blend-overlay">
          <div className="h-full w-full bg-[radial-gradient(circle_at_0_0,#34d399_0,transparent_55%),radial-gradient(circle_at_100%_100%,#22c55e_0,transparent_55%)]" />
        </div>

        <div className="relative z-10 p-5 pb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-slate-900/70 border border-emerald-400/60 flex items-center justify-center overflow-hidden">
              <img
                src="/imagens/logo-biomed.png"
                alt="Atlética Patológicos"
                className="h-9 w-9 object-contain drop-shadow-[0_0_14px_rgba(16,185,129,0.9)]"
              />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-200/90 font-semibold">
                {atlheticName}
              </p>
              <p className="text-[13px] text-emerald-50/95 font-semibold">Biomedicina – UNIGRAN</p>
            </div>
          </div>
          <Badge tone={isActive ? "success" : "danger"}>
            <ShieldCheck className="h-3 w-3" />
            <span>{isActive ? "Associado ativo" : "Associado inativo"}</span>
          </Badge>
        </div>

        <div className="relative z-10 px-5 pb-5 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200/80">Nome</p>
              <p className="text-base font-semibold text-slate-50 leading-tight">{name}</p>
            </div>
            <div className="text-[11px] text-emerald-100/80">
              <p className="uppercase tracking-[0.18em] text-emerald-200/70">RGM</p>
              <p className="font-medium">{rgm}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="rounded-2xl bg-slate-900/80 border border-emerald-400/40 px-2.5 py-2 shadow-soft-card">
              <QrCode className="h-11 w-11 text-emerald-200" />
            </div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-100/70">
              QR Code Associado
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

