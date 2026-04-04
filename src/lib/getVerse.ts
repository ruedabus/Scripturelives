import kjv from "@/data/bibles/normalized/kjv.json";
import web from "@/data/bibles/normalized/web.json";
import asv from "@/data/bibles/normalized/asv.json";

export type BibleVersion = "KJV" | "WEB" | "ASV";

export type BibleVerse = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
};

export function loadBible(version: BibleVersion): BibleVerse[] {
  switch (version) {
    case "WEB":
      return web;
    case "ASV":
      return asv;
    case "KJV":
    default:
      return kjv;
  }
}