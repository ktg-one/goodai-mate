import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { getServiceBySlug, services } from "@/lib/services";
import { SURVEY_URL } from "@/lib/links";
import { ogDefaults, twitterDefaults } from "@/lib/seo";

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  const path = service ? `/services/${service.slug}` : "/services";
  const title = service?.name ?? "Service not found";
  const description = service?.description;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...ogDefaults,
      title,
      description,
      url: path,
    },
    twitter: {
      ...twitterDefaults,
      title,
      description,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <article className="detail-page shell">
      <Link href="/#services" className="back-link">
        <ArrowLeft size={17} />
        All services
      </Link>
      <div className="detail-grid">
        <div>
          <h1>
            {service.name}
            <span className="brand-period">.</span>
          </h1>
          <p className="detail-lead">{service.line}</p>
          <p className="detail-body">{service.description}</p>
          <p className="detail-body">{service.detail}</p>
          <div className="detail-inclusions">
            <h2>What we can help with.</h2>
            <ul>
              {service.items.map((item) => (
                <li key={item}>
                  <Check size={20} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="detail-aside">
          <h2>Scoped to your business.</h2>
          <p>We quote after we understand the work. No public price list.</p>
          <Link href={SURVEY_URL} className="button">
            Tell us what you need <ArrowUpRight size={20} />
          </Link>
          <p>
            Start with our short business enquiry form. We’ll use what you share
            to understand the problem and the right next step.
          </p>
          {service.slug === "voice-agents" && (
            <Link href="/demo#voice" className="text-link">
              Explore the voice demo <ArrowUpRight size={17} />
            </Link>
          )}
        </aside>
      </div>
      <div className="price-detail">
        <h2>A clear scope. An agreed plan.</h2>
        <p>
          Inclusions, hand-off rules and any third-party costs are agreed in
          writing before work starts.
        </p>
        <p>
          Third-party subscriptions, usage and ongoing support are discussed
          before you commit.
        </p>
      </div>
    </article>
  );
}
