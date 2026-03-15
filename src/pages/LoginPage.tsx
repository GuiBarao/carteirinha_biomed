import { useState } from "react";
import { LogIn, IdCard, ShieldCheck, MessageCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginAssociated } from "../services/userService";
import { supabase } from "../lib/supabase";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [rgm, setRgm] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleForgotPassword() {
    const { data } = await supabase
      .from("app_configuration")
      .select("name, value")
      .in("name", ["DEFINE_NEW_PASSWORD_NUMBER", "DEFINE_NEW_PASSWORD_MESSAGE"]);

    const configs = Object.fromEntries((data ?? []).map((r) => [r.name, r.value]));
    const number = configs["DEFINE_NEW_PASSWORD_NUMBER"]?.replace(/\D/g, "") ?? "";
    const message = configs["DEFINE_NEW_PASSWORD_MESSAGE"] ?? "";

    if (number) {
      const url = message
        ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
        : `https://wa.me/${number}`;
      window.open(url, "_blank");
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await loginAssociated(rgm.trim(), password);
      login(user);
      if (user.ask_for_new_password) {
        navigate("/change-password", { replace: true });
      } else {
        navigate(user.role === "ADMIN" ? "/admin" : "/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao realizar login.");
    } finally {
      setLoading(false);
    }
  }

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
            value={rgm}
            onChange={(e) => setRgm(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            icon={<ShieldCheck className="h-4 w-4" />}
            rightAction={
              <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-[12px] text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={loading}
            leftIcon={<LogIn className="h-4 w-4" />}
            className="mt-1"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 text-[11px] text-emerald-100/80 hover:text-emerald-200"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Esqueci minha senha
          </button>
        </form>
      </div>
    </div>
  );
}
