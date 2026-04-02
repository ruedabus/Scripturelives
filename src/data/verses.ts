export type VersePlace = {
  name: string;
  description: string;
  ancientDescription: string;
  lat: number;
  lng: number;
};

export type Verse = {
  id: string;
  reference: string;
  text: string;
  places: VersePlace[];
};

export const verses: Verse[] = [
  {
    id: "john-2-13",
    reference: "John 2:13",
    text: "When it was almost time for the Jewish Passover, Jesus went up to Jerusalem.",
    places: [
      {
        name: "Jerusalem",
        description: "Jerusalem was the religious and cultural center of Jewish life in the first century.",
        ancientDescription:
          "In ancient times, Jerusalem was home to the Temple and was central to pilgrimage, worship, and major feast observances.",
        lat: 31.778,
        lng: 35.235,
      },
    ],
  },
  {
    id: "luke-2-4",
    reference: "Luke 2:4",
    text: "So Joseph also went up from the town of Nazareth in Galilee to Judea, to Bethlehem the town of David.",
    places: [
      {
        name: "Nazareth",
        description: "Nazareth was a small village in Galilee associated with Jesus' early life.",
        ancientDescription:
          "Ancient Nazareth was a modest settlement in lower Galilee during the Roman period.",
        lat: 32.6996,
        lng: 35.3035,
      },
      {
        name: "Bethlehem",
        description: "Bethlehem is traditionally recognized as the birthplace of Jesus.",
        ancientDescription:
          "In ancient Judea, Bethlehem was a small town tied to the lineage of David.",
        lat: 31.7054,
        lng: 35.2024,
      },
    ],
  },
  {
    id: "acts-9-3",
    reference: "Acts 9:3",
    text: "As he neared Damascus on his journey, suddenly a light from heaven flashed around him.",
    places: [
      {
        name: "Damascus",
        description: "Damascus is one of the oldest continuously inhabited cities in the world.",
        ancientDescription:
          "In the ancient world, Damascus was a major city linked to trade routes and regional power.",
        lat: 33.5138,
        lng: 36.2765,
      },
    ],
  },
];