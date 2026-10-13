import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({request});
  const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    const client = createServerClient(url,key,{
      cookieOptions:{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/"},
      cookies:{
        getAll:()=>request.cookies.getAll(),
        setAll:(values)=>{
          values.forEach(({name,value})=>request.cookies.set(name,value));
          response=NextResponse.next({request});
          values.forEach(({name,value,options})=>response.cookies.set(name,value,options));
        },
      },
    });
    // Auth-server validation also refreshes expired sessions. Pages and actions
    // independently verify identity; a proxy check is not authorisation.
    try { await client.auth.getUser(); } catch { /* Pages show their own safe failure state. */ }
  }
  response.headers.set("Cache-Control","private, no-store");
  return response;
}
export const config={matcher:["/portal/:path*"]};
