import { useEffect, useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { PartnerCard } from "../components/cards/PartnerCard";
import type { PartnerType } from "../classes/Partner";
import { fetchPartners } from "../services/partnerService";

export function ParceriasPage() {
  const [partners, setPartners] = useState<PartnerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPartners()
      .then(setPartners)
      .catch(() => setError("Não foi possível carregar as parcerias."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout
      title="Parcerias Patológicos"
      subtitle="Empresas que apoiam a Biomedicina UNIGRAN com benefícios exclusivos."
    >
      <div className="space-y-4">
        <p className="text-[13px] text-emerald-50/85">
          Mostre sua carteirinha digital para garantir os descontos. Confira abaixo as principais
          parcerias ativas com a Atlética Patológicos.
        </p>

        {loading && (
          <p className="text-[13px] text-slate-400 py-6 text-center">Carregando parcerias...</p>
        )}

        {error && (
          <p className="text-[13px] text-red-400 py-6 text-center">{error}</p>
        )}

        {!loading && !error && partners.length === 0 && (
          <p className="text-[13px] text-slate-400 py-6 text-center">
            Nenhuma parceria cadastrada ainda.
          </p>
        )}

        <div className="space-y-3">
          {partners.map((partner) => (
            <PartnerCard
              key={partner.id}
              name={partner.name}
              benefit={partner.benefit_description ?? "Benefício exclusivo para associados"}
              description={partner.description ?? ""}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
