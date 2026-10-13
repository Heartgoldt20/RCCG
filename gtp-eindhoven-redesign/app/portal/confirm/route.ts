import { NextRequest,NextResponse } from "next/server";
import { portalClient,portalConfigured } from "../../../lib/portal/server";
export async function GET(request:NextRequest) {
 if(!portalConfigured()) return NextResponse.redirect(new URL("/portal/login",request.url));
 const params=request.nextUrl.searchParams;
 const token=params.get("token_hash"), type=params.get("type"), code=params.get("code");
 const client=await portalClient();
 let success=false;
 if(token && (type==="email"||type==="signup"||type==="recovery")) {
   const {error}=await client.auth.verifyOtp({token_hash:token,type}); success=!error;
 } else if(code) {
   const {error}=await client.auth.exchangeCodeForSession(code); success=!error;
 }
 const target=success?(type==="recovery"?"/portal/reset-password":"/portal/dashboard"):"/portal/login?error=confirmation";
 const response=NextResponse.redirect(new URL(target,request.url));
 response.headers.set("Cache-Control","no-store");
 response.headers.set("Referrer-Policy","no-referrer");
 return response;
}
