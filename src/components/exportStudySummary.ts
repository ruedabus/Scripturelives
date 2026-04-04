import type { VersePlace } from "@/data/verses";

type ExportPlace = {
  name: string;
  place: VersePlace;
  sourceReference: string;
  note: string;
};

export default function exportStudySummary(places: ExportPlace[]) {
  const lines: string[] = [];

  lines.push("Scripture Lives - Study Summary");
  lines.push(`Exported: ${new Date().toLocaleString()}`);
  lines.push("");

  if (places.length === 0) {
    lines.push("No bookmarked places found.");
  } else {
    places.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.name}`);
      lines.push(`Era: ${item.place.era}`);
      lines.push(`Source Verse: ${item.sourceReference}`);
      lines.push(`Summary: ${item.place.description}`);
      lines.push(`Biblical Significance: ${item.place.biblicalSignificance}`);
      lines.push(`Note: ${item.note || "No note saved."}`);
      lines.push("");
    });
  }

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "scripture-lives-study-summary.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}