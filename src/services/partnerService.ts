import { supabase } from "../lib/supabase";
import type { PartnerType } from "../classes/Partner";

const BUCKET = "partner_images";

type PartnerInsert = Omit<PartnerType, "id" | "created_at" | "deleted_at" | "has_image_stored">;
type PartnerUpdate = Partial<PartnerInsert> & { id: number };

export async function fetchPartners(includeInactive = false): Promise<PartnerType[]> {
  let query = supabase
    .from("partners")
    .select("*")
    .order("created_at", { ascending: false });

  if (!includeInactive) {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as PartnerType[];
}

export async function createPartner(partner: PartnerInsert): Promise<PartnerType> {
  const { data, error } = await supabase
    .from("partners")
    .insert(partner)
    .select()
    .single();

  if (error) throw error;
  return data as PartnerType;
}

export async function updatePartner({ id, ...fields }: PartnerUpdate): Promise<PartnerType> {
  const { data, error } = await supabase
    .from("partners")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as PartnerType;
}

export async function uploadPartnerImage(id: number, file: File): Promise<void> {
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(String(id), file, { upsert: true, contentType: file.type });

  if (uploadError) throw uploadError;

  const { error: updateError } = await supabase
    .from("partners")
    .update({ has_image_stored: true })
    .eq("id", id);

  if (updateError) throw updateError;
}

export function getPartnerImageUrl(id: number): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(String(id));
  return data.publicUrl;
}

export async function softDeletePartner(id: number): Promise<void> {
  const { error } = await supabase
    .from("partners")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function reactivatePartner(id: number): Promise<void> {
  const { error } = await supabase
    .from("partners")
    .update({ deleted_at: null })
    .eq("id", id);

  if (error) throw error;
}
