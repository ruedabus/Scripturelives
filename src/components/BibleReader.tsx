"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { verses, Verse, VersePlace } from "@/data/verses";
import { journeys, Journey, ALL_JOURNEY_ERAS, JOURNEY_ERA_DOT, JOURNEY_ERA_BADGE, type JourneyEra } from "@/data/journeys";
import dynamic from "next/dynamic";
import SearchBar from "@/components/SearchBar";
import useBookmarks from "@/components/useBookmarks";
import usePlaceNotes from "@/components/usePlaceNotes";
import useStudySessions from "@/components/useStudySessions";
import { exportStudyPdf } from "@/components/exportStudyPdf";
import getPlaceStudyPrompts, {
  StudyPrompt,
} from "@/components/getPlaceStudyPrompts";
import FullBibleReader from "@/components/FullBibleReader";
import ParallelBibleReader from "@/components/ParallelBibleReader";
import TopicalBible from "@/components/TopicalBible";
import PrayerJournal from "@/components/PrayerJournal";
import TestimonialWall from "@/components/TestimonialWall";
import OutlineBuilder from "@/components/OutlineBuilder";
import MemorizationFlashcards from "@/components/MemorizationFlashcards";
import ReadingProgress from "@/components/ReadingProgress";
import BibleCharacterProfiles from "@/components/BibleCharacterProfiles";
import { ATLAS_PLACES, ATLAS_BOOKS, type AtlasPlace } from "@/data/atlasPlaces";
import { ANCIENT_LOCATIONS, type AncientLocation } from "@/data/ancientPlaces";
import { getTodaysDevotional } from "@/data/devotionals";
import VisualReferencePanel from "@/components/VisualReferencePanel";
import LexiconPanel from "@/components/LexiconPanel";
import BiblicalTimeline from "@/components/BiblicalTimeline";
import CommentaryPanel from "@/components/CommentaryPanel";
import PassagePresenter from "@/components/PassagePresenter";
import {
  Home, Feather, BookOpen, Library, Layers, BookText, BookMarked,
  ScrollText, Landmark, Globe, Star, ClipboardList, FileText,
  HeartHandshake, ExternalLink, BookHeart, HandCoins, MapPin, Compass,
  Copy, Check, Image, Columns3, Heart, Menu, X, Brain, BarChart2, Users,
} from "lucide-react";

const PlaceMap = dynamic(() => import("@/components/PlaceMap"), {
  ssr: false,
});

type IndexedPlace = {
  name: string;
  place: VersePlace;
  sourceVerseId: string;
  sourceReference: string;
};

type LeftPanelTab =
  | "home"
  | "devotional"
  | "reader"
  | "bible"
  | "parallel"
  | "topical"
  | "prayer_journal"
  | "timeline"
  | "commentary"
  | "dictionary"
  | "ancient_world"
  | "atlas"
  | "study_prompts"
  | "bookmarks"
  | "study_sheet"
  | "sessions"
  | "testimonials"
  | "resources"
  | "books"
  | "outline"
  | "flashcards"
  | "reading_progress"
  | "characters";

// ── Bible book lists ──────────────────────────────────────────────────────
const OT_SECTIONS = [
  { label: "The Law",        books: ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy"] },
  { label: "History",        books: ["Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther"] },
  { label: "Poetry & Wisdom",books: ["Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon"] },
  { label: "Major Prophets", books: ["Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel"] },
  { label: "Minor Prophets", books: ["Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"] },
];

const NT_SECTIONS = [
  { label: "Gospels",         books: ["Matthew","Mark","Luke","John"] },
  { label: "History",         books: ["Acts"] },
  { label: "Paul's Letters",  books: ["Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon"] },
  { label: "General Letters", books: ["Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude"] },
  { label: "Prophecy",        books: ["Revelation"] },
];

const DAILY_VERSES = [
  { reference: "John 3:16",         text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",                                  book: "John",         chapter: 3 },
  { reference: "Psalm 23:1-3",      text: "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul.",              book: "Psalms",       chapter: 23 },
  { reference: "Romans 8:28",       text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",                                    book: "Romans",       chapter: 8 },
  { reference: "Jeremiah 29:11",    text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",                           book: "Jeremiah",     chapter: 29 },
  { reference: "Philippians 4:13",  text: "I can do all things through Christ which strengtheneth me.",                                                                                                       book: "Philippians",  chapter: 4 },
  { reference: "Proverbs 3:5-6",    text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",               book: "Proverbs",     chapter: 3 },
  { reference: "Isaiah 40:31",      text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", book: "Isaiah", chapter: 40 },
  { reference: "Matthew 6:33",      text: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",                                                       book: "Matthew",      chapter: 6 },
  { reference: "Psalm 119:105",     text: "Thy word is a lamp unto my feet, and a light unto my path.",                                                                                                       book: "Psalms",       chapter: 119 },
  { reference: "2 Timothy 3:16-17", text: "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness.",                    book: "2 Timothy",    chapter: 3 },
  { reference: "Hebrews 11:1",      text: "Now faith is the substance of things hoped for, the evidence of things not seen.",                                                                                 book: "Hebrews",      chapter: 11 },
  { reference: "Joshua 1:9",        text: "Have not I commanded thee? Be strong and courageous. Be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",       book: "Joshua",       chapter: 1 },
  { reference: "Matthew 11:28",     text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",                                                                                  book: "Matthew",      chapter: 11 },
  { reference: "Psalm 46:1",        text: "God is our refuge and strength, a very present help in trouble.",                                                                                                  book: "Psalms",       chapter: 46 },
  { reference: "John 14:6",         text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",                                                          book: "John",         chapter: 14 },
  { reference: "Ephesians 2:8-9",   text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.",                           book: "Ephesians",    chapter: 2 },
  { reference: "Isaiah 55:11",      text: "So shall my word be that goeth forth out of my mouth: it shall not return unto me void, but it shall accomplish that which I please.",                            book: "Isaiah",       chapter: 55 },
  { reference: "Micah 6:8",         text: "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?",       book: "Micah",        chapter: 6 },
  { reference: "1 John 4:8",        text: "He that loveth not knoweth not God; for God is love.",                                                                                                            book: "1 John",       chapter: 4 },
  { reference: "Revelation 21:4",   text: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain.",          book: "Revelation",   chapter: 21 },
  { reference: "Lamentations 3:22-23", text: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",              book: "Lamentations", chapter: 3 },
  { reference: "Galatians 5:22-23", text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance: against such there is no law.",              book: "Galatians",    chapter: 5 },
  { reference: "Genesis 1:1",       text: "In the beginning God created the heaven and the earth.",                                                                                                          book: "Genesis",      chapter: 1 },
  { reference: "Acts 1:8",          text: "But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth.", book: "Acts", chapter: 1 },
  { reference: "Colossians 3:23",   text: "And whatsoever ye do, do it heartily, as to the Lord, and not unto men.",                                                                                        book: "Colossians",   chapter: 3 },
  { reference: "Psalm 27:1",        text: "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?",                                      book: "Psalms",       chapter: 27 },
  { reference: "Romans 3:23",       text: "For all have sinned, and come short of the glory of God.",                                                                                                        book: "Romans",       chapter: 3 },
  { reference: "James 1:2-4",       text: "Count it all joy, my brethren, when ye fall into divers temptations; Knowing this, that the trying of your faith worketh patience.",                             book: "James",        chapter: 1 },
  { reference: "John 10:10",        text: "The thief cometh not, but for to steal, and to kill, and to destroy: I am come that they might have life, and that they might have it more abundantly.",         book: "John",         chapter: 10 },
  { reference: "Deuteronomy 31:6",  text: "Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.", book: "Deuteronomy", chapter: 31 },
];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function EraBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-600">
      {label}
    </span>
  );
}

// ── Share helper ────────────────────────────────────────────────────────────
function shareVerse(reference: string, text: string) {
  const shareText = `"${text}" — ${reference} (KJV)`;
  const shareUrl  = typeof window !== "undefined" ? window.location.href : "https://scripturelives.com";

  if (typeof navigator !== "undefined" && navigator.share) {
    navigator.share({ title: reference, text: shareText, url: shareUrl }).catch(() => {});
    return;
  }

  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
  window.open(fbUrl, "fb-share", "width=600,height=500,resizable=yes,scrollbars=yes");
}

// ── Branded post builder ─────────────────────────────────────────────────────
function buildDevotionalPost(devotional: { icon: string; title: string; verse: string; reference: string; reflection: string; prayer: string }) {
  return [
    `🙏 Grow Your Faith`,
    ``,
    `${devotional.icon} ${devotional.title}`,
    ``,
    `"${devotional.verse}"`,
    `— ${devotional.reference} (KJV)`,
    ``,
    devotional.reflection,
    ``,
    `🙏 Prayer: ${devotional.prayer}`,
    ``,
    `📖 Read & study the full devotional at scripturelives.com`,
    ``,
    `#GrowYourFaith #ScriptureLives #BibleStudy #DailyDevotional #Faith`,
  ].join("\n");
}

function buildStudyPost(reference: string, verseText: string, prompts: { title: string; prompt: string }[]) {
  const questions = prompts.slice(0, 2).map((p, i) => `${i + 1}. ${p.prompt}`).join("\n\n");
  return [
    `🙏 Grow Your Faith`,
    ``,
    `✏️ Today's Bible Study — ${reference}`,
    ``,
    `"${verseText}"`,
    `— ${reference} (KJV)`,
    ``,
    `📖 Study Questions:`,
    ``,
    questions,
    ``,
    `Dive deeper at scripturelives.com`,
    ``,
    `#GrowYourFaith #ScriptureLives #BibleStudy #Scripture #Faith`,
  ].join("\n");
}

export default function BibleReader() {
  const [selectedPlace, setSelectedPlace] = useState<VersePlace | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(verses[0] ?? null);
  const [mapMode, setMapMode] = useState<"modern" | "ancient">("modern");
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeEraFilter, setPlaceEraFilter] = useState("All eras");
  const [journeyEraFilter, setJourneyEraFilter] = useState<JourneyEra | "All eras">("All eras");
  const [ancientWorldView, setAncientWorldView] = useState<"journeys" | "places" | "locations">("locations");
  const [selectedAncientLocation, setSelectedAncientLocation] = useState<AncientLocation | null>(null);
  const [ancientLocationSearch, setAncientLocationSearch] = useState("");
  const [activeJourneyStop, setActiveJourneyStop] = useState<number | null>(null);
  const [leftPanelTab, setLeftPanelTab] = useState<LeftPanelTab>("home");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [homeQuery, setHomeQuery] = useState("");
  const [readerJumpRef, setReaderJumpRef] = useState<{ book: string; chapter: number; verse: number } | null>(null);

  // Dictionary state
  const [dictQuery, setDictQuery] = useState("");
  const [dictResult, setDictResult] = useState<{ found: boolean; term?: string; body?: string; sourceUrl?: string; source?: string } | null>(null);
  const [dictLoading, setDictLoading] = useState(false);
  const [dictError, setDictError] = useState("");

  // Atlas state
  const [atlasSearch, setAtlasSearch] = useState("");
  const [atlasLetterFilter, setAtlasLetterFilter] = useState("");
  const [atlasBookFilter, setAtlasBookFilter] = useState("");
  const [draftNote, setDraftNote] = useState("");

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [sessionName, setSessionName] = useState("");
  const [fullBibleNav, setFullBibleNav] = useState<{
    version: "KJV" | "ASV" | "WEB";
    book: string;
    chapter: number;
  } | null>(null);
  // Track what the Full Bible reader is currently showing (for Commentary sync)
  const [activeFullBibleRef, setActiveFullBibleRef] = useState<{ book: string; chapter: number }>({
    book: "Genesis", chapter: 1,
  });
  const [visualQuery, setVisualQuery] = useState<string | null>(null);
  const [lexiconWord, setLexiconWord] = useState<{ word: string; book: string } | null>(null);
  const [presenterRef, setPresenterRef] = useState<{ book: string; chapter: number; verse?: number; reference: string; text: string } | null>(null);

  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [exportError, setExportError] = useState("");

  const [aiPrompts, setAiPrompts] = useState<StudyPrompt[]>([]);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  // tracks which variant index is showing per prompt id (0 = default prompt)
  const [promptVariantIndexes, setPromptVariantIndexes] = useState<Record<string, number>>({});
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const [promptError, setPromptError] = useState("");
  const [promptCustomRef, setPromptCustomRef] = useState("");
  const [promptOverride, setPromptOverride] = useState<{ ref: string; text: string } | null>(null);
  const [postPreview, setPostPreview] = useState<string | null>(null);
  const [postCopied, setPostCopied] = useState(false);

  const verseRefs = useRef<Record<string, HTMLElement | null>>({});

  const {
    bookmarks,
    toggleBookmark,
    removeBookmark,
    isBookmarked,
    replaceBookmarks,
  } = useBookmarks();

  const { notes, getNote, saveNote, removeNote, replaceNotes } = usePlaceNotes();
  const { sessions, saveSession, deleteSession } = useStudySessions();

  useEffect(() => {
    if (selectedPlace) {
      setDraftNote(getNote(selectedPlace.name));
    } else {
      setDraftNote("");
    }
  }, [selectedPlace?.name]);

  useEffect(() => {
    setActiveImageIndex(0);
    setActivePromptIndex(0);
  }, [selectedPlace?.name]);


  useEffect(() => {
    if (!selectedVerse || leftPanelTab !== "reader") return;

    const target = verseRefs.current[selectedVerse.id];
    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [selectedVerse?.id, leftPanelTab]);

  const renderedVerses = useMemo(() => {
    return verses.map((verse) => {
      let parts: (string | VersePlace)[] = [verse.translations.KJV];

      for (const place of verse.places) {
        const nextParts: (string | VersePlace)[] = [];

        for (const part of parts) {
          if (typeof part !== "string") {
            nextParts.push(part);
            continue;
          }

          const regex = new RegExp(`(${escapeRegExp(place.name)})`, "g");
          const splitParts = part.split(regex).filter(Boolean);

          for (const splitPart of splitParts) {
            if (splitPart === place.name) {
              nextParts.push(place);
            } else {
              nextParts.push(splitPart);
            }
          }
        }

        parts = nextParts;
      }

      return {
        ...verse,
        parts,
      };
    });
  }, []);


  const placeIndex = useMemo<IndexedPlace[]>(() => {
    const seen = new Map<string, IndexedPlace>();

    for (const verse of verses) {
      for (const place of verse.places) {
        if (!seen.has(place.name)) {
          seen.set(place.name, {
            name: place.name,
            place,
            sourceVerseId: verse.id,
            sourceReference: verse.reference,
          });
        }
      }
    }

    return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const bookmarkedPlaces = useMemo(() => {
    return placeIndex.filter((item) => bookmarks.includes(item.name));
  }, [placeIndex, bookmarks]);

  const exportableBookmarkedPlaces = useMemo(() => {
    return bookmarkedPlaces.map((item) => ({
      name: item.name,
      place: item.place,
      sourceReference: item.sourceReference,
      note: notes[item.name] ?? "",
    }));
  }, [bookmarkedPlaces, notes]);

  // ── Export handlers ───────────────────────────────────────────
  async function exportAsDocx() {
    setIsExportingDocx(true);
    setExportError("");
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: "docx",
          bookmarks: exportableBookmarkedPlaces,
          notes,
          sessions,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error((err as { error?: string }).error ?? "Export failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scripture-lives-study-${new Date().toISOString().slice(0, 10)}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsExportingDocx(false);
    }
  }

  function exportAsPdf() {
    exportStudyPdf(exportableBookmarkedPlaces, sessions);
  }

  const uniquePlaceEras = useMemo(() => {
    return ["All eras", ...Array.from(new Set(placeIndex.map((item) => item.place.era))).sort()];
  }, [placeIndex]);

  const filteredPlaceIndex = useMemo(() => {
    const normalizedQuery = placeQuery.trim().toLowerCase();

    return placeIndex.filter((item) => {
      const matchesQuery = !normalizedQuery || item.name.toLowerCase().includes(normalizedQuery);
      const matchesEra =
        placeEraFilter === "All eras" || item.place.era === placeEraFilter;

      return matchesQuery && matchesEra;
    });
  }, [placeIndex, placeQuery, placeEraFilter]);

  const filteredJourneys = useMemo(() => {
    if (journeyEraFilter === "All eras") return journeys;
    return journeys.filter((j) => j.era === journeyEraFilter);
  }, [journeyEraFilter]);

  // ── Atlas tab — uses standalone ATLAS_PLACES dataset (100+ places) ──
  const atlasFilteredItems = useMemo((): AtlasPlace[] => {
    return ATLAS_PLACES.filter(p => {
      const q = atlasSearch.trim().toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesLetter = !atlasLetterFilter || p.name.toUpperCase().startsWith(atlasLetterFilter);
      const matchesBook   = !atlasBookFilter || p.books.includes(atlasBookFilter);
      return matchesSearch && matchesLetter && matchesBook;
    });
  }, [atlasSearch, atlasLetterFilter, atlasBookFilter]);

  // Stable VersePlace-compatible array for the map (only changes when filter changes)
  const atlasVersePlaces = useMemo(() => atlasFilteredItems.map(p => ({
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    description: p.description,
    era: p.era,
    ancientDescription: p.description,
    biblicalSignificance: "",
    relatedVerses: [] as import("@/data/verses").RelatedVerse[],
  })), [atlasFilteredItems]);

  const versePlaces = selectedVerse?.places ?? [];
  const mapPlaces = versePlaces;
  const selectedPlaceImages = selectedPlace?.images ?? [];
  const selectedImage = selectedPlaceImages[activeImageIndex] ?? null;

  // presenterRef (Reader tab) always wins for study context; selectedVerse is fallback
  const studyRef = promptOverride?.ref ?? presenterRef?.reference ?? selectedVerse?.reference ?? null;

  const fallbackPrompts = useMemo(() => {
    const ref = promptOverride?.ref ?? presenterRef?.reference ?? selectedVerse?.reference;
    if (selectedPlace) return getPlaceStudyPrompts(selectedPlace, ref);
    if (!ref) return [];
    return [
      {
        id: "observation",
        title: "Observation",
        prompt: `Read ${ref} carefully. What stands out? Who is speaking, who is the audience, and what is the main action or declaration?`,
        variants: [
          `What specific words or phrases in ${ref} carry the most weight? What repeated words, contrasts, or comparisons do you notice?`,
          `Who are the key people in ${ref}? What are they doing, saying, or feeling — and what does that reveal about the situation?`,
          `What questions does ${ref} raise for you as a first-time reader? What seems surprising, confusing, or unexpected?`,
        ],
      },
      {
        id: "context",
        title: "Historical Context",
        prompt: `What was happening in Israel's history when ${ref} was written? How does the political, cultural, or religious context shape its meaning?`,
        variants: [
          `What is the broader narrative context of ${ref}? What comes immediately before and after it — and how does that shape its meaning?`,
          `Who was the original audience of ${ref}? What struggles, hopes, or questions might they have brought to this text?`,
          `How does the genre of ${ref} — whether law, prophecy, poetry, letter, or narrative — affect how we should read and interpret it?`,
        ],
      },
      {
        id: "theological",
        title: "Theological Truth",
        prompt: `What does ${ref} reveal about God's character, His purposes, or His relationship with humanity? What truth is being communicated?`,
        variants: [
          `How does ${ref} connect to the person and work of Jesus? Is there a foreshadowing, fulfillment, or direct teaching about Christ?`,
          `What does ${ref} teach about humanity — our condition, our need, or our calling before God?`,
          `What tension or paradox exists in ${ref}? How does it hold together ideas like grace and justice, suffering and hope, or law and freedom?`,
        ],
      },
      {
        id: "personal",
        title: "Personal Application",
        prompt: `What does ${ref} mean for your life today? Is there a promise to claim, a warning to heed, a command to obey, or an example to follow?`,
        variants: [
          `What in ${ref} challenges a belief, attitude, or habit you currently hold? What might need to change?`,
          `Is there someone in your life — family, friend, coworker — that ${ref} equips you to love or serve better? How?`,
          `What would it look like to fully trust or obey what ${ref} is saying this week? What is one concrete step you could take?`,
        ],
      },
      {
        id: "discussion",
        title: "Group Discussion",
        prompt: `If you were leading a Bible study on ${ref}, what 2–3 questions would help your group understand and apply its message?`,
        variants: [
          `What part of ${ref} do you think your group would find most challenging — and how would you help them wrestle with it honestly?`,
          `What story, illustration, or real-life example could you use to make the message of ${ref} come alive for your group?`,
          `How would you close a study on ${ref}? What prayer, response, or commitment would you invite your group into?`,
        ],
      },
    ];
  }, [promptOverride, selectedPlace, presenterRef?.reference, selectedVerse?.reference, selectedVerse?.id]);

  const effectivePrompts = aiPrompts.length > 0 ? aiPrompts : fallbackPrompts;
  const activePrompt = effectivePrompts[activePromptIndex] ?? null;

  useEffect(() => {
    let isCancelled = false;

    async function loadPrompts() {
      const activeRef = promptOverride?.ref ?? presenterRef?.reference ?? selectedVerse?.reference;
      const activeText = promptOverride?.text ?? presenterRef?.text ?? selectedVerse?.translations?.KJV;
      if (!activeRef || !activeText) {
        setAiPrompts([]);
        setPromptError("");
        return;
      }

      setIsLoadingPrompts(true);
      setPromptError("");
      setAiPrompts([]);

      try {
        const response = await fetch("/api/study-prompts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            placeName: selectedPlace?.name ?? null,
            era: selectedPlace?.era ?? null,
            description: selectedPlace?.description ?? null,
            ancientDescription: selectedPlace?.ancientDescription ?? null,
            biblicalSignificance: selectedPlace?.biblicalSignificance ?? null,
            verseReference: activeRef,
            verseText: activeText,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to generate prompts.");
        }

        if (!isCancelled) {
          setAiPrompts(Array.isArray(data.prompts) ? data.prompts : []);
        }
      } catch (error) {
        if (!isCancelled) {
          const message =
            error instanceof Error ? error.message : "Prompt generation failed.";
          setPromptError(message);
          setAiPrompts([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingPrompts(false);
        }
      }
    }

    loadPrompts();

    return () => {
      isCancelled = true;
    };
  }, [selectedPlace?.name, presenterRef?.reference, selectedVerse?.id, promptOverride]);

  // Reset to first prompt and clear variant indexes when context changes
  useEffect(() => {
    setActivePromptIndex(0);
    setPromptVariantIndexes({});
  }, [selectedPlace?.name, presenterRef?.reference, selectedVerse?.id, promptOverride]);

  const handleCopyPost = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setPostCopied(true);
      setTimeout(() => setPostCopied(false), 2500);
    });
  }, []);

  const handleGenerateCustomPrompts = useCallback(async () => {
    const ref = promptCustomRef.trim();
    if (!ref) return;

    // First try local verse dataset
    const found = verses.find((v) => v.reference.toLowerCase() === ref.toLowerCase());
    if (found?.translations?.KJV) {
      setPromptOverride({ ref, text: found.translations.KJV });
      return;
    }

    // Parse "Book Chapter:Verse" — handles "1 Corinthians 13:4", "Matthew 28:6" etc.
    const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (match) {
      const [, book, chapterStr, verseStr] = match;
      const chapter = parseInt(chapterStr, 10);
      const verseNum = parseInt(verseStr, 10);
      try {
        setIsLoadingPrompts(true);
        const res = await fetch(`/api/bible?version=KJV&book=${encodeURIComponent(book)}&chapter=${chapter}`);
        if (res.ok) {
          const data = await res.json();
          const verseObj = (data.verses as { verse: number; text: string }[])?.find((v) => v.verse === verseNum);
          if (verseObj?.text) {
            setPromptOverride({ ref, text: verseObj.text });
            return;
          }
        }
      } catch {
        // fall through to placeholder
      } finally {
        setIsLoadingPrompts(false);
      }
    }

    // Fallback if not found
    setPromptOverride({ ref, text: ref });
  }, [promptCustomRef]);

  const handleSelectBibleVerse = (
    version: "KJV" | "ASV" | "WEB",
    book: string,
    chapter: number
  ) => {
    setFullBibleNav({ version, book, chapter });
    setLeftPanelTab("bible");
  };

  const handleSelectVerse = (verseId: string) => {
    const verse = verses.find((v) => v.id === verseId);
    if (!verse) return;

    setActiveJourney(null);
    setSelectedVerse(verse);
    setSelectedPlace(verse.places[0] ?? null);
    setLeftPanelTab("reader");
  };

  const handleSelectPlaceFromIndex = (item: IndexedPlace) => {
    const verse = verses.find((v) => v.id === item.sourceVerseId);
    if (!verse) return;

    const matchingPlace =
      verse.places.find((place) => place.name === item.name) ?? verse.places[0] ?? null;

    setActiveJourney(null);
    setSelectedVerse(verse);
    setSelectedPlace(matchingPlace);
  };

  const handleLoadSession = (sessionId: string) => {
    const session = sessions.find((item) => item.id === sessionId);
    if (!session) return;

    replaceBookmarks(session.bookmarks);
    replaceNotes(session.notes);
    setLeftPanelTab("bookmarks");
  };

  const handleSaveSession = () => {
    const name = sessionName.trim();
    if (!name) return;

    saveSession(name, bookmarks, notes);
    setSessionName("");
    setLeftPanelTab("sessions");
  };

  // ── Dictionary lookup ─────────────────────────────────────────────────────────
  async function lookupDictionary(term: string) {
    if (!term.trim()) return;
    setDictLoading(true);
    setDictError("");
    setDictResult(null);
    try {
      const res = await fetch(`/api/dictionary?term=${encodeURIComponent(term.trim())}`);
      const data = await res.json();
      setDictResult(data);
    } catch {
      setDictError("Could not reach the dictionary. Please try again.");
    } finally {
      setDictLoading(false);
    }
  }

  // ── Stable PassagePresenter callbacks (useCallback prevents infinite loop) ──
  const handlePresenterWordClick = useCallback((word: string, book: string) => {
    setLexiconWord({ word, book });
    setVisualQuery(null);
  }, []);

  const handlePresenterVisualSearch = useCallback((term: string) => {
    setVisualQuery(term);
    setLexiconWord(null);
  }, []);

  const handlePresenterNavigateFullBible = useCallback((book: string, chapter: number) => {
    setFullBibleNav({ version: "KJV", book, chapter });
    setLeftPanelTab("bible");
  }, []);

  const handlePresenterVerseChange = useCallback(
    (ref: { book: string; chapter: number; verse?: number; reference: string; text: string }) => {
      setPresenterRef(ref);
    },
    []
  );

  // Verse of the Day — rotates daily
  const verseOfDay = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86_400_000
    );
    return DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
  }, []);

  // Today's devotional — rotates daily
  const devotional = useMemo(() => getTodaysDevotional(), []);

  // Dog-ear — read last-read position from localStorage for the home page banner.
  // Must use useState + useEffect (not useMemo) so the server and client both
  // render null on first pass, then the client updates after hydration.
  const [lastRead, setLastRead] = useState<{ book: string; chapter: number; verse?: number } | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("scripture-lives-last-read");
      if (!raw) return;
      setLastRead(JSON.parse(raw) as { book: string; chapter: number; verse?: number });
    } catch { /* ignore */ }
  }, []);

  // Sidebar nav button (desktop)
  const sideNavBtn = (tab: LeftPanelTab, icon: React.ReactNode, label: string) => (
    <button
      key={tab}
      type="button"
      onClick={() => setLeftPanelTab(tab)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
        leftPanelTab === tab
          ? "bg-amber-500 text-stone-900"
          : "text-stone-400 hover:bg-stone-800 hover:text-white"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );

  // Tab button (mobile — legacy, kept for reference)
  const tabButtonClass = (tab: LeftPanelTab) =>
    `rounded-lg px-3 py-1.5 text-xs font-medium transition whitespace-nowrap ${
      leftPanelTab === tab
        ? "bg-amber-500 text-gray-900"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  // Mobile nav helper — navigate and close drawer
  const mobileNav = (tab: LeftPanelTab) => {
    setLeftPanelTab(tab);
    setMobileDrawerOpen(false);
  };

  // Drawer row button
  const drawerBtn = (tab: LeftPanelTab, icon: React.ReactNode, label: string) => (
    <button
      key={tab}
      type="button"
      onClick={() => mobileNav(tab)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition w-full text-left ${
        leftPanelTab === tab
          ? "bg-amber-500 text-stone-900"
          : "text-gray-700 hover:bg-amber-50"
      }`}
    >
      <span className={`shrink-0 ${leftPanelTab === tab ? "text-stone-900" : "text-amber-600"}`}>{icon}</span>
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-white text-gray-900 print:bg-white print:text-black">
      <div className="xl:flex xl:min-h-screen print:block">

        {/* ── LEFT SIDEBAR (desktop) ───────────────────────────────────────── */}
        <nav className="hidden xl:flex flex-col w-56 shrink-0 bg-stone-900 text-white sticky top-0 h-screen overflow-y-auto print:hidden">
          {/* Logo */}
          <div className="px-4 py-5 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Hand-painted cross_logo.png"
                alt="Scripture Lives"
                className="h-14 w-14 rounded-lg object-contain shrink-0"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <div>
                <p className="text-sm font-bold text-amber-300 leading-tight">Scripture Lives</p>
                <p className="text-xs text-stone-500 mt-0.5">Bible Study Platform</p>
              </div>
            </div>
          </div>

          {/* Nav sections */}
          <div className="flex-1 py-5 px-3 space-y-6 overflow-y-auto">
            <div>
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">Read</p>
              {sideNavBtn("home",          <Home size={16} />,         "Home")}
              {sideNavBtn("devotional",    <Feather size={16} />,      "Daily Devotional")}
              {sideNavBtn("reader",        <BookOpen size={16} />,     "Passage Reader")}
              {sideNavBtn("bible",         <Library size={16} />,      "Full Bible")}
              {sideNavBtn("parallel",      <Columns3 size={16} />,     "Parallel Bible")}
              {sideNavBtn("topical",       <BookText size={16} />,     "Topical Bible")}
              {sideNavBtn("prayer_journal",<Heart size={16} />,        "Prayer Journal")}
            </div>
            <div>
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">Study</p>
              {sideNavBtn("timeline",      <Layers size={16} />,       "Timeline")}
              {sideNavBtn("commentary",    <BookText size={16} />,     "Commentary")}
              {sideNavBtn("dictionary",    <BookMarked size={16} />,   "Dictionary")}
              {sideNavBtn("study_prompts", <ScrollText size={16} />,   "Study Prompts")}
              {sideNavBtn("outline",       <FileText size={16} />,     "Sermon Outlines")}
              {sideNavBtn("flashcards",    <Brain size={16} />,        "Memorization")}
            </div>
            <div>
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">Explore</p>
              {sideNavBtn("ancient_world", <Landmark size={16} />,     "Ancient Places")}
              {sideNavBtn("atlas",         <Globe size={16} />,        "Bible Atlas")}
              {sideNavBtn("characters",    <Users size={16} />,        "Character Profiles")}
            </div>
            <div>
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">My Library</p>
              {sideNavBtn("bookmarks",       <Star size={16} />,         "Bookmarks")}
              {sideNavBtn("sessions",        <ClipboardList size={16} />, "Sessions")}
              {sideNavBtn("study_sheet",     <FileText size={16} />,     "Study Sheet")}
              {sideNavBtn("reading_progress",<BarChart2 size={16} />,    "Reading Progress")}
            </div>
            <div>
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">Community</p>
              {sideNavBtn("testimonials",  <HeartHandshake size={16} />, "Testimonials")}
              {sideNavBtn("resources",     <ExternalLink size={16} />, "More Resources")}
              {sideNavBtn("books",         <BookHeart size={16} />,    "Christian Books")}
            </div>
          </div>

          {/* Sidebar footer links */}
          <div className="shrink-0 border-t border-stone-800 px-4 py-4 space-y-1">

            {/* YouTube channel */}
            <a
              href="https://www.youtube.com/@FaithTails"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs font-medium text-stone-300 hover:bg-stone-800 hover:text-white transition group"
            >
              {/* YouTube brandmark SVG */}
              <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded bg-[#FF0000] group-hover:bg-[#cc0000] transition">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </span>
              <span>Faith Tails on YouTube</span>
            </a>

            <a href="/donate" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-amber-400 hover:bg-stone-800 transition">
              <HandCoins size={14} /> Support Scripture Lives
            </a>
            <a href="/about" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition">
              About Us
            </a>
            <a href="/terms" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition">
              Terms &amp; Conditions
            </a>
            <a href="/privacy" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition">
              Privacy Policy
            </a>
          </div>
        </nav>

        {/* ── CENTER + RIGHT ───────────────────────────────────────────────── */}
        <div className="flex-1 xl:grid xl:grid-cols-[1fr_400px] min-h-screen print:block">

          {/* CENTER — main content */}
          <section className="bg-gray-50 p-4 xl:p-6 min-h-screen pb-24 xl:pb-6 print:border-none print:bg-white print:p-0 print:shadow-none">

            {/* Mobile: no inline nav strip — replaced by fixed bottom bar below */}

            {/* ── HOME TAB ─────────────────────────────────────────────────── */}
            {leftPanelTab === "home" && (
              <div className="space-y-8 print:hidden">

                {/* Hero search */}
                <div className="relative rounded-xl bg-gradient-to-br from-stone-950 to-stone-800 px-7 py-9 overflow-hidden">
                  {/* Bible image — layered behind content, top-right */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/bible-hero.jpg"
                    alt=""
                    aria-hidden="true"
                    className="absolute right-8 -top-4 h-52 w-80 object-cover object-center opacity-50 pointer-events-none select-none"
                    style={{ maskImage: "linear-gradient(to left, black 40%, transparent 100%)", WebkitMaskImage: "linear-gradient(to left, black 40%, transparent 100%)" }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/Hand-painted cross_logo.png"
                        alt="Scripture Lives"
                        className="h-20 w-20 rounded-xl object-contain shrink-0"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                      <div>
                        <h1 className="text-2xl font-bold text-amber-400">Scripture Lives</h1>
                        <p className="text-sm text-stone-400">Explore, study, and present the living Word of God</p>
                      </div>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <input
                        type="text"
                        value={homeQuery}
                        onChange={(e) => setHomeQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && homeQuery.trim()) {
                            setLeftPanelTab("reader");
                          }
                        }}
                        placeholder="Search a verse, passage, or keyword…"
                        className="flex-1 rounded-xl border-0 bg-stone-700/80 px-4 py-3 text-sm text-white placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => { if (homeQuery.trim()) setLeftPanelTab("reader"); }}
                        className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-stone-900 hover:bg-amber-400 transition"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dog-ear — Continue Reading banner */}
                {lastRead && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">🔖</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Continue Reading</p>
                        <p className="text-sm font-semibold text-blue-800 mt-0.5">
                          {lastRead.book} — Chapter {lastRead.chapter}
                          {lastRead.verse ? `, verse ${lastRead.verse}` : ""}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLeftPanelTab("reader");
                      }}
                      className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
                    >
                      Resume →
                    </button>
                  </div>
                )}

                {/* Verse of the Day */}
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-5">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-600">✦ Verse of the Day</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => shareVerse(verseOfDay.reference, verseOfDay.text)}
                        title="Share on Facebook"
                        className="flex items-center gap-1.5 rounded-lg bg-[#1877F2] px-3 py-1 text-xs font-semibold text-white hover:bg-[#1464d3] transition"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                        Share
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFullBibleNav({ version: "KJV", book: verseOfDay.book, chapter: verseOfDay.chapter });
                          setLeftPanelTab("bible");
                        }}
                        className="text-xs text-amber-600 hover:text-amber-800 transition"
                      >
                        Read chapter →
                      </button>
                    </div>
                  </div>
                  <p className="text-base font-semibold text-amber-800 italic leading-7">"{verseOfDay.text}"</p>
                  <p className="mt-2 text-sm font-medium text-amber-600">— {verseOfDay.reference} (KJV)</p>
                </div>

                {/* Daily Devotional preview card */}
                <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 px-6 py-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{devotional.icon}</span>
                      <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Daily Devotional</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const text = `${devotional.icon} ${devotional.title}\n\n"${devotional.verse}" — ${devotional.reference}\n\n${devotional.reflection}\n\n🙏 ${devotional.prayer}`;
                          shareVerse(devotional.reference, text);
                        }}
                        title="Share this devotional on Facebook"
                        className="flex items-center gap-1.5 rounded-lg bg-[#1877F2] px-3 py-1 text-xs font-semibold text-white hover:bg-[#1464d3] transition"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                        Share
                      </button>
                      <button
                        type="button"
                        onClick={() => setLeftPanelTab("devotional")}
                        className="text-xs text-indigo-600 hover:text-indigo-800 transition"
                      >
                        Read full →
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-indigo-800 mb-1">{devotional.title}</p>
                  <p className="text-sm font-semibold text-indigo-700 italic mb-2">"{devotional.verse}"</p>
                  <p className="text-xs text-indigo-500 font-medium mb-3">— {devotional.reference}</p>
                  <p className="text-sm text-indigo-900 leading-relaxed line-clamp-3">{devotional.reflection}</p>
                </div>

                {/* Quick-access feature cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {([
                    { tab: "reader"       as LeftPanelTab, Icon: BookOpen,   label: "Passage Reader",  desc: "Search & present verses",    gradient: "from-amber-50 to-orange-50",   ring: "hover:ring-amber-300",   iconBg: "bg-amber-100",   iconColor: "text-amber-600"  },
                    { tab: "ancient_world"as LeftPanelTab, Icon: Landmark,   label: "Ancient Places",  desc: "Major locations & journeys", gradient: "from-stone-50 to-amber-50",    ring: "hover:ring-stone-300",   iconBg: "bg-stone-100",   iconColor: "text-stone-600"  },
                    { tab: "study_prompts"as LeftPanelTab, Icon: ScrollText, label: "Study Prompts",   desc: "Reflection & discussion",    gradient: "from-indigo-50 to-purple-50",  ring: "hover:ring-indigo-300",  iconBg: "bg-indigo-100",  iconColor: "text-indigo-600" },
                    { tab: "timeline"     as LeftPanelTab, Icon: Layers,     label: "Timeline",        desc: "Biblical history eras",      gradient: "from-sky-50 to-blue-50",       ring: "hover:ring-sky-300",     iconBg: "bg-sky-100",     iconColor: "text-sky-600"    },
                    { tab: "parallel"     as LeftPanelTab, Icon: Columns3,   label: "Parallel Bible",  desc: "Compare 2–4 translations",   gradient: "from-violet-50 to-purple-50",  ring: "hover:ring-violet-300",  iconBg: "bg-violet-100",  iconColor: "text-violet-600" },
                    { tab: "topical"      as LeftPanelTab, Icon: BookText,   label: "Topical Bible",   desc: "Browse by topic & theme",    gradient: "from-emerald-50 to-teal-50",   ring: "hover:ring-emerald-300", iconBg: "bg-emerald-100", iconColor: "text-emerald-600"},
                    { tab: "prayer_journal"   as LeftPanelTab, Icon: Heart,     label: "Prayer Journal",     desc: "Write & track your prayers",   gradient: "from-rose-50 to-pink-50",      ring: "hover:ring-rose-300",    iconBg: "bg-rose-100",    iconColor: "text-rose-600"    },
                    { tab: "outline"          as LeftPanelTab, Icon: FileText,  label: "Sermon Outlines",    desc: "AI-generated study outlines",  gradient: "from-slate-50 to-gray-50",     ring: "hover:ring-slate-300",   iconBg: "bg-slate-100",   iconColor: "text-slate-600"   },
                    { tab: "flashcards"       as LeftPanelTab, Icon: Brain,     label: "Memorization",       desc: "Flashcards & spaced review",   gradient: "from-fuchsia-50 to-purple-50", ring: "hover:ring-fuchsia-300",  iconBg: "bg-fuchsia-100", iconColor: "text-fuchsia-600" },
                    { tab: "reading_progress" as LeftPanelTab, Icon: BarChart2, label: "Reading Progress",   desc: "Track your Bible journey",     gradient: "from-teal-50 to-cyan-50",      ring: "hover:ring-teal-300",    iconBg: "bg-teal-100",    iconColor: "text-teal-600"    },
                    { tab: "characters"       as LeftPanelTab, Icon: Users,    label: "Character Profiles", desc: "Biographies of Bible figures",  gradient: "from-orange-50 to-amber-50",   ring: "hover:ring-orange-300",  iconBg: "bg-orange-100",  iconColor: "text-orange-600"  },
                  ]).map(card => (
                    <button
                      key={card.tab}
                      type="button"
                      onClick={() => setLeftPanelTab(card.tab)}
                      className={`group relative rounded-xl bg-gradient-to-br ${card.gradient} p-4 text-left ring-1 ring-gray-200 ${card.ring} transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
                    >
                      <div className={`inline-flex items-center justify-center rounded-xl ${card.iconBg} p-2.5 mb-3`}>
                        <card.Icon size={20} className={card.iconColor} />
                      </div>
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{card.label}</p>
                      <p className="mt-0.5 text-xs text-gray-400 leading-snug">{card.desc}</p>
                    </button>
                  ))}
                </div>

                {/* OT / NT Book Grid */}
                <div className="grid gap-8 lg:grid-cols-2">

                  {/* Old Testament */}
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-0.5 w-5 bg-amber-500 rounded-full" />
                      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600">Old Testament</h2>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                    <div className="space-y-4">
                      {OT_SECTIONS.map(section => (
                        <div key={section.label}>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-600">{section.label}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {section.books.map(book => (
                              <button
                                key={book}
                                type="button"
                                onClick={() => {
                                  setFullBibleNav({ version: "KJV", book, chapter: 1 });
                                  setLeftPanelTab("bible");
                                }}
                                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
                              >
                                {book}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* New Testament */}
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-0.5 w-5 bg-blue-500 rounded-full" />
                      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600">New Testament</h2>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                    <div className="space-y-4">
                      {NT_SECTIONS.map(section => (
                        <div key={section.label}>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-600">{section.label}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {section.books.map(book => (
                              <button
                                key={book}
                                type="button"
                                onClick={() => {
                                  setFullBibleNav({ version: "KJV", book, chapter: 1 });
                                  setLeftPanelTab("bible");
                                }}
                                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                              >
                                {book}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ── Daily Devotional tab ───────────────────────────────────── */}
            {leftPanelTab === "devotional" && (
              <div className="space-y-6">
                {/* Header */}
                <div className="rounded-xl bg-gradient-to-br from-indigo-900 to-purple-900 px-7 py-8 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-1">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                      </p>
                      <h2 className="text-2xl font-bold text-white leading-snug">
                        {devotional.icon} {devotional.title}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPostPreview(buildDevotionalPost(devotional))}
                      className="shrink-0 flex items-center gap-2 rounded-xl bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1464d3] transition"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                      Share to Facebook
                    </button>
                  </div>
                </div>

                {/* Scripture */}
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Today&apos;s Scripture</p>
                  <blockquote className="text-lg font-semibold text-indigo-900 italic leading-8 border-l-4 border-indigo-400 pl-4">
                    &ldquo;{devotional.verse}&rdquo;
                  </blockquote>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600">— {devotional.reference} (KJV)</p>
                    <button
                      type="button"
                      onClick={() => {
                        setFullBibleNav({ version: "KJV", book: devotional.book, chapter: devotional.chapter });
                        setLeftPanelTab("bible");
                      }}
                      className="text-xs text-indigo-500 hover:text-indigo-800 transition"
                    >
                      Read full chapter →
                    </button>
                  </div>
                </div>

                {/* Reflection */}
                <div className="rounded-xl border border-gray-200 bg-white px-6 py-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Reflection</p>
                  <p className="text-base text-gray-800 leading-8">{devotional.reflection}</p>
                </div>

                {/* Prayer */}
                <div className="rounded-xl border border-purple-200 bg-purple-50 px-6 py-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-purple-500 mb-3 flex items-center gap-1.5"><HeartHandshake size={13} /> Today&apos;s Prayer</p>
                  <p className="text-base font-medium text-purple-900 italic leading-7">{devotional.prayer}</p>
                </div>

                {/* Share CTA */}
                <div className="rounded-xl border border-[#1877F2]/30 bg-[#1877F2]/5 px-6 py-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Share today&apos;s devotional</p>
                    <p className="text-xs text-gray-500 mt-0.5">Encourage someone on Facebook with today&apos;s message</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPostPreview(buildDevotionalPost(devotional))}
                    className="shrink-0 flex items-center gap-2 rounded-xl bg-[#1877F2] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1464d3] transition"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                    Share to Facebook
                  </button>
                </div>
              </div>
            )}

            {leftPanelTab === "reader" && (
              <PassagePresenter
                onWordClick={handlePresenterWordClick}
                onVisualSearch={handlePresenterVisualSearch}
                onNavigateFullBible={handlePresenterNavigateFullBible}
                onVerseChange={handlePresenterVerseChange}
                initialQuery={homeQuery}
                jumpToRef={readerJumpRef}
              />
            )}

            {leftPanelTab === "bible" && (
              <div>
                <h2 className="mb-4 text-xl font-semibold">Full Bible</h2>
                <FullBibleReader
                  navTarget={fullBibleNav}
                  onNavConsumed={() => setFullBibleNav(null)}
                  onChapterChange={(book, chapter) =>
                    setActiveFullBibleRef({ book, chapter })
                  }
                  onVisualSearch={(term) => {
                    setVisualQuery(term);
                    setLexiconWord(null);
                  }}
                  onWordClick={(word, book) => {
                    setLexiconWord({ word, book });
                    setVisualQuery(null);
                  }}
                />
              </div>
            )}

            {leftPanelTab === "parallel" && (
              <div className="h-full flex flex-col -mx-4 -mt-2">
                <ParallelBibleReader />
              </div>
            )}

            {leftPanelTab === "topical" && (
              <div className="h-full flex flex-col -mx-4 -mt-2">
                <TopicalBible
                  onOpenVerse={(ref) => {
                    // Parse "Book Chapter:Verse" e.g. "John 11:35", "1 Corinthians 13:4"
                    const m = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
                    if (m) {
                      setReaderJumpRef({ book: m[1], chapter: parseInt(m[2], 10), verse: parseInt(m[3], 10) });
                    }
                    setLeftPanelTab("reader");
                  }}
                />
              </div>
            )}

            {leftPanelTab === "prayer_journal" && (
              <div className="h-full flex flex-col -mx-4 -mt-2">
                <PrayerJournal />
              </div>
            )}

            {leftPanelTab === "timeline" && (
              <BiblicalTimeline
                onNavigate={(book, chapter) => {
                  setFullBibleNav({ version: "KJV", book, chapter });
                  setLeftPanelTab("bible");
                }}
              />
            )}

            {leftPanelTab === "commentary" && (
              <CommentaryPanel
                book={activeFullBibleRef.book}
                chapter={activeFullBibleRef.chapter}
              />
            )}

            {leftPanelTab === "ancient_world" && (
              <div className="print:hidden space-y-4">
                {/* Header */}
                <div className="border-b border-gray-200 pb-3">
                  <h2 className="text-lg font-semibold text-amber-700">Ancient Places</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Major biblical locations, ancient journeys, and the geography of scripture
                  </p>
                </div>

                {/* View toggle: Locations / Journeys / Places */}
                <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => { setAncientWorldView("locations"); setSelectedAncientLocation(null); }}
                    className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition ${
                      ancientWorldView === "locations" ? "bg-amber-500 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Landmark size={13} className="inline mr-1" />Locations
                  </button>
                  <button
                    type="button"
                    onClick={() => setAncientWorldView("journeys")}
                    className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition ${
                      ancientWorldView === "journeys" ? "bg-amber-500 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Compass size={13} className="inline mr-1" />Journeys
                  </button>
                  <button
                    type="button"
                    onClick={() => setAncientWorldView("places")}
                    className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition ${
                      ancientWorldView === "places" ? "bg-amber-500 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <MapPin size={13} className="inline mr-1" />Places
                  </button>
                </div>

                {/* ── LOCATIONS VIEW ── */}
                {ancientWorldView === "locations" && (
                  <div className="space-y-3">
                    {/* Search */}
                    <input
                      type="text"
                      value={ancientLocationSearch}
                      onChange={(e) => { setAncientLocationSearch(e.target.value); setSelectedAncientLocation(null); }}
                      placeholder="Search locations… e.g. Babylon, Egypt"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-amber-400"
                    />

                    {/* Detail panel for selected location */}
                    {selectedAncientLocation ? (
                      <div className="space-y-3">
                        {/* Back button */}
                        <button
                          type="button"
                          onClick={() => setSelectedAncientLocation(null)}
                          className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-800 font-medium"
                        >
                          ← All Locations
                        </button>

                        {/* Location header */}
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                          <h3 className="text-base font-bold text-amber-800">{selectedAncientLocation.name}</h3>
                          {selectedAncientLocation.aka && (
                            <p className="text-xs text-amber-600 italic mt-0.5">{selectedAncientLocation.aka}</p>
                          )}
                          <span className="inline-block mt-2 rounded-full border border-amber-300 bg-white px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                            {selectedAncientLocation.era}
                          </span>
                          <p className="mt-3 text-sm text-gray-700 leading-6">{selectedAncientLocation.description}</p>
                          <div className="mt-3 border-t border-amber-200 pt-3">
                            <p className="text-xs font-semibold text-amber-700 mb-1">Biblical Significance</p>
                            <p className="text-xs text-gray-600 leading-5">{selectedAncientLocation.significance}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setVisualQuery(selectedAncientLocation.name)}
                            className="mt-3 flex items-center gap-1.5 rounded-lg bg-stone-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-700 transition"
                          >
                            <Image size={13} /> View Historical Image
                          </button>
                        </div>

                        {/* Verse list */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Found in Scripture ({selectedAncientLocation.verses.length} references)
                          </p>
                          <div className="space-y-2">
                            {selectedAncientLocation.verses.map((v) => (
                              <div
                                key={v.reference}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-3"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-amber-700">{v.reference}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPromptCustomRef(v.reference);
                                      setLeftPanelTab("study_prompts");
                                    }}
                                    className="text-[10px] text-gray-400 hover:text-amber-600 transition"
                                  >
                                    Study →
                                  </button>
                                </div>
                                <p className="text-xs text-gray-600 leading-5 italic">&ldquo;{v.text}&rdquo;</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Location grid */
                      <div className="space-y-2">
                        {ANCIENT_LOCATIONS.filter((loc) =>
                          ancientLocationSearch === "" ||
                          loc.name.toLowerCase().includes(ancientLocationSearch.toLowerCase()) ||
                          (loc.aka ?? "").toLowerCase().includes(ancientLocationSearch.toLowerCase())
                        ).map((loc) => (
                          <button
                            key={loc.name}
                            type="button"
                            onClick={() => {
                              setSelectedAncientLocation(loc);
                              setVisualQuery(loc.name);
                            }}
                            className="w-full text-left rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-amber-300 hover:bg-amber-50 transition group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 group-hover:text-amber-700">{loc.name}</p>
                                {loc.aka && <p className="text-[10px] text-gray-400 italic">{loc.aka}</p>}
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-5">{loc.description}</p>
                              </div>
                              <div className="shrink-0 text-right">
                                <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                                  {loc.verses.length} verses
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── JOURNEYS VIEW ── */}
                {ancientWorldView === "journeys" && (
                  <div className="space-y-3">
                    {/* Era filter chips */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setJourneyEraFilter("All eras")}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                          journeyEraFilter === "All eras"
                            ? "bg-gray-800 text-white border-gray-800"
                            : "border-gray-300 text-gray-500 hover:border-gray-400"
                        }`}
                      >
                        All eras
                      </button>
                      {ALL_JOURNEY_ERAS.map((era) => (
                        <button
                          key={era}
                          type="button"
                          onClick={() => setJourneyEraFilter(era)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition flex items-center gap-1.5 ${
                            journeyEraFilter === era
                              ? JOURNEY_ERA_BADGE[era]
                              : "border-gray-200 text-gray-400 hover:border-gray-300"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${JOURNEY_ERA_DOT[era]}`} />
                          {era}
                        </button>
                      ))}
                    </div>

                    {/* Journey cards */}
                    {filteredJourneys.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                        No journeys in this era.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredJourneys.map((journey) => {
                          const isActive = activeJourney?.id === journey.id;
                          const dotClass = JOURNEY_ERA_DOT[journey.era];
                          return (
                            <button
                              key={journey.id}
                              type="button"
                              onClick={() => {
                                setActiveJourney(journey);
                                setActiveJourneyStop(null);
                                setSelectedPlace(null);
                                setVisualQuery(journey.theme);
                                setLexiconWord(null);
                              }}
                              className={`w-full rounded-xl border p-4 text-left transition ${
                                isActive
                                  ? "border-amber-400 bg-amber-50 shadow-sm"
                                  : "border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/30"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-xl shrink-0 mt-0.5">{journey.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-amber-700 text-sm">{journey.title}</h3>
                                    <span className="ml-auto text-xs text-gray-400 shrink-0">{journey.reference}</span>
                                  </div>
                                  <div className="mt-1.5 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
                                    <span className="text-xs text-gray-500">{journey.era}</span>
                                    <span className="text-xs text-gray-300">·</span>
                                    <span className="text-xs text-gray-400">{journey.stops.length} stops</span>
                                  </div>
                                  <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                    {journey.description}
                                  </p>
                                </div>
                              </div>

                              {/* Stop list when active */}
                              {isActive && (
                                <div className="mt-3 pt-3 border-t border-amber-200 space-y-1">
                                  {journey.stops.map((stop, idx) => (
                                    <button
                                      key={stop.name}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveJourneyStop(idx);
                                        setVisualQuery(stop.visualTerm ?? stop.name);
                                        setLexiconWord(null);
                                        if (stop.book && stop.chapter) {
                                          setFullBibleNav({ version: "KJV", book: stop.book, chapter: stop.chapter });
                                        }
                                      }}
                                      className={`w-full text-left rounded-lg px-3 py-2 text-xs transition ${
                                        activeJourneyStop === idx
                                          ? "bg-amber-500 text-white"
                                          : "hover:bg-amber-100 text-gray-700"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                          activeJourneyStop === idx ? "bg-white/30 text-white" : "bg-amber-100 text-amber-700"
                                        }`}>
                                          {idx + 1}
                                        </span>
                                        <span className="font-medium">{stop.name}</span>
                                        {stop.reference && (
                                          <span className={`ml-auto shrink-0 ${activeJourneyStop === idx ? "text-white/70" : "text-gray-400"}`}>
                                            {stop.reference}
                                          </span>
                                        )}
                                      </div>
                                      {activeJourneyStop === idx && (
                                        <p className="mt-1.5 text-white/90 leading-relaxed pl-7">
                                          {stop.description}
                                        </p>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ── PLACES VIEW ── */}
                {ancientWorldView === "places" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{filteredPlaceIndex.length} of {placeIndex.length} places</span>
                    </div>

                    <input
                      type="text"
                      value={placeQuery}
                      onChange={(event) => setPlaceQuery(event.target.value)}
                      placeholder="Search sacred places…"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-amber-400"
                    />

                    <select
                      value={placeEraFilter}
                      onChange={(event) => setPlaceEraFilter(event.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-amber-400"
                    >
                      {uniquePlaceEras.map((era) => (
                        <option key={era} value={era}>{era}</option>
                      ))}
                    </select>

                    {filteredPlaceIndex.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                        No places found.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredPlaceIndex.map((item) => {
                          const isActive = selectedPlace?.name === item.name && !activeJourney;
                          return (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => {
                                handleSelectPlaceFromIndex(item);
                                setVisualQuery(item.name);
                                setLexiconWord(null);
                              }}
                              className={`w-full rounded-xl border p-4 text-left transition ${
                                isActive ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-white hover:border-amber-200"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <h3 className="font-semibold text-amber-700 text-sm flex items-center gap-1"><MapPin size={13} /> {item.name}</h3>
                                <span className="text-xs text-gray-400 shrink-0">{item.sourceReference}</span>
                              </div>
                              <div className="mt-1.5">
                                <EraBadge label={item.place.era} />
                              </div>
                              <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.place.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── DICTIONARY TAB ──────────────────────────────────────────── */}
            {leftPanelTab === "dictionary" && (
              <div className="space-y-5">
                {/* Header */}
                <div className="border-b border-gray-200 pb-3">
                  <h2 className="text-lg font-semibold text-amber-700 flex items-center gap-2"><BookMarked size={18} /> Bible Dictionary</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Easton's Bible Dictionary (1897) — Public Domain</p>
                </div>

                {/* Search */}
                <form
                  onSubmit={(e) => { e.preventDefault(); lookupDictionary(dictQuery); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={dictQuery}
                    onChange={(e) => setDictQuery(e.target.value)}
                    placeholder="Search a term, name, or place… (e.g. Aaron, Bethlehem, Atonement)"
                    className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={dictLoading || !dictQuery.trim()}
                    className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-stone-900 hover:bg-amber-400 transition disabled:opacity-50"
                  >
                    {dictLoading ? "…" : "Look up"}
                  </button>
                </form>

                {/* Quick suggestions */}
                {!dictResult && !dictLoading && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Common searches:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Aaron","Bethlehem","Covenant","Atonement","Baptism","Messiah","Passover","Prophet","Resurrection","Sabbath","Temple","Zion"].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => { setDictQuery(t); lookupDictionary(t); }}
                          className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-600 hover:border-amber-400 hover:text-amber-700 transition"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading */}
                {dictLoading && (
                  <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-6 text-center">
                    <p className="text-sm text-amber-600 animate-pulse">Looking up "{dictQuery}" in Easton's…</p>
                  </div>
                )}

                {/* Error */}
                {dictError && (
                  <p className="text-xs text-red-500">{dictError}</p>
                )}

                {/* Not found */}
                {dictResult && !dictResult.found && (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-6 text-center">
                    <p className="text-sm text-gray-600">No entry found for "<strong>{dictResult.term ?? dictQuery}</strong>" in Easton's Dictionary.</p>
                    <p className="text-xs text-gray-400 mt-2">Try a different spelling, or search for a related term.</p>
                  </div>
                )}

                {/* Result */}
                {dictResult?.found && dictResult.body && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold text-amber-800">{dictResult.term}</h3>
                      <a
                        href={dictResult.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-xs text-amber-600 hover:text-amber-800 transition"
                      >
                        Full source →
                      </a>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      {dictResult.body.split("\n\n").map((para, i) => (
                        <p key={i} className="text-sm text-gray-700 leading-7">{para.trim()}</p>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 border-t border-amber-200 pt-3">{dictResult.source}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── ATLAS TAB ───────────────────────────────────────────────── */}
            {leftPanelTab === "atlas" && (() => {
              const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
              return (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="border-b border-gray-200 pb-3">
                    <h2 className="text-lg font-semibold text-amber-700">🌍 Bible Atlas</h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Search by name, Bible book, or starting letter — {ATLAS_PLACES.length} biblical locations
                    </p>
                  </div>

                  {/* Search controls */}
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 space-y-3">
                    {/* Text search */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={atlasSearch}
                        onChange={(e) => { setAtlasSearch(e.target.value); setAtlasLetterFilter(""); setAtlasBookFilter(""); }}
                        placeholder="Atlas search… (e.g. Babylon, Sinai, Corinth)"
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-amber-400"
                      />
                      {atlasSearch && (
                        <button type="button" onClick={() => setAtlasSearch("")} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-500 hover:bg-gray-100">Clear</button>
                      )}
                    </div>

                    {/* Bible book selector */}
                    <div className="flex gap-2 items-center">
                      <label className="text-xs font-medium text-gray-500 shrink-0">By book:</label>
                      <select
                        value={atlasBookFilter}
                        onChange={(e) => { setAtlasBookFilter(e.target.value); setAtlasSearch(""); setAtlasLetterFilter(""); }}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-amber-400"
                      >
                        <option value="">Select a Bible book…</option>
                        {ATLAS_BOOKS.map(book => (
                          <option key={book} value={book}>{book}</option>
                        ))}
                      </select>
                      {atlasBookFilter && (
                        <button type="button" onClick={() => setAtlasBookFilter("")} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
                      )}
                    </div>

                    {/* A–Z letter browser */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1.5">By letter:</p>
                      <div className="flex flex-wrap gap-1">
                        {letters.map(l => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => { setAtlasLetterFilter(atlasLetterFilter === l ? "" : l); setAtlasSearch(""); setAtlasBookFilter(""); }}
                            className={`w-7 h-7 rounded text-xs font-semibold transition ${
                              atlasLetterFilter === l
                                ? "bg-amber-500 text-white"
                                : "bg-white border border-gray-300 text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Map mode toggle */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Showing <span className="font-semibold text-gray-700">{atlasFilteredItems.length}</span> location{atlasFilteredItems.length !== 1 ? "s" : ""}
                    </p>
                    <div className="inline-flex rounded-xl border border-gray-300 bg-white p-1">
                      <button type="button" onClick={() => setMapMode("modern")}  className={`rounded-lg px-3 py-1 text-xs font-medium transition ${mapMode === "modern"  ? "bg-amber-500 text-white" : "text-gray-600 hover:text-gray-900"}`}>Modern</button>
                      <button type="button" onClick={() => setMapMode("ancient")} className={`rounded-lg px-3 py-1 text-xs font-medium transition ${mapMode === "ancient" ? "bg-amber-500 text-white" : "text-gray-600 hover:text-gray-900"}`}>Ancient</button>
                    </div>
                  </div>

                  {/* Two-panel: list + map */}
                  <div className="flex gap-3" style={{ height: "460px" }}>
                    {/* Place list */}
                    <div className="w-52 shrink-0 flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden">
                      <div className="bg-stone-50 border-b border-gray-200 px-3 py-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Locations</p>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {atlasFilteredItems.map(p => (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => setSelectedPlace({ name: p.name, lat: p.lat, lng: p.lng, description: p.description, era: p.era, ancientDescription: p.description, biblicalSignificance: "", relatedVerses: [] as import("@/data/verses").RelatedVerse[] })}
                            className={`w-full text-left px-3 py-2.5 border-b border-gray-100 text-sm transition ${
                              selectedPlace?.name === p.name
                                ? "bg-amber-50 text-amber-800 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm leading-none">{selectedPlace?.name === p.name ? "📍" : "·"}</span>
                              <span>{p.name}</span>
                            </div>
                            <p className="mt-0.5 ml-5 text-[10px] text-gray-400 truncate">{p.era}</p>
                          </button>
                        ))}
                        {atlasFilteredItems.length === 0 && (
                          <p className="px-4 py-8 text-xs text-center text-gray-400">No places found.<br/>Try a different search or letter.</p>
                        )}
                      </div>
                    </div>

                    {/* Map */}
                    <div className="flex-1 flex flex-col gap-2 min-w-0">
                      <div className="flex-1 rounded-xl overflow-hidden border border-gray-200">
                        <PlaceMap
                          selectedPlace={selectedPlace}
                          versePlaces={atlasVersePlaces}
                          mapMode={mapMode}
                          activeJourney={null}
                          fillHeight
                          onPlaceClick={(place) => setSelectedPlace(place)}
                        />
                      </div>
                      {selectedPlace ? (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start justify-between gap-3 shrink-0">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-amber-800 flex items-center gap-1"><MapPin size={14} /> {selectedPlace.name}</p>
                            <p className="text-xs text-amber-600 mt-0.5">{selectedPlace.era}</p>
                            {selectedPlace.description && (
                              <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2">{selectedPlace.description}</p>
                            )}
                          </div>
                          <button type="button" onClick={() => setSelectedPlace(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none shrink-0">✕</button>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 shrink-0 text-center">
                          <p className="text-xs text-gray-400">Click a location name or map pin to explore</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {leftPanelTab === "study_prompts" && (
              <div className="space-y-5">
                {/* Header */}
                <div className="border-b border-gray-200 pb-3">
                  <h2 className="text-lg font-semibold text-amber-700">Study Prompts</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Reflection and discussion questions tied to your selected verse or place
                  </p>
                </div>

                {/* Custom verse input */}
                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Generate prompts for any verse:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promptCustomRef}
                      onChange={(e) => setPromptCustomRef(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleGenerateCustomPrompts(); }}
                      placeholder="e.g. John 3:16 or Romans 8:28"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateCustomPrompts}
                      disabled={!promptCustomRef.trim() || isLoadingPrompts}
                      className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {isLoadingPrompts ? "…" : "Go"}
                    </button>
                  </div>
                  {promptOverride && (
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-amber-700 font-medium">Showing: {promptOverride.ref}</p>
                      <button
                        type="button"
                        onClick={() => { setPromptOverride(null); setPromptCustomRef(""); }}
                        className="text-xs text-gray-400 hover:text-gray-600 underline"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Context banner */}
                {studyRef || selectedPlace ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
                    <span className="text-amber-500 text-lg shrink-0">📖</span>
                    <div className="min-w-0">
                      {studyRef && (
                        <p className="text-sm font-semibold text-amber-700">{studyRef}</p>
                      )}
                      {selectedPlace && (
                        <p className="text-xs text-amber-600 mt-0.5">{selectedPlace.name} · {selectedPlace.era}</p>
                      )}
                      {isLoadingPrompts && (
                        <p className="text-xs text-amber-500 mt-1 italic">Generating prompts…</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-center">
                    <p className="text-sm text-gray-500">Select a verse or place to generate study prompts</p>
                    <p className="text-xs text-gray-400 mt-1">Search a verse in the Reader tab, or pick a place from Ancient World</p>
                  </div>
                )}

                {/* Prompt cards */}
                {effectivePrompts.length > 0 && (
                  <div className="space-y-3">
                    {effectivePrompts.map((prompt, idx) => {
                      const isActive = activePromptIndex === idx;
                      const icons = ["🏺", "📖", "✝", "🪞", "🎓"];
                      // Determine which question to show (default + variants array)
                      const allVariants = [prompt.prompt, ...(prompt.variants ?? [])];
                      const variantIdx = promptVariantIndexes[prompt.id] ?? 0;
                      const displayPrompt = allVariants[variantIdx] ?? prompt.prompt;
                      const hasVariants = allVariants.length > 1;
                      const cycleVariant = () => {
                        setPromptVariantIndexes((prev) => ({
                          ...prev,
                          [prompt.id]: ((prev[prompt.id] ?? 0) + 1) % allVariants.length,
                        }));
                      };
                      return (
                        <div
                          key={prompt.id}
                          className={`rounded-xl border transition overflow-hidden ${
                            isActive ? "border-amber-400 shadow-sm" : "border-gray-200"
                          }`}
                        >
                          {/* Card header — always visible */}
                          <button
                            type="button"
                            onClick={() => setActivePromptIndex(isActive ? -1 : idx)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
                              isActive ? "bg-amber-50" : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-lg shrink-0">{icons[idx] ?? "💡"}</span>
                            <span className={`text-sm font-semibold flex-1 ${isActive ? "text-amber-700" : "text-gray-800"}`}>
                              {prompt.title}
                            </span>
                            {/* Variant counter badge */}
                            {hasVariants && (
                              <span className="text-[10px] text-gray-400 shrink-0 mr-1">
                                {variantIdx + 1}/{allVariants.length}
                              </span>
                            )}
                            <span className={`text-xs shrink-0 ${isActive ? "text-amber-500" : "text-gray-400"}`}>
                              {isActive ? "▲" : "▼"}
                            </span>
                          </button>

                          {/* Expanded prompt text */}
                          {isActive && (
                            <div className="px-4 pb-4 pt-1 bg-amber-50 border-t border-amber-100">
                              <p className="text-sm text-gray-700 leading-7">{displayPrompt}</p>
                              <div className="mt-3 flex items-center gap-2 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => navigator.clipboard.writeText(displayPrompt)}
                                  className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-600 hover:border-amber-400 hover:text-amber-700 transition"
                                >
                                  <Copy size={13} className="inline mr-1" />Copy
                                </button>
                                {hasVariants && (
                                  <button
                                    type="button"
                                    onClick={cycleVariant}
                                    className="flex items-center gap-1 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 transition"
                                  >
                                    Next question →
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {promptError && (
                  <p className="text-xs text-gray-400 italic">
                    Using built-in prompts. {promptError}
                  </p>
                )}

                {/* Branded Share button */}
                {effectivePrompts.length > 0 && studyRef && (
                  <div className="rounded-xl border border-[#1877F2]/30 bg-[#1877F2]/5 px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Share this study</p>
                      <p className="text-xs text-gray-500 mt-0.5">Post a branded &ldquo;Grow Your Faith&rdquo; study to Facebook</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const ref = studyRef;
                        const text = (promptOverride?.text ?? presenterRef?.text ?? selectedVerse?.translations?.KJV ?? "");
                        setPostPreview(buildStudyPost(ref, text, effectivePrompts));
                      }}
                      className="shrink-0 flex items-center gap-2 rounded-xl bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1464d3] transition"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                      Share to Facebook
                    </button>
                  </div>
                )}
              </div>
            )}

            {leftPanelTab === "bookmarks" && (
              <div className="print:hidden">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">Bookmarks</h2>
                    <span className="text-sm text-gray-500">{bookmarkedPlaces.length} saved</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={exportAsPdf}
                        title="Open a print-ready page — use Ctrl+P / ⌘P to Save as PDF"
                        className="rounded-lg border border-amber-600 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                      >
                        📄 PDF
                      </button>
                      <button
                        type="button"
                        onClick={exportAsDocx}
                        disabled={isExportingDocx}
                        title="Download a formatted Word document"
                        className="rounded-lg border border-amber-500 bg-amber-500 px-3 py-2 text-sm font-medium text-gray-900 transition hover:opacity-90 disabled:opacity-50"
                      >
                        {isExportingDocx ? "Exporting…" : <><FileText size={13} className="inline mr-1" />Word</>}
                      </button>
                    </div>
                    {exportError && (
                      <span className="text-xs text-red-600">{exportError}</span>
                    )}
                  </div>
                </div>

                {bookmarkedPlaces.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                    No saved places yet. Open a place in the explorer and save it.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookmarkedPlaces.map((item) => (
                      <div key={item.name} className="rounded-xl border border-gray-200 p-4">
                        <button
                          type="button"
                          onClick={() => handleSelectPlaceFromIndex(item)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold text-amber-700">{item.name}</h3>
                            <span className="text-xs text-gray-500">{item.sourceReference}</span>
                          </div>
                          <div className="mt-2">
                            <EraBadge label={item.place.era} />
                          </div>
                          <p className="mt-3 text-sm text-gray-600">{item.place.description}</p>
                          <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Saved Note
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              {notes[item.name] ? notes[item.name] : "No note saved yet."}
                            </div>
                          </div>
                        </button>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => removeBookmark(item.name)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 transition hover:border-red-400 hover:text-red-500"
                          >
                            Remove bookmark
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {leftPanelTab === "sessions" && (
              <div className="print:hidden">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Study Sessions</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Save your current bookmarks and notes as a named session.
                  </p>
                </div>

                <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      value={sessionName}
                      onChange={(event) => setSessionName(event.target.value)}
                      placeholder="Session name..."
                      className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleSaveSession}
                      className="rounded-lg border border-amber-500 bg-amber-500 px-4 py-2 text-sm font-medium text-gray-900 transition hover:opacity-90"
                    >
                      Save Session
                    </button>
                  </div>
                </div>

                {sessions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                    No study sessions yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="rounded-xl border border-gray-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-amber-700">{session.name}</h3>
                            <p className="mt-1 text-xs text-gray-500">
                              {new Date(session.createdAt).toLocaleString()}
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                              {session.bookmarks.length} bookmark
                              {session.bookmarks.length === 1 ? "" : "s"} •{" "}
                              {Object.keys(session.notes).length} note
                              {Object.keys(session.notes).length === 1 ? "" : "s"}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleLoadSession(session.id)}
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 transition hover:border-amber-500"
                            >
                              Load
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSession(session.id)}
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 transition hover:border-red-400 hover:text-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {leftPanelTab === "study_sheet" && (
              <div className="text-gray-900 print:text-black">
                <div className="mb-6 flex items-start justify-between gap-4 print:hidden">
                  <div>
                    <h2 className="text-2xl font-semibold">Study Sheet</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Print this page or save it as a PDF from your browser.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-lg border border-amber-500 bg-amber-500 px-4 py-2 text-sm font-medium text-gray-900 transition hover:opacity-90"
                  >
                    Print / Save PDF
                  </button>
                </div>

                <div className="hidden print:block print:mb-8">
                  <h1 className="text-3xl font-bold">Scripture Lives Study Sheet</h1>
                  <p className="mt-2 text-sm">Generated {new Date().toLocaleString()}</p>
                </div>

                {bookmarkedPlaces.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500 print:border-gray-300 print:text-black">
                    No bookmarked places yet. Save a few places first, then return here to print a study sheet.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookmarkedPlaces.map((item, index) => (
                      <article
                        key={item.name}
                        className="rounded-xl border border-gray-200 bg-white p-6 print:break-inside-avoid print:border-gray-300 print:bg-white"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm font-semibold uppercase tracking-wide text-amber-700 print:text-black">
                              Place {index + 1}
                            </div>
                            <h3 className="mt-1 text-2xl font-bold text-amber-600 print:text-black">
                              {item.name}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 print:text-black">
                              Source Verse: {item.sourceReference}
                            </p>
                          </div>

                          <div className="print:hidden">
                            <EraBadge label={item.place.era} />
                          </div>
                          <div className="hidden print:block text-sm">Era: {item.place.era}</div>
                        </div>

                        <div className="mt-5 space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500 print:text-black">
                              Summary
                            </h4>
                            <p className="mt-1 text-gray-800 print:text-black">{item.place.description}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500 print:text-black">
                              Ancient Context
                            </h4>
                            <p className="mt-1 text-gray-800 print:text-black">{item.place.ancientDescription}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500 print:text-black">
                              Biblical Significance
                            </h4>
                            <p className="mt-1 text-gray-800 print:text-black">{item.place.biblicalSignificance}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500 print:text-black">
                              Study Note
                            </h4>
                            <div className="mt-1 rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-800 print:border-gray-300 print:bg-white print:text-black">
                              {notes[item.name] ? notes[item.name] : "No note saved yet."}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TESTIMONIALS TAB ─────────────────────────────────────────── */}
            {leftPanelTab === "testimonials" && (
              <div className="h-full flex flex-col -mx-4 -mt-2">
                <TestimonialWall />
              </div>
            )}

            {/* ── MORE RESOURCES TAB ───────────────────────────────────────── */}
            {leftPanelTab === "resources" && (
              <div className="space-y-5">
                <div className="border-b border-gray-200 pb-3">
                  <h2 className="text-lg font-semibold text-amber-700 flex items-center gap-2"><ExternalLink size={18} /> More Resources</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Trusted external tools and ministries for deeper study</p>
                </div>

                <div className="space-y-3">
                  {[
                    { category: "Bible Study", items: [
                      { name: "Bible Gateway", url: "https://www.biblegateway.com", desc: "Search the Bible in over 200 translations." },
                      { name: "Blue Letter Bible", url: "https://www.blueletterbible.org", desc: "In-depth tools: lexicons, commentaries, interlinears." },
                      { name: "Bible Hub", url: "https://biblehub.com", desc: "Parallel translations, concordances, and commentaries." },
                    ]},
                    { category: "Commentaries", items: [
                      { name: "Enduring Word", url: "https://enduringword.com", desc: "Verse-by-verse Bible commentary by David Guzik." },
                      { name: "Grace to You", url: "https://www.gty.org", desc: "John MacArthur's sermons and Bible resources." },
                    ]},
                    { category: "Prayer & Devotion", items: [
                      { name: "Open Bible", url: "https://www.openbible.info", desc: "Topical Bible searches and verse-by-verse resources." },
                      { name: "Desiring God", url: "https://www.desiringgod.org", desc: "Articles, sermons, and devotionals from John Piper." },
                    ]},
                    { category: "Biblical History", items: [
                      { name: "Smithsonian Bible Archaeology", url: "https://www.smithsonianmag.com/history/archaeology", desc: "Archaeological discoveries that illuminate the Bible." },
                      { name: "Biblical Archaeology Society", url: "https://www.biblicalarchaeology.org", desc: "Scholarly articles on biblical history and culture." },
                    ]},
                    { category: "Prophecy & Israel", items: [
                      { name: "Rapture Ready", url: "https://www.raptureready.com", desc: "Bible prophecy news, articles, and end-times resources." },
                      { name: "Behold Israel", url: "https://beholdisrael.org", desc: "Amir Tsarfati's ministry — news and prophecy from Israel." },
                    ]},
                    { category: "Evangelism & Apologetics", items: [
                      { name: "Living Waters", url: "https://livingwaters.com", desc: "Ray Comfort's evangelism training and gospel resources." },
                      { name: "Koinonia House", url: "https://khouse.org", desc: "Chuck Missler's in-depth Bible study and strategic perspectives." },
                    ]},
                    { category: "Local Church", items: [
                      { name: "Calvary Chapel Church", url: "https://calvarycch.org", desc: "Calvary Chapel — verse-by-verse Bible teaching and community." },
                    ]},
                  ].map((section) => (
                    <div key={section.category}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{section.category}</p>
                      <div className="space-y-2">
                        {section.items.map((item) => (
                          <a
                            key={item.name}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-amber-300 hover:bg-amber-50 transition group"
                          >
                            <span className="text-amber-500 text-lg shrink-0 mt-0.5">🔗</span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 group-hover:text-amber-700">{item.name}</p>
                              <p className="text-xs text-gray-500 leading-5">{item.desc}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-center text-xs text-gray-400">
                  Want to suggest a resource?{" "}
                  <a href="mailto:info@scripturelives.com?subject=Resource Suggestion" className="text-amber-600 hover:underline">Let us know</a>
                </p>
              </div>
            )}

            {/* ── CHRISTIAN BOOKS TAB ──────────────────────────────────────── */}
            {leftPanelTab === "books" && (
              <div className="space-y-5">
                <div className="border-b border-gray-200 pb-3">
                  <h2 className="text-lg font-semibold text-amber-700 flex items-center gap-2"><BookHeart size={18} /> Christian Books</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Classic public domain works of the faith — free to read</p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "The Pilgrim's Progress", author: "John Bunyan (1678)", desc: "One of the most widely read books in Christian history — an allegory of the journey from sin to salvation.", url: "https://www.gutenberg.org/ebooks/131" },
                    { title: "Institutes of the Christian Religion", author: "John Calvin (1536)", desc: "A systematic presentation of Christian doctrine that shaped Reformed theology for centuries.", url: "https://www.gutenberg.org/ebooks/45001" },
                    { title: "Morning and Evening", author: "Charles H. Spurgeon (1865)", desc: "Daily devotional readings from the Prince of Preachers — one for each morning and evening of the year.", url: "https://www.gutenberg.org/ebooks/2934" },
                    { title: "The City of God", author: "Augustine of Hippo (426 AD)", desc: "Augustine's sweeping vision of history and the two cities — earthly and heavenly — that shape all of human life.", url: "https://www.gutenberg.org/ebooks/45304" },
                    { title: "Confessions", author: "Augustine of Hippo (397 AD)", desc: "Perhaps the first autobiography in history — Augustine's frank account of his life, sins, and conversion to Christ.", url: "https://www.gutenberg.org/ebooks/3296" },
                    { title: "Sinners in the Hands of an Angry God", author: "Jonathan Edwards (1741)", desc: "The most famous sermon in American history — a call to repentance and a portrait of divine grace.", url: "https://www.gutenberg.org/ebooks/34632" },
                    { title: "The Practice of the Presence of God", author: "Brother Lawrence (1692)", desc: "Short reflections on finding God in the ordinary moments of daily life.", url: "https://www.gutenberg.org/ebooks/13871" },
                    { title: "Foxe's Book of Martyrs", author: "John Foxe (1563)", desc: "The stories of Christian martyrs from the early church through the Reformation — a powerful testimony of faith.", url: "https://www.gutenberg.org/ebooks/22400" },
                  ].map((book) => (
                    <a
                      key={book.title}
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 hover:border-amber-300 hover:bg-amber-50 transition group"
                    >
                      <BookHeart size={22} className="text-amber-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-amber-700">{book.title}</p>
                        <p className="text-[10px] text-amber-600 font-medium mb-1">{book.author}</p>
                        <p className="text-xs text-gray-500 leading-5">{book.desc}</p>
                        <p className="text-[10px] text-blue-500 mt-1">Read free on Project Gutenberg →</p>
                      </div>
                    </a>
                  ))}
                </div>

                <p className="text-center text-xs text-gray-400">
                  All books are in the public domain and free to read.
                  Want to suggest a title?{" "}
                  <a href="mailto:info@scripturelives.com?subject=Book Suggestion" className="text-amber-600 hover:underline">Email us</a>
                </p>
              </div>
            )}

            {/* ── SERMON OUTLINE BUILDER ────────────────────────────────────── */}
            {leftPanelTab === "outline" && (
              <OutlineBuilder />
            )}

            {/* ── VERSE MEMORIZATION FLASHCARDS ────────────────────────────── */}
            {leftPanelTab === "flashcards" && (
              <MemorizationFlashcards />
            )}

            {/* ── READING PROGRESS TRACKER ─────────────────────────────────── */}
            {leftPanelTab === "reading_progress" && (
              <ReadingProgress />
            )}

            {/* ── BIBLE CHARACTER PROFILES ──────────────────────────────────── */}
            {leftPanelTab === "characters" && (
              <BibleCharacterProfiles
                onOpenVerse={(ref) => {
                  const m = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
                  if (m) setReaderJumpRef({ book: m[1], chapter: parseInt(m[2], 10), verse: parseInt(m[3], 10) });
                  setLeftPanelTab("reader");
                }}
              />
            )}

          </section>

          {/* RIGHT PANEL */}
          <aside className="bg-white border-l border-gray-200 p-5 space-y-6 print:hidden">

            {/* Share current verse */}
            {(presenterRef || selectedVerse) && (() => {
              const ref  = presenterRef?.reference ?? selectedVerse?.reference ?? "";
              const text = presenterRef?.text       ?? selectedVerse?.translations?.KJV ?? "";
              if (!ref || !text) return null;
              return (
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Current Verse</p>
                    <p className="text-xs font-semibold text-amber-700 truncate">{ref}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 italic">"{text}"</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => shareVerse(ref, text)}
                    title="Share this verse on Facebook"
                    className="shrink-0 flex items-center gap-1.5 rounded-lg bg-[#1877F2] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1464d3] transition mt-0.5"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                    Share
                  </button>
                </div>
              );
            })()}

            {/* Lexicon Panel — Word Study */}
            {lexiconWord && (
              <LexiconPanel
                mode="word"
                clickedWord={lexiconWord.word}
                book={lexiconWord.book}
                onClear={() => setLexiconWord(null)}
              />
            )}

            {/* Visual Reference Panel */}
            {visualQuery && (
              <VisualReferencePanel
                query={visualQuery}
                onClear={() => setVisualQuery(null)}
              />
            )}

          </aside>
        </div>{/* end center+right grid */}
      </div>{/* end xl:flex */}

      {/* ── Post Preview Modal ───────────────────────────────────────────── */}
      {postPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setPostPreview(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#1877F2] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                <span className="text-white font-bold text-sm">Your Branded Post Preview</span>
              </div>
              <button type="button" onClick={() => setPostPreview(null)} className="text-white/80 hover:text-white text-xl leading-none">✕</button>
            </div>

            {/* Post content */}
            <div className="px-6 py-5">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 max-h-72 overflow-y-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-6">{postPreview}</pre>
              </div>
              <p className="text-xs text-gray-400 mt-2">This is exactly what will appear in your Facebook post.</p>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex flex-col gap-3">

              {/* Facebook */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCopyPost(postPreview)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1464d3] transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                Copy &amp; Open Facebook
              </a>

              {/* SMS */}
              <a
                href={`sms:?&body=${encodeURIComponent(postPreview)}`}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#34C759] px-5 py-3 text-sm font-semibold text-white hover:bg-[#28a745] transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                Send as Text Message
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent("🙏 Grow Your Faith — Scripture Lives")}&body=${encodeURIComponent(postPreview)}`}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#EA4335] px-5 py-3 text-sm font-semibold text-white hover:bg-[#c5352a] transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                Send as Email
              </a>

              {/* Copy */}
              <button
                type="button"
                onClick={() => handleCopyPost(postPreview)}
                className={`w-full flex items-center justify-center gap-2 rounded-xl border-2 px-5 py-3 text-sm font-semibold transition ${
                  postCopied
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 bg-white text-gray-800 hover:border-amber-400 hover:bg-amber-50"
                }`}
              >
                {postCopied ? <><Check size={14} className="inline mr-1" />Copied!</> : <><Copy size={14} className="inline mr-1" />Copy Text Only</>}
              </button>

              <p className="text-center text-xs text-gray-400">
                Facebook: post text is copied automatically — just paste it in.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAV BAR ────────────────────────────────────────── */}
      {/* Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="xl:hidden fixed inset-0 z-40 bg-black/40 print:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Slide-up drawer */}
      <div
        className={`xl:hidden fixed inset-x-0 bottom-16 z-50 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 transition-transform duration-300 print:hidden ${
          mobileDrawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <div className="px-4 pb-6 pt-2 max-h-[70vh] overflow-y-auto space-y-4">

          {/* Read */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 mb-1">Read</p>
            {drawerBtn("reader",       <BookOpen size={16} />,      "Passage Reader")}
            {drawerBtn("bible",        <Library size={16} />,       "Full Bible")}
            {drawerBtn("parallel",     <Columns3 size={16} />,      "Parallel Bible")}
            {drawerBtn("devotional",   <Feather size={16} />,       "Devotional")}
          </div>

          {/* Study */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 mb-1">Study</p>
            {drawerBtn("study_prompts", <ScrollText size={16} />,   "Study Prompts")}
            {drawerBtn("topical",       <BookText size={16} />,     "Topical Bible")}
            {drawerBtn("outline",       <FileText size={16} />,     "Sermon Outlines")}
            {drawerBtn("flashcards",    <Brain size={16} />,        "Memorization")}
            {drawerBtn("commentary",    <BookText size={16} />,     "Commentary")}
            {drawerBtn("dictionary",    <BookMarked size={16} />,   "Dictionary / Lexicon")}
            {drawerBtn("timeline",      <Layers size={16} />,       "Timeline")}
          </div>

          {/* Explore */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 mb-1">Explore</p>
            {drawerBtn("ancient_world", <Landmark size={16} />,     "Ancient World Map")}
            {drawerBtn("atlas",         <Globe size={16} />,        "Atlas")}
            {drawerBtn("characters",    <Users size={16} />,        "Character Profiles")}
            {drawerBtn("resources",     <ExternalLink size={16} />, "Resources")}
            {drawerBtn("books",         <BookHeart size={16} />,    "Christian Books")}
          </div>

          {/* My Library */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 mb-1">My Library</p>
            {drawerBtn("prayer_journal",   <Heart size={16} />,        "Prayer Journal")}
            {drawerBtn("reading_progress", <BarChart2 size={16} />,  "Reading Progress")}
            {drawerBtn("bookmarks",        <Star size={16} />,       "Bookmarks")}
            {drawerBtn("sessions",         <ClipboardList size={16} />, "Study Sessions")}
            {drawerBtn("study_sheet",      <FileText size={16} />,   "Study Sheet")}
          </div>

          {/* Community */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 mb-1">Community</p>
            {drawerBtn("testimonials",  <HeartHandshake size={16} />, "Testimonials")}
          </div>

        </div>
      </div>

      {/* Fixed bottom bar — 5 key tabs */}
      <nav className="xl:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 flex items-stretch h-16 print:hidden">
        {(
          [
            { tab: "home"   as LeftPanelTab, icon: <Home size={20} />,     label: "Home"    },
            { tab: "reader" as LeftPanelTab, icon: <BookOpen size={20} />, label: "Reader"  },
            { tab: "bible"  as LeftPanelTab, icon: <Library size={20} />,  label: "Bible"   },
            { tab: "prayer_journal" as LeftPanelTab, icon: <Heart size={20} />, label: "Prayer" },
          ] as { tab: LeftPanelTab; icon: React.ReactNode; label: string }[]
        ).map(({ tab, icon, label }) => (
          <button
            key={tab}
            type="button"
            onClick={() => { setLeftPanelTab(tab); setMobileDrawerOpen(false); }}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition ${
              leftPanelTab === tab && !mobileDrawerOpen
                ? "text-amber-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className={leftPanelTab === tab && !mobileDrawerOpen ? "text-amber-600" : ""}>{icon}</span>
            {label}
          </button>
        ))}

        {/* Menu / More button */}
        <button
          type="button"
          onClick={() => setMobileDrawerOpen((o) => !o)}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition ${
            mobileDrawerOpen ? "text-amber-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <span>{mobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}</span>
          {mobileDrawerOpen ? "Close" : "More"}
        </button>
      </nav>

    </main>
  );
}