// What's under the hood, shown on /admin-engine. One file so the lineup is a one-edit fix.
// Claims policy: vendors are named as "built with" only. No version numbers, benchmarks,
// or compliance wording about Good'Ai; certifications appear only on the vendor that holds them (Trillet).
// Residency (Kev, 2026-10-31): the models run on GCP Sydney; voice vendors' data handling sits with the voice platform, so no Sydney claim on voices.

export type StackLayer = "labels" | "explode" | "cut" | "xray" | "slow";

export type Vendor = {
  name: string;
  href: string;
  /** Simple Icons (CC0) 24x24 path. Absent where no official mark is available: render the name as text. */
  icon?: string;
  note?: string;
};

export type StackArm = {
  station: string;
  name: string;
  href: string;
  detail: string;
};

export type StackPrinciple = {
  title: string;
  detail: string;
};

export const STACK_LAYERS: readonly StackLayer[] = ["labels", "explode", "cut", "xray", "slow"];

export const STACK_COPY: Record<StackLayer, { kicker: string; title: string; body: string; button: string }> = {
  labels: {
    kicker: "Labels",
    title: "The four arms & blueprint",
    body: "Each arm on the machine is one of our four build services, driven by the opportunity audit cam shaft underneath.",
    button: "Labels · Services",
  },
  explode: {
    kicker: "Explode",
    title: "Our ethics & guardrails",
    body: "How we keep people in charge: clear stop authority, no mystery boxes, grounded answers, and strict data boundaries.",
    button: "Explode · Ethics",
  },
  cut: {
    kicker: "Cut away",
    title: "Underlying architecture & brains",
    body: "Event-driven workflows with isolated permissions and human review gates, powered by flagship models.",
    button: "Cut away · Architecture",
  },
  xray: {
    kicker: "X-ray",
    title: "The voices",
    body: "Professional-grade voices, so callers hear a natural-sounding assistant rather than a robotic phone tree.",
    button: "X-ray · Voices",
  },
  slow: {
    kicker: "Slow",
    title: "Where it runs",
    body: "Everything runs on Google Cloud in Sydney, models included, paired with our dedicated WA automation engine.",
    button: "Slow · Where it runs",
  },
};

export const STACK_SERVICES = [
  "AI voice agents",
  "Business automation",
  "Custom AI assistants",
  "AI integration projects",
  "AI opportunity audit",
] as const;

export const STACK_ARMS: readonly StackArm[] = [
  {
    station: "Arm 01 · Hopper",
    name: "AI voice agents",
    href: "/services/voice-agents",
    detail: "Answers calls, books jobs, and takes clear messages when you are on the tools.",
  },
  {
    station: "Arm 02 · Press",
    name: "Business automation",
    href: "/services/business-automation",
    detail: "Routes enquiries, job cards, and follow-ups without manual copy-pasting.",
  },
  {
    station: "Arm 03 · Bell",
    name: "Custom AI assistants",
    href: "/services/custom-assistants",
    detail: "Finds answers across your own SOPs, notes, and past jobs in seconds.",
  },
  {
    station: "Arm 04 · Stamp",
    name: "AI integration projects",
    href: "/services/ai-integration",
    detail: "Connects Xero, ServiceM8, calendars, and CRMs so data enters once.",
  },
  {
    station: "Cam shaft · Blueprint",
    name: "AI opportunity audit",
    href: "/services/opportunity-audit",
    detail: "Starts with the problem first and maps where time is leaking before touching a tool.",
  },
];

export const STACK_ETHICS: readonly StackPrinciple[] = [
  {
    title: "Human in control",
    detail: "A named person on your team holds stop authority. The line never runs faster than your people can check.",
  },
  {
    title: "No mystery box",
    detail: "We build in your own accounts where possible and hand over plain-English runbooks so you are never locked in.",
  },
  {
    title: "Grounded, not guessed",
    detail: "Assistants cite your own documents and flag uncertainty to a human instead of inventing answers.",
  },
  {
    title: "Least data needed",
    detail: "Each step only sees the fields required for that job, and your business data is never sold or used to train public models.",
  },
];

export const STACK_ARCHITECTURE: readonly StackPrinciple[] = [
  {
    title: "Event-driven workflow harness",
    detail: "Each station is a small, testable step triggered by a real webhook or schedule rather than one fragile prompt.",
  },
  {
    title: "Scoped tool boundaries",
    detail: "Every arm holds narrow credentials for the single inbox, calendar, or ledger it updates.",
  },
  {
    title: "Human sign-off gates",
    detail: "Quotes, outbound messages, and edge cases pause at the till for a quick thumbs-up before anything leaves your business.",
  },
];

export const STACK_MODELS: readonly Vendor[] = [
  {
    name: "Liquid AI",
    href: "https://www.liquid.ai",
    note: "LFM3 Omni · Self-hosted voice & text",
  },
  {
    name: "Gemini",
    href: "https://gemini.google.com",
    note: "Google",
    icon: "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
  },
  { name: "Grok", href: "https://x.ai", note: "xAI" },
  { name: "ChatGPT", href: "https://chatgpt.com", note: "OpenAI" },
];

export const STACK_VOICES: readonly Vendor[] = [
  { name: "Trillet", href: "https://trillet.ai", note: "Voice platform · SOC 2 Type II, ISO 27001, HIPAA" },
  {
    name: "ElevenLabs",
    href: "https://elevenlabs.io",
    note: "Professional voices",
    icon: "M4.6035 0v24h4.9317V0zm9.8613 0v24h4.9317V0z",
  },
  { name: "Hume", href: "https://www.hume.ai", note: "Expressive voice" },
];

export const STACK_HOSTING: Vendor = {
  name: "Google Cloud",
  href: "https://cloud.google.com",
  note: "Sydney",
  icon: "M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 0 0 4.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.365 9.365 0 0 0-2.821-4.552l-.043.043.006-.05A9.344 9.344 0 0 0 12.19 2.38zm-.358 4.146c1.244-.04 2.518.368 3.486 1.15a5.186 5.186 0 0 1 1.862 4.078v.518c3.53-.07 3.53 5.262 0 5.193h-5.193l-.008.009v-.04H6.785a2.59 2.59 0 0 1-1.067-.23h.001a2.597 2.597 0 1 1 3.437-3.437l3.013-3.012A6.747 6.747 0 0 0 8.11 8.24c.018-.01.04-.026.054-.023a5.186 5.186 0 0 1 3.67-1.69z",
};

export const STACK_RUNTIME: readonly Vendor[] = [
  STACK_HOSTING,
  { name: "n8n", href: "https://n8n.io", note: "Workflow automation" },
  { name: "PostgreSQL", href: "https://www.postgresql.org", note: "Isolated state" },
];

export const STACK_FOOTNOTE =
  "Names and logos belong to their owners and are shown to say what we build with. Good’Ai is not affiliated with or endorsed by them.";
