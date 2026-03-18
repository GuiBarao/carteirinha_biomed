import { useEffect, useState } from "react";
import { AdminLayout } from "../layouts/AdminLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  User,
  IdCard,
  PlusCircle,
  Building2,
  Pencil,
  Trash2,
  X,
  Check,
  Copy,
  ShieldCheck,
  RefreshCw,
  Search,
  EyeOff,
  RotateCcw,
  ImagePlus,
  Image,
} from "lucide-react";
import type { PartnerType } from "../classes/Partner";
import {
  fetchPartners,
  createPartner,
  updatePartner,
  softDeletePartner,
  reactivatePartner,
  uploadPartnerImage,
  getPartnerImageUrl,
  deletePartnerImage,
} from "../services/partnerService";
import type { Associated, AssociatedRole } from "../services/userService";
import {
  fetchAssociated,
  createAssociated,
  updateAssociated,
  softDeleteAssociated,
  reactivateAssociated,
  resetAssociatedPassword,
} from "../services/userService";

// ── Partner form ──────────────────────────────────────────────────────────────

type PartnerForm = { name: string; description: string; benefit_description: string };
const emptyPartnerForm: PartnerForm = { name: "", description: "", benefit_description: "" };

// ── User form ─────────────────────────────────────────────────────────────────

type UserForm = { complete_name: string; rgm: string; role: AssociatedRole };
const emptyUserForm: UserForm = { complete_name: "", rgm: "", role: "COMMON" };

// ── Styled select (matches Input styling) ─────────────────────────────────────

function RoleSelect({
  value,
  onChange,
}: {
  value: AssociatedRole;
  onChange: (v: AssociatedRole) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-200 tracking-wide">Perfil</label>
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-slate-950/70 px-3.5 py-2.5 text-sm focus-within:border-emerald-400/70 focus-within:ring-1 focus-within:ring-emerald-400/60">
        <span className="text-emerald-300/80">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as AssociatedRole)}
          className="flex-1 bg-transparent outline-none text-slate-50 text-sm cursor-pointer"
        >
          <option value="COMMON" className="bg-slate-900">
            Comum
          </option>
          <option value="ADMIN" className="bg-slate-900">
            Administrador
          </option>
        </select>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AdminPage() {
  // Partners state
  const [partners, setPartners] = useState<PartnerType[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [partnerError, setPartnerError] = useState<string | null>(null);
  const [partnerForm, setPartnerForm] = useState<PartnerForm>(emptyPartnerForm);
  const [editingPartnerId, setEditingPartnerId] = useState<number | null>(null);
  const [savingPartner, setSavingPartner] = useState(false);
  const [deletingPartnerId, setDeletingPartnerId] = useState<number | null>(null);
  const [reactivatingPartnerId, setReactivatingPartnerId] = useState<number | null>(null);
  const [showInactivePartners, setShowInactivePartners] = useState(false);
  const [partnerImageFile, setPartnerImageFile] = useState<File | null>(null);
  const [partnerImagePreview, setPartnerImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  // Users state
  const [users, setUsers] = useState<Associated[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [userForm, setUserForm] = useState<UserForm>(emptyUserForm);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [reactivatingUserId, setReactivatingUserId] = useState<string | null>(null);
  const [createdPassword, setCreatedPassword] = useState<{ name: string; password: string } | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState("");

  useEffect(() => {
    fetchPartners(true)
      .then(setPartners)
      .catch(() => setPartnerError("Não foi possível carregar as parcerias."))
      .finally(() => setLoadingPartners(false));

    fetchAssociated(true)
      .then(setUsers)
      .catch(() => setUserError("Não foi possível carregar os associados."))
      .finally(() => setLoadingUsers(false));
  }, []);

  // ── Partner handlers ────────────────────────────────────────────────────────

  function setPartnerField(field: keyof PartnerForm, value: string) {
    setPartnerForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEditPartner(p: PartnerType) {
    setEditingPartnerId(p.id);
    setPartnerForm({
      name: p.name,
      description: p.description ?? "",
      benefit_description: p.benefit_description ?? "",
    });
    setPartnerImageFile(null);
    setPartnerImagePreview(p.has_image_stored ? getPartnerImageUrl(p.id) : null);
    setRemoveImage(false);
  }

  function cancelEditPartner() {
    setEditingPartnerId(null);
    setPartnerForm(emptyPartnerForm);
    setPartnerImageFile(null);
    setPartnerImagePreview(null);
    setRemoveImage(false);
  }

  function handlePartnerImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPartnerImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPartnerImagePreview(url);
    }
  }

  async function handlePartnerSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!partnerForm.name.trim()) return;
    setSavingPartner(true);
    setPartnerError(null);
    const payload = {
      name: partnerForm.name.trim(),
      description: partnerForm.description.trim() || null,
      benefit_description: partnerForm.benefit_description.trim() || null,
    };
    try {
      if (editingPartnerId !== null) {
        let updated = await updatePartner({ id: editingPartnerId, ...payload });
        if (removeImage) {
          await deletePartnerImage(editingPartnerId);
          updated = { ...updated, has_image_stored: false };
        } else if (partnerImageFile) {
          await uploadPartnerImage(editingPartnerId, partnerImageFile);
          updated = { ...updated, has_image_stored: true };
        }
        setPartners((prev) => prev.map((p) => (p.id === editingPartnerId ? updated : p)));
        setEditingPartnerId(null);
      } else {
        let created = await createPartner(payload);
        if (partnerImageFile) {
          await uploadPartnerImage(created.id, partnerImageFile);
          created = { ...created, has_image_stored: true };
        }
        setPartners((prev) => [created, ...prev]);
      }
      setPartnerForm(emptyPartnerForm);
      setPartnerImageFile(null);
      setPartnerImagePreview(null);
      setRemoveImage(false);
    } catch {
      setPartnerError("Erro ao salvar parceria. Tente novamente.");
    } finally {
      setSavingPartner(false);
    }
  }

  async function handlePartnerDelete(id: number) {
    setDeletingPartnerId(id);
    setPartnerError(null);
    try {
      await softDeletePartner(id);
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, deleted_at: new Date().toISOString() } : p))
      );
      if (editingPartnerId === id) cancelEditPartner();
    } catch {
      setPartnerError("Erro ao desativar parceria.");
    } finally {
      setDeletingPartnerId(null);
    }
  }

  async function handlePartnerReactivate(id: number) {
    setReactivatingPartnerId(id);
    setPartnerError(null);
    try {
      await reactivatePartner(id);
      setPartners((prev) =>
        prev.map((p) => (p.id === id ? { ...p, deleted_at: null } : p))
      );
    } catch {
      setPartnerError("Erro ao reativar parceria.");
    } finally {
      setReactivatingPartnerId(null);
    }
  }

  // ── User handlers ───────────────────────────────────────────────────────────

  function setUserField<K extends keyof UserForm>(field: K, value: UserForm[K]) {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEditUser(u: Associated) {
    setEditingUserId(u.id);
    setCreatedPassword(null);
    setUserForm({ complete_name: u.complete_name, rgm: u.rgm, role: u.role });
  }

  function cancelEditUser() {
    setEditingUserId(null);
    setUserForm(emptyUserForm);
  }

  async function handleUserSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userForm.complete_name.trim() || !userForm.rgm.trim()) return;
    setSavingUser(true);
    setUserError(null);
    setCreatedPassword(null);
    try {
      if (editingUserId !== null) {
        const updated = await updateAssociated(editingUserId, {
          complete_name: userForm.complete_name.trim(),
          rgm: userForm.rgm.trim(),
          role: userForm.role,
        });
        setUsers((prev) => prev.map((u) => (u.id === editingUserId ? updated : u)));
        setEditingUserId(null);
      } else {
        const { associated, tempPassword } = await createAssociated({
          complete_name: userForm.complete_name.trim(),
          rgm: userForm.rgm.trim(),
          role: userForm.role,
        });
        setUsers((prev) =>
          [...prev, associated].sort((a, b) => a.complete_name.localeCompare(b.complete_name))
        );
        setCreatedPassword({ name: associated.complete_name, password: tempPassword });
      }
      setUserForm(emptyUserForm);
    } catch {
      setUserError("Erro ao salvar associado. Tente novamente.");
    } finally {
      setSavingUser(false);
    }
  }

  async function handleResetPassword(id: string, name: string) {
    setResettingUserId(id);
    setUserError(null);
    setCreatedPassword(null);
    try {
      const result = await resetAssociatedPassword(id, name);
      setCreatedPassword(result);
    } catch {
      setUserError("Erro ao redefinir senha. Tente novamente.");
    } finally {
      setResettingUserId(null);
    }
  }

  async function handleUserDelete(id: string) {
    setDeletingUserId(id);
    setUserError(null);
    try {
      await softDeleteAssociated(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, deleted_at: new Date().toISOString() } : u))
      );
      if (editingUserId === id) cancelEditUser();
    } catch {
      setUserError("Erro ao remover associado.");
    } finally {
      setDeletingUserId(null);
    }
  }

  async function handleUserReactivate(id: string) {
    setReactivatingUserId(id);
    setUserError(null);
    try {
      await reactivateAssociated(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, deleted_at: null } : u))
      );
    } catch {
      setUserError("Erro ao reativar associado.");
    } finally {
      setReactivatingUserId(null);
    }
  }

  // ── Derived: filtered users ─────────────────────────────────────────────────

  const visibleUsers = users
    .filter((u) => showInactive || u.deleted_at === null)
    .filter((u) => {
      const q = userSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        u.complete_name.toLowerCase().includes(q) ||
        u.rgm.toLowerCase().includes(q)
      );
    });

  const visiblePartnerList = partners
    .filter((p) => showInactivePartners || p.deleted_at === null)
    .filter((p) => p.name.toLowerCase().includes(partnerSearch.trim().toLowerCase()));

  // ── Render ──────────────────────────────────────────────────────────────────

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
          {/* Form: Associado */}
          <section className="glass-panel bg-slate-950/95 border-emerald-500/25 p-4 space-y-4 h-min">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-emerald-200 uppercase tracking-[0.22em]">
                  {editingUserId ? "Editar associado" : "Novo associado"}
                </p>
                <p className="text-[13px] text-slate-300">
                  {editingUserId
                    ? "Atualize os dados do associado selecionado."
                    : "Cadastre um novo acadêmico da Biomedicina."}
                </p>
              </div>
              {editingUserId && (
                <button
                  type="button"
                  onClick={cancelEditUser}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                  title="Cancelar edição"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <form className="grid sm:grid-cols-2 gap-3" onSubmit={handleUserSubmit}>
              <Input
                label="Nome completo"
                placeholder="Nome do associado"
                icon={<User className="h-4 w-4" />}
                value={userForm.complete_name}
                onChange={(e) => setUserField("complete_name", e.target.value)}
                required
              />
              <Input
                label="RGM"
                placeholder="RGM do associado"
                icon={<IdCard className="h-4 w-4" />}
                value={userForm.rgm}
                onChange={(e) => setUserField("rgm", e.target.value)}
                required
              />
              <div className="sm:col-span-2">
                <RoleSelect
                  value={userForm.role}
                  onChange={(v) => setUserField("role", v)}
                />
              </div>

              {userError && (
                <p className="sm:col-span-2 text-[11px] text-red-400">{userError}</p>
              )}

              {createdPassword && (
                <div className="sm:col-span-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 space-y-1">
                  <p className="text-[12px] font-semibold text-emerald-200">
                    Associado criado com sucesso!
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Senha temporária de{" "}
                    <span className="font-semibold text-slate-50">{createdPassword.name.split(" ")[0]}</span>:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-bold tracking-widest text-emerald-300">
                      {createdPassword.password}
                    </code>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(createdPassword.password)}
                      className="p-1.5 text-slate-400 hover:text-emerald-300 transition-colors"
                      title="Copiar senha"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreatedPassword(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Fechar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    O usuário será solicitado a criar uma nova senha no primeiro acesso.
                  </p>
                </div>
              )}

              <div className="sm:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={savingUser || !userForm.complete_name.trim() || !userForm.rgm.trim()}
                  leftIcon={
                    editingUserId ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <PlusCircle className="h-4 w-4" />
                    )
                  }
                >
                  {savingUser
                    ? "Salvando..."
                    : editingUserId
                    ? "Salvar alterações"
                    : "Cadastrar associado"}
                </Button>
              </div>
            </form>
          </section>

          {/* Form: Parceria */}
          <section className="glass-panel bg-slate-950/95 border-emerald-500/25 p-4 space-y-4 h-min">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-emerald-200 uppercase tracking-[0.22em]">
                  {editingPartnerId !== null ? "Editar parceria" : "Nova parceria"}
                </p>
                <p className="text-[13px] text-slate-300">
                  {editingPartnerId !== null
                    ? "Atualize os dados da parceria selecionada."
                    : "Cadastre empresas que apoiam a Atlética."}
                </p>
              </div>
              {editingPartnerId !== null && (
                <button
                  type="button"
                  onClick={cancelEditPartner}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                  title="Cancelar edição"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <form className="space-y-3" onSubmit={handlePartnerSubmit}>
              <Input
                label="Nome da empresa"
                placeholder="Nome fantasia"
                icon={<Building2 className="h-4 w-4" />}
                value={partnerForm.name}
                onChange={(e) => setPartnerField("name", e.target.value)}
                required
              />
              <Input
                label="Descrição do benefício"
                placeholder="Ex: 10% OFF em consumação"
                value={partnerForm.benefit_description}
                onChange={(e) => setPartnerField("benefit_description", e.target.value)}
              />
              <Input
                label="Descrição rápida"
                placeholder="Detalhes do benefício oferecido"
                value={partnerForm.description}
                onChange={(e) => setPartnerField("description", e.target.value)}
              />

              {/* Upload de logo */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-200 tracking-wide">
                  Logo da empresa <span className="text-slate-500">(opcional)</span>
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-dashed border-emerald-500/30 bg-slate-950/70 px-3.5 py-3 cursor-pointer hover:border-emerald-400/60 transition-colors group">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/svg+xml"
                    className="sr-only"
                    onChange={handlePartnerImageChange}
                  />
                  {partnerImagePreview ? (
                    <img
                      src={partnerImagePreview}
                      alt="Preview"
                      className="h-10 w-10 rounded-lg object-contain bg-slate-900 border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-center shrink-0">
                      <Image className="h-5 w-5 text-slate-500" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[13px] text-slate-300 group-hover:text-slate-100 transition-colors truncate">
                      {removeImage
                        ? "Foto será removida ao salvar"
                        : partnerImageFile
                        ? partnerImageFile.name
                        : partnerImagePreview
                        ? "Clique para alterar a imagem"
                        : "Clique para selecionar"}
                    </p>
                    <p className="text-[11px] text-slate-500">JPG, PNG ou SVG</p>
                  </div>
                  <ImagePlus className="h-4 w-4 text-emerald-400/60 group-hover:text-emerald-400 transition-colors ml-auto shrink-0" />
                </label>
                {partnerImageFile && (
                  <button
                    type="button"
                    onClick={() => { setPartnerImageFile(null); setPartnerImagePreview(editingPartnerId ? getPartnerImageUrl(editingPartnerId) : null); }}
                    className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Remover seleção
                  </button>
                )}
                {!partnerImageFile && partnerImagePreview && !removeImage && (
                  <button
                    type="button"
                    onClick={() => { setRemoveImage(true); setPartnerImagePreview(null); }}
                    className="text-[11px] text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Remover foto
                  </button>
                )}
                {removeImage && (
                  <button
                    type="button"
                    onClick={() => { setRemoveImage(false); setPartnerImagePreview(editingPartnerId ? getPartnerImageUrl(editingPartnerId) : null); }}
                    className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Cancelar remoção
                  </button>
                )}
              </div>

              {partnerError && (
                <p className="text-[11px] text-red-400">{partnerError}</p>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={savingPartner || !partnerForm.name.trim()}
                  leftIcon={
                    editingPartnerId !== null ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <PlusCircle className="h-4 w-4" />
                    )
                  }
                >
                  {savingPartner
                    ? "Salvando..."
                    : editingPartnerId !== null
                    ? "Salvar alterações"
                    : "Cadastrar parceria"}
                </Button>
              </div>
            </form>
          </section>
        </div>

        <section className="grid lg:grid-cols-2 gap-5">
          {/* Lista: Associados */}
          <div className="glass-panel bg-slate-950/95 border-emerald-500/25 p-4 space-y-3">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-emerald-200 uppercase tracking-[0.22em]">
                Associados cadastrados
              </p>
              {!loadingUsers && (
                <span className="text-[11px] text-slate-400">
                  {visibleUsers.length} de {users.filter((u) => u.deleted_at === null).length} ativo
                  {users.filter((u) => u.deleted_at === null).length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Busca + filtro */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-slate-950/70 px-3 py-2 text-sm focus-within:border-emerald-400/70 focus-within:ring-1 focus-within:ring-emerald-400/60">
                <Search className="h-3.5 w-3.5 text-emerald-300/60 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou RGM..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-slate-50 placeholder-slate-500 text-[13px]"
                />
                {userSearch && (
                  <button
                    type="button"
                    onClick={() => setUserSearch("")}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowInactive((v) => !v)}
                className={[
                  "flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12px] font-medium transition-colors w-full",
                  showInactive
                    ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                    : "bg-slate-900/50 border border-slate-700/40 text-slate-400 hover:text-slate-300",
                ].join(" ")}
              >
                <EyeOff className="h-3.5 w-3.5 shrink-0" />
                {showInactive ? "Ocultando inativos" : "Mostrar inativos"}
                {showInactive && users.filter((u) => u.deleted_at !== null).length > 0 && (
                  <span className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">
                    {users.filter((u) => u.deleted_at !== null).length} inativo
                    {users.filter((u) => u.deleted_at !== null).length !== 1 ? "s" : ""}
                  </span>
                )}
              </button>
            </div>

            {loadingUsers && (
              <p className="text-[13px] text-slate-400 py-2">Carregando...</p>
            )}

            {!loadingUsers && visibleUsers.length === 0 && (
              <p className="text-[13px] text-slate-400 py-2">
                {userSearch ? "Nenhum associado encontrado." : "Nenhum associado cadastrado."}
              </p>
            )}

            <div className="space-y-2">
              {visibleUsers.map((u) => {
                const isInactive = u.deleted_at !== null;
                return (
                  <div
                    key={u.id}
                    className={[
                      "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-[13px] transition-colors",
                      isInactive
                        ? "bg-slate-900/30 border border-slate-700/30 opacity-60"
                        : editingUserId === u.id
                        ? "bg-emerald-500/10 border border-emerald-500/30"
                        : "bg-slate-900/50",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={["font-medium truncate", isInactive ? "line-through text-slate-400" : "text-slate-100"].join(" ")}>
                          {u.complete_name}
                        </p>
                        {isInactive && (
                          <Badge tone="danger">Inativo</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        RGM {u.rgm} •{" "}
                        <span className={u.role === "ADMIN" ? "text-emerald-400" : "text-slate-400"}>
                          {u.role === "ADMIN" ? "Admin" : "Comum"}
                        </span>
                      </p>
                    </div>
                    {isInactive && (
                      <button
                        type="button"
                        onClick={() => handleUserReactivate(u.id)}
                        disabled={reactivatingUserId === u.id}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-40"
                        title="Reativar associado"
                      >
                        <RotateCcw className={["h-3.5 w-3.5", reactivatingUserId === u.id ? "animate-spin" : ""].join(" ")} />
                      </button>
                    )}
                    {!isInactive && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditUser(u)}
                          className="p-1.5 text-slate-400 hover:text-emerald-300 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetPassword(u.id, u.complete_name)}
                          disabled={resettingUserId === u.id}
                          className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors disabled:opacity-40"
                          title="Gerar nova senha temporária"
                        >
                          <RefreshCw className={["h-3.5 w-3.5", resettingUserId === u.id ? "animate-spin" : ""].join(" ")} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUserDelete(u.id)}
                          disabled={deletingUserId === u.id}
                          className="p-1.5 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-40"
                          title="Remover"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista: Parcerias */}
          <div className="h-auto w-auto glass-panel bg-slate-950/95 border-emerald-500/25 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-emerald-200 uppercase tracking-[0.22em]">
                Parcerias cadastradas
              </p>
              {!loadingPartners && (
                <span className="text-[11px] text-slate-400">
                  {visiblePartnerList.length} {visiblePartnerList.length === 1 ? "parceria" : "parcerias"}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-slate-950/70 px-3 py-2 focus-within:border-emerald-400/70 focus-within:ring-1 focus-within:ring-emerald-400/60">
                <Search className="h-3.5 w-3.5 text-emerald-300/60 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-slate-50 placeholder-slate-500 text-[13px]"
                />
                {partnerSearch && (
                  <button type="button" onClick={() => setPartnerSearch("")} className="text-slate-500 hover:text-slate-300 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowInactivePartners((v) => !v)}
                className={[
                  "flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12px] font-medium transition-colors w-full",
                  showInactivePartners
                    ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                    : "bg-slate-900/50 border border-slate-700/40 text-slate-400 hover:text-slate-300",
                ].join(" ")}
              >
                <EyeOff className="h-3.5 w-3.5 shrink-0" />
                {showInactivePartners ? "Ocultando inativos" : "Mostrar inativos"}
                {showInactivePartners && partners.filter((p) => p.deleted_at !== null).length > 0 && (
                  <span className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">
                    {partners.filter((p) => p.deleted_at !== null).length} inativo
                    {partners.filter((p) => p.deleted_at !== null).length !== 1 ? "s" : ""}
                  </span>
                )}
              </button>
            </div>

            {loadingPartners && (
              <p className="text-[13px] text-slate-400 py-2">Carregando...</p>
            )}

            {!loadingPartners && visiblePartnerList.length === 0 && (
              <p className="text-[13px] text-slate-400 py-2">
                {partnerSearch ? "Nenhuma parceria encontrada." : "Nenhuma parceria cadastrada."}
              </p>
            )}

            <div className="space-y-2">
              {visiblePartnerList.map((partner) => {
                const isInactive = partner.deleted_at !== null;
                return (
                  <div
                    key={partner.id}
                    className={[
                      "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-[13px] transition-colors",
                      isInactive
                        ? "bg-slate-900/30 border border-slate-700/30 opacity-60"
                        : editingPartnerId === partner.id
                        ? "bg-emerald-500/10 border border-emerald-500/30"
                        : "bg-slate-900/50",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {partner.has_image_stored ? (
                        <img
                          src={getPartnerImageUrl(partner.id)}
                          alt={partner.name}
                          className="h-8 w-8 rounded-lg object-contain bg-slate-900 border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-700/50 flex items-center justify-center shrink-0">
                          <Image className="h-3.5 w-3.5 text-slate-600" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={["font-medium truncate", isInactive ? "line-through text-slate-400" : "text-slate-100"].join(" ")}>
                            {partner.name}
                          </p>
                          {isInactive && <Badge tone="danger">Inativo</Badge>}
                        </div>
                        {partner.benefit_description && (
                          <p className="text-[11px] text-slate-400 truncate">
                            {partner.benefit_description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {isInactive ? (
                        <button
                          type="button"
                          onClick={() => handlePartnerReactivate(partner.id)}
                          disabled={reactivatingPartnerId === partner.id}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-40"
                          title="Reativar parceria"
                        >
                          <RotateCcw className={["h-3.5 w-3.5", reactivatingPartnerId === partner.id ? "animate-spin" : ""].join(" ")} />
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEditPartner(partner)}
                            className="p-1.5 text-slate-400 hover:text-emerald-300 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePartnerDelete(partner.id)}
                            disabled={deletingPartnerId === partner.id}
                            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-40"
                            title="Desativar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
