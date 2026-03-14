import { AdminLayout } from "../layouts/AdminLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Mail, User, IdCard, GraduationCap, PlusCircle, Building2 } from "lucide-react";

export function AdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/80 font-semibold">
            Painel Administrativo
          </p>
          <h1 className="text-xl font-semibold text-slate-50">
            Gestão de associados e parcerias
          </h1>
          <p className="text-[13px] text-slate-300">
            Controle centralizado para manter a Atlética Patológicos organizada, forte e próxima dos
            acadêmicos.
          </p>
        </header>

        <div className="grid lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] gap-5">
          <section className="glass-panel bg-slate-950/95 border-emerald-500/25 p-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-emerald-200 uppercase tracking-[0.22em]">
                  Novo associado
                </p>
                <p className="text-[13px] text-slate-300">
                  Cadastre rapidamente um novo acadêmico da Biomedicina.
                </p>
              </div>
              <Badge tone="success">Cadastro rápido</Badge>
            </div>

            <form className="grid sm:grid-cols-2 gap-3">
              <Input
                label="Nome completo"
                placeholder="Nome do associado"
                icon={<User className="h-4 w-4" />}
              />
              <Input
                label="E-mail"
                type="email"
                placeholder="email@unigran.br"
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Curso"
                placeholder="Biomedicina"
                icon={<GraduationCap className="h-4 w-4" />}
              />
              <Input
                label="Matrícula"
                placeholder="2026xxxxx"
                icon={<IdCard className="h-4 w-4" />}
              />
              <div className="sm:col-span-2 flex justify-end">
                <Button
                  type="button"
                  leftIcon={<PlusCircle className="h-4 w-4" />}
                >
                  Cadastrar associado
                </Button>
              </div>
            </form>
          </section>

          <section className="glass-panel bg-slate-950/95 border-emerald-500/25 p-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-emerald-200 uppercase tracking-[0.22em]">
                  Nova parceria
                </p>
                <p className="text-[13px] text-slate-300">
                  Cadastre empresas que apoiam a Atlética.
                </p>
              </div>
            </div>

            <form className="space-y-3">
              <Input
                label="Nome da empresa"
                placeholder="Nome fantasia"
                icon={<Building2 className="h-4 w-4" />}
              />
              <Input
                label="Tipo de benefício"
                placeholder="Ex: 10% OFF em consumação"
              />
              <Input
                label="Descrição rápida"
                placeholder="Detalhes do benefício oferecido"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  leftIcon={<PlusCircle className="h-4 w-4" />}
                >
                  Cadastrar parceria
                </Button>
              </div>
            </form>
          </section>
        </div>

        <section className="grid lg:grid-cols-2 gap-5">
          <div className="glass-panel bg-slate-950/95 border-emerald-500/25 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-emerald-200 uppercase tracking-[0.22em]">
                Associados recentes
              </p>
              <span className="text-[11px] text-slate-400">Exibição ilustrativa</span>
            </div>
            <div className="space-y-2 text-[13px]">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-100">Ana Clara</p>
                  <p className="text-[11px] text-slate-400">Biomedicina • Matrícula 2026xxxx</p>
                </div>
                <Badge tone="success">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-100">João Pedro</p>
                  <p className="text-[11px] text-slate-400">Biomedicina • Matrícula 2025xxxx</p>
                </div>
                <Badge tone="danger">Inativo</Badge>
              </div>
            </div>
          </div>

          <div className="glass-panel bg-slate-950/95 border-emerald-500/25 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-emerald-200 uppercase tracking-[0.22em]">
                Parcerias ativas
              </p>
              <span className="text-[11px] text-slate-400">Visão geral</span>
            </div>
            <div className="space-y-2 text-[13px]">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-100">Laboratório Vida & Diagnóstico</p>
                  <p className="text-[11px] text-slate-400">Saúde • 20% OFF</p>
                </div>
                <Badge tone="success">Ativa</Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-100">Academia Corpo em Equilíbrio</p>
                  <p className="text-[11px] text-slate-400">Esportes • 10% OFF</p>
                </div>
                <Badge tone="success">Ativa</Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

