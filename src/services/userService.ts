import { supabase } from "../lib/supabase";

export type AssociatedRole = "ADMIN" | "COMMON";

export type Associated = {
  id: string;
  rgm: string;
  complete_name: string;
  role: AssociatedRole;
  ask_for_new_password: boolean;
  deleted_at: string | null;
  updated_at: string | null;
};

const ASSOCIATED_FIELDS =
  "id, rgm, complete_name, role, ask_for_new_password, deleted_at, updated_at";

export function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}


export async function loginAssociated(rgm: string, password: string): Promise<Associated> {
  const { data, error } = await supabase.rpc("login_associated", {
    p_rgm: rgm,
    p_password: password,
  });

  if (error) throw error;
  if (!data || (data as Associated[]).length === 0) throw new Error("RGM ou senha incorretos.");

  return (data as Associated[])[0];
}

export async function fetchAssociated(includeInactive = false): Promise<Associated[]> {
  let query = supabase
    .from("associated")
    .select(ASSOCIATED_FIELDS)
    .order("complete_name");

  if (!includeInactive) {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Associated[];
}

/** Cria o associado com senha temporária gerada automaticamente. Retorna a senha em texto claro. */
export async function createAssociated(fields: {
  rgm: string;
  complete_name: string;
  role: AssociatedRole;
}): Promise<{ associated: Associated; tempPassword: string }> {
  const tempPassword = generateTempPassword();

  const { data, error } = await supabase
    .from("associated")
    .insert({
      rgm: fields.rgm,
      complete_name: fields.complete_name,
      role: fields.role,
      password_hash: tempPassword,
    })
    .select(ASSOCIATED_FIELDS)
    .single();

  if (error) throw error;
  return { associated: data as Associated, tempPassword };
}

export async function updateAssociated(
  id: string,
  fields: { rgm?: string; complete_name?: string; role?: AssociatedRole }
): Promise<Associated> {
  const { data, error } = await supabase
    .from("associated")
    .update(fields)
    .eq("id", id)
    .select(ASSOCIATED_FIELDS)
    .single();

  if (error) throw error;
  return data as Associated;
}

export async function updatePassword(id: string, newPassword: string): Promise<void> {
  const { error } = await supabase
    .from("associated")
    .update({ password_hash: newPassword, ask_for_new_password: false })
    .eq("id", id);

  if (error) throw error;
}

export async function resetAssociatedPassword(
  id: string,
  name: string
): Promise<{ name: string; password: string }> {
  const tempPassword = generateTempPassword();
  const { error } = await supabase
    .from("associated")
    .update({ password_hash: tempPassword, ask_for_new_password: true })
    .eq("id", id);

  if (error) throw error;
  return { name, password: tempPassword };
}

export async function reactivateAssociated(id: string): Promise<void> {
  const { error } = await supabase
    .from("associated")
    .update({ deleted_at: null })
    .eq("id", id);

  if (error) throw error;
}

export async function softDeleteAssociated(id: string): Promise<void> {
  const { error } = await supabase
    .from("associated")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}
