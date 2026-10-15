export function allowedAgentIds(): Set<string> {
  const ids = new Set<string>();
  const primary = process.env.NEXT_PUBLIC_TRILLET_AGENT_ID?.trim();
  if (primary) ids.add(primary);
  const extra = process.env.TRILLET_ALLOWED_AGENT_IDS?.split(",") ?? [];
  for (const id of extra) {
    const t = id.trim();
    if (t) ids.add(t);
  }
  return ids;
}

export function isAgentAllowed(requestedId: string): boolean {
  if (!requestedId) return false;
  const allow = allowedAgentIds();
  return allow.has(requestedId);
}
