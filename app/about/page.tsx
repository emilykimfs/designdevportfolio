import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PlaceholderPage activeTab="About" title="About">
      <p>About page coming soon.</p>
    </PlaceholderPage>
  );
}
