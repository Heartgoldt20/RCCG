import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function portalConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY && process.env.PORTAL_SITE_URL);
}
export async function portalClient() {
  if (!portalConfigured()) throw new Error("Portal is not configured");
  const cookieStore = await cookies();
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (values) => {
        // Server components cannot write cookies; actions and the confirmation route can.
        try { values.forEach(({name,value,options}) => cookieStore.set(name,value,options)); } catch {}
      },
    },
  });
}
export function portalOrigin() {
  const url = new URL(process.env.PORTAL_SITE_URL!);
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") throw new Error("Portal requires HTTPS");
  return url.origin;
}
