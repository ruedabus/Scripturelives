export type JourneyStop = {
  name: string;
  lat: number;
  lng: number;
  description: string;
};

export type Journey = {
  id: string;
  title: string;
  reference: string;
  era: string;
  description: string;
  stops: JourneyStop[];
};

export const journeys: Journey[] = [
  {
    id: "paul-damascus",
    title: "Paul's Road to Damascus",
    reference: "Acts 9",
    era: "Roman / Early Church",
    description:
      "A sample journey showing Paul's approach toward Damascus at the time of his dramatic encounter.",
    stops: [
      {
        name: "Jerusalem",
        lat: 31.778,
        lng: 35.235,
        description: "Traditional starting point for this POC route.",
      },
      {
        name: "Damascus",
        lat: 33.5138,
        lng: 36.2765,
        description: "Destination city connected with Paul's conversion account.",
      },
    ],
  },
];