import { AuthPage } from "../AuthPage";
export const dynamic="force-dynamic";
export default async function Login({searchParams}:{searchParams:Promise<{reset?:string;error?:string}>}) {
 const q=await searchParams;
 return <AuthPage mode="login" title="Welcome back." text="Sign in to your GTP account." notice={q.reset==="success"?"Your password has been changed. Sign in with your new password.":q.error?"This confirmation link is invalid or has expired. Request a new link or contact the church.":undefined}/>;
}
