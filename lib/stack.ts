// What's under the hood, shown on /admin-engine under the machine. The machine
// (public/machine/goodai-machine.html) is the source: every label here is copied word for word
// from its lab.label() calls and film beats, and lib/stack.test.ts fails if the two drift.

/** The machine's mode buttons, as it reports them in goodai-machine:state. */
export type StackLayer = "labels" | "explode" | "cut" | "xray" | "slow";
export const STACK_LAYERS: readonly StackLayer[] = ["labels", "explode", "cut", "xray", "slow"];

/** The machine's three label sets. */
export type LabelLayer = "services" | "stack" | "ethics";

export type StackLogoId = "elevenlabs" | "openai" | "gemini" | "xai" | "n8n" | "googlecloud";

export type MachineLabel = {
  tag: string;
  title: string;
  detail: string;
  href?: string;
  logos?: readonly StackLogoId[];
};

/** Same rule as the machine: Explode beats Cut away/X-ray, which beat Labels. */
export function shownLayer(on: Record<StackLayer, boolean>): LabelLayer | null {
  if (on.explode) return "ethics";
  if (on.cut || on.xray) return "stack";
  return on.labels ? "services" : null;
}

/** The page's layer buttons: the machine button that opens each label set. */
export const LAYER_BUTTONS: readonly { layer: StackLayer; shows: LabelLayer; label: string }[] = [
  { layer: "labels", shows: "services", label: "Labels" },
  { layer: "cut", shows: "stack", label: "Cut away" },
  { layer: "explode", shows: "ethics", label: "Explode" },
];

/** Headings: the machine's film beats 02, 04 and 05. */
export const LAYER_COPY: Record<LabelLayer, { title: string; body: string }> = {
  services: { title: "How a job moves through.", body: "Voice, automation, assistants, and integrations." },
  stack: { title: "Underlying architecture.", body: "OpenAI, Gemini, xAI, ElevenLabs, n8n & Google Cloud." },
  ethics: { title: "Our ethics & policy.", body: "Human holds the off-switch · grounded · no mystery box." },
};

export const MACHINE_LABELS: Record<LabelLayer, readonly MachineLabel[]> = {
  services: [
    { tag: "Incoming call", title: "Voice agents", detail: "Answers calls when hands are full", href: "/services/voice-agents" },
    { tag: "Workflow", title: "Business automation", detail: "Writes up & routes the job card", href: "/services/business-automation" },
    { tag: "Your docs", title: "Custom assistants", detail: "Finds answers in your own manuals", href: "/services/custom-assistants" },
    { tag: "Sync", title: "Tool integrations", detail: "Connects the software you already use", href: "/services/ai-integration" },
    { tag: "You in control", title: "Human sign-off", detail: "Your team checks the till at the end" },
  ],
  stack: [
    { tag: "Voice", title: "ElevenLabs", detail: "", logos: ["elevenlabs"] },
    { tag: "Models", title: "OpenAI · Gemini · xAI", detail: "", logos: ["openai", "gemini", "xai"] },
    { tag: "Automation", title: "n8n", detail: "", logos: ["n8n"] },
    { tag: "Cloud", title: "Google Cloud", detail: "", logos: ["googlecloud"] },
  ],
  ethics: [
    { tag: "Stop authority", title: "Human holds the off-switch", detail: "Named person in control · 30-sec stop" },
    { tag: "Honesty", title: "Grounded, never fabricated", detail: "Cites your own uploaded docs · no guessing" },
    { tag: "Ownership", title: "No mystery box", detail: "Built in your accounts with plain handover" },
    { tag: "Privacy", title: "Traffic-light data privacy", detail: "Your business data never trains public models" },
  ],
};

export const STACK_FOOTNOTE =
  "Names belong to their owners and are shown to say what we build with. Good’Ai is not affiliated with or endorsed by them.";
