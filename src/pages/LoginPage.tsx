import { useState } from "react";
import { LogIn, IdCard, ShieldCheck, User } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Fluxo simulado – redireciona para o dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-cracked px-5 py-8">
      <div className="w-full max-w-md space-y-5">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative">
            <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center overflow-hidden shadow-soft-card">
              <img
                src="/imagens/logo-biomed.png"
                alt="Atlética Patológicos"
                className="h-14 w-14 object-contain drop-shadow-[0_0_18px_rgba(16,185,129,0.95)]"
              />
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80 font-semibold">
              Atlética Patológicos
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-50">
              Acesse sua carteirinha digital
            </h1>
            <p className="mt-1 text-xs text-emerald-100/80">
              Login exclusivo para associados da Biomedicina UNIGRAN – Dourados.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-panel bg-slate-950/90 border-emerald-500/25 px-5 py-5 space-y-4"
        >
          <Input
            label="RGM do universitário"
            placeholder="Seu RGM"
            icon={<IdCard className="h-4 w-4" />}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            icon={<ShieldCheck className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            leftIcon={<LogIn className="h-4 w-4" />}
            className="mt-1"
          >
            Entrar
          </Button>

          <button
            type="button"
            className="mt-1 inline-flex w-full items-center justify-center gap-2 text-[11px] text-emerald-100/80 hover:text-emerald-200"
          >
            <User className="h-3.5 w-3.5" />
            Esqueci minha senha
          </button>
        </form>
      </div>
    </div>
  );
}

