import { useState } from "react";
import { KeyRound, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updatePassword } from "../services/userService";

export function ChangePasswordPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(user!.id, password);
      updateUser({ ask_for_new_password: false });
      navigate(user!.role === "ADMIN" ? "/admin" : "/dashboard", { replace: true });
    } catch {
      setError("Erro ao definir a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-cracked px-5 py-8">
      <div className="w-full max-w-md space-y-5">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center shadow-soft-card">
            <KeyRound className="h-7 w-7 text-emerald-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80 font-semibold">
              Atlética Patológicos
            </p>
            <h1 className="mt-1 text-xl font-semibold text-slate-50">Defina sua nova senha</h1>
            <p className="mt-1 text-xs text-emerald-100/80">
              Olá, {user?.complete_name?.split(" ")[0]}! Por segurança, crie uma senha pessoal para
              continuar.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-panel bg-slate-950/90 border-emerald-500/25 px-5 py-5 space-y-4"
        >
          <Input
            label="Nova senha"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 4 caracteres"
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
          <Input
            label="Confirmar senha"
            type={showConfirm ? "text" : "password"}
            placeholder="Repita a senha"
            icon={<ShieldCheck className="h-4 w-4" />}
            rightAction={
              <button type="button" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}>
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          {error && <p className="text-[12px] text-red-400">{error}</p>}

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={loading}
            leftIcon={<KeyRound className="h-4 w-4" />}
          >
            {loading ? "Salvando..." : "Definir senha e entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
