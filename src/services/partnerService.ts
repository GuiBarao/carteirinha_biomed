import { supabase } from "../lib/supabase";
import type { PartnerType } from "../classes/Partner";

type PartnerInsert = Omit<PartnerType, "id" | "created_at">;
type PartnerUpdate = Partial<PartnerInsert> & { id: number };

export async function fetchPartners(): Promise<PartnerType[]> {
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("created_at", { ascending: false });

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

export async function deletePartner(id: number): Promise<void> {
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) throw error;
}
