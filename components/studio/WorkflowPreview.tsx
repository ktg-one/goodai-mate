"use client";
import { useState } from "react";
import { ArrowRight, Check, Mail, CalendarDays, ListChecks, RotateCcw } from "lucide-react";
const scenarios = {
  enquiry: { title: "A new enquiry comes in", body: "A customer asks about availability.", items: ["Enquiry captured", "Availability checked", "Reply ready for your review"] },
  followup: { title: "A quote needs a follow-up", body: "A quote is waiting for a reply.", items: ["Quote status checked", "Reminder prepared", "Follow-up ready for your review"] },
  booking: { title: "A booking needs a home", body: "A customer requests an appointment.", items: ["Booking details captured", "Calendar checked", "Confirmation ready for your review"] },
};
export function WorkflowPreview() {
  const [scenario, setScenario] = useState<keyof typeof scenarios>("enquiry");
  const [complete, setComplete] = useState(false);
  const selected = scenarios[scenario];
  return <div className="workflow-preview"><div className="workflow-heading"><span className="workflow-brand">Good’Ai at work</span><span className="example-label">Illustrative demo</span></div><div className="scenario-switch" role="group" aria-label="Choose an example workflow">{([['enquiry','New enquiry'],['followup','Quote follow-up'],['booking','Booking']] as const).map(([id,label])=><button type="button" key={id} aria-pressed={scenario === id} onClick={()=>{setScenario(id);setComplete(false)}}>{label}</button>)}</div><div className="workflow-title"><Mail size={25}/><div><h3>{selected.title}</h3><p>{selected.body}</p></div></div><ol className={`workflow-stages ${complete ? "is-complete" : ""}`} aria-label="Example workflow steps">{selected.items.map((item,i)=><li key={item}><span className="stage-icon">{complete ? <Check size={18}/> : i === 1 ? <CalendarDays size={18}/> : <ListChecks size={18}/>}</span><span>{item}</span><span className="stage-status">{complete ? "Done" : "Ready"}</span></li>)}</ol><div className="workflow-bottom"><p role="status">{complete ? "Example complete. You stay in control." : "Nothing sent. No tools connected."}</p><button type="button" className="demo-run" onClick={()=>setComplete(!complete)}>{complete ? "Reset" : "Run example"}{complete ? <RotateCcw size={16}/> : <ArrowRight size={17}/>}</button></div></div>;
}
