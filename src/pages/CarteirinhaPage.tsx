import { MembershipCard } from "../components/cards/MembershipCard";
import { Button } from "../components/ui/Button";
import { Download, Share2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CarteirinhaPage() {
  const navigate = useNavigate();
  const user = {
    name: "Usuário teste",
    rgm: "2026XXXXX",
    status: "ativo" as const
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-8 text-slate-50 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.22),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(16,185,129,0.4),_transparent_55%),_linear-gradient(135deg,_#020617_0%,_#022c22_50%,_#020617_100%)]">
      <div className="w-full max-w-md space-y-6">
        <MembershipCard
          name={user.name}
          rgm={user.rgm}
          atlheticName="Atlética Patológicos"
          status={user.status}
        />

        <div className="grid sm:grid-cols-2 gap-3">
          <Button
            fullWidth
            variant="secondary"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Baixar carteirinha
          </Button>
          <Button
            fullWidth
            variant="ghost"
            leftIcon={<Share2 className="h-4 w-4" />}
          >
            Compartilhar
          </Button>
        </div>

        <Button
          variant="ghost"
          fullWidth
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}

