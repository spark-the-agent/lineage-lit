import type { Metadata } from "next";
import InsightsContent from "./InsightsContent";

export const metadata: Metadata = {
  title: "Network Insights - Lineage Lit",
  description:
    "Deep network intelligence: influence rankings, literary clusters, bridge creators, and graph analysis.",
};

export default function InsightsPage() {
  return <InsightsContent />;
}
