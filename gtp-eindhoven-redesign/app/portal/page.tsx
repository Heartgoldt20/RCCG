import Link from "next/link";
import { Shell } from "../components/SiteChrome";
export default function Portal() {
 return <Shell><section className="portalHero"><div><p className="eyebrow pale">GTP Eindhoven · Member portal</p><h1>Church is more<br/>than <i>Sunday.</i></h1><p>A space to connect, find your community and take your next step with GTP Eindhoven.</p><div className="portalActions"><Link className="portalButton gold" href="/portal/register">Create an account</Link><Link className="portalButton light" href="/portal/login">Sign in</Link></div><span className="portalHeroNote">New to GTP? You are welcome here.</span></div></section>
 <section className="portalOverview"><div className="portalSectionHeading"><p className="eyebrow">Connect · Belong · Learn · Grow</p><h2>Your church family,<br/>throughout the week.</h2></div><div className="portalFeatureGrid">{[
 ["01","Make yourself at home","Create your profile and share the ministries you would like to get involved in."],
 ["02","Find your community","Explore our regular gatherings and register your interest in a home cell near you."],
 ["03","Stay connected","Keep church information, prayer requests and your registrations within easy reach."],
 ].map(([n,title,text])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="portalWelcome"><div><h3>Your first Sunday?</h3><p>You do not need an account or a registration to attend. Join us on Sunday at 11:00 AM.</p></div><Link className="portalButton secondary" href="/contact">Plan your visit</Link></div></section></Shell>;
}
