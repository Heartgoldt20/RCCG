"use client";
import { useActionState } from "react";
import Link from "next/link";
import { login,register,forgotPassword,resetPassword,saveProfile,toggleRegistration,type FormState } from "./actions";
import { ministryOptions } from "../../lib/portal/gatherings";
function Notice({state}:{state:FormState}) {return <>{state.error&&<p className="portalNotice error" role="alert">{state.error}</p>}{state.success&&<p className="portalNotice" role="status">{state.success}</p>}</>;}
export function AuthForm({mode,configured}:{mode:"login"|"register"|"forgot"|"reset";configured:boolean}) {
 const action={login,register,forgot:forgotPassword,reset:resetPassword}[mode];
 const [state,formAction,pending]=useActionState(action,{});
 return <form action={formAction} className="portalForm"><Notice state={state}/>
 {!configured&&<p className="portalNotice">Online accounts are coming soon. <Link href="/contact">Contact the church</Link> to connect in the meantime.</p>}
 <fieldset disabled={pending||!configured}>
 {mode==="register"&&<label>Full name<input name="name" autoComplete="name" maxLength={100} required/></label>}
 {mode!=="reset"&&<label>Email address<input name="email" type="email" autoComplete="email" maxLength={254} required/></label>}
 {mode!=="forgot"&&<label>{mode==="reset"?"New password":"Password"}<input name="password" type="password" autoComplete={mode==="login"?"current-password":"new-password"} minLength={mode==="login"?undefined:12} maxLength={128} required/>{mode!=="login"&&<small>At least 12 characters. Use a unique password.</small>}</label>}
 {(mode==="register"||mode==="reset")&&<label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/></label>}
 {mode==="register"&&<label className="portalCheck"><input type="checkbox" name="privacy" required/><span>I have read the <Link href="/portal/privacy">portal privacy notice</Link> and understand how my details are used.</span></label>}
 <button className="portalButton primary" type="submit">{pending?"Please wait…":{login:"Sign in",register:"Create account",forgot:"Send reset link",reset:"Save new password"}[mode]}</button>
 </fieldset>
 {mode==="login"&&<div className="portalFormLinks"><Link href="/portal/forgot-password">Forgot password?</Link><Link href="/portal/register">Create an account</Link></div>}
 {mode==="register"&&<p className="portalFine">Already part of the portal? <Link href="/portal/login">Sign in</Link></p>}
 {mode==="forgot"&&<Link className="portalFine" href="/portal/login">Back to sign in</Link>}
 </form>;
}
export type Profile = {full_name:string;phone:string|null;city:string|null;interests:string[]};
export function ProfileForm({profile,email}:{profile:Profile;email:string}) {
 const [state,action,pending]=useActionState(saveProfile,{});
 return <form className="portalForm" action={action}><Notice state={state}/><fieldset disabled={pending}>
 <label>Full name<input name="name" defaultValue={profile.full_name} autoComplete="name" maxLength={100} required/></label>
 <label>Email address<input value={email} readOnly/><small>Your sign-in email address.</small></label>
 <div className="portalFieldRow"><label>Phone <small>Optional</small><input name="phone" type="tel" autoComplete="tel" maxLength={30} defaultValue={profile.phone||""}/></label><label>City <small>Optional</small><input name="city" autoComplete="address-level2" maxLength={100} defaultValue={profile.city||""}/></label></div>
 <div className="portalInterests"><p>I would like to help with</p>{ministryOptions.map(m=><label className="portalCheck" key={m}><input type="checkbox" name="interests" value={m} defaultChecked={profile.interests.includes(m)}/><span>{m}</span></label>)}<small>These are your interests. Contact the church to discuss joining a team.</small></div>
 <button className="portalButton primary" type="submit">{pending?"Saving…":"Save profile"}</button></fieldset></form>;
}
export function GatheringForm({id,registered}:{id:string;registered:boolean}) {
 const [state,action,pending]=useActionState(toggleRegistration,{});
 return <form action={action}><input name="gathering" type="hidden" value={id}/><input name="cancel" type="hidden" value={String(registered)}/><button className={"portalButton "+(registered?"secondary":"primary")} disabled={pending}>{pending?"Updating…":registered?"Cancel registration":"Register interest"}</button><Notice state={state}/></form>;
}
