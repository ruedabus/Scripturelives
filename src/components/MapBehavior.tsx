"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { VersePlace } from "@/data/verses";
import type { Journey } from "@/data/journeys";

type MapBehaviorProps = {
  selectedPlace: VersePlace | null;
  versePlaces: VersePlace[];
  activeJourney: Journey | null;
};

export default function MapBehavior({
  selectedPlace,
  versePlaces,
  activeJourney,
}: MapBehaviorProps) {
  const map = useMap();

  useEffect(() => {
    if (activeJourney && activeJourney.stops.length > 1) {
      const bounds = L.latLngBounds(
        activeJourney.stops.map((stop) => [stop.lat, stop.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [40, 40] });
      return;
    }

    if (selectedPlace) {
      map.flyTo([selectedPlace.lat, selectedPlace.lng], 8, {
        duration: 1.2,
      });
      return;
    }

    if (versePlaces.length > 1) {
      const bounds = L.latLngBounds(
        versePlaces.map((place) => [place.lat, place.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [40, 40] });
      return;
    }

    if (versePlaces.length === 1) {
      map.flyTo([versePlaces[0].lat, versePlaces[0].lng], 8, {
        duration: 1.2,
      });
    }
  }, [map, selectedPlace, versePlaces, activeJourney]);

  return null;
}