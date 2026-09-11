import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("YOUR-PROJECT-ID")
);

// Graceful Supabase client instance
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Inserts a contact message directly into the Supabase 'messages' table if configured.
 */
export async function insertContactToSupabase(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!supabase) {
    return { data: null, error: new Error("Supabase is not configured in frontend/.env.local") };
  }
  try {
    const { data: insertedData, error } = await supabase.from("messages").insert([
      {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        created_at: new Date().toISOString(),
      },
    ]);
    return { data: insertedData, error };
  } catch (err: any) {
    console.warn("Direct Supabase message insertion error:", err);
    return { data: null, error: err };
  }
}
