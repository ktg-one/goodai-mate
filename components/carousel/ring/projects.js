// Ring order is the public GoodAI service narrative. Each image is a
// source-faithful Figma export owned by this project; the unlicensed sample
// artwork from the upstream demo is intentionally not vendored.
export const PROJECTS = [
  {
    file: "assets/carousel/ai-operations.svg",
    name: "Operations Sprint",
    type: "Operational redesign",
    year: "Good'ai",
  },
  {
    file: "assets/carousel/workflow-redesign.svg",
    name: "Workflow Redesign",
    type: "Systems mapping",
    year: "Good'ai",
  },
  {
    file: "n8n.png",
    name: "Business Automation",
    type: "n8n + Workspace",
    year: "Good'ai",
  },
  {
    file: "Wispr_Flow_77LkjL340d.png",
    name: "System Integration",
    type: "Proof it saves time",
    year: "Good'ai",
  },
  {
    file: "assets/carousel/ai-governance.svg",
    name: "Practical Governance",
    type: "Practical controls",
    year: "Good'ai",
  },
  {
    file: "voice-agent.png",
    name: "Voice Agents",
    type: "When voice fits",
    year: "Good'ai",
  },
];

export const IMAGE_FILES = PROJECTS.map((project) => project.file);
