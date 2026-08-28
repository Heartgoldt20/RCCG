"use client";

import { FormEvent, useMemo, useState } from "react";

const churchEmail = "gtpeindhoven@rccgeurope.org";

export default function PrayerForm() {
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const message = useMemo(() => `Name: ${name.trim() || "Prefer not to say"}\n\nPrayer request:\n${request.trim()}`, [name, request]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = name.trim() ? `Prayer request from ${name.trim()}` : "Prayer request";
    window.location.href = `mailto:${churchEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    setOpened(true);
    setCopied(false);
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return <form className="prayerForm" onSubmit={submit}>
    <label>Your name <span>(optional)</span><input value={name} onChange={event => setName(event.target.value)} autoComplete="name" placeholder="Your name"/></label>
    <label>Prayer request<textarea value={request} onChange={event => setRequest(event.target.value)} rows={7} placeholder="Tell us how we can pray..." required/></label>
    <div className="prayerPrivacy"><span aria-hidden="true">✦</span><p>Your prayer request stays on your device until you send it from your own email app. Nothing is stored on this website.</p></div>
    <button className="btn dark" type="submit">Open email to send</button>
    {opened && <div className="formStatus" role="status"><p>If no email app opened, copy the prayer request and email it to <a href={`mailto:${churchEmail}`}>{churchEmail}</a>.</p><button className="btn dark" type="button" onClick={copyMessage}>{copied ? "Prayer request copied" : "Copy prayer request"}</button></div>}
  </form>;
}
