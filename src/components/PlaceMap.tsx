"use client";

import { useMemo } from "react";
import {
  CircleMarker,
  ImageOverlay,
  MapContainer,
  Marker,
  Pane,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import type { VersePlace } from "@/data/verses";
import type { Journey } from "@/data/journeys";
import "leaflet/dist/leaflet.css";
import "@/components/LeafletMarkerFix";
import MapBehavior from "@/components/MapBehavior";

type PlaceMapProps = {
  selectedPlace: VersePlace | null;
  versePlaces: VersePlace[];
  mapMode: "modern" | "ancient";
  activeJourney: Journey | null;
};

export default function PlaceMap({
  selectedPlace,
  versePlaces,
  mapMode,
  activeJourney,
}: PlaceMapProps) {
  const defaultCenter: [number, number] = [31.778, 35.235];

  const mapClassName =
    mapMode === "ancient"
      ? "h-[380px] w-full sepia-[0.55] saturate-[0.8] contrast-[0.95] brightness-[0.95]"
      : "h-[380px] w-full";

  const overlayBounds = useMemo(
    () =>
      [
        [29.0, 33.0],
        [35.5, 37.8],
      ] as [[number, number], [number, number]],
    []
  );

  const routePositions =
    activeJourney?.stops.map((stop) => [stop.lat, stop.lng] as [number, number]) ?? [];

  const center =
    selectedPlace
      ? ([selectedPlace.lat, selectedPlace.lng] as [number, number])
      : activeJourney?.stops[0]
      ? ([activeJourney.stops[0].lat, activeJourney.stops[0].lng] as [number, number])
      : versePlaces[0]
      ? ([versePlaces[0].lat, versePlaces[0].lng] as [number, number])
      : defaultCenter;

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-800">
      <MapContainer center={center} zoom={6} scrollWheelZoom={true} className={mapClassName}>
        <TileLayer
          attribution="&copy; OpenStreetMap & CARTO"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapBehavior
          selectedPlace={selectedPlace}
          versePlaces={versePlaces}
          activeJourney={activeJourney}
        />

        {mapMode === "ancient" && (
          <>
            <Pane name="ancient-overlay" style={{ zIndex: 350 }}>
              <ImageOverlay
                url="/textures/ancient-paper.png"
                bounds={overlayBounds}
                opacity={0.28}
                pane="ancient-overlay"
              />
            </Pane>

            <Pane name="ancient-labels" style={{ zIndex: 500 }}>
              <CircleMarker
                center={[31.778, 35.235]}
                radius={1}
                pathOptions={{ opacity: 0, fillOpacity: 0 }}
                pane="ancient-labels"
              >
                <Tooltip permanent direction="top" offset={[0, -8]}>
                  Judea
                </Tooltip>
              </CircleMarker>

              <CircleMarker
                center={[32.85, 35.2]}
                radius={1}
                pathOptions={{ opacity: 0, fillOpacity: 0 }}
                pane="ancient-labels"
              >
                <Tooltip permanent direction="top" offset={[0, -8]}>
                  Galilee
                </Tooltip>
              </CircleMarker>
            </Pane>
          </>
        )}

        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            pathOptions={{
              color: "#f59e0b",
              weight: 4,
              opacity: 0.9,
              dashArray: "10, 8",
            }}
          />
        )}

        {activeJourney
          ? activeJourney.stops.map((stop) => (
              <Marker key={`${stop.name}-${stop.lat}-${stop.lng}`} position={[stop.lat, stop.lng]}>
                <Popup>
                  <div>
                    <strong>{stop.name}</strong>
                    <br />
                    {stop.description}
                  </div>
                </Popup>
              </Marker>
            ))
          : versePlaces.map((place) => {
              const isSelected = selectedPlace?.name === place.name;

              return (
                <Marker key={`${place.name}-${place.lat}-${place.lng}`} position={[place.lat, place.lng]}>
                  <Popup>
                    <div>
                      <strong>{place.name}</strong>
                      <br />
                      {place.description}
                    </div>
                  </Popup>

                  {isSelected && (
                    <Tooltip permanent direction="top" offset={[0, -18]}>
                      Selected
                    </Tooltip>
                  )}
                </Marker>
              );
            })}
      </MapContainer>
    </div>
  );
}