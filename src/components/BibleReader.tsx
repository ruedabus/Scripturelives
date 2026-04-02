"use client";

import { useMemo, useState } from "react";
import { verses, Verse, VersePlace } from "@/data/verses";
import { journeys, Journey } from "@/data/journeys";
import dynamic from "next/dynamic";
import SearchBar from "@/components/SearchBar";

const PlaceMap = dynamic(() => import("@/components/PlaceMap"), {
  ssr: false,
});

type IndexedPlace = {
  name: string;
  place: VersePlace;
  sourceVerseId: string;
  sourceReference: string;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function BibleReader() {
  const [selectedPlace, setSelectedPlace] = useState<VersePlace | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(verses[0] ?? null);
  const [mapMode, setMapMode] = useState<"modern" | "ancient">("modern");
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);

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

  const activeVersePlaces = selectedVerse?.places ?? [];

  const handleSelectVerse = (verseId: string) => {
    const verse = verses.find((v) => v.id === verseId);
    if (!verse) return;

    setActiveJourney(null);
    setSelectedVerse(verse);
    setSelectedPlace(verse.places[0] ?? null);
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

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl font-bold">Scripture Alive</h1>
        <p className="mt-2 text-stone-300">
          Explore scripture through places, maps, journeys, and linked verse discovery.
        </p>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr_1fr]">
          <section className="space-y-6 rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-lg">
            <div>
              <SearchBar onSelectVerse={handleSelectVerse} />

              <h2 className="mb-4 mt-6 text-xl font-semibold">Reader</h2>

              <div className="space-y-6">
                {renderedVerses.map((verse) => {
                  const verseIsSelected = selectedVerse?.id === verse.id;

                  return (
                    <article
                      key={verse.id}
                      className={`rounded-xl border p-4 transition ${
                        verseIsSelected ? "border-amber-500 bg-stone-800" : "border-stone-800"
                      }`}
                      onClick={() => {
                        setActiveJourney(null);
                        setSelectedVerse(verse);
                        if (!verse.places.some((p) => p.name === selectedPlace?.name)) {
                          setSelectedPlace(verse.places[0] ?? null);
                        }
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-semibold uppercase tracking-wide text-amber-400">
                          {verse.reference}
                        </div>
                        <div className="text-xs text-stone-400">
                          {verse.places.length} place{verse.places.length === 1 ? "" : "s"}
                        </div>
                      </div>

                      <p className="text-lg leading-8">
                        {verse.parts.map((part, index) => {
                          if (typeof part === "string") {
                            return <span key={`${verse.id}-text-${index}`}>{part}</span>;
                          }

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
                              className="rounded px-1 font-semibold text-sky-300 underline decoration-sky-500 underline-offset-4 hover:text-sky-200"
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
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Journeys</h2>

              <div className="space-y-3">
                {journeys.map((journey) => {
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
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-amber-400">{journey.title}</h3>
                        <span className="text-xs text-stone-400">{journey.reference}</span>
                      </div>
                      <p className="mt-2 text-sm text-stone-300">{journey.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Place Index</h2>
              <span className="text-sm text-stone-400">{placeIndex.length} places</span>
            </div>

            <div className="space-y-3">
              {placeIndex.map((item) => {
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
                    <p className="mt-2 text-sm text-stone-300">{item.place.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">
                  {activeJourney ? "Journey Explorer" : "Place Explorer"}
                </h2>

                <div className="inline-flex rounded-xl border border-stone-700 bg-stone-950 p-1">
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
              </div>

              {activeJourney ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-amber-400">{activeJourney.title}</h3>
                    <p className="mt-2 text-sm text-stone-400">{activeJourney.reference}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                      Journey Summary
                    </h4>
                    <p className="mt-1 text-stone-200">{activeJourney.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                      Stops
                    </h4>
                    <div className="mt-2 space-y-2">
                      {activeJourney.stops.map((stop, index) => (
                        <div key={stop.name} className="rounded-lg border border-stone-800 p-3">
                          <div className="text-sm font-semibold text-amber-400">
                            {index + 1}. {stop.name}
                          </div>
                          <div className="mt-1 text-sm text-stone-300">{stop.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : !selectedPlace ? (
                <p className="text-stone-300">
                  Select a highlighted place, search result, place index entry, or journey.
                </p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-amber-400">{selectedPlace.name}</h3>
                    <p className="mt-2 text-sm text-stone-400">
                      {selectedVerse?.reference} • {selectedPlace.lat}, {selectedPlace.lng}
                    </p>
                  </div>

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
                  {activeJourney ? activeJourney.reference : selectedVerse?.reference ?? "No selection"}
                </span>
              </div>

              <PlaceMap
                selectedPlace={selectedPlace}
                versePlaces={activeVersePlaces}
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
              ) : activeVersePlaces.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeVersePlaces.map((place) => {
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