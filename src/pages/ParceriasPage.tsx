import { MainLayout } from "../layouts/MainLayout";
import { PartnerCard } from "../components/cards/PartnerCard";

export function ParceriasPage() {
  const partners = [
    {
      name: "Laboratório Vida & Diagnóstico",
      benefit: "20% OFF em exames selecionados",
      description:
        "Benefício exclusivo para associados da Atlética Patológicos mediante apresentação da carteirinha digital e documento com foto.",
      category: "Saúde"
    },
    {
      name: "Academia Corpo em Equilíbrio",
      benefit: "Isenção de matrícula + 10% OFF nas mensalidades",
      description:
        "Planos especiais para universitários, musculação completa, aulas coletivas e acompanhamento com educador físico.",
      category: "Esportes"
    },
    {
      name: "Bar & Gastro Pub Biomakers",
      benefit: "10% OFF no consumo de quarta a domingo",
      description:
        "Ambiente universitário com drinks, lanches e porções. Válido para mesas com ao menos um associado ativo.",
      category: "Lazer"
    }
  ];

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

        <div className="space-y-3">
          {partners.map((partner) => (
            <PartnerCard key={partner.name} {...partner} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

