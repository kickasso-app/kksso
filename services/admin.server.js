import { supabaseAdmin } from "services/supabase-admin";

// Server-side admin check. The client-side gate is only cosmetic.
// app_metadata can only be changed with the service role, unlike user_metadata,
// which every user can edit about themselves.
export async function requireManager(request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { status: 401, message: "Sign in required" };

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return { status: 401, message: "Sign in required" };

  if (data.user.app_metadata?.role !== "manager") {
    return {
      status: 403,
      message: "Manager role required (app_metadata.role = manager)",
    };
  }
  return { user: data.user };
}
