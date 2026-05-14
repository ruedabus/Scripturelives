import type { Metadata } from "next";
import BibleReader from "@/components/BibleReader";

export const metadata: Metadata = {
  title: "Bible Reader | Scripture Lives",
  description:
    "Read the Bible in multiple translations, explore verse-by-verse commentary, Strong's concordance, cross-references, and more — free.",
};

export default function BiblePage() {
  return <BibleReader />;
}
