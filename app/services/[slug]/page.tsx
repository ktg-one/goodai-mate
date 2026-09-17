import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { services, getServiceBySlug } from "@/lib/services";
import { SURVEY_URL } from "@/lib/links";
export function generateStaticParams() { return services.map(({slug})=>({slug})); }
export async function generateMetadata({params}: {params:Promise<{slug:string}>}) { const {slug}=await params; const service=getServiceBySlug(slug); return {title:service?.name ?? "Service not found", description:service?.description}; }
export default async function ServicePage({params}: {params:Promise<{slug:string}>}) {
 const {slug}=await params;const service=getServiceBySlug(slug);if(!service)notFound();
 return <article className="detail-page shell"><Link href="/#services" className="back-link"><ArrowLeft size={17}/>All services</Link><div className="detail-grid"><div><h1>{service.name}<span className="brand-period">.</span></h1><p className="detail-lead">{service.line}</p><p className="detail-body">{service.description}</p><p className="detail-body">{service.detail}</p><div className="detail-inclusions"><h2>What we can help with.</h2><ul>{service.items.map(item=><li key={item}><Check size={20}/>{item}</li>)}</ul></div></div><aside className="detail-aside"><h2>{service.price}</h2><p>{service.priceNote}</p><a href={SURVEY_URL} className="button">Tell us what you need <ArrowUpRight size={20}/></a><p>Start with our short business enquiry form. We’ll use what you share to understand the problem and the right next step.</p>{service.slug==="voice-agents" && <Link href="/demo#voice" className="text-link">Explore the voice demo <ArrowUpRight size={17}/></Link>}</aside></div><div className="price-detail"><h2>A clear scope. An agreed price.</h2><p>{service.range}</p><p>All amounts are in AUD. Third-party subscriptions, usage and ongoing support are discussed before you commit.</p></div></article>;
}
