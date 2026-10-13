import Link from "next/link";
import { redirect } from "next/navigation";
import { Shell } from "../../components/SiteChrome";
import { portalClient,portalConfigured } from "../../../lib/portal/server";
import { gatherings } from "../../../lib/portal/gatherings";
import { ProfileForm,GatheringForm,type Profile } from "../PortalForms";
import { signOut } from "../actions";
export const dynamic="force-dynamic";
export default async function Dashboard() {
 if(!portalConfigured()) redirect("/portal/login");
 const client=await portalClient();
 const {data:{user}}=await client.auth.getUser();
 if(!user) redirect("/portal/login");
 const [{data:profile,error:profileError},{data:registrations,error:registrationError}]=await Promise.all([
  client.from("portal_profiles").select("full_name,phone,city,interests").eq("id",user.id).single(),
  client.from("portal_registrations").select("gathering_id").eq("user_id",user.id),
 ]);
 const registered=new Set((registrations||[]).map(r=>r.gathering_id));
 const name=profile?.full_name||user.user_metadata.full_name||"friend";
 return <Shell><div className="portalDashboard"><div className="portalDashboardHead"><div><p className="eyebrow">Your GTP community</p><h1>Welcome, {name.split(" ")[0]}.</h1><p>Connect, belong and grow with your church family.</p></div><form action={signOut}><button className="portalButton secondary">Sign out</button></form></div>
 {(profileError||registrationError)&&<p className="portalNotice error" role="alert">We could not load your account details. Please refresh or contact the church.</p>}
 <div className="portalDashboardGrid"><div><section className="portalPanel"><div className="portalPanelHeading"><p className="eyebrow">Come together</p><h2>Find your gathering.</h2><p>Register your interest in a regular gathering. Your choices are saved in your account.</p></div><div className="portalGatherings">{gatherings.map(g=><article key={g.id}><div className="portalGatheringTop"><span>{g.day}</span><strong>{g.time}</strong></div><h3>{g.title}</h3><p className="portalLocation">{g.location}</p><p>{g.description}</p>{registered.has(g.id)&&<p className="portalBadge">Interest registered</p>}<GatheringForm id={g.id} registered={registered.has(g.id)}/></article>)}</div></section>
 <section className="portalQuickLinks"><Link href="/prayer-request"><h3>How can we pray for you?</h3><p>Share a request with the church.</p></Link><Link href="/events"><h3>Church calendar</h3><p>Explore services and church programmes.</p></Link><Link href="/contact"><h3>Talk to the team</h3><p>Ask about a home cell or serving at GTP.</p></Link></section></div>
 <aside className="portalPanel portalProfile"><p className="eyebrow">Make yourself at home</p><h2>Your profile.</h2><p>Keep your details up to date.</p>{profile?<ProfileForm profile={profile as Profile} email={user.email||""}/>:<p>Please contact the church if your profile is unavailable.</p>}<Link className="portalFine" href="/portal/privacy">How we use your details</Link></aside></div></div></Shell>;
}
