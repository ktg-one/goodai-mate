import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Plus, Check, Headphones, Workflow, MessagesSquare, Network, ScanSearch, Asterisk } from "lucide-react";
import { SURVEY_URL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";
import { services } from "@/lib/services";
import { WorkflowPreview } from "@/components/studio/WorkflowPreview";
import { ScrollStory } from "@/components/studio/ScrollStory";
import { PerthSketchbook } from "@/components/studio/PerthSketchbook";
import { Hero } from "@/components/sections/Hero";

const serviceIcons = [Headphones, Workflow, MessagesSquare, Network, ScanSearch];

export default function Home() {
  return <div className="home-page">
    <PerthSketchbook />
    <Hero />
    <div className="promise-strip"><div className="shell"><span>Less chasing.</span><Asterisk className="small-spark" aria-hidden="true"/><span>Less copying.</span><Asterisk className="small-spark" aria-hidden="true"/><span>More getting on with it.</span></div></div>
    <section className="empathy shell" id="been-tough">
      <Image src="/assets/branch.svg" alt="" width={280} height={850} className="empathy-branch" unoptimized aria-hidden="true" />
      <div className="section-heading"><h2>It’s been a lot,<br /><span className="pen-stroke"><em>hasn’t it?</em></span></h2><p>The quotes you chase. The details you type twice.<br />The phone you answer after hours.</p></div>
      <div className="empathy-beats">
        <article>
          <div className="beat-illustration">
            <Image src="/assets/busy-desk.svg" alt="" width={140} height={110} unoptimized aria-hidden="true" />
          </div>
          <h3>The follow-up that became yours</h3>
          <p>We send the quote chasers and the reminders so it isn’t you at 8pm.</p>
        </article>
        <article>
          <div className="beat-illustration">
            <Image src="/assets/connected-work.svg" alt="" width={140} height={110} unoptimized aria-hidden="true" />
          </div>
          <h3>The details copied twice</h3>
          <p>We connect the tools you already use so a job is typed once.</p>
        </article>
        <article>
          <div className="beat-illustration">
            <Image src="/assets/knock-off-early.svg" alt="" width={140} height={110} unoptimized aria-hidden="true" />
          </div>
          <h3>The day that never ends</h3>
          <p>A voice agent answers the phone while you’re on the tools.</p>
        </article>
      </div>
      <p className="handwritten empathy-note">You’ve carried it long enough.</p>
    </section>
    <ScrollStory />
    <section className="services-section shell" id="services"><div className="section-heading"><h2>A little less on<br /><em>your plate.</em></h2><p>Workflows take the admin off your hands. A voice agent answers the calls. A consult finds the first thing worth fixing. Integrations make the systems talk.</p></div><div className="service-list">{services.map((service, index) => {const Icon = serviceIcons[index];return <Link href={`/services/${service.slug}`} className="service-row" key={service.slug}><div className="service-symbol" aria-hidden="true"><Icon strokeWidth={1.25}/></div><div className="service-name"><h3>{service.name}</h3><p>{service.line}</p></div><div className="service-price"><strong>Talk to us</strong></div><span className="service-arrow"><ArrowUpRight size={25} /></span></Link>})}</div><p className="pricing-note" id="pricing">Scope is agreed before we build. <Link href={SURVEY_URL}>Talk to us <ArrowUpRight size={14} /></Link></p></section>
    <section className="demo-section" id="demo">
      <Image src="/assets/arch.svg" alt="" width={320} height={395} className="demo-arch" unoptimized aria-hidden="true" />
      <div className="shell demo-grid"><div className="demo-copy"><h2>A good system<br />knows what<br /><em>happens next.</em></h2><p>An enquiry comes in. We turn it into a job card, chase the quote, remind them they’re booked. Your team sees what happens next.</p><Link href="/demo" className="text-link">Explore the workflow demo <ArrowUpRight size={18} /></Link></div><WorkflowPreview /></div>
    </section>
    <section className="approach shell" id="approach">
      <Image src="/assets/mandala-green.svg" alt="" width={440} height={440} className="approach-mandala" unoptimized aria-hidden="true" />
      <div className="section-heading"><h2>Good people.<br /><em>Useful technology.</em></h2><p>Workflows, a voice agent, a consult, or an integration.<br />You get a system that makes sense.</p></div><div className="approach-steps" id="story">{[{n:"01",title:"Find the friction.",text:"We start with your day, your tools and the work that keeps getting in the way. Then we pick a useful place to start."},{n:"02",title:"Make it work.",text:"We agree the scope, build the workflow and test the awkward bits with the people who will actually use it."},{n:"03",title:"Make it yours.",text:"Clear documentation. A team walkthrough. Human hand-off when it matters. Ongoing support if you need it."}].map(step=><article key={step.n}><span className="step-number">{step.n}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div><div className="principle-note"><Check size={20} /><p>Your tools where possible. Your people in control. No mystery box.</p></div>
    </section>
    <section className="faq shell" id="faq"><h2>A few<br /><em>fair questions.</em></h2><div>{[{q:"Do we need to replace our current tools?",a:"Usually, no. We start with what already works and connect or replace only what is causing the problem. The right solution may be a simple workflow change rather than more software."},{q:"What happens when the AI gets it wrong?",a:"We define when a person needs to review, approve or take over. We test the likely failure cases and make those boundaries part of the system, rather than treating AI as infallible."},{q:"Where should we start?",a:"Tell us about one task that gets copied, chased or done twice. If it needs a closer look, we start with a consult: one session, a written plan, the first thing worth fixing."},{q:"Can you help after the build?",a:"Yes. We can stay on after the build to keep the system running and fix what breaks. Talk to us about what that looks like."}].map(item=><details key={item.q}><summary>{item.q}<Plus size={20} /></summary><p>{item.a}</p></details>)}</div></section>
    <section className="contact-section" id="contact">
      <Image src="/assets/branch.svg" alt="" width={300} height={910} className="contact-branch" unoptimized aria-hidden="true" />
      <div className="shell contact-inner"><div><h2>Not sure where it’s stuck?<br /><em>Start with the form.</em></h2><p>Tell us what gets copied, chased, or done twice. We’ll work out the bottleneck before we talk tools.</p><a href={PHONE_HREF} className="contact-phone"><span>Call our AI agent</span><strong>{PHONE_DISPLAY}</strong></a></div><Link href={SURVEY_URL} className="contact-link" aria-label="Open the intake form"><ArrowUpRight /><span>Open the form.</span></Link></div>
    </section>
  </div>;
}
