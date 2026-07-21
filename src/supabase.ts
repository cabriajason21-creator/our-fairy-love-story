import { createClient } from "@supabase/supabase-js";
import { ClientAccount } from "./types";

const SUPABASE_URL = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || "https://igscxnzefglfblljgtqn.supabase.co";
const SUPABASE_ANON_KEY = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnc2N4bnplZmdsZmJsbGpndHFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTIwNjksImV4cCI6MjEwMDEyODA2OX0.CwGZgIRF7jobfVmKGaquRG6bCrRlb0lVL5cKeJP9Zlk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BUCKET_NAME = "media_uploads";

/**
 * Uploads a file to Supabase Storage bucket `media_uploads`
 * and returns its public URL. Files can optionally be organized in a folder named after userId.
 */
export async function uploadFileToSupabase(file: File, userId?: string): Promise<string> {
  // Generate a clean, unique file path
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const folder = userId ? `${userId}/` : "";
  const filePath = `${folder}${Date.now()}_${cleanName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase Storage Upload Error:", error);
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Deletes a file from Supabase Storage given its public URL or raw path.
 */
export async function deleteFileFromSupabase(urlOrPath: string): Promise<void> {
  if (!urlOrPath) return;

  let filePath = urlOrPath;
  const bucketSegment = "/storage/v1/object/public/media_uploads/";
  const index = urlOrPath.indexOf(bucketSegment);
  if (index !== -1) {
    filePath = decodeURIComponent(urlOrPath.substring(index + bucketSegment.length));
  } else if (urlOrPath.startsWith("http")) {
    // If it's some other external URL (like an un-uploaded template asset), do not attempt to delete it
    return;
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.warn("Supabase Storage Delete Warning or Error for path:", filePath, error.message || error);
  } else {
    console.log("Successfully deleted file from Supabase Storage:", filePath);
  }
}

/**
 * Syncs a client account's details and state to the Supabase database.
 * Upserts a row in the `fairy_clients` table.
 */
export async function syncClientToSupabase(client: ClientAccount): Promise<void> {
  const payload = {
    id: client.id,
    username: client.username,
    password: client.password,
    space_state: client.spaceState,
    created_at: client.createdAt,
  };

  const { error } = await supabase
    .from("fairy_clients")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    console.error("Supabase Database Sync Error:", error);
    throw new Error(`Failed to sync to database: ${error.message}`);
  }
}

/**
 * Deletes a client account from the Supabase database.
 */
export async function deleteClientFromSupabase(clientId: string): Promise<void> {
  const { error } = await supabase
    .from("fairy_clients")
    .delete()
    .eq("id", clientId);

  if (error) {
    console.error("Supabase Database Delete Error:", error);
    throw new Error(`Failed to delete client from database: ${error.message}`);
  }
}

/**
 * Fetches all client accounts from the Supabase database.
 * Returns null if the table does not exist or fetch fails.
 */
export async function fetchClientsFromSupabase(): Promise<ClientAccount[] | null> {
  try {
    const { data, error } = await supabase
      .from("fairy_clients")
      .select("*");

    if (error) {
      console.warn("Supabase Database Fetch Warning (Table may not exist or permission denied):", error.message);
      return null;
    }

    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,
      username: item.username,
      password: item.password,
      spaceState: item.space_state,
      createdAt: item.created_at,
    }));
  } catch (err: any) {
    console.warn("Supabase Database Fetch Exception:", err.message || err);
    return null;
  }
}

/**
 * Converts general database errors to user-friendly, copy-pasteable queries and setup guides.
 */
export function getFriendlyDbError(error: any): string {
  const msg = error?.message || String(error);
  const msgLower = msg.toLowerCase();
  
  if (
    msgLower.includes("could not find") || 
    msgLower.includes("table") || 
    msgLower.includes("schema cache") || 
    msgLower.includes("relation")
  ) {
    return `Supabase Table Missing! 🗄️\n\n` +
           `The "fairy_clients" table does not exist in your Supabase database.\n\n` +
           `Please run this SQL query in your Supabase SQL Editor to create it:\n\n` +
           `CREATE TABLE public.fairy_clients (\n` +
           `  id TEXT PRIMARY KEY,\n` +
           `  username TEXT UNIQUE NOT NULL,\n` +
           `  password TEXT NOT NULL,\n` +
           `  space_state JSONB NOT NULL DEFAULT '{}'::jsonb,\n` +
           `  created_at TIMESTAMPTZ DEFAULT NOW()\n` +
           `);\n\n` +
           `-- Also enable public access to this table (Row Level Security policies):\n` +
           `ALTER TABLE public.fairy_clients ENABLE ROW LEVEL SECURITY;\n` +
           `CREATE POLICY "Allow public select" ON public.fairy_clients FOR SELECT USING (true);\n` +
           `CREATE POLICY "Allow public insert" ON public.fairy_clients FOR INSERT WITH CHECK (true);\n` +
           `CREATE POLICY "Allow public update" ON public.fairy_clients FOR UPDATE USING (true);\n` +
           `CREATE POLICY "Allow public delete" ON public.fairy_clients FOR DELETE USING (true);`;
  }
  
  if (
    msgLower.includes("row-level security") || 
    msgLower.includes("rls") || 
    msgLower.includes("policy") || 
    msgLower.includes("security policy")
  ) {
    return `Supabase Security Policy Restriction! 🔒\n\n` +
           `You need to enable insert/update/select policies for the "fairy_clients" table.\n\n` +
           `Please run this SQL query in your Supabase SQL Editor:\n\n` +
           `ALTER TABLE public.fairy_clients ENABLE ROW LEVEL SECURITY;\n` +
           `CREATE POLICY "Allow public select" ON public.fairy_clients FOR SELECT USING (true);\n` +
           `CREATE POLICY "Allow public insert" ON public.fairy_clients FOR INSERT WITH CHECK (true);\n` +
           `CREATE POLICY "Allow public update" ON public.fairy_clients FOR UPDATE USING (true);\n` +
           `CREATE POLICY "Allow public delete" ON public.fairy_clients FOR DELETE USING (true);`;
  }
  
  return msg;
}
