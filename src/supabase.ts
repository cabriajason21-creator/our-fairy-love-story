import { createClient } from "@supabase/supabase-js";
import { ClientAccount } from "./types";

/**
 * Safely resolves an environment variable across Vite, Vercel, and Node runtimes.
 * Cleans up leading/trailing quotes, whitespace, and invalid values.
 */
function resolveEnvVar(keys: string[], defaultValue: string): string {
  for (const key of keys) {
    let val: any = undefined;
    try {
      val = (import.meta as any).env?.[key];
    } catch {
      // Ignore meta env read errors
    }
    if (!val && typeof process !== "undefined" && process.env) {
      val = process.env[key];
    }
    if (val && typeof val === "string") {
      const cleaned = val.trim().replace(/^["']|["']$/g, "");
      if (cleaned && cleaned !== "undefined" && cleaned !== "null" && cleaned.length > 0) {
        return cleaned;
      }
    }
  }
  return defaultValue;
}

const DEFAULT_SUPABASE_URL = "https://igscxnzefglfblljgtqn.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnc2N4bnplZmdsZmJsbGpndHFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTIwNjksImV4cCI6MjEwMDEyODA2OX0.CwGZgIRF7jobfVmKGaquRG6bCrRlb0lVL5cKeJP9Zlk";

export const SUPABASE_URL = resolveEnvVar(
  ["VITE_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL", "REACT_APP_SUPABASE_URL"],
  DEFAULT_SUPABASE_URL
);

export const SUPABASE_ANON_KEY = resolveEnvVar(
  [
    "VITE_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_ANON_KEY",
    "SUPABASE_KEY",
    "REACT_APP_SUPABASE_ANON_KEY",
  ],
  DEFAULT_SUPABASE_ANON_KEY
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      "X-Client-Info": "love-story-app",
    },
  },
});

const BUCKET_NAME = "media_uploads";

/**
 * Uploads a file to Supabase Storage bucket `media_uploads`
 * and returns its public URL. Files can optionally be organized in a folder named after userId.
 */
export async function uploadFileToSupabase(file: File, userId?: string): Promise<string> {
  try {
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
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err: any) {
    console.error("Exception in uploadFileToSupabase:", err);
    throw new Error(err?.message || String(err));
  }
}

/**
 * Deletes a file from Supabase Storage given its public URL or raw path.
 */
export async function deleteFileFromSupabase(urlOrPath: string): Promise<void> {
  if (!urlOrPath) return;

  try {
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
  } catch (err: any) {
    console.warn("Exception in deleteFileFromSupabase:", err?.message || err);
  }
}

/**
 * Syncs a client account's details and state to the Supabase database.
 * Upserts a row in the `fairy_clients` table.
 */
export async function syncClientToSupabase(client: ClientAccount): Promise<void> {
  if (!client || !client.id) {
    console.warn("syncClientToSupabase called with invalid client account:", client);
    return;
  }

  const payload = {
    id: client.id,
    username: client.username,
    password: client.password,
    space_state: client.spaceState,
    created_at: client.createdAt || new Date().toISOString(),
  };

  try {
    const { error } = await supabase
      .from("fairy_clients")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Supabase Database Sync Error Details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        targetClientId: client.id,
      });
      throw error;
    }
  } catch (err: any) {
    console.error("Exception in syncClientToSupabase:", err);
    const errMsg = err?.message || String(err);
    throw new Error(errMsg);
  }
}

/**
 * Deletes a client account from the Supabase database.
 */
export async function deleteClientFromSupabase(clientId: string): Promise<void> {
  if (!clientId) return;

  try {
    const { error } = await supabase
      .from("fairy_clients")
      .delete()
      .eq("id", clientId);

    if (error) {
      console.error("Supabase Database Delete Error Details:", {
        message: error.message,
        code: error.code,
        clientId,
      });
      throw error;
    }
  } catch (err: any) {
    console.error("Exception in deleteClientFromSupabase:", err);
    throw new Error(err?.message || String(err));
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
    console.warn("Supabase Database Fetch Exception:", err?.message || err);
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
    msgLower.includes("failed to fetch") ||
    msgLower.includes("typeerror") ||
    msgLower.includes("networkerror") ||
    msgLower.includes("network error") ||
    msgLower.includes("fetch failed") ||
    msgLower.includes("network")
  ) {
    return `Cloud Database Sync Status 🌐\n\n` +
           `Could not reach the cloud database endpoint (Failed to fetch).\n\n` +
           `✅ DON'T WORRY: All your changes ARE SAVED LOCALLY on this browser!\n\n` +
           `If you want your changes synced across all devices via Supabase, please verify:\n` +
           `1. Is your Supabase project active? (Free-tier Supabase projects auto-pause after 7 days of inactivity — log into supabase.com to reactivate it).\n` +
           `2. Are VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY configured in your Vercel Environment Variables?\n` +
           `3. Are any ad-blockers, browser extensions, or firewalls blocking connection to *.supabase.co?`;
  }

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

