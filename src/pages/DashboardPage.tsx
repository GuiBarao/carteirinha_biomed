import { useEffect, useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { PartnerCard } from "../components/cards/PartnerCard";
import { CreditCard, Sparkles, Trophy } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import type { PartnerType } from "../classes/Partner";
import { fetchPartners } from "../services/partnerService";
import { useAuth } from "../context/AuthContext";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [partners, setPartners] = useState<PartnerType[]>([]);

  useEffect(() => {
    fetchPartners().then(setPartners).catch(() => {});
  }, []);

  return (
    <MainLayout
      title="Bem-vindo(a), Patológico(a)!"
      subtitle="Acompanhe sua carteirinha, parcerias e status como associado."
    >
      <section className="glass-panel bg-slate-950/90 border-emerald-500/25 p-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-300/90">Associado</p>
          <p className="text-sm sm:text-base font-semibold text-slate-50 truncate">
            {user?.complete_name}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <Badge tone="success">Associado ativo</Badge>
            <span className="hidden sm:inline text-[11px] text-emerald-100/80">
              Mostre sua carteirinha para garantir os benefícios.
            </span>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4">
        <div className="glass-panel bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-emerald-400/10 border-emerald-500/30 p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/80 font-semibold">
              Carteirinha Digital
            </p>
            <h2 className="mt-1 text-base sm:text-lg font-semibold text-slate-50">
              Sua identificação oficial na Atlética
            </h2>
            <p className="mt-1 text-[12px] text-emerald-50/85">
              Acesse sua carteirinha com QR Code exclusivo e valide sua presença em eventos, treinos e
              parcerias.
            </p>
          </div>
          <Button
            fullWidth
            className="sm:w-auto"
            leftIcon={<CreditCard className="h-4 w-4" />}
            onClick={() => navigate("/carteirinha")}
          >
            Ver carteirinha
          </Button>
        </div>

        <div className="grid sm:grid-cols-1 gap-4">
          <div className="glass-panel bg-slate-950/90 border-emerald-500/25 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-300" />
              <p className="text-xs font-semibold text-slate-200 uppercase tracking-[0.18em]">
                Status do associado
              </p>
            </div>
            <p className="text-sm text-slate-100">
              Você está{" "}
              <span className="font-semibold text-emerald-300">em dia com a Atlética Patológicos</span>{" "}
              e pode aproveitar todos os benefícios.
            </p>
            <ul className="mt-1 text-[12px] text-slate-300 list-disc list-inside space-y-0.5">
              <li>Acesso a eventos oficiais</li>
              <li>Descontos em parcerias</li>
              <li>Prioridade em campeonatos e jogos</li>
            </ul>
          </div>

        </div>
      </section>

      <section className="mt-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/80 font-semibold">
              Parcerias em destaque
            </p>
            <p className="text-sm text-emerald-50/90">
              Benefícios exclusivos para quem é Patológicos.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {partners.slice(0, 3).map((partner) => (
            <PartnerCard
              key={partner.id}
              name={partner.name}
              benefit={partner.benefit_description ?? "Benefício exclusivo para associados"}
              description={partner.description ?? ""}
            />
          ))}
          {partners.length === 0 && (
            <p className="text-[13px] text-slate-400 py-2">Nenhuma parceria cadastrada ainda.</p>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

