export type RelatedVerse = {
  reference: string;
  text: string;
  targetVerseId: string;
};

export type VersePlace = {
  name: string;
  description: string;
  ancientDescription: string;
  biblicalSignificance: string;
  lat: number;
  lng: number;
  relatedVerses: RelatedVerse[];
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
        biblicalSignificance:
          "Jerusalem is one of the most important cities in the Bible. It is associated with the Temple, major feast gatherings, the ministry of Jesus, and many pivotal events in both the Old and New Testaments.",
        lat: 31.778,
        lng: 35.235,
        relatedVerses: [
          {
            reference: "Luke 19:41",
            text: "As he approached Jerusalem and saw the city, he wept over it.",
            targetVerseId: "luke-19-41",
          },
          {
            reference: "Psalm 122:6",
            text: "Pray for the peace of Jerusalem: May those who love you be secure.",
            targetVerseId: "psalm-122-6",
          },
        ],
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
        biblicalSignificance:
          "Nazareth is closely tied to the childhood and early life of Jesus. It became part of his public identity, including the title 'Jesus of Nazareth.'",
        lat: 32.6996,
        lng: 35.3035,
        relatedVerses: [
          {
            reference: "Luke 4:16",
            text: "He went to Nazareth, where he had been brought up, and on the Sabbath day he went into the synagogue, as was his custom.",
            targetVerseId: "luke-4-16",
          },
          {
            reference: "Matthew 2:23",
            text: "And he went and lived in a town called Nazareth. So was fulfilled what was said through the prophets, that he would be called a Nazarene.",
            targetVerseId: "matthew-2-23",
          },
        ],
      },
      {
        name: "Bethlehem",
        description: "Bethlehem is traditionally recognized as the birthplace of Jesus.",
        ancientDescription:
          "In ancient Judea, Bethlehem was a small town tied to the lineage of David.",
        biblicalSignificance:
          "Bethlehem is significant as the city of David and the birthplace of Jesus, making it central to messianic expectation and gospel fulfillment.",
        lat: 31.7054,
        lng: 35.2024,
        relatedVerses: [
          {
            reference: "Micah 5:2",
            text: "But you, Bethlehem Ephrathah... out of you will come for me one who will be ruler over Israel.",
            targetVerseId: "micah-5-2",
          },
          {
            reference: "Matthew 2:1",
            text: "After Jesus was born in Bethlehem in Judea, during the time of King Herod, Magi from the east came to Jerusalem.",
            targetVerseId: "matthew-2-1",
          },
        ],
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
        biblicalSignificance:
          "Damascus is especially important in the New Testament because of Saul's encounter with the risen Christ on the road to the city, a turning point in early Christian history.",
        lat: 33.5138,
        lng: 36.2765,
        relatedVerses: [
          {
            reference: "Acts 9:6",
            text: "Now get up and go into the city, and you will be told what you must do.",
            targetVerseId: "acts-9-6",
          },
          {
            reference: "2 Corinthians 11:32",
            text: "In Damascus the governor under King Aretas had the city of the Damascenes guarded in order to arrest me.",
            targetVerseId: "second-corinthians-11-32",
          },
        ],
      },
    ],
  },
  {
    id: "luke-19-41",
    reference: "Luke 19:41",
    text: "As he approached Jerusalem and saw the city, he wept over it.",
    places: [
      {
        name: "Jerusalem",
        description: "Jerusalem was the religious and cultural center of Jewish life in the first century.",
        ancientDescription:
          "In ancient times, Jerusalem was home to the Temple and was central to pilgrimage, worship, and major feast observances.",
        biblicalSignificance:
          "Jerusalem is one of the most important cities in the Bible. It is associated with the Temple, major feast gatherings, the ministry of Jesus, and many pivotal events in both the Old and New Testaments.",
        lat: 31.778,
        lng: 35.235,
        relatedVerses: [
          {
            reference: "John 2:13",
            text: "When it was almost time for the Jewish Passover, Jesus went up to Jerusalem.",
            targetVerseId: "john-2-13",
          },
        ],
      },
    ],
  },
  {
    id: "psalm-122-6",
    reference: "Psalm 122:6",
    text: "Pray for the peace of Jerusalem: May those who love you be secure.",
    places: [
      {
        name: "Jerusalem",
        description: "Jerusalem was the religious and cultural center of Jewish life in the first century.",
        ancientDescription:
          "In ancient times, Jerusalem was home to the Temple and was central to pilgrimage, worship, and major feast observances.",
        biblicalSignificance:
          "Jerusalem is one of the most important cities in the Bible. It is associated with the Temple, major feast gatherings, the ministry of Jesus, and many pivotal events in both the Old and New Testaments.",
        lat: 31.778,
        lng: 35.235,
        relatedVerses: [
          {
            reference: "John 2:13",
            text: "When it was almost time for the Jewish Passover, Jesus went up to Jerusalem.",
            targetVerseId: "john-2-13",
          },
        ],
      },
    ],
  },
  {
    id: "luke-4-16",
    reference: "Luke 4:16",
    text: "He went to Nazareth, where he had been brought up, and on the Sabbath day he went into the synagogue, as was his custom.",
    places: [
      {
        name: "Nazareth",
        description: "Nazareth was a small village in Galilee associated with Jesus' early life.",
        ancientDescription:
          "Ancient Nazareth was a modest settlement in lower Galilee during the Roman period.",
        biblicalSignificance:
          "Nazareth is closely tied to the childhood and early life of Jesus. It became part of his public identity, including the title 'Jesus of Nazareth.'",
        lat: 32.6996,
        lng: 35.3035,
        relatedVerses: [
          {
            reference: "Luke 2:4",
            text: "So Joseph also went up from the town of Nazareth in Galilee to Judea, to Bethlehem the town of David.",
            targetVerseId: "luke-2-4",
          },
        ],
      },
    ],
  },
  {
    id: "matthew-2-23",
    reference: "Matthew 2:23",
    text: "And he went and lived in a town called Nazareth. So was fulfilled what was said through the prophets, that he would be called a Nazarene.",
    places: [
      {
        name: "Nazareth",
        description: "Nazareth was a small village in Galilee associated with Jesus' early life.",
        ancientDescription:
          "Ancient Nazareth was a modest settlement in lower Galilee during the Roman period.",
        biblicalSignificance:
          "Nazareth is closely tied to the childhood and early life of Jesus. It became part of his public identity, including the title 'Jesus of Nazareth.'",
        lat: 32.6996,
        lng: 35.3035,
        relatedVerses: [
          {
            reference: "Luke 2:4",
            text: "So Joseph also went up from the town of Nazareth in Galilee to Judea, to Bethlehem the town of David.",
            targetVerseId: "luke-2-4",
          },
        ],
      },
    ],
  },
  {
    id: "micah-5-2",
    reference: "Micah 5:2",
    text: "But you, Bethlehem Ephrathah... out of you will come for me one who will be ruler over Israel.",
    places: [
      {
        name: "Bethlehem",
        description: "Bethlehem is traditionally recognized as the birthplace of Jesus.",
        ancientDescription:
          "In ancient Judea, Bethlehem was a small town tied to the lineage of David.",
        biblicalSignificance:
          "Bethlehem is significant as the city of David and the birthplace of Jesus, making it central to messianic expectation and gospel fulfillment.",
        lat: 31.7054,
        lng: 35.2024,
        relatedVerses: [
          {
            reference: "Luke 2:4",
            text: "So Joseph also went up from the town of Nazareth in Galilee to Judea, to Bethlehem the town of David.",
            targetVerseId: "luke-2-4",
          },
        ],
      },
    ],
  },
  {
    id: "matthew-2-1",
    reference: "Matthew 2:1",
    text: "After Jesus was born in Bethlehem in Judea, during the time of King Herod, Magi from the east came to Jerusalem.",
    places: [
      {
        name: "Bethlehem",
        description: "Bethlehem is traditionally recognized as the birthplace of Jesus.",
        ancientDescription:
          "In ancient Judea, Bethlehem was a small town tied to the lineage of David.",
        biblicalSignificance:
          "Bethlehem is significant as the city of David and the birthplace of Jesus, making it central to messianic expectation and gospel fulfillment.",
        lat: 31.7054,
        lng: 35.2024,
        relatedVerses: [
          {
            reference: "Luke 2:4",
            text: "So Joseph also went up from the town of Nazareth in Galilee to Judea, to Bethlehem the town of David.",
            targetVerseId: "luke-2-4",
          },
        ],
      },
      {
        name: "Jerusalem",
        description: "Jerusalem was the religious and cultural center of Jewish life in the first century.",
        ancientDescription:
          "In ancient times, Jerusalem was home to the Temple and was central to pilgrimage, worship, and major feast observances.",
        biblicalSignificance:
          "Jerusalem is one of the most important cities in the Bible. It is associated with the Temple, major feast gatherings, the ministry of Jesus, and many pivotal events in both the Old and New Testaments.",
        lat: 31.778,
        lng: 35.235,
        relatedVerses: [
          {
            reference: "John 2:13",
            text: "When it was almost time for the Jewish Passover, Jesus went up to Jerusalem.",
            targetVerseId: "john-2-13",
          },
        ],
      },
    ],
  },
  {
    id: "acts-9-6",
    reference: "Acts 9:6",
    text: "Now get up and go into the city, and you will be told what you must do.",
    places: [
      {
        name: "Damascus",
        description: "Damascus is one of the oldest continuously inhabited cities in the world.",
        ancientDescription:
          "In the ancient world, Damascus was a major city linked to trade routes and regional power.",
        biblicalSignificance:
          "Damascus is especially important in the New Testament because of Saul's encounter with the risen Christ on the road to the city, a turning point in early Christian history.",
        lat: 33.5138,
        lng: 36.2765,
        relatedVerses: [
          {
            reference: "Acts 9:3",
            text: "As he neared Damascus on his journey, suddenly a light from heaven flashed around him.",
            targetVerseId: "acts-9-3",
          },
        ],
      },
    ],
  },
  {
    id: "second-corinthians-11-32",
    reference: "2 Corinthians 11:32",
    text: "In Damascus the governor under King Aretas had the city of the Damascenes guarded in order to arrest me.",
    places: [
      {
        name: "Damascus",
        description: "Damascus is one of the oldest continuously inhabited cities in the world.",
        ancientDescription:
          "In the ancient world, Damascus was a major city linked to trade routes and regional power.",
        biblicalSignificance:
          "Damascus is especially important in the New Testament because of Saul's encounter with the risen Christ on the road to the city, a turning point in early Christian history.",
        lat: 33.5138,
        lng: 36.2765,
        relatedVerses: [
          {
            reference: "Acts 9:3",
            text: "As he neared Damascus on his journey, suddenly a light from heaven flashed around him.",
            targetVerseId: "acts-9-3",
          },
        ],
      },
    ],
  },
];