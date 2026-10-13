"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { portalClient, portalConfigured, portalOrigin } from "../../lib/portal/server";
import { gatherings, ministryOptions } from "../../lib/portal/gatherings";
export type FormState = { error?: string; success?: string };
const field = (form: FormData, key: string) => String(form.get(key) || "").trim();
const unavailable = { error: "Online registration is not available yet. Please contact GTP Eindhoven for help." };
const emailValid = (email: string) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (!portalConfigured()) return unavailable;
  const email = field(form,"email"), password = String(form.get("password") || "");
  if (!emailValid(email) || !password) return { error: "Enter your email address and password." };
  try {
    const client = await portalClient();
    const {error} = await client.auth.signInWithPassword({email,password});
    if (error) return {error: "Unable to sign in. Check your details and confirm your email address first."};
  } catch { return {error: "Unable to connect. Please try again shortly."}; }
  redirect("/portal/dashboard");
}
export async function register(_: FormState, form: FormData): Promise<FormState> {
  if (!portalConfigured()) return unavailable;
  const email=field(form,"email"), name=field(form,"name"), password=String(form.get("password") || "");
  if (!name || name.length > 100 || !emailValid(email)) return {error:"Enter your name and a valid email address."};
  if (password.length < 12 || password.length > 128) return {error:"Use a password between 12 and 128 characters."};
  if (password !== String(form.get("confirmPassword") || "")) return {error:"The passwords do not match."};
  if (form.get("privacy") !== "on") return {error:"Please acknowledge the portal privacy notice."};
  try {
    const client=await portalClient();
    const {error} = await client.auth.signUp({email,password,options:{data:{full_name:name,privacy_acknowledged_at:new Date().toISOString()},emailRedirectTo:portalOrigin()+"/portal/confirm"}});
    if (error) return {error:"Registration could not be completed. Please try again or contact the church."};
    return {success:"Check your inbox for a confirmation email. If you already have an account, sign in or reset your password."};
  } catch { return {error:"Unable to connect. Please try again shortly."}; }
}
export async function forgotPassword(_: FormState, form: FormData): Promise<FormState> {
  if (!portalConfigured()) return unavailable;
  const email=field(form,"email");
  if (!emailValid(email)) return {error:"Enter a valid email address."};
  try {
    const client=await portalClient();
    await client.auth.resetPasswordForEmail(email,{redirectTo:portalOrigin()+"/portal/confirm"});
  } catch { return {error:"Unable to connect. Please try again shortly."}; }
  return {success:"If an account exists for this address, you will receive a password reset email."};
}
export async function resetPassword(_: FormState, form: FormData): Promise<FormState> {
  if (!portalConfigured()) return unavailable;
  const password=String(form.get("password") || "");
  if(password.length<12 || password.length>128) return {error:"Use a password between 12 and 128 characters."};
  if(password!==String(form.get("confirmPassword") || "")) return {error:"The passwords do not match."};
  try {
    const client=await portalClient();
    const {data:{user}}=await client.auth.getUser();
    if(!user) return {error:"Your reset link has expired. Please request a new one."};
    const {error}=await client.auth.updateUser({password});
    if(error) return {error:"Unable to change your password. Request a new reset link and try again."};
    await client.auth.signOut();
  } catch { return {error:"Unable to connect. Please try again shortly."}; }
  redirect("/portal/login?reset=success");
}
export async function saveProfile(_: FormState, form: FormData): Promise<FormState> {
  if (!portalConfigured()) return unavailable;
  const name=field(form,"name"), phone=field(form,"phone"), city=field(form,"city");
  const interests=form.getAll("interests").map(String);
  if(!name || name.length>100 || phone.length>30 || city.length>100 || interests.some(i=>!ministryOptions.some(m=>m===i))) return {error:"Please check your profile details."};
  try {
    const client=await portalClient();
    const {data:{user}}=await client.auth.getUser();
    if(!user) return {error:"Please sign in again to save your profile."};
    const {error}=await client.from("portal_profiles").update({full_name:name,phone,city,interests,updated_at:new Date().toISOString()}).eq("id",user.id);
    if(error) return {error:"Your profile could not be saved. Please try again."};
    revalidatePath("/portal/dashboard");
    return {success:"Your profile has been saved."};
  } catch { return {error:"Unable to connect. Please try again shortly."}; }
}
export async function toggleRegistration(_: FormState, form: FormData): Promise<FormState> {
  if (!portalConfigured()) return unavailable;
  const gathering=field(form,"gathering"), cancel=form.get("cancel")==="true";
  if(!gatherings.some(g=>g.id===gathering)) return {error:"This gathering is not available."};
  try {
    const client=await portalClient();
    const {data:{user}}=await client.auth.getUser();
    if(!user) return {error:"Please sign in again."};
    const {error}=cancel
      ? await client.from("portal_registrations").delete().eq("user_id",user.id).eq("gathering_id",gathering)
      : await client.from("portal_registrations").upsert({user_id:user.id,gathering_id:gathering},{onConflict:"user_id,gathering_id"});
    if(error) return {error:"Unable to update your registration. Please try again."};
    revalidatePath("/portal/dashboard");
    return {success:cancel?"Your registration has been cancelled.":"Your interest has been saved. For home cells, contact the church to arrange your first visit."};
  } catch { return {error:"Unable to connect. Please try again shortly."}; }
}
export async function signOut() {
  if(portalConfigured()) { const client=await portalClient(); await client.auth.signOut(); }
  redirect("/portal/login");
}
