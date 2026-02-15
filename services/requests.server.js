import { supabaseAdmin } from "services/supabase-admin";

export const getRequests = async (studioUuid) => {
  const { data, error } = await supabaseAdmin
    .from("requests")
    .select("*")
    .eq("studio_uuid", studioUuid)
    .order("request_date_tz", { ascending: false });

  if (error) {
    console.error("Error fetching requests:", error);
    return [];
  }

  return data;
};

export const getRequest = async (requestId, studioUuid) => {
  const { data, error } = await supabaseAdmin
    .from("requests")
    .select("*")
    .eq("studio_uuid", studioUuid)
    .eq("request_id", requestId)
    .single();

  if (error) {
    console.error("Error fetching request:", error);
    return null;
  }

  return data;
};

export const updateRequest = async (requestId, updates) => {
  const { data, error } = await supabaseAdmin
    .from("requests")
    .update(updates)
    .eq("request_id", requestId)
    .select()
    .single();

  if (error) {
    console.error("Error updating request:", error);
    throw error;
  }

  return data;
};
