import { useEffect, useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { PartnerCard } from "../components/cards/PartnerCard";
import type { PartnerType } from "../classes/Partner";
import { fetchPartners, getPartnerImageUrl } from "../services/partnerService";
import { Search, X } from "lucide-react";

export function ParceriasPage() {
  const [partners, setPartners] = useState<PartnerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPartners()
      .then(setPartners)
      .catch(() => setError("Não foi possível carregar as parcerias."))
      .finally(() => setLoading(false));
  }, []);

  const visible = partners.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase())
  );

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

        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-slate-950/70 px-3 py-2.5 focus-within:border-emerald-400/70 focus-within:ring-1 focus-within:ring-emerald-400/60">
          <Search className="h-3.5 w-3.5 text-emerald-300/60 shrink-0" />
          <input
            type="text"
            placeholder="Buscar parceria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-slate-50 placeholder-slate-500 text-[13px]"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {loading && (
          <p className="text-[13px] text-slate-400 py-6 text-center">Carregando parcerias...</p>
        )}

        {error && (
          <p className="text-[13px] text-red-400 py-6 text-center">{error}</p>
        )}

        {!loading && !error && visible.length === 0 && (
          <p className="text-[13px] text-slate-400 py-6 text-center">
            {search ? "Nenhuma parceria encontrada." : "Nenhuma parceria cadastrada ainda."}
          </p>
        )}

        <div className="space-y-3">
          {visible.map((partner) => (
            <PartnerCard
              key={partner.id}
              name={partner.name}
              benefit={partner.benefit_description ?? "Benefício exclusivo para associados"}
              description={partner.description ?? ""}
              imageUrl={partner.has_image_stored ? getPartnerImageUrl(partner.id) : undefined}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
