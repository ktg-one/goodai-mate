import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowUpRight, Plus, Check, Asterisk } from "lucide-react";
import { SURVEY_URL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";
import { Hero } from "@/components/sections/Hero";
import { ServicesList } from "@/components/sections/ServicesList";
import { ApproachSteps } from "@/components/sections/ApproachSteps";

// Dynamic imports for GSAP-heavy components
// Note: These are client-only components, so they'll only load on the client
const ScrollStory = dynamic(() => import("@/components/studio/ScrollStory").then((m) => m.ScrollStory));
const PerthSketchbook = dynamic(() => import("@/components/studio/PerthSketchbook").then((m) => m.PerthSketchbook));

export default function Home() {
  return <div className="home-page">
    <PerthSketchbook />
    <Hero />
    <div className="promise-strip"><div className="shell"><span>Less chasing.</span><Asterisk className="small-spark" aria-hidden="true"/><span>Less copying.</span><Asterisk className="small-spark" aria-hidden="true"/><span>More getting on with it.</span></div></div>
    <ScrollStory />
    <ServicesList />
    <ApproachSteps />
    <section className="faq shell" id="faq"><h2>A few<br /><em>fair questions.</em></h2><div>{[{q:"Do we need to replace our current tools?",a:"Usually, no. We start with what already works and connect or replace only what is causing the problem. The right solution may be a simple workflow change rather than more software."},{q:"What happens when the AI gets it wrong?",a:"We define when a person needs to review, approve or take over. We test the likely failure cases and make those boundaries part of the system, rather than treating AI as infallible."},{q:"Where should we start?",a:"Tell us about one task that gets copied, chased or done twice. If it needs a closer look, we start with a consult: one session, a written plan, the first thing worth fixing."},{q:"Can you help after the build?",a:"Yes. We can stay on after the build to keep the system running and fix what breaks. Talk to us about what that looks like."}].map(item=><details key={item.q}><summary>{item.q}<Plus size={20} /></summary><p>{item.a}</p></details>)}</div></section>
    <section className="contact-section" id="contact">
      <Image src="/images/drawings/branch.svg" alt="" width={300} height={910} className="contact-branch h-auto" unoptimized aria-hidden="true" />
      <div className="shell contact-inner"><div><h2>Admin doing your head in?<br /><em>Handball it.</em></h2><p>Tell us what gets copied, chased, or done twice, and where to send the fix.</p><a href={PHONE_HREF} className="text-link"><span>Prefer to call? </span><strong>{PHONE_DISPLAY}</strong></a></div><Link href={SURVEY_URL} className="contact-link" aria-label="Open the intake form"><ArrowUpRight /><span>Open the form.</span></Link></div>
    </section>
  </div>;
}
