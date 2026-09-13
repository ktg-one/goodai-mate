import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WorkflowPreview } from "@/components/studio/WorkflowPreview";
import { ProductDemo } from "@/components/sections/ProductDemo";
import { VoiceDemo } from "@/components/studio/VoiceDemo";
export const metadata={title:"See it in action"};
export default function DemoPage(){return <><div className="shell demo-page-header"><Link href="/" className="back-link"><ArrowLeft size={17}/>Back to Good’Ai</Link><h1>Less busywork.<br /><em>See how it feels.</em></h1><p>Choose a scenario and run the example. These are local demonstrations with sample data: they do not send messages, book appointments or connect to your systems.</p></div><div className="full-demo"><div className="shell"><h2 className="sr-only">Try an example workflow</h2><WorkflowPreview/><details className="legacy-demo"><summary>Explore the full operations dashboard</summary><p className="motion-note">Interactive example — all jobs, rules and results below are simulated.</p><ProductDemo/></details><VoiceDemo/></div></div></>}

