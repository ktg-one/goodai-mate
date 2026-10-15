import { notFound } from "next/navigation";

export const metadata = {
  title: "Voice + automation demo",
  description: "Call the voice agent and watch the automation that follows.",
};

export default function DemoPage() {
  notFound();
}
