import Link from "next/link";
import { Shell } from "../components/SiteChrome";
import { AuthForm } from "./PortalForms";
import { portalConfigured } from "../../lib/portal/server";
export function AuthPage({mode,title,text,notice}:{mode:"login"|"register"|"forgot"|"reset";title:string;text:string;notice?:string}) {
 return <Shell><div className="portalAuth"><aside className="portalAuthStory"><p className="eyebrow pale">GTP Eindhoven · Member portal</p><h2>A place to belong.<br/><i>A family to grow with.</i></h2><p>Stay connected to your church family throughout the week.</p><Link href="/portal">Discover the portal</Link></aside><section className="portalAuthCard"><p className="eyebrow">Your church. Your community.</p><h1>{title}</h1><p>{text}</p>{notice&&<p className="portalNotice" role="status">{notice}</p>}<AuthForm mode={mode} configured={portalConfigured()}/></section></div></Shell>;
}
