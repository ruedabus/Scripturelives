import type { Metadata } from "next";
import BibleReader from "@/components/BibleReader";

export const metadata: Metadata = {
  title: "Bible Reader | Scripture Lives",
  description:
    "Read the Bible in multiple translations, explore verse-by-verse commentary, Strong's concordance, cross-references, and more — free.",
};

const VALID_TABS = ["home", "bible", "reader", "parallel", "bookmarks", "sessions", "quiz", "atlas", "map", "timeline", "lexicon", "commentary"] as const;
type ValidTab = typeof VALID_TABS[number];

export default async function BiblePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab = VALID_TABS.includes(tab as ValidTab) ? (tab as ValidTab) : undefined;
  return <BibleReader initialTab={initialTab} />;
}
