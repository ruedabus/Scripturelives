import { loadBible, BibleVersion } from "./loadBibleVersion";

export function getChapter(
  version: BibleVersion,
  book: string,
  chapter: number
) {
  const bible = loadBible(version);

  return bible.filter(
    (v) =>
      v.book === book &&
      v.chapter === chapter
  );
}