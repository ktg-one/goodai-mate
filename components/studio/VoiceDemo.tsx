"use client";
import { useState } from "react";
import Script from "next/script";
import { ArrowUpRight } from "lucide-react";
import { SURVEY_URL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";
import { BrandedVoiceWidget } from "./BrandedVoiceWidget";
export function VoiceDemo() {
 const [enabled,setEnabled]=useState(false);const [failed,setFailed]=useState(false);const [ready,setReady]=useState(false);
 return <section className="voice-panel" id="voice" aria-labelledby="voice-title"><div><span className="handwritten voice-aside">Give it a ring.</span><h2 id="voice-title">A conversation is worth<br /><em>a thousand buzzwords.</em></h2><p>Meet the Good’Ai voice agent. Try a conversation and get a feel for what an AI assistant could bring to your business.</p><p className="voice-disclosure">Powered by ElevenLabs. Audio and anything you share are processed by that service. Use example details. You choose when to start the call.</p></div><div className="voice-actions"><a className="voice-phone" href={PHONE_HREF}><span>Call our AI voice agent</span><strong>{PHONE_DISPLAY}</strong><span>Or try it in your browser below.</span></a>{!enabled ? <button type="button" className="button" onClick={()=>setEnabled(true)}>Try the voice agent <ArrowUpRight size={17}/></button> : <><Script src="https://elevenlabs.io/convai-widget/index.js" strategy="afterInteractive" onReady={()=>setReady(true)} onError={()=>setFailed(true)}/><p role="status">{failed ? "The voice service couldn’t load. Reload this page to try again, or tell us what you need using the enquiry form." : ready ? "The voice widget is ready in the corner of this page. Choose Start a call when you’re ready." : "Loading the voice service…"}</p>{ready && !failed && <BrandedVoiceWidget />}</>}<a href={SURVEY_URL} target="_blank" rel="noopener noreferrer" className="text-link">Want one for your business? <ArrowUpRight size={17}/></a></div></section>;
}
