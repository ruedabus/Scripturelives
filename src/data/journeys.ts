export type JourneyStop = {
  name: string;
  lat: number;
  lng: number;
  description: string;
  reference?: string;   // e.g. "Genesis 12:1"
  book?: string;        // for Full Bible navigation
  chapter?: number;
  visualTerm?: string;  // triggers Visual Reference search
};

export type JourneyEra =
  | "Patriarchal"
  | "Exodus & Wilderness"
  | "Conquest & Judges"
  | "Life of Christ"
  | "Early Church";

export type Journey = {
  id: string;
  title: string;
  reference: string;
  era: JourneyEra;
  description: string;
  icon: string;
  theme: string;        // key figure/term for Visual Reference
  stops: JourneyStop[];
};

export const JOURNEY_ERA_DOT: Record<JourneyEra, string> = {
  "Patriarchal":         "bg-amber-500",
  "Exodus & Wilderness": "bg-orange-500",
  "Conquest & Judges":   "bg-yellow-500",
  "Life of Christ":      "bg-violet-500",
  "Early Church":        "bg-rose-500",
};

export const JOURNEY_ERA_BADGE: Record<JourneyEra, string> = {
  "Patriarchal":         "bg-amber-50 border-amber-200 text-amber-700",
  "Exodus & Wilderness": "bg-orange-50 border-orange-200 text-orange-700",
  "Conquest & Judges":   "bg-yellow-50 border-yellow-200 text-yellow-700",
  "Life of Christ":      "bg-violet-50 border-violet-200 text-violet-700",
  "Early Church":        "bg-rose-50 border-rose-200 text-rose-700",
};

export const ALL_JOURNEY_ERAS: JourneyEra[] = [
  "Patriarchal",
  "Exodus & Wilderness",
  "Conquest & Judges",
  "Life of Christ",
  "Early Church",
];

export const journeys: Journey[] = [

  // ── PATRIARCHAL ─────────────────────────────────────────────────────────────
  {
    id: "abraham-calling",
    title: "Abraham's Journey to Canaan",
    reference: "Genesis 12–13",
    era: "Patriarchal",
    icon: "🏕",
    theme: "Abraham",
    description:
      "God called Abram out of Ur of the Chaldees, through Haran, into the land of Canaan — the first great act of faith in the Bible. He would become the father of nations and a blessing to all peoples.",
    stops: [
      {
        name: "Ur of the Chaldees",
        lat: 30.9626, lng: 46.1033,
        description: "Birthplace of Abram. A prosperous Sumerian city-state in southern Mesopotamia. God's call came here to leave everything behind.",
        reference: "Genesis 11:31", book: "Genesis", chapter: 11, visualTerm: "Ur of the Chaldees",
      },
      {
        name: "Haran",
        lat: 36.8637, lng: 39.0325,
        description: "The family settled in Haran after leaving Ur. Abram's father Terah died here. God renewed the call: 'Get out of your country… to a land I will show you.'",
        reference: "Genesis 12:1–4", book: "Genesis", chapter: 12, visualTerm: "Haran ancient city",
      },
      {
        name: "Shechem",
        lat: 32.2065, lng: 35.2776,
        description: "The first stop in Canaan. God appeared to Abram and promised, 'To your descendants I will give this land.' Abram built an altar here.",
        reference: "Genesis 12:6–7", book: "Genesis", chapter: 12, visualTerm: "Shechem Canaan",
      },
      {
        name: "Bethel",
        lat: 31.9274, lng: 35.2237,
        description: "Abram camped between Bethel and Ai, built another altar, and called on the name of the Lord.",
        reference: "Genesis 12:8", book: "Genesis", chapter: 12, visualTerm: "Bethel ancient Israel",
      },
      {
        name: "Egypt",
        lat: 30.0444, lng: 31.2357,
        description: "Driven south by famine, Abram and Sarai descended into Egypt. God protected Sarai and brought them out with great wealth.",
        reference: "Genesis 12:10–20", book: "Genesis", chapter: 12, visualTerm: "ancient Egypt",
      },
      {
        name: "Hebron / Mamre",
        lat: 31.5326, lng: 35.0998,
        description: "Abram settled by the oaks of Mamre near Hebron. He received the three visitors who promised a son, and this became his home for much of his life.",
        reference: "Genesis 13:18", book: "Genesis", chapter: 13, visualTerm: "Hebron ancient",
      },
    ],
  },

  {
    id: "jacob-haran",
    title: "Jacob's Flight to Haran & Return",
    reference: "Genesis 28–33",
    era: "Patriarchal",
    icon: "🌅",
    theme: "Jacob Israel",
    description:
      "Jacob fled from Esau's wrath to his uncle Laban in Haran, encountered God at Bethel, labored twenty years, and returned to Canaan as Israel — wrestling with God along the way.",
    stops: [
      {
        name: "Beersheba",
        lat: 31.2518, lng: 34.7913,
        description: "Jacob departed from Beersheba, fleeing from Esau who had sworn to kill him.",
        reference: "Genesis 28:10", book: "Genesis", chapter: 28, visualTerm: "Beersheba ancient",
      },
      {
        name: "Bethel",
        lat: 31.9274, lng: 35.2237,
        description: "Jacob slept with a stone for a pillow and dreamed of a ladder to heaven. God stood above it and promised the land to his descendants. Jacob named it Bethel — 'House of God.'",
        reference: "Genesis 28:11–19", book: "Genesis", chapter: 28, visualTerm: "Jacob's ladder Bethel",
      },
      {
        name: "Haran",
        lat: 36.8637, lng: 39.0325,
        description: "Jacob worked for Laban for twenty years. Here his twelve sons were born — the twelve tribes of Israel.",
        reference: "Genesis 29:1–30", book: "Genesis", chapter: 29, visualTerm: "Haran Mesopotamia",
      },
      {
        name: "Peniel / Jabbok Ford",
        lat: 32.3100, lng: 35.5900,
        description: "Jacob wrestled with God all night and refused to let go until he received a blessing. God renamed him Israel — 'one who strives with God.'",
        reference: "Genesis 32:22–32", book: "Genesis", chapter: 32, visualTerm: "Jacob wrestling angel Peniel",
      },
      {
        name: "Shechem",
        lat: 32.2065, lng: 35.2776,
        description: "Jacob returned safely to Canaan and arrived at Shechem, where he bought a plot of land and erected an altar — El Elohe Israel.",
        reference: "Genesis 33:18–20", book: "Genesis", chapter: 33, visualTerm: "Shechem Canaan",
      },
    ],
  },

  // ── EXODUS & WILDERNESS ──────────────────────────────────────────────────────
  {
    id: "exodus-wilderness",
    title: "The Exodus: Egypt to the Promised Land",
    reference: "Exodus 12 – Deuteronomy 34",
    era: "Exodus & Wilderness",
    icon: "🔥",
    theme: "Moses Exodus",
    description:
      "God delivered His people from four hundred years of Egyptian bondage through mighty signs and wonders, led them through the wilderness forty years, and brought them to the threshold of Canaan.",
    stops: [
      {
        name: "Rameses / Goshen",
        lat: 30.8668, lng: 31.8199,
        description: "The Israelites labored in Goshen. On Passover night the death angel passed over those who had applied the blood of the lamb. At dawn, 600,000 men plus women and children departed.",
        reference: "Exodus 12:37", book: "Exodus", chapter: 12, visualTerm: "ancient Goshen Egypt Rameses",
      },
      {
        name: "Red Sea Crossing",
        lat: 29.9200, lng: 32.5500,
        description: "Pharaoh's army pursued Israel to the sea. Moses stretched his rod over the waters; God divided the sea and Israel walked through on dry ground. The Egyptians were drowned when the waters returned.",
        reference: "Exodus 14:21–31", book: "Exodus", chapter: 14, visualTerm: "Red Sea crossing Moses",
      },
      {
        name: "Marah",
        lat: 29.1000, lng: 33.0000,
        description: "The bitter waters of Marah could not be drunk. God showed Moses a tree; when cast in, the waters became sweet. The first test of faith in the wilderness.",
        reference: "Exodus 15:23–25", book: "Exodus", chapter: 15, visualTerm: "Marah bitter waters wilderness",
      },
      {
        name: "Mount Sinai",
        lat: 28.5397, lng: 33.9750,
        description: "God descended in fire upon Sinai. Moses received the Ten Commandments and the Law. The Tabernacle was revealed. Israel camped here for nearly a year.",
        reference: "Exodus 19:1–3", book: "Exodus", chapter: 19, visualTerm: "Mount Sinai Ten Commandments",
      },
      {
        name: "Kadesh-Barnea",
        lat: 30.3000, lng: 34.4000,
        description: "Twelve spies were sent into Canaan. Ten brought a bad report; only Caleb and Joshua believed God. Because of unbelief, an entire generation wandered forty years in the desert.",
        reference: "Numbers 13–14", book: "Numbers", chapter: 13, visualTerm: "Kadesh Barnea wilderness",
      },
      {
        name: "Plains of Moab",
        lat: 31.8433, lng: 35.5460,
        description: "Forty years later, a new generation stood across from Jericho. Moses gave his final sermons, climbed Nebo to view the land, and died. Joshua would lead them in.",
        reference: "Deuteronomy 34:1–4", book: "Deuteronomy", chapter: 34, visualTerm: "Plains of Moab Jordan River",
      },
    ],
  },

  // ── LIFE OF CHRIST ───────────────────────────────────────────────────────────
  {
    id: "nativity-journey",
    title: "The Nativity Journey",
    reference: "Luke 2; Matthew 2",
    era: "Life of Christ",
    icon: "⭐",
    theme: "Bethlehem nativity",
    description:
      "Joseph and Mary traveled from Nazareth to Bethlehem for the census, where Jesus was born. After the Magi's visit the family fled to Egypt to escape Herod, then returned to Nazareth.",
    stops: [
      {
        name: "Nazareth",
        lat: 32.7021, lng: 35.2965,
        description: "Gabriel appeared to Mary here and announced she would conceive the Son of God by the Holy Spirit. Joseph also received his angelic dream here.",
        reference: "Luke 1:26–38", book: "Luke", chapter: 1, visualTerm: "Nazareth ancient village",
      },
      {
        name: "Bethlehem",
        lat: 31.7054, lng: 35.1981,
        description: "Joseph and Mary journeyed for the Roman census, fulfilling Micah's prophecy. Finding no room, Mary gave birth in a stable. Angels announced the birth to nearby shepherds.",
        reference: "Luke 2:4–7", book: "Luke", chapter: 2, visualTerm: "Bethlehem manger nativity",
      },
      {
        name: "Jerusalem — Temple",
        lat: 31.7784, lng: 35.2354,
        description: "The infant Jesus was presented at the Temple. Simeon took the child in his arms: 'Lord, now let Your servant depart in peace.' Anna the prophetess also gave thanks.",
        reference: "Luke 2:22–38", book: "Luke", chapter: 2, visualTerm: "Jerusalem Temple Herod",
      },
      {
        name: "Egypt",
        lat: 30.0444, lng: 31.2357,
        description: "An angel warned Joseph to flee to Egypt, for Herod sought the child's life. The family remained until Herod died, fulfilling 'Out of Egypt I called my Son.'",
        reference: "Matthew 2:13–15", book: "Matthew", chapter: 2, visualTerm: "flight to Egypt Holy Family",
      },
      {
        name: "Nazareth",
        lat: 32.7121, lng: 35.3065,
        description: "The family returned from Egypt and settled again in Nazareth, where Jesus 'grew and became strong, filled with wisdom, and the grace of God was upon Him.'",
        reference: "Luke 2:39–40", book: "Luke", chapter: 2, visualTerm: "Nazareth childhood Jesus",
      },
    ],
  },

  {
    id: "jesus-ministry",
    title: "The Ministry of Jesus",
    reference: "Matthew – John",
    era: "Life of Christ",
    icon: "✦",
    theme: "Jesus ministry Galilee",
    description:
      "For three years Jesus traveled throughout Galilee, Samaria, Judea, and beyond — healing, teaching, training the twelve, and ultimately walking the road to the cross in Jerusalem.",
    stops: [
      {
        name: "Jordan River — Baptism",
        lat: 31.8333, lng: 35.5500,
        description: "Jesus was baptized by John. The heavens opened, the Spirit descended like a dove, and the Father spoke: 'This is My beloved Son, in whom I am well pleased.'",
        reference: "Matthew 3:13–17", book: "Matthew", chapter: 3, visualTerm: "baptism of Jesus Jordan River",
      },
      {
        name: "Judean Wilderness",
        lat: 31.7000, lng: 35.4000,
        description: "Jesus fasted forty days and overcame Satan's three great temptations — the flesh, pride, and worldly power — by the Word of God.",
        reference: "Matthew 4:1–11", book: "Matthew", chapter: 4, visualTerm: "Judean wilderness temptation",
      },
      {
        name: "Cana of Galilee",
        lat: 32.7447, lng: 35.3419,
        description: "Jesus performed His first miracle at a wedding feast, turning six stone jars of water into the finest wine. 'He revealed His glory, and His disciples believed in Him.'",
        reference: "John 2:1–11", book: "John", chapter: 2, visualTerm: "Cana Galilee wedding",
      },
      {
        name: "Capernaum",
        lat: 32.8809, lng: 35.5759,
        description: "Jesus made Capernaum His base of ministry. He healed many and taught in the synagogue with authority unlike the scribes.",
        reference: "Matthew 4:13", book: "Matthew", chapter: 4, visualTerm: "Capernaum synagogue ruins",
      },
      {
        name: "Mount of Beatitudes",
        lat: 32.9018, lng: 35.5552,
        description: "On a hillside overlooking Galilee, Jesus delivered the Sermon on the Mount — the constitution of the Kingdom. 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.'",
        reference: "Matthew 5:1–3", book: "Matthew", chapter: 5, visualTerm: "Mount of Beatitudes Sermon on the Mount",
      },
      {
        name: "Sea of Galilee",
        lat: 32.8268, lng: 35.5838,
        description: "Jesus called fishermen from their nets, calmed the storm on this sea, walked on its waters, and fed 5,000 on its northern shores.",
        reference: "Matthew 8:23–27", book: "Matthew", chapter: 8, visualTerm: "Sea of Galilee",
      },
      {
        name: "Caesarea Philippi",
        lat: 33.2488, lng: 35.6935,
        description: "Peter confessed: 'You are the Christ, the Son of the living God.' Here Jesus first revealed that He must suffer, die, and rise again.",
        reference: "Matthew 16:13–20", book: "Matthew", chapter: 16, visualTerm: "Caesarea Philippi",
      },
      {
        name: "Jerusalem — Triumphal Entry",
        lat: 31.7784, lng: 35.2354,
        description: "Jesus rode into Jerusalem on a donkey to shouts of 'Hosanna!' — fulfilling Zechariah's prophecy. He cleansed the Temple and shared a final Passover with His disciples.",
        reference: "Matthew 21:1–11", book: "Matthew", chapter: 21, visualTerm: "triumphal entry Jerusalem Palm Sunday",
      },
      {
        name: "Gethsemane",
        lat: 31.7794, lng: 35.2395,
        description: "In the garden at the foot of the Mount of Olives, Jesus prayed in agony. He was betrayed by Judas and arrested. His disciples fled.",
        reference: "Luke 22:39–48", book: "Luke", chapter: 22, visualTerm: "Garden of Gethsemane",
      },
      {
        name: "Golgotha — The Cross",
        lat: 31.7784, lng: 35.2297,
        description: "Outside the city walls, Jesus was crucified. He cried 'It is finished!' and gave up His spirit. On the third day He rose from the dead — the foundation of all Christian hope.",
        reference: "John 19:17–30", book: "John", chapter: 19, visualTerm: "Golgotha crucifixion",
      },
    ],
  },

  // ── EARLY CHURCH ─────────────────────────────────────────────────────────────
  {
    id: "paul-damascus",
    title: "Paul's Road to Damascus",
    reference: "Acts 9",
    era: "Early Church",
    icon: "⚡",
    theme: "Paul Damascus conversion",
    description:
      "Saul the persecutor was struck blind by a light from heaven on the road to Damascus. He heard the voice of the risen Jesus and became the greatest missionary in history.",
    stops: [
      {
        name: "Jerusalem",
        lat: 31.7784, lng: 35.2354,
        description: "Saul received authorization from the high priest to arrest followers of 'The Way' in Damascus and bring them bound to Jerusalem for trial.",
        reference: "Acts 9:1–2", book: "Acts", chapter: 9, visualTerm: "Jerusalem first century",
      },
      {
        name: "Damascus Road",
        lat: 32.7000, lng: 36.0000,
        description: "A light from heaven flashed around Saul. He fell and heard: 'Saul, Saul, why are you persecuting Me?' 'Who are You, Lord?' 'I am Jesus, whom you are persecuting.'",
        reference: "Acts 9:3–6", book: "Acts", chapter: 9, visualTerm: "Damascus road Paul conversion light",
      },
      {
        name: "Damascus",
        lat: 33.5138, lng: 36.2765,
        description: "Blind for three days, Saul fasted and prayed. Ananias laid hands on him: 'Brother Saul, receive your sight.' Scales fell from his eyes. He was baptized and immediately began preaching that Jesus is the Son of God.",
        reference: "Acts 9:10–22", book: "Acts", chapter: 9, visualTerm: "Damascus ancient city Syria",
      },
    ],
  },

  {
    id: "paul-first-journey",
    title: "Paul's First Missionary Journey",
    reference: "Acts 13–14",
    era: "Early Church",
    icon: "⛵",
    theme: "Paul missionary journey",
    description:
      "Sent out by the church at Antioch, Paul and Barnabas sailed to Cyprus then traveled through Asia Minor — preaching, planting churches, and facing fierce opposition.",
    stops: [
      {
        name: "Antioch (Syria)",
        lat: 36.2021, lng: 36.1601,
        description: "The Holy Spirit said: 'Set apart Barnabas and Saul for the work to which I have called them.' They were commissioned by prayer and fasting — the birth of intentional world mission.",
        reference: "Acts 13:1–3", book: "Acts", chapter: 13, visualTerm: "Antioch ancient Syria",
      },
      {
        name: "Salamis, Cyprus",
        lat: 35.1765, lng: 33.9081,
        description: "Paul and Barnabas sailed first to Cyprus, Barnabas's homeland, and preached in the synagogues.",
        reference: "Acts 13:5", book: "Acts", chapter: 13, visualTerm: "Salamis Cyprus ancient",
      },
      {
        name: "Paphos, Cyprus",
        lat: 34.7700, lng: 32.4259,
        description: "The proconsul Sergius Paulus sought the Word of God. The sorcerer Bar-Jesus tried to hinder; Paul struck him blind. The proconsul believed, astonished at the teaching of the Lord.",
        reference: "Acts 13:6–12", book: "Acts", chapter: 13, visualTerm: "Paphos Cyprus",
      },
      {
        name: "Antioch of Pisidia",
        lat: 38.3250, lng: 31.2103,
        description: "Paul's synagogue sermon traced God's redemptive history from Abraham to the resurrection. The Gentiles begged to hear more. Jews stirred persecution and expelled them from the region.",
        reference: "Acts 13:14–52", book: "Acts", chapter: 13, visualTerm: "Pisidia Antioch Turkey",
      },
      {
        name: "Lystra",
        lat: 37.5800, lng: 32.5200,
        description: "Paul healed a lame man. The crowds tried to worship Paul and Barnabas as gods. Then Jews from Antioch stirred the crowd and Paul was stoned and left for dead — yet he rose and continued.",
        reference: "Acts 14:8–20", book: "Acts", chapter: 14, visualTerm: "Lystra ancient Anatolia",
      },
      {
        name: "Derbe",
        lat: 37.3556, lng: 33.2956,
        description: "After Lystra, Paul traveled to Derbe, preached the gospel, and made many disciples. The furthest point of the first journey.",
        reference: "Acts 14:20–21", book: "Acts", chapter: 14, visualTerm: "Derbe Asia Minor",
      },
    ],
  },

  {
    id: "paul-second-journey",
    title: "Paul's Second Missionary Journey",
    reference: "Acts 15–18",
    era: "Early Church",
    icon: "🌊",
    theme: "Paul Corinth Philippi",
    description:
      "Paul's second journey crossed into Europe for the first time. Churches were planted in Philippi, Thessalonica, Athens, and Corinth. Paul spent 18 months in Corinth — his longest stay in any city.",
    stops: [
      {
        name: "Antioch (Syria)",
        lat: 36.2021, lng: 36.1601,
        description: "After the Jerusalem Council, Paul and Silas set out to revisit the churches and strengthen them in the faith.",
        reference: "Acts 15:40–41", book: "Acts", chapter: 15, visualTerm: "Antioch Syria",
      },
      {
        name: "Troas",
        lat: 39.7893, lng: 26.1685,
        description: "The Spirit had prevented Paul from entering Asia and Bithynia. At Troas, Paul received the Macedonian vision: 'Come over to Macedonia and help us.' The gospel crossed into Europe.",
        reference: "Acts 16:6–10", book: "Acts", chapter: 16, visualTerm: "Troas ancient Turkey",
      },
      {
        name: "Philippi",
        lat: 41.0136, lng: 24.2803,
        description: "Paul led Lydia to faith by the riverside. Beaten and jailed, he and Silas prayed and sang at midnight. An earthquake opened the prison. The jailer and his household were baptized.",
        reference: "Acts 16:12–34", book: "Acts", chapter: 16, visualTerm: "Philippi ancient Macedonia",
      },
      {
        name: "Thessalonica",
        lat: 40.6401, lng: 22.9444,
        description: "For three Sabbaths Paul reasoned from scripture that Christ had to suffer and rise. Many believed, but a riot drove him out. He later wrote two letters to this beloved church.",
        reference: "Acts 17:1–10", book: "Acts", chapter: 17, visualTerm: "Thessalonica Greece ancient",
      },
      {
        name: "Athens",
        lat: 37.9755, lng: 23.7348,
        description: "Paul stood on the Areopagus: 'The God who made the world does not live in temples made with human hands.' He proclaimed the unknown God and the resurrection.",
        reference: "Acts 17:22–34", book: "Acts", chapter: 17, visualTerm: "Athens Areopagus Mars Hill Paul",
      },
      {
        name: "Corinth",
        lat: 37.9076, lng: 22.8787,
        description: "Paul spent 18 months in Corinth, living with Aquila and Priscilla tent-making. The Lord spoke in a night vision: 'Do not be afraid, I am with you.' Two major letters followed.",
        reference: "Acts 18:1–18", book: "Acts", chapter: 18, visualTerm: "Corinth ancient Greece ruins",
      },
    ],
  },

  {
    id: "paul-third-journey",
    title: "Paul's Third Missionary Journey",
    reference: "Acts 18–21",
    era: "Early Church",
    icon: "⛵",
    theme: "Paul Ephesus",
    description:
      "The third journey centered on Ephesus, where Paul spent over two years — so that all of Asia heard the Word. It ended with a tearful farewell and Paul's final walk to Jerusalem.",
    stops: [
      {
        name: "Ephesus",
        lat: 37.9392, lng: 27.3410,
        description: "Paul's greatest ministry center. He taught daily for two years. Extraordinary miracles occurred. The silversmiths rioted in fear the gospel would destroy the idol trade. The letter to the Ephesians followed.",
        reference: "Acts 19:1–10", book: "Acts", chapter: 19, visualTerm: "Ephesus ancient ruins Turkey",
      },
      {
        name: "Philippi",
        lat: 41.0136, lng: 24.2803,
        description: "Paul revisited the Macedonian churches to encourage them and collect the offering for the poor saints in Jerusalem.",
        reference: "Acts 20:1–6", book: "Acts", chapter: 20, visualTerm: "Philippi Macedonia",
      },
      {
        name: "Troas",
        lat: 39.7893, lng: 26.1685,
        description: "Paul preached until midnight. A young man named Eutychus fell from a third-story window in a deep sleep. Paul embraced him: 'His life is in him.' He was restored alive.",
        reference: "Acts 20:7–12", book: "Acts", chapter: 20, visualTerm: "Troas ancient",
      },
      {
        name: "Miletus",
        lat: 37.5300, lng: 27.2767,
        description: "Paul summoned the Ephesian elders and gave his most personal speech. 'They wept greatly and fell on Paul's neck and kissed him, sorrowing most of all that they would see his face no more.'",
        reference: "Acts 20:17–38", book: "Acts", chapter: 20, visualTerm: "Miletus ancient Turkey",
      },
      {
        name: "Caesarea Maritima",
        lat: 32.5000, lng: 34.9000,
        description: "The prophet Agabus bound Paul's hands with his belt: 'Thus says the Holy Spirit, so shall the Jews bind the man who owns this belt.' Paul replied: 'I am ready to die at Jerusalem for the name of the Lord Jesus.'",
        reference: "Acts 21:8–14", book: "Acts", chapter: 21, visualTerm: "Caesarea Maritima ancient port",
      },
      {
        name: "Jerusalem",
        lat: 31.7784, lng: 35.2354,
        description: "Paul arrived in Jerusalem and was welcomed by James and the elders. A riot in the Temple led to his arrest — beginning the long journey to Rome.",
        reference: "Acts 21:17–36", book: "Acts", chapter: 21, visualTerm: "Jerusalem Temple mount",
      },
    ],
  },

  {
    id: "paul-rome",
    title: "Paul's Journey to Rome",
    reference: "Acts 27–28",
    era: "Early Church",
    icon: "⚓",
    theme: "Paul shipwreck Rome",
    description:
      "As a prisoner, Paul sailed under Roman guard toward Rome. He survived a shipwreck on Malta, a viper's bite, and months of delay — arriving in the capital to preach with 'all boldness, no one forbidding him.'",
    stops: [
      {
        name: "Caesarea Maritima",
        lat: 32.5000, lng: 34.9000,
        description: "Paul, having appealed to Caesar as a Roman citizen, set sail under the guard of a centurion named Julius.",
        reference: "Acts 27:1–2", book: "Acts", chapter: 27, visualTerm: "Caesarea harbor ancient",
      },
      {
        name: "Fair Havens, Crete",
        lat: 34.9378, lng: 24.7556,
        description: "Paul warned the crew not to sail further. His warning was ignored. Soon a violent northeaster called the Euroclydon seized the ship and drove it helplessly for fourteen days.",
        reference: "Acts 27:8–12", book: "Acts", chapter: 27, visualTerm: "Crete island ancient",
      },
      {
        name: "Malta",
        lat: 35.9375, lng: 14.3754,
        description: "The ship ran aground and broke apart. All 276 persons swam safely to shore. A viper bit Paul's hand; he shook it off without harm. He healed Publius's father and many others on the island.",
        reference: "Acts 28:1–10", book: "Acts", chapter: 28, visualTerm: "Malta ancient Paul shipwreck",
      },
      {
        name: "Syracuse, Sicily",
        lat: 37.0755, lng: 15.2866,
        description: "After three months on Malta, they sailed on, stopping three days at Syracuse on the island of Sicily.",
        reference: "Acts 28:12", book: "Acts", chapter: 28, visualTerm: "Syracuse Sicily ancient",
      },
      {
        name: "Puteoli",
        lat: 40.8272, lng: 14.1231,
        description: "Paul found brothers in the faith at Puteoli and stayed seven days. Brothers from Rome traveled out to meet him at Three Taverns — Paul thanked God and took courage.",
        reference: "Acts 28:13–15", book: "Acts", chapter: 28, visualTerm: "Puteoli ancient Roman port Italy",
      },
      {
        name: "Rome",
        lat: 41.9028, lng: 12.4964,
        description: "Paul arrived in Rome — the heart of the empire. He lived in his own rented house for two full years, welcoming all who came, preaching the Kingdom of God 'with all boldness and without hindrance.'",
        reference: "Acts 28:16–31", book: "Acts", chapter: 28, visualTerm: "ancient Rome",
      },
    ],
  },

  {
    id: "john-patmos",
    title: "John on Patmos — The Revelation",
    reference: "Revelation 1–3",
    era: "Early Church",
    icon: "📜",
    theme: "John Patmos Revelation",
    description:
      "The Apostle John was exiled to the island of Patmos for the Word of God and testimony of Jesus. There he received the great Revelation — visions of heaven, the glorified Christ, and letters to seven churches.",
    stops: [
      {
        name: "Ephesus",
        lat: 37.9392, lng: 27.3410,
        description: "John based his later ministry in Ephesus as bishop of the Asian churches. Ephesus received the first of the seven letters: 'You have left your first love.'",
        reference: "Revelation 2:1", book: "Revelation", chapter: 2, visualTerm: "Ephesus ancient church ruins",
      },
      {
        name: "Patmos",
        lat: 37.3213, lng: 26.5479,
        description: "A small rocky island in the Aegean, used by Rome as a place of exile. 'I, John… was on the island of Patmos for the word of God and for the testimony of Jesus Christ.' Here he saw the glorified Christ and received the entire Book of Revelation.",
        reference: "Revelation 1:9", book: "Revelation", chapter: 1, visualTerm: "Patmos island Greece",
      },
      {
        name: "Smyrna",
        lat: 38.4192, lng: 27.1287,
        description: "Christ's letter: 'Do not be afraid of what you are about to suffer… Be faithful, even to the point of death, and I will give you life as your victor's crown.'",
        reference: "Revelation 2:8–11", book: "Revelation", chapter: 2, visualTerm: "Smyrna Izmir ancient",
      },
      {
        name: "Pergamum",
        lat: 39.1200, lng: 27.1800,
        description: "The city where Satan's throne was — a center of emperor worship. Christ commended those who held fast in faith where Satan dwelt, but warned against compromise.",
        reference: "Revelation 2:12–17", book: "Revelation", chapter: 2, visualTerm: "Pergamum ancient acropolis",
      },
      {
        name: "Philadelphia",
        lat: 38.3500, lng: 28.5167,
        description: "'I have placed before you an open door that no one can shut.' Christ promised to keep this faithful church from the hour of trial coming upon the whole world.",
        reference: "Revelation 3:7–13", book: "Revelation", chapter: 3, visualTerm: "Philadelphia ancient Lydia",
      },
      {
        name: "Laodicea",
        lat: 37.8350, lng: 29.1100,
        description: "The lukewarm church: 'Because you are lukewarm, I am about to spit you out.' Yet Christ stood at the door and knocked, offering fellowship to any who would open.",
        reference: "Revelation 3:14–22", book: "Revelation", chapter: 3, visualTerm: "Laodicea ancient ruins Turkey",
      },
    ],
  },

];
