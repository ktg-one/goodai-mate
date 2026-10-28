// Document header shared by /privacy and /terms.
export function PolicyMeta({
  identifier,
  effectiveDate,
  contactLabel,
  email,
  emailHref,
}: {
  identifier: string;
  effectiveDate: string;
  contactLabel: string;
  email: string;
  emailHref: string;
}) {
  return (
    <div className="text-sm opacity-80 space-y-1 mb-6">
      <p><strong>Identifier:</strong> {identifier}</p>
      <p><strong>Effective Date:</strong> {effectiveDate}</p>
      <p><strong>Website:</strong> <a href="https://goodai.au" target="_blank" rel="noopener noreferrer">https://goodai.au</a> (&quot;Site&quot;)</p>
      <p><strong>Operator:</strong> Good AI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)</p>
      <p><strong>Location:</strong> Perth, Western Australia</p>
      <p><strong>{contactLabel}</strong> <a href={emailHref}>{email}</a></p>
    </div>
  );
}
