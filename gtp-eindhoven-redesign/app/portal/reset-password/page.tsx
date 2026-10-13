import { redirect } from "next/navigation";
import { AuthPage } from "../AuthPage";
import { portalClient,portalConfigured } from "../../../lib/portal/server";
export const dynamic="force-dynamic";
export default async function Reset(){
 if(!portalConfigured()) redirect("/portal/login");
 const client=await portalClient();
 const {data:{user}}=await client.auth.getUser();
 if(!user) redirect("/portal/forgot-password");
 return <AuthPage mode="reset" title="A fresh start." text="Choose a new password for your account."/>;
}
