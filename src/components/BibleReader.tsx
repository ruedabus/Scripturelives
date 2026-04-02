"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { verses, Verse, VersePlace } from "@/data/verses";
import { journeys, Journey } from "@/data/journeys";
import dynamic from "next/dynamic";
import SearchBar from "@/components/SearchBar";
import useBookmarks from "@/components/useBookmarks";
import usePlaceNotes from "@/components/usePlaceNotes";
import exportStudySummary from "@/components/exportStudySummary";
import getPlaceStudyPrompts from "@/components/getPlaceStudyPrompts";

const PlaceMap = dynamic(() => import("@/components/PlaceMap"), {
  ssr: false,
});

type IndexedPlace = {
  name: string;
  place: VersePlace;
  sourceVerseId: string;
  sourceReference: string;
};

type PassageGroup = {
  passageId: string;
  passageTitle: string;
  verses: (Verse & { parts: (string | VersePlace)[] })[];
};

type LeftPanelTab = "reader" | "journeys" | "places" | "bookmarks" | "study_sheet";
type MapScope = "verse" | "passage";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function EraBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-amber-700/40 bg-amber-950/40 px-2.5 py-1 text-xs text-amber-200">
      {label}
    </span>
  );
}

export default function BibleReader() {
  const [selectedPlace, setSelectedPlace] = useState<VersePlace | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(verses[0] ?? null);
  const [mapMode, setMapMode] = useState<"modern" | "ancient">("modern");
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeEraFilter, setPlaceEraFilter] = useState("All eras");
  const [journeyEraFilter, setJourneyEraFilter] = useState("All eras");
  const [leftPanelTab, setLeftPanelTab] = useState<LeftPanelTab>("reader");
  const [draftNote, setDraftNote] = useState("");
  const [openPassages, setOpenPassages] = useState<Record<string, boolean>>(() => {
    const initialPassageId = verses[0]?.passageId;
    return initialPassageId ? { [initialPassageId]: true } : {};
  });
  const [mapScope, setMapScope] = useState<MapScope>("verse");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  const verseRefs = useRef<Record<string, HTMLArticleElement | null>>({});

  const { bookmarks, toggleBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const { notes, getNote, saveNote, removeNote } = usePlaceNotes();

  useEffect(() => {
    if (selectedPlace) {
      setDraftNote(getNote(selectedPlace.name));
    } else {
      setDraftNote("");
    }
  }, [selectedPlace?.name, getNote]);

  useEffect(() => {
    setActiveImageIndex(0);
    setActivePromptIndex(0);
  }, [selectedPlace?.name]);

  useEffect(() => {
    if (!selectedVerse) return;

    setOpenPassages((current) => ({
      ...current,
      [selectedVerse.passageId]: true,
    }));
  }, [selectedVerse?.passageId]);

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
      let parts: (string | VersePlace)[] = [verse.text];

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

  const passageGroups = useMemo<PassageGroup[]>(() => {
    const groups = new Map<string, PassageGroup>();

    for (const verse of renderedVerses) {
      if (!groups.has(verse.passageId)) {
        groups.set(verse.passageId, {
          passageId: verse.passageId,
          passageTitle: verse.passageTitle,
          verses: [],
        });
      }

      groups.get(verse.passageId)!.verses.push(verse);
    }

    return Array.from(groups.values());
  }, [renderedVerses]);

  const currentPassagePlaces = useMemo(() => {
    if (!selectedVerse) return [];

    const passageVerses = verses.filter((verse) => verse.passageId === selectedVerse.passageId);
    const seen = new Map<string, VersePlace>();

    for (const verse of passageVerses) {
      for (const place of verse.places) {
        if (!seen.has(place.name)) {
          seen.set(place.name, place);
        }
      }
    }

    return Array.from(seen.values());
  }, [selectedVerse]);

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

  const uniquePlaceEras = useMemo(() => {
    return ["All eras", ...Array.from(new Set(placeIndex.map((item) => item.place.era))).sort()];
  }, [placeIndex]);

  const uniqueJourneyEras = useMemo(() => {
    return ["All eras", ...Array.from(new Set(journeys.map((journey) => journey.era))).sort()];
  }, []);

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
    if (journeyEraFilter === "All eras") {
      return journeys;
    }

    return journeys.filter((journey) => journey.era === journeyEraFilter);
  }, [journeyEraFilter]);

  const versePlaces = selectedVerse?.places ?? [];
  const mapPlaces = mapScope === "passage" ? currentPassagePlaces : versePlaces;
  const selectedPlaceImages = selectedPlace?.images ?? [];
  const selectedImage = selectedPlaceImages[activeImageIndex] ?? null;

  const studyPrompts = useMemo(() => {
    if (!selectedPlace) return [];
    return getPlaceStudyPrompts(selectedPlace, selectedVerse?.reference);
  }, [selectedPlace, selectedVerse?.reference]);

  const activePrompt = studyPrompts[activePromptIndex] ?? null;

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
    setLeftPanelTab("reader");
  };

  const togglePassage = (passageId: string) => {
    setOpenPassages((current) => ({
      ...current,
      [passageId]: !current[passageId],
    }));
  };

  const tabButtonClass = (tab: LeftPanelTab) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition ${
      leftPanelTab === tab
        ? "bg-amber-500 text-stone-950"
        : "text-stone-300 hover:bg-stone-800"
    }`;

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 print:bg-white print:text-black">
      <div className="mx-auto max-w-7xl px-6 py-10 print:max-w-none print:px-0 print:py-0">
        <div className="print:hidden">
          <h1 className="text-3xl font-bold">Scripture Alive</h1>
          <p className="mt-2 text-stone-300">
            Explore scripture through passages, places, maps, journeys, linked verse discovery, bookmarks, notes, printable study sheets, image galleries, and guided study prompts.
          </p>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr] print:mt-0 print:block">
          <section className="rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-lg print:border-none print:bg-white print:p-0 print:shadow-none">
            <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-stone-800 bg-stone-950 p-2 print:hidden">
              <button type="button" onClick={() => setLeftPanelTab("reader")} className={tabButtonClass("reader")}>
                Reader
              </button>
              <button type="button" onClick={() => setLeftPanelTab("journeys")} className={tabButtonClass("journeys")}>
                Journeys
              </button>
              <button type="button" onClick={() => setLeftPanelTab("places")} className={tabButtonClass("places")}>
                Places
              </button>
              <button type="button" onClick={() => setLeftPanelTab("bookmarks")} className={tabButtonClass("bookmarks")}>
                Bookmarks
              </button>
              <button type="button" onClick={() => setLeftPanelTab("study_sheet")} className={tabButtonClass("study_sheet")}>
                Study Sheet
              </button>
            </div>

            {leftPanelTab === "reader" && (
              <div>
                <SearchBar onSelectVerse={handleSelectVerse} />
                <h2 className="mb-4 mt-6 text-xl font-semibold">Reader</h2>

                <div className="space-y-6">
                  {passageGroups.map((group) => {
                    const isOpen = !!openPassages[group.passageId];
                    const hasSelectedVerse = group.verses.some((verse) => verse.id === selectedVerse?.id);

                    return (
                      <section
                        key={group.passageId}
                        className={`rounded-2xl border p-4 transition ${
                          hasSelectedVerse ? "border-amber-500 bg-stone-950/50" : "border-stone-800 bg-stone-950/30"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => togglePassage(group.passageId)}
                          className="flex w-full items-center justify-between gap-4 text-left"
                        >
                          <div>
                            <h3 className="text-2xl font-semibold text-amber-400">{group.passageTitle}</h3>
                            <p className="mt-1 text-sm text-stone-400">
                              {group.verses.length} verse{group.verses.length === 1 ? "" : "s"}
                            </p>
                          </div>

                          <div className="rounded-lg border border-stone-700 px-3 py-2 text-sm text-stone-300">
                            {isOpen ? "Collapse" : "Expand"}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="mt-5 space-y-4">
                            {group.verses.map((verse) => {
                              const verseIsSelected = selectedVerse?.id === verse.id;

                              return (
                                <article
                                  key={verse.id}
                                  ref={(el) => {
                                    verseRefs.current[verse.id] = el;
                                  }}
                                  className={`rounded-xl border p-4 transition ${
                                    verseIsSelected
                                      ? "border-amber-500 bg-stone-800 shadow-[0_0_0_1px_rgba(245,158,11,0.25)]"
                                      : "border-stone-800"
                                  }`}
                                  onClick={() => {
                                    setActiveJourney(null);
                                    setSelectedVerse(verse);
                                    if (!verse.places.some((p) => p.name === selectedPlace?.name)) {
                                      setSelectedPlace(verse.places[0] ?? null);
                                    }
                                  }}
                                >
                                  <div className="mb-2 flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold uppercase tracking-wide text-amber-400">
                                      {verse.reference}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {verse.places[0] && <EraBadge label={verse.places[0].era} />}
                                      <div className="text-xs text-stone-400">
                                        {verse.places.length} place{verse.places.length === 1 ? "" : "s"}
                                      </div>
                                    </div>
                                  </div>

                                  <p className="text-lg leading-8">
                                    {verse.parts.map((part, index) => {
                                      if (typeof part === "string") {
                                        return <span key={`${verse.id}-text-${index}`}>{part}</span>;
                                      }

                                      const isSelectedPlace =
                                        verseIsSelected && selectedPlace?.name === part.name;

                                      return (
                                        <button
                                          key={`${verse.id}-place-${part.name}-${index}`}
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setActiveJourney(null);
                                            setSelectedVerse(verse);
                                            setSelectedPlace(part);
                                          }}
                                          className={`rounded px-1 font-semibold underline underline-offset-4 transition ${
                                            isSelectedPlace
                                              ? "bg-amber-500 text-stone-950 decoration-amber-300"
                                              : "text-sky-300 decoration-sky-500 hover:text-sky-200"
                                          }`}
                                        >
                                          {part.name}
                                        </button>
                                      );
                                    })}
                                  </p>
                                </article>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              </div>
            )}

            {leftPanelTab === "journeys" && (
              <div className="print:hidden">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Journeys</h2>
                  <select
                    value={journeyEraFilter}
                    onChange={(event) => setJourneyEraFilter(event.target.value)}
                    className="rounded-lg border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                  >
                    {uniqueJourneyEras.map((era) => (
                      <option key={era} value={era}>
                        {era}
                      </option>
                    ))}
                  </select>
                </div>

                {filteredJourneys.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-stone-700 p-4 text-sm text-stone-400">
                    No journeys found for the selected era.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredJourneys.map((journey) => {
                      const isActive = activeJourney?.id === journey.id;

                      return (
                        <button
                          key={journey.id}
                          type="button"
                          onClick={() => {
                            setActiveJourney(journey);
                            setSelectedPlace(null);
                          }}
                          className={`w-full rounded-xl border p-4 text-left transition ${
                            isActive ? "border-amber-500 bg-stone-800" : "border-stone-800"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold text-amber-400">{journey.title}</h3>
                            <span className="text-xs text-stone-400">{journey.reference}</span>
                          </div>
                          <div className="mt-2">
                            <EraBadge label={journey.era} />
                          </div>
                          <p className="mt-3 text-sm text-stone-300">{journey.description}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {leftPanelTab === "places" && (
              <div className="print:hidden">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Place Index</h2>
                  <span className="text-sm text-stone-400">
                    {filteredPlaceIndex.length} of {placeIndex.length} places
                  </span>
                </div>

                <div className="mb-4 space-y-3">
                  <input
                    type="text"
                    value={placeQuery}
                    onChange={(event) => setPlaceQuery(event.target.value)}
                    placeholder="Search places in the index..."
                    className="w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-2 text-sm text-stone-100 outline-none placeholder:text-stone-500 focus:border-amber-500"
                  />

                  <select
                    value={placeEraFilter}
                    onChange={(event) => setPlaceEraFilter(event.target.value)}
                    className="w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
                  >
                    {uniquePlaceEras.map((era) => (
                      <option key={era} value={era}>
                        {era}
                      </option>
                    ))}
                  </select>
                </div>

                {filteredPlaceIndex.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-stone-700 p-4 text-sm text-stone-400">
                    No places found for the current filters.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredPlaceIndex.map((item) => {
                      const isActive = selectedPlace?.name === item.name && !activeJourney;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => handleSelectPlaceFromIndex(item)}
                          className={`w-full rounded-xl border p-4 text-left transition ${
                            isActive ? "border-amber-500 bg-stone-800" : "border-stone-800"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold text-amber-400">{item.name}</h3>
                            <span className="text-xs text-stone-400">{item.sourceReference}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <EraBadge label={item.place.era} />
                            <span className="text-xs text-stone-400">
                              {isBookmarked(item.name) ? "Saved" : "Not saved"}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-stone-300">{item.place.description}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {leftPanelTab === "bookmarks" && (
              <div className="print:hidden">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">Bookmarks</h2>
                    <span className="text-sm text-stone-400">{bookmarkedPlaces.length} saved</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => exportStudySummary(exportableBookmarkedPlaces)}
                    className="rounded-lg border border-amber-500 bg-amber-500 px-3 py-2 text-sm font-medium text-stone-950 transition hover:opacity-90"
                  >
                    Export Notes
                  </button>
                </div>

                {bookmarkedPlaces.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-stone-700 p-4 text-sm text-stone-400">
                    No saved places yet. Open a place in the explorer and save it.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookmarkedPlaces.map((item) => (
                      <div key={item.name} className="rounded-xl border border-stone-800 p-4">
                        <button
                          type="button"
                          onClick={() => handleSelectPlaceFromIndex(item)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold text-amber-400">{item.name}</h3>
                            <span className="text-xs text-stone-400">{item.sourceReference}</span>
                          </div>
                          <div className="mt-2">
                            <EraBadge label={item.place.era} />
                          </div>
                          <p className="mt-3 text-sm text-stone-300">{item.place.description}</p>
                          <div className="mt-3 rounded-lg border border-stone-800 bg-stone-950 p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                              Saved Note
                            </div>
                            <div className="mt-1 text-sm text-stone-300">
                              {notes[item.name] ? notes[item.name] : "No note saved yet."}
                            </div>
                          </div>
                        </button>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => removeBookmark(item.name)}
                            className="rounded-lg border border-stone-700 px-3 py-2 text-sm text-stone-200 transition hover:border-red-400 hover:text-red-300"
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

            {leftPanelTab === "study_sheet" && (
              <div className="text-stone-100 print:text-black">
                <div className="mb-6 flex items-start justify-between gap-4 print:hidden">
                  <div>
                    <h2 className="text-2xl font-semibold">Study Sheet</h2>
                    <p className="mt-1 text-sm text-stone-400">
                      Print this page or save it as a PDF from your browser.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-lg border border-amber-500 bg-amber-500 px-4 py-2 text-sm font-medium text-stone-950 transition hover:opacity-90"
                  >
                    Print / Save PDF
                  </button>
                </div>

                <div className="hidden print:block print:mb-8">
                  <h1 className="text-3xl font-bold">Scripture Alive Study Sheet</h1>
                  <p className="mt-2 text-sm">Generated {new Date().toLocaleString()}</p>
                </div>

                {bookmarkedPlaces.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-stone-700 p-6 text-sm text-stone-400 print:border-gray-300 print:text-black">
                    No bookmarked places yet. Save a few places first, then return here to print a study sheet.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookmarkedPlaces.map((item, index) => (
                      <article
                        key={item.name}
                        className="rounded-2xl border border-stone-800 bg-stone-950 p-6 print:break-inside-avoid print:border-gray-300 print:bg-white"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm font-semibold uppercase tracking-wide text-amber-400 print:text-black">
                              Place {index + 1}
                            </div>
                            <h3 className="mt-1 text-2xl font-bold text-amber-300 print:text-black">
                              {item.name}
                            </h3>
                            <p className="mt-2 text-sm text-stone-400 print:text-black">
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
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-400 print:text-black">
                              Summary
                            </h4>
                            <p className="mt-1 text-stone-200 print:text-black">{item.place.description}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-400 print:text-black">
                              Ancient Context
                            </h4>
                            <p className="mt-1 text-stone-200 print:text-black">{item.place.ancientDescription}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-400 print:text-black">
                              Biblical Significance
                            </h4>
                            <p className="mt-1 text-stone-200 print:text-black">{item.place.biblicalSignificance}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-400 print:text-black">
                              Study Note
                            </h4>
                            <div className="mt-1 rounded-xl border border-stone-800 bg-stone-900 p-4 text-stone-200 print:border-gray-300 print:bg-white print:text-black">
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
          </section>

          <aside className="space-y-6 print:hidden">
            <section className="rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                  {activeJourney ? "Journey Explorer" : "Place Explorer"}
                </h2>

                {!activeJourney && selectedVerse && (
                  <div className="inline-flex rounded-xl border border-stone-700 bg-stone-950 p-1">
                    <button
                      type="button"
                      onClick={() => setMapScope("verse")}
                      className={`rounded-lg px-3 py-1 text-sm ${
                        mapScope === "verse" ? "bg-amber-500 text-stone-950" : "text-stone-300"
                      }`}
                    >
                      Verse Places
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapScope("passage")}
                      className={`rounded-lg px-3 py-1 text-sm ${
                        mapScope === "passage" ? "bg-amber-500 text-stone-950" : "text-stone-300"
                      }`}
                    >
                      Passage Places
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-4 inline-flex rounded-xl border border-stone-700 bg-stone-950 p-1">
                <button
                  type="button"
                  onClick={() => setMapMode("modern")}
                  className={`rounded-lg px-3 py-1 text-sm ${
                    mapMode === "modern" ? "bg-amber-500 text-stone-950" : "text-stone-300"
                  }`}
                >
                  Modern
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode("ancient")}
                  className={`rounded-lg px-3 py-1 text-sm ${
                    mapMode === "ancient" ? "bg-amber-500 text-stone-950" : "text-stone-300"
                  }`}
                >
                  Ancient View
                </button>
              </div>

              {activeJourney ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-amber-400">{activeJourney.title}</h3>
                    <p className="mt-2 text-sm text-stone-400">{activeJourney.reference}</p>
                    <div className="mt-3">
                      <EraBadge label={activeJourney.era} />
                    </div>
                  </div>
                </div>
              ) : !selectedPlace ? (
                <p className="text-stone-300">
                  Select a highlighted place, search result, place index entry, or journey.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-amber-400">{selectedPlace.name}</h3>
                      <p className="mt-2 text-sm text-stone-400">
                        {selectedVerse?.reference} • {selectedPlace.lat}, {selectedPlace.lng}
                      </p>
                      <div className="mt-3">
                        <EraBadge label={selectedPlace.era} />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(selectedPlace.name)}
                      className={`rounded-lg border px-3 py-2 text-sm transition ${
                        isBookmarked(selectedPlace.name)
                          ? "border-amber-500 bg-amber-500 text-stone-950"
                          : "border-stone-700 text-stone-200 hover:border-amber-500"
                      }`}
                    >
                      {isBookmarked(selectedPlace.name) ? "Saved" : "Save place"}
                    </button>
                  </div>

                  {selectedImage && (
                    <div className="overflow-hidden rounded-2xl border border-stone-800 bg-stone-950">
                      <img
                        src={selectedImage.url}
                        alt={selectedPlace.name}
                        className="h-56 w-full object-cover"
                      />

                      <div className="border-t border-stone-800 px-4 py-3 text-sm text-stone-300">
                        {selectedImage.caption}
                      </div>

                      {selectedPlaceImages.length > 1 && (
                        <div className="flex items-center justify-between border-t border-stone-800 px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveImageIndex((current) =>
                                current === 0 ? selectedPlaceImages.length - 1 : current - 1
                              )
                            }
                            className="rounded-lg border border-stone-700 px-3 py-2 text-sm text-stone-200 transition hover:border-amber-500"
                          >
                            Previous
                          </button>

                          <div className="text-sm text-stone-400">
                            {activeImageIndex + 1} of {selectedPlaceImages.length}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setActiveImageIndex((current) =>
                                current === selectedPlaceImages.length - 1 ? 0 : current + 1
                              )
                            }
                            className="rounded-lg border border-stone-700 px-3 py-2 text-sm text-stone-200 transition hover:border-amber-500"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activePrompt && (
                    <div className="rounded-2xl border border-sky-800/40 bg-sky-950/20 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wide text-sky-300">
                            Study Prompt
                          </h4>
                          <div className="mt-1 text-base font-semibold text-sky-100">
                            {activePrompt.title}
                          </div>
                        </div>

                        {studyPrompts.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setActivePromptIndex((current) =>
                                current === studyPrompts.length - 1 ? 0 : current + 1
                              )
                            }
                            className="rounded-lg border border-sky-700/50 px-3 py-2 text-sm text-sky-100 transition hover:border-sky-400"
                          >
                            Next Prompt
                          </button>
                        )}
                      </div>

                      <p className="text-sm leading-7 text-sky-50">
                        {activePrompt.prompt}
                      </p>
                    </div>
                  )}

                  {mapScope === "passage" && currentPassagePlaces.length > 1 && (
                    <div className="rounded-xl border border-amber-700/30 bg-amber-950/20 p-3 text-sm text-amber-100">
                      Showing all places in the passage: {selectedVerse?.passageTitle}
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                      Quick Summary
                    </h4>
                    <p className="mt-1 text-stone-200">{selectedPlace.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                      Ancient Context
                    </h4>
                    <p className="mt-1 text-stone-200">{selectedPlace.ancientDescription}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                      Biblical Significance
                    </h4>
                    <p className="mt-1 text-stone-200">{selectedPlace.biblicalSignificance}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                      Study Notes
                    </h4>

                    <textarea
                      value={draftNote}
                      onChange={(event) => setDraftNote(event.target.value)}
                      placeholder="Write your study notes for this place..."
                      className="mt-2 min-h-[120px] w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-stone-100 outline-none placeholder:text-stone-500 focus:border-amber-500"
                    />

                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedPlace) return;
                          saveNote(selectedPlace.name, draftNote);
                        }}
                        className="rounded-lg border border-amber-500 bg-amber-500 px-4 py-2 text-sm font-medium text-stone-950 transition hover:opacity-90"
                      >
                        Save note
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedPlace) return;
                          setDraftNote("");
                          removeNote(selectedPlace.name);
                        }}
                        className="rounded-lg border border-stone-700 px-4 py-2 text-sm text-stone-200 transition hover:border-red-400 hover:text-red-300"
                      >
                        Clear note
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                      Related Verses
                    </h4>

                    <div className="mt-2 space-y-3">
                      {selectedPlace.relatedVerses.map((verse) => (
                        <button
                          key={verse.reference}
                          type="button"
                          onClick={() => handleSelectVerse(verse.targetVerseId)}
                          className="block w-full rounded-lg border border-stone-800 p-3 text-left transition hover:border-amber-500 hover:bg-stone-800"
                        >
                          <div className="text-sm font-semibold text-amber-400">
                            {verse.reference}
                          </div>
                          <div className="mt-1 text-sm text-stone-300">{verse.text}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-stone-800 bg-stone-900 p-4 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Map</h2>
                <span className="text-sm text-stone-400">
                  {activeJourney
                    ? activeJourney.reference
                    : mapScope === "passage"
                    ? selectedVerse?.passageTitle ?? "No selection"
                    : selectedVerse?.reference ?? "No selection"}
                </span>
              </div>

              <PlaceMap
                selectedPlace={selectedPlace}
                versePlaces={mapPlaces}
                mapMode={mapMode}
                activeJourney={activeJourney}
              />

              {activeJourney ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeJourney.stops.map((stop, index) => (
                    <span
                      key={stop.name}
                      className="rounded-full border border-stone-700 px-3 py-1 text-sm text-stone-200"
                    >
                      {index + 1}. {stop.name}
                    </span>
                  ))}
                </div>
              ) : mapPlaces.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {mapPlaces.map((place) => {
                    const isActive = selectedPlace?.name === place.name;

                    return (
                      <button
                        key={place.name}
                        type="button"
                        onClick={() => setSelectedPlace(place)}
                        className={`rounded-full border px-3 py-1 text-sm ${
                          isActive
                            ? "border-amber-500 bg-amber-500 text-stone-950"
                            : "border-stone-700 text-stone-200"
                        }`}
                      >
                        {place.name}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}