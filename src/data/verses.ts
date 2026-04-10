/** All supported versions — local (KJV/ASV/WEB) + cloud api.bible (NIV/NLT/AMP) */
export type BibleVersion = "KJV" | "WEB" | "ASV" | "NIV" | "NLT" | "AMP";

/** Local-only translation keys stored in verse data */
export type LocalBibleVersion = "KJV" | "WEB" | "ASV";

export type RelatedVerse = {
  reference: string;
  text: string;
  targetVerseId: string;
};

export type PlaceImage = {
  url: string;
  caption: string;
};

export type VersePlace = {
  name: string;
  era: string;
  description: string;
  ancientDescription: string;
  biblicalSignificance: string;
  lat: number;
  lng: number;
  images?: PlaceImage[];
  relatedVerses: RelatedVerse[];
};

export type VerseTranslations = Record<LocalBibleVersion, string>;

export type Verse = {
  id: string;
  reference: string;
  translations: VerseTranslations;
  places: VersePlace[];
  passageId: string;
  passageTitle: string;
};

export const verses: Verse[] = [
  {
    id: "john-2-13",
    reference: "John 2:13",
    translations: {
      KJV: "And the Jews' passover was at hand, and Jesus went up to Jerusalem,",
      WEB: "The Passover of the Jews was at hand, and Jesus went up to Jerusalem.",
      ASV: "And the passover of the Jews was at hand, and Jesus went up to Jerusalem.",
    },
    passageId: "jerusalem-passages",
    passageTitle: "Jerusalem Passages",
    places: [
      {
        name: "Jerusalem",
        era: "Second Temple / New Testament",
        description: "Jerusalem was the religious and cultural center of Jewish life in the first century.",
        ancientDescription:
          "In ancient times, Jerusalem was home to the Temple and was central to pilgrimage, worship, and major feast observances.",
        biblicalSignificance:
          "Jerusalem is one of the most important cities in the Bible. It is associated with the Temple, major feast gatherings, the ministry of Jesus, and many pivotal events in both the Old and New Testaments.",
        lat: 31.778,
        lng: 35.235,
        images: [
          {
            url: "/places/jerusalem.jpg",
            caption: "Suggested placeholder image for Jerusalem.",
          },
          {
            url: "/places/jerusalem-2.jpg",
            caption: "Optional second visual for Jerusalem, such as an archaeological or reconstructed view.",
          },
        ],
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
    id: "luke-19-41",
    reference: "Luke 19:41",
    translations: {
      KJV: "And when he was come near, he beheld the city, and wept over it,",
      WEB: "When he came near, he saw the city and wept over it,",
      ASV: "And when he drew nigh, he saw the city and wept over it,",
    },
    passageId: "jerusalem-passages",
    passageTitle: "Jerusalem Passages",
    places: [
      {
        name: "Jerusalem",
        era: "Second Temple / New Testament",
        description: "Jerusalem was the religious and cultural center of Jewish life in the first century.",
        ancientDescription:
          "In ancient times, Jerusalem was home to the Temple and was central to pilgrimage, worship, and major feast observances.",
        biblicalSignificance:
          "Jerusalem is one of the most important cities in the Bible. It is associated with the Temple, major feast gatherings, the ministry of Jesus, and many pivotal events in both the Old and New Testaments.",
        lat: 31.778,
        lng: 35.235,
        images: [
          {
            url: "/places/jerusalem.jpg",
            caption: "Suggested placeholder image for Jerusalem.",
          },
          {
            url: "/places/jerusalem-2.jpg",
            caption: "Optional second visual for Jerusalem, such as an archaeological or reconstructed view.",
          },
        ],
        relatedVerses: [
          {
            reference: "John 2:13",
            text: "And the Jews' passover was at hand, and Jesus went up to Jerusalem,",
            targetVerseId: "john-2-13",
          },
        ],
      },
    ],
  },
  {
    id: "psalm-122-6",
    reference: "Psalm 122:6",
    translations: {
      KJV: "Pray for the peace of Jerusalem: they shall prosper that love thee.",
      WEB: "Pray for the peace of Jerusalem. Those who love you will prosper.",
      ASV: "Pray for the peace of Jerusalem: They shall prosper that love thee.",
    },
    passageId: "jerusalem-passages",
    passageTitle: "Jerusalem Passages",
    places: [
      {
        name: "Jerusalem",
        era: "Monarchy to Second Temple",
        description: "Jerusalem was the religious and cultural center of Jewish life in biblical history.",
        ancientDescription:
          "Jerusalem stood at the heart of worship, kingship, and temple life across major periods of Israel's history.",
        biblicalSignificance:
          "Jerusalem is central to covenant history, kingship, worship, prophecy, exile, return, and messianic expectation.",
        lat: 31.778,
        lng: 35.235,
        images: [
          {
            url: "/places/jerusalem.jpg",
            caption: "Suggested placeholder image for Jerusalem.",
          },
          {
            url: "/places/jerusalem-2.jpg",
            caption: "Optional second visual for Jerusalem, such as an archaeological or reconstructed view.",
          },
        ],
        relatedVerses: [
          {
            reference: "John 2:13",
            text: "And the Jews' passover was at hand, and Jesus went up to Jerusalem,",
            targetVerseId: "john-2-13",
          },
        ],
      },
    ],
  },
  {
    id: "luke-2-4",
    reference: "Luke 2:4",
    translations: {
      KJV: "And Joseph also went up from Galilee, out of the city of Nazareth, into Judaea, unto the city of David, which is called Bethlehem.",
      WEB: "Joseph also went up from Galilee, out of the city of Nazareth, into Judea, to David's city, which is called Bethlehem.",
      ASV: "And Joseph also went up from Galilee, out of the city of Nazareth, into Judaea, to the city of David, which is called Bethlehem.",
    },
    passageId: "birth-narrative",
    passageTitle: "Birth Narrative",
    places: [
      {
        name: "Nazareth",
        era: "Roman / New Testament",
        description: "Nazareth was a small village in Galilee associated with Jesus' early life.",
        ancientDescription:
          "Ancient Nazareth was a modest settlement in lower Galilee during the Roman period.",
        biblicalSignificance:
          "Nazareth is closely tied to the childhood and early life of Jesus. It became part of his public identity, including the title 'Jesus of Nazareth.'",
        lat: 32.6996,
        lng: 35.3035,
        images: [
          {
            url: "/places/nazareth.jpg",
            caption: "Suggested placeholder image for Nazareth.",
          },
          {
            url: "/places/nazareth-2.jpg",
            caption: "Optional second visual for Nazareth.",
          },
        ],
        relatedVerses: [
          {
            reference: "Luke 4:16",
            text: "And he came to Nazareth, where he had been brought up.",
            targetVerseId: "luke-4-16",
          },
          {
            reference: "Matthew 2:23",
            text: "And he came and dwelt in a city called Nazareth.",
            targetVerseId: "matthew-2-23",
          },
        ],
      },
      {
        name: "Bethlehem",
        era: "Monarchy to Roman / Messianic Context",
        description: "Bethlehem is traditionally recognized as the birthplace of Jesus.",
        ancientDescription:
          "In ancient Judea, Bethlehem was a small town tied to the lineage of David.",
        biblicalSignificance:
          "Bethlehem is significant as the city of David and the birthplace of Jesus, making it central to messianic expectation and gospel fulfillment.",
        lat: 31.7054,
        lng: 35.2024,
        images: [
          {
            url: "/places/bethlehem.jpg",
            caption: "Suggested placeholder image for Bethlehem.",
          },
          {
            url: "/places/bethlehem-2.jpg",
            caption: "Optional second visual for Bethlehem.",
          },
        ],
        relatedVerses: [
          {
            reference: "Micah 5:2",
            text: "But thou, Bethlehem Ephrathah... out of thee shall one come forth unto me.",
            targetVerseId: "micah-5-2",
          },
          {
            reference: "Matthew 2:1",
            text: "Now when Jesus was born in Bethlehem of Judaea.",
            targetVerseId: "matthew-2-1",
          },
        ],
      },
    ],
  },
  {
    id: "luke-4-16",
    reference: "Luke 4:16",
    translations: {
      KJV: "And he came to Nazareth, where he had been brought up.",
      WEB: "He came to Nazareth, where he had been brought up.",
      ASV: "And he came to Nazareth, where he had been brought up.",
    },
    passageId: "birth-narrative",
    passageTitle: "Birth Narrative",
    places: [
      {
        name: "Nazareth",
        era: "Roman / New Testament",
        description: "Nazareth was a small village in Galilee associated with Jesus' early life.",
        ancientDescription:
          "Ancient Nazareth was a modest settlement in lower Galilee during the Roman period.",
        biblicalSignificance:
          "Nazareth is closely tied to the childhood and early life of Jesus. It became part of his public identity, including the title 'Jesus of Nazareth.'",
        lat: 32.6996,
        lng: 35.3035,
        images: [
          {
            url: "/places/nazareth.jpg",
            caption: "Suggested placeholder image for Nazareth.",
          },
          {
            url: "/places/nazareth-2.jpg",
            caption: "Optional second visual for Nazareth.",
          },
        ],
        relatedVerses: [
          {
            reference: "Luke 2:4",
            text: "And Joseph also went up from Galilee, out of the city of Nazareth...",
            targetVerseId: "luke-2-4",
          },
        ],
      },
    ],
  },
  {
    id: "matthew-2-23",
    reference: "Matthew 2:23",
    translations: {
      KJV: "And he came and dwelt in a city called Nazareth.",
      WEB: "He came and lived in a city called Nazareth.",
      ASV: "And came and dwelt in a city called Nazareth.",
    },
    passageId: "birth-narrative",
    passageTitle: "Birth Narrative",
    places: [
      {
        name: "Nazareth",
        era: "Roman / New Testament",
        description: "Nazareth was a small village in Galilee associated with Jesus' early life.",
        ancientDescription:
          "Ancient Nazareth was a modest settlement in lower Galilee during the Roman period.",
        biblicalSignificance:
          "Nazareth is closely tied to the childhood and early life of Jesus. It became part of his public identity, including the title 'Jesus of Nazareth.'",
        lat: 32.6996,
        lng: 35.3035,
        images: [
          {
            url: "/places/nazareth.jpg",
            caption: "Suggested placeholder image for Nazareth.",
          },
          {
            url: "/places/nazareth-2.jpg",
            caption: "Optional second visual for Nazareth.",
          },
        ],
        relatedVerses: [
          {
            reference: "Luke 2:4",
            text: "And Joseph also went up from Galilee, out of the city of Nazareth...",
            targetVerseId: "luke-2-4",
          },
        ],
      },
    ],
  },
  {
    id: "micah-5-2",
    reference: "Micah 5:2",
    translations: {
      KJV: "But thou, Bethlehem Ephratah... out of thee shall he come forth unto me that is to be ruler in Israel.",
      WEB: "But you, Bethlehem Ephrathah... out of you one will come out to me that is to be ruler in Israel.",
      ASV: "But thou, Bethlehem Ephrathah... out of thee shall one come forth unto me that is to be ruler in Israel.",
    },
    passageId: "birth-narrative",
    passageTitle: "Birth Narrative",
    places: [
      {
        name: "Bethlehem",
        era: "Monarchy / Prophetic",
        description: "Bethlehem is the city of David and a place of deep prophetic significance.",
        ancientDescription:
          "In ancient Judah, Bethlehem was a small but symbolically important town tied to royal lineage and prophetic expectation.",
        biblicalSignificance:
          "Bethlehem is central to messianic prophecy because it is linked both to Davidic kingship and to the promised ruler to come.",
        lat: 31.7054,
        lng: 35.2024,
        images: [
          {
            url: "/places/bethlehem.jpg",
            caption: "Suggested placeholder image for Bethlehem.",
          },
          {
            url: "/places/bethlehem-2.jpg",
            caption: "Optional second visual for Bethlehem.",
          },
        ],
        relatedVerses: [
          {
            reference: "Luke 2:4",
            text: "And Joseph also went up from Galilee... unto the city of David, which is called Bethlehem.",
            targetVerseId: "luke-2-4",
          },
        ],
      },
    ],
  },
  {
    id: "matthew-2-1",
    reference: "Matthew 2:1",
    translations: {
      KJV: "Now when Jesus was born in Bethlehem of Judaea in the days of Herod the king, behold, there came wise men.",
      WEB: "Now when Jesus was born in Bethlehem of Judea in the days of King Herod, behold, wise men came.",
      ASV: "Now when Jesus was born in Bethlehem of Judaea in the days of Herod the king, behold, Wise-men came.",
    },
    passageId: "birth-narrative",
    passageTitle: "Birth Narrative",
    places: [
      {
        name: "Bethlehem",
        era: "Roman / Birth Narrative",
        description: "Bethlehem is traditionally recognized as the birthplace of Jesus.",
        ancientDescription:
          "Under Roman rule, Bethlehem remained a small Judean town but carried immense symbolic weight because of its Davidic and messianic associations.",
        biblicalSignificance:
          "Bethlehem connects the Davidic promise and the birth of Jesus in a way that is foundational to the gospel narrative.",
        lat: 31.7054,
        lng: 35.2024,
        images: [
          {
            url: "/places/bethlehem.jpg",
            caption: "Suggested placeholder image for Bethlehem.",
          },
          {
            url: "/places/bethlehem-2.jpg",
            caption: "Optional second visual for Bethlehem.",
          },
        ],
        relatedVerses: [
          {
            reference: "Luke 2:4",
            text: "And Joseph also went up from Galilee... unto Bethlehem.",
            targetVerseId: "luke-2-4",
          },
        ],
      },
      {
        name: "Jerusalem",
        era: "Second Temple / New Testament",
        description: "Jerusalem was the religious and political center of Judea.",
        ancientDescription:
          "Jerusalem in this period was shaped by temple life, pilgrimage, Roman oversight, and intense messianic expectation.",
        biblicalSignificance:
          "Jerusalem remains the focal point of worship, kingship, prophecy, and later the passion and resurrection narratives.",
        lat: 31.778,
        lng: 35.235,
        images: [
          {
            url: "/places/jerusalem.jpg",
            caption: "Suggested placeholder image for Jerusalem.",
          },
          {
            url: "/places/jerusalem-2.jpg",
            caption: "Optional second visual for Jerusalem, such as an archaeological or reconstructed view.",
          },
        ],
        relatedVerses: [
          {
            reference: "John 2:13",
            text: "And the Jews' passover was at hand, and Jesus went up to Jerusalem,",
            targetVerseId: "john-2-13",
          },
        ],
      },
    ],
  },
  {
    id: "acts-9-3",
    reference: "Acts 9:3",
    translations: {
      KJV: "And as he journeyed, he came near Damascus: and suddenly there shined round about him a light from heaven:",
      WEB: "As he traveled, he got close to Damascus, and suddenly a light from the sky shone around him.",
      ASV: "And as he journeyed, it came to pass that he drew nigh unto Damascus: and suddenly there shone round about him a light out of heaven:",
    },
    passageId: "damascus-road",
    passageTitle: "Damascus Road",
    places: [
      {
        name: "Damascus",
        era: "Ancient Near East to Roman",
        description: "Damascus is one of the oldest continuously inhabited cities in the world.",
        ancientDescription:
          "In the ancient world, Damascus was a major city linked to trade routes and regional power.",
        biblicalSignificance:
          "Damascus is especially important in the New Testament because of Saul's encounter with the risen Christ on the road to the city, a turning point in early Christian history.",
        lat: 33.5138,
        lng: 36.2765,
        images: [
          {
            url: "/places/damascus.jpg",
            caption: "Suggested placeholder image for Damascus.",
          },
          {
            url: "/places/damascus-2.jpg",
            caption: "Optional second visual for Damascus.",
          },
        ],
        relatedVerses: [
          {
            reference: "Acts 9:6",
            text: "Arise, and go into the city, and it shall be told thee what thou must do.",
            targetVerseId: "acts-9-6",
          },
          {
            reference: "2 Corinthians 11:32",
            text: "In Damascus the governor under Aretas the king kept the city...",
            targetVerseId: "second-corinthians-11-32",
          },
        ],
      },
    ],
  },
  {
    id: "acts-9-6",
    reference: "Acts 9:6",
    translations: {
      KJV: "Arise, and go into the city, and it shall be told thee what thou must do.",
      WEB: "But rise up and enter into the city, and you will be told what you must do.",
      ASV: "But rise, and enter into the city, and it shall be told thee what thou must do.",
    },
    passageId: "damascus-road",
    passageTitle: "Damascus Road",
    places: [
      {
        name: "Damascus",
        era: "Roman / Early Church",
        description: "Damascus remained a major urban center and became a key setting in Saul's conversion story.",
        ancientDescription:
          "Its regional importance made it a major meeting point of peoples, trade, and imperial power.",
        biblicalSignificance:
          "Damascus is one of the great turning-point settings in the New Testament because it frames the conversion and commission of Saul, later Paul.",
        lat: 33.5138,
        lng: 36.2765,
        images: [
          {
            url: "/places/damascus.jpg",
            caption: "Suggested placeholder image for Damascus.",
          },
          {
            url: "/places/damascus-2.jpg",
            caption: "Optional second visual for Damascus.",
          },
        ],
        relatedVerses: [
          {
            reference: "Acts 9:3",
            text: "And as he journeyed, he came near Damascus...",
            targetVerseId: "acts-9-3",
          },
        ],
      },
    ],
  },
  {
    id: "second-corinthians-11-32",
    reference: "2 Corinthians 11:32",
    translations: {
      KJV: "In Damascus the governor under Aretas the king kept the city of the Damascenes with a garrison, desirous to apprehend me:",
      WEB: "In Damascus the governor under Aretas the king guarded the city of the Damascenes desiring to arrest me.",
      ASV: "In Damascus the governor under Aretas the king guarded the city of the Damascenes in order to take me:",
    },
    passageId: "damascus-road",
    passageTitle: "Damascus Road",
    places: [
      {
        name: "Damascus",
        era: "Roman / Early Church",
        description: "Damascus was an important city in Paul's memory and ministry context.",
        ancientDescription:
          "The city was strategically significant and politically watched, making it a fitting setting for both conflict and calling.",
        biblicalSignificance:
          "Damascus continues to appear as a marker of early Christian mission, opposition, and divine redirection.",
        lat: 33.5138,
        lng: 36.2765,
        images: [
          {
            url: "/places/damascus.jpg",
            caption: "Suggested placeholder image for Damascus.",
          },
          {
            url: "/places/damascus-2.jpg",
            caption: "Optional second visual for Damascus.",
          },
        ],
        relatedVerses: [
          {
            reference: "Acts 9:3",
            text: "And as he journeyed, he came near Damascus...",
            targetVerseId: "acts-9-3",
          },
        ],
      },
    ],
  },
];