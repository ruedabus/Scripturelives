// ─── Bible Wordle Word List ───────────────────────────────────────────────────
// Each entry: a 5-letter UPPERCASE Bible word + a verse hint with the word
// blanked out as "_____", plus its Scripture reference.
// Entries are shuffled deliberately so consecutive days feel varied.

export interface WordleEntry {
  word: string;       // 5-letter, uppercase
  hint: string;       // verse with the answer blanked as "_____"
  ref: string;        // Scripture reference
  category: "faith" | "person" | "place" | "action" | "object";
}

export const WORDLE_WORDS: WordleEntry[] = [
  // ── Faith & Theology ───────────────────────────────────────────────────────
  {
    word: "GRACE",
    hint: "For by _____ you have been saved, through faith.",
    ref: "Ephesians 2:8",
    category: "faith",
  },
  {
    word: "FAITH",
    hint: "Now _____ is confidence in what we hope for and assurance about what we do not see.",
    ref: "Hebrews 11:1",
    category: "faith",
  },
  {
    word: "MERCY",
    hint: "His _____ endures forever.",
    ref: "Psalm 136:1",
    category: "faith",
  },
  {
    word: "PEACE",
    hint: "And the _____ of God, which surpasses all understanding, will guard your hearts.",
    ref: "Philippians 4:7",
    category: "faith",
  },
  {
    word: "TRUTH",
    hint: "I am the way and the _____ and the life.",
    ref: "John 14:6",
    category: "faith",
  },
  {
    word: "LIGHT",
    hint: "I am the _____ of the world. Whoever follows me will never walk in darkness.",
    ref: "John 8:12",
    category: "faith",
  },
  {
    word: "GLORY",
    hint: "The sufferings of this present time are not worth comparing with the _____ to be revealed in us.",
    ref: "Romans 8:18",
    category: "faith",
  },
  {
    word: "RISEN",
    hint: "He is not here; he has _____, just as he said.",
    ref: "Matthew 28:6",
    category: "faith",
  },
  {
    word: "CROSS",
    hint: "For the message of the _____ is foolishness to those who are perishing, but to us who are being saved it is the power of God.",
    ref: "1 Corinthians 1:18",
    category: "faith",
  },
  {
    word: "BLOOD",
    hint: "They triumphed over him by the _____ of the Lamb and by the word of their testimony.",
    ref: "Revelation 12:11",
    category: "faith",
  },
  {
    word: "CROWN",
    hint: "Blessed is the one who perseveres under trial and will receive the _____ of life that the Lord has promised.",
    ref: "James 1:12",
    category: "faith",
  },
  {
    word: "FLESH",
    hint: "The Word became _____ and made his dwelling among us.",
    ref: "John 1:14",
    category: "faith",
  },
  {
    word: "SAVED",
    hint: "For by grace you have been _____, through faith—and this is not from yourselves, it is the gift of God.",
    ref: "Ephesians 2:8",
    category: "faith",
  },
  {
    word: "SELAH",
    hint: "The LORD Almighty is with us; the God of Jacob is our fortress. _____.",
    ref: "Psalm 46:7",
    category: "faith",
  },
  {
    word: "AGAPE",
    hint: "And now these three remain: faith, hope and love. But the greatest of these is _____ (love).",
    ref: "1 Corinthians 13:13",
    category: "faith",
  },
  {
    word: "LOGOS",
    hint: "In the beginning was the _____, and the _____ was with God, and the _____ was God.",
    ref: "John 1:1",
    category: "faith",
  },
  {
    word: "REPAY",
    hint: "Do not _____ anyone evil for evil. Be careful to do what is right in the eyes of everyone.",
    ref: "Romans 12:17",
    category: "faith",
  },
  {
    word: "HADES",
    hint: "The sea gave up the dead that were in it, and death and _____ gave up the dead that were in them.",
    ref: "Revelation 20:13",
    category: "faith",
  },
  {
    word: "REIGN",
    hint: "For sin shall no longer be your master, because you are not under the law, but under _____ of grace.",
    ref: "Romans 6:14",
    category: "faith",
  },
  {
    word: "SEEKS",
    hint: "For the Son of Man came to seek and to save the lost — he _____ those who are lost.",
    ref: "Luke 19:10",
    category: "faith",
  },
  {
    word: "SOULS",
    hint: "Come to me, all you who are weary and burdened, and I will give rest to your _____.",
    ref: "Matthew 11:28–29",
    category: "faith",
  },
  {
    word: "ATONE",
    hint: "Christ Jesus, whom God put forward as a propitiation by his blood — a sacrifice to _____ for sin.",
    ref: "Romans 3:25",
    category: "faith",
  },
  {
    word: "OMEGA",
    hint: "I am the Alpha and the _____, the First and the Last, the Beginning and the End.",
    ref: "Revelation 22:13",
    category: "faith",
  },
  {
    word: "BEARS",
    hint: "Love _____ all things, believes all things, hopes all things, endures all things.",
    ref: "1 Corinthians 13:7",
    category: "faith",
  },
  {
    word: "ABIDE",
    hint: "_____ in me, and I in you. As the branch cannot bear fruit by itself, unless it abides in the vine.",
    ref: "John 15:4",
    category: "action",
  },
  {
    word: "ARISE",
    hint: "_____, shine, for your light has come, and the glory of the LORD rises upon you.",
    ref: "Isaiah 60:1",
    category: "action",
  },
  {
    word: "SERVE",
    hint: "As for me and my household, we will _____ the LORD.",
    ref: "Joshua 24:15",
    category: "action",
  },
  {
    word: "BLESS",
    hint: "The LORD _____ you and keep you; the LORD make his face shine on you.",
    ref: "Numbers 6:24",
    category: "action",
  },
  {
    word: "SHINE",
    hint: "Let your light _____ before others, that they may see your good deeds and glorify your Father in heaven.",
    ref: "Matthew 5:16",
    category: "action",
  },
  {
    word: "STAND",
    hint: "Put on the full armor of God, so that when the day of evil comes, you may be able to _____ your ground.",
    ref: "Ephesians 6:13",
    category: "action",
  },
  {
    word: "TRUST",
    hint: "_____ in the LORD with all your heart and lean not on your own understanding.",
    ref: "Proverbs 3:5",
    category: "action",
  },
  {
    word: "PRAYS",
    hint: "The Spirit himself intercedes for us through wordless groans when the believer _____ .",
    ref: "Romans 8:26",
    category: "action",
  },
  {
    word: "WATCH",
    hint: "Be sober-minded; be watchful. Your adversary the devil prowls around. Always _____ and pray.",
    ref: "1 Peter 5:8",
    category: "action",
  },
  {
    word: "EXALT",
    hint: "Humble yourselves before the Lord, and he will _____ you.",
    ref: "James 4:10",
    category: "action",
  },
  {
    word: "KNEEL",
    hint: "Come, let us bow down in worship, let us _____ before the LORD our Maker.",
    ref: "Psalm 95:6",
    category: "action",
  },

  // ── People ─────────────────────────────────────────────────────────────────
  {
    word: "DAVID",
    hint: "From that day on the Spirit of the LORD came powerfully upon _____, who ran toward Goliath.",
    ref: "1 Samuel 16:13 / 17:48",
    category: "person",
  },
  {
    word: "MOSES",
    hint: "Now _____ was a very humble man, more humble than anyone else on the face of the earth.",
    ref: "Numbers 12:3",
    category: "person",
  },
  {
    word: "PETER",
    hint: "And I tell you that you are _____, and on this rock I will build my church.",
    ref: "Matthew 16:18",
    category: "person",
  },
  {
    word: "JESUS",
    hint: "She will give birth to a son, and you are to give him the name _____, because he will save his people from their sins.",
    ref: "Matthew 1:21",
    category: "person",
  },
  {
    word: "SARAH",
    hint: "Is anything too hard for the LORD? I will return to you and _____ will have a son.",
    ref: "Genesis 18:14",
    category: "person",
  },
  {
    word: "JACOB",
    hint: "I am with you and will watch over you wherever you go, the LORD told _____ in his dream.",
    ref: "Genesis 28:15",
    category: "person",
  },
  {
    word: "ISAAC",
    hint: "Sarah said, 'God has brought me laughter, and everyone who hears about this will laugh with me.' She named him _____.",
    ref: "Genesis 21:6",
    category: "person",
  },
  {
    word: "AARON",
    hint: "Is there not _____ the Levite, your brother? I know he can speak well.",
    ref: "Exodus 4:14",
    category: "person",
  },
  {
    word: "JONAH",
    hint: "The LORD provided a huge fish to swallow _____; he was in the belly of the fish three days.",
    ref: "Jonah 1:17",
    category: "person",
  },
  {
    word: "NAOMI",
    hint: "But _____ said, 'Return home, my daughters. Why would you come with me?'",
    ref: "Ruth 1:11",
    category: "person",
  },
  {
    word: "JUDAH",
    hint: "The scepter will not depart from _____, nor the ruler's staff from between his feet.",
    ref: "Genesis 49:10",
    category: "person",
  },
  {
    word: "HEROD",
    hint: "When _____ realized that he had been outwitted by the Magi, he was furious.",
    ref: "Matthew 2:16",
    category: "person",
  },
  {
    word: "RAHAB",
    hint: "'I know that the LORD has given you this land,' _____ told the spies, 'for a great fear of you has fallen on us.'",
    ref: "Joshua 2:9",
    category: "person",
  },
  {
    word: "CALEB",
    hint: "My servant _____ has a different spirit and follows me wholeheartedly, so I will bring him into the land.",
    ref: "Numbers 14:24",
    category: "person",
  },
  {
    word: "ENOCH",
    hint: "_____ walked faithfully with God; then he was no more, because God took him away.",
    ref: "Genesis 5:24",
    category: "person",
  },
  {
    word: "SILAS",
    hint: "About midnight Paul and _____ were praying and singing hymns to God, and the other prisoners were listening.",
    ref: "Acts 16:25",
    category: "person",
  },
  {
    word: "LYDIA",
    hint: "One who heard us was a woman named _____, a seller of purple goods, who was a worshiper of God.",
    ref: "Acts 16:14",
    category: "person",
  },
  {
    word: "TITUS",
    hint: "To _____, my true son in our common faith: Grace and peace from God the Father and Christ Jesus our Savior.",
    ref: "Titus 1:4",
    category: "person",
  },
  {
    word: "TAMAR",
    hint: "Then _____ put ashes on her head and tore the ornate robe she was wearing.",
    ref: "2 Samuel 13:19",
    category: "person",
  },
  {
    word: "SIMON",
    hint: "'_____  son of John, do you love me?' Jesus asked a third time.",
    ref: "John 21:17",
    category: "person",
  },
  {
    word: "ELIAS",
    hint: "But I tell you, _____ has already come, and they did not recognize him.",
    ref: "Matthew 17:12",
    category: "person",
  },
  {
    word: "JUDAS",
    hint: "Then _____, who had betrayed him, saw that Jesus was condemned and was seized with remorse.",
    ref: "Matthew 27:3",
    category: "person",
  },
  {
    word: "ABRAM",
    hint: "The LORD said to _____, 'Go from your country, your people and your father's household to the land I will show you.'",
    ref: "Genesis 12:1",
    category: "person",
  },
  {
    word: "MICAH",
    hint: "He has shown you, O mortal, what is good, wrote the prophet _____. And what does the LORD require of you?",
    ref: "Micah 6:8",
    category: "person",
  },
  {
    word: "HOSEA",
    hint: "When the LORD began to speak through _____, the LORD said to him, 'Go, marry a promiscuous woman.'",
    ref: "Hosea 1:2",
    category: "person",
  },
  {
    word: "NAHUM",
    hint: "The LORD is good, a refuge in times of trouble, wrote the prophet _____. He cares for those who trust in him.",
    ref: "Nahum 1:7",
    category: "person",
  },
  {
    word: "JAMES",
    hint: "_____, a servant of God and of the Lord Jesus Christ, to the twelve tribes scattered among the nations.",
    ref: "James 1:1",
    category: "person",
  },
  {
    word: "LABAN",
    hint: "When _____ heard the news about his sister's son Jacob, he hurried to meet him.",
    ref: "Genesis 29:13",
    category: "person",
  },
  {
    word: "HIRAM",
    hint: "_____ king of Tyre sent his servants to Solomon with cedar logs when he heard that Solomon had been anointed king.",
    ref: "1 Kings 5:1",
    category: "person",
  },

  // ── Places ─────────────────────────────────────────────────────────────────
  {
    word: "SINAI",
    hint: "The LORD descended to the top of Mount _____ and called Moses to the top of the mountain.",
    ref: "Exodus 19:20",
    category: "place",
  },
  {
    word: "BABEL",
    hint: "That is why it was called _____—because there the LORD confused the language of the whole world.",
    ref: "Genesis 11:9",
    category: "place",
  },
  {
    word: "EGYPT",
    hint: "I am the LORD your God, who brought you out of _____, out of the land of slavery.",
    ref: "Exodus 20:2",
    category: "place",
  },
  {
    word: "JOPPA",
    hint: "Now there was in _____ a disciple named Tabitha, who was always doing good and helping the poor.",
    ref: "Acts 9:36",
    category: "place",
  },
  {
    word: "JUDEA",
    hint: "You will be my witnesses in Jerusalem, and in all _____ and Samaria, and to the ends of the earth.",
    ref: "Acts 1:8",
    category: "place",
  },
  {
    word: "ZORAH",
    hint: "A certain man of _____, named Manoah, had a wife who was barren. The angel of the LORD appeared to her.",
    ref: "Judges 13:2–3",
    category: "place",
  },
  {
    word: "TROAS",
    hint: "After Paul had seen the vision, we got ready at once to leave for Macedonia from _____ where he saw a man calling him.",
    ref: "Acts 16:10",
    category: "place",
  },
  {
    word: "OPHIR",
    hint: "Hiram's ships brought gold from _____ and great cargoes of almugwood and precious stones.",
    ref: "1 Kings 10:11",
    category: "place",
  },
  {
    word: "SHEBA",
    hint: "When the queen of _____ heard about the fame of Solomon and his relationship to the LORD, she came to test him.",
    ref: "1 Kings 10:1",
    category: "place",
  },
  {
    word: "PETRA",
    hint: "Who will bring me to the fortified city? Who will lead me to _____?",
    ref: "Psalm 60:9",
    category: "place",
  },

  // ── Objects & Nature ────────────────────────────────────────────────────────
  {
    word: "BREAD",
    hint: "I am the _____ of life. Whoever comes to me will never go hungry.",
    ref: "John 6:35",
    category: "object",
  },
  {
    word: "SHEEP",
    hint: "I am the good shepherd. The good shepherd lays down his life for the _____.",
    ref: "John 10:11",
    category: "object",
  },
  {
    word: "SWORD",
    hint: "Take the helmet of salvation and the _____ of the Spirit, which is the word of God.",
    ref: "Ephesians 6:17",
    category: "object",
  },
  {
    word: "ARMOR",
    hint: "Put on the full _____ of God, so that you can take your stand against the devil's schemes.",
    ref: "Ephesians 6:11",
    category: "object",
  },
  {
    word: "ALTAR",
    hint: "Then Noah built an _____ to the LORD and, taking some of all the clean animals, he sacrificed burnt offerings.",
    ref: "Genesis 8:20",
    category: "object",
  },
  {
    word: "OLIVE",
    hint: "I am like a flourishing _____ tree in the house of God; I trust in God's unfailing love.",
    ref: "Psalm 52:8",
    category: "object",
  },
  {
    word: "CEDAR",
    hint: "The righteous shall flourish like the palm tree: he shall grow like a _____ in Lebanon.",
    ref: "Psalm 92:12",
    category: "object",
  },
  {
    word: "FLAME",
    hint: "His servants are winds, his servants are _____ of fire.",
    ref: "Hebrews 1:7",
    category: "object",
  },
  {
    word: "WATER",
    hint: "But whoever drinks the _____ I give them will never thirst again.",
    ref: "John 4:14",
    category: "object",
  },
  {
    word: "STONE",
    hint: "The _____ the builders rejected has become the cornerstone; the LORD has done this.",
    ref: "Psalm 118:22",
    category: "object",
  },
  {
    word: "FEAST",
    hint: "The kingdom of heaven is like a king who prepared a wedding _____ for his son.",
    ref: "Matthew 22:2",
    category: "object",
  },
  {
    word: "TITHE",
    hint: "Bring the whole _____ into the storehouse, that there may be food in my house.",
    ref: "Malachi 3:10",
    category: "object",
  },
  {
    word: "ANGEL",
    hint: "Do not forget to show hospitality to strangers, for by so doing some people have shown hospitality to _____ without knowing it.",
    ref: "Hebrews 13:2",
    category: "object",
  },
  {
    word: "PALMS",
    hint: "They took branches of _____ trees and went out to meet him, crying out, 'Hosanna!'",
    ref: "John 12:13",
    category: "object",
  },
  {
    word: "GRAIN",
    hint: "Ruth gleaned in the field after the reapers, and she beat out what she had gleaned, and it was about an ephah of _____.",
    ref: "Ruth 2:17",
    category: "object",
  },
  {
    word: "LAMBS",
    hint: "Jesus said to him, 'Feed my _____.' He said to him again a second time, 'Tend my sheep.'",
    ref: "John 21:15–16",
    category: "object",
  },
  {
    word: "TOWER",
    hint: "For which of you, desiring to build a _____, does not first sit down and count the cost?",
    ref: "Luke 14:28",
    category: "object",
  },
  {
    word: "WALLS",
    hint: "By faith the _____ of Jericho fell, after the army had marched around them for seven days.",
    ref: "Hebrews 11:30",
    category: "object",
  },
  {
    word: "GATES",
    hint: "Enter his _____ with thanksgiving and his courts with praise; give thanks to him.",
    ref: "Psalm 100:4",
    category: "object",
  },
  {
    word: "HEART",
    hint: "Guard your _____ above all else, for everything you do flows from it.",
    ref: "Proverbs 4:23",
    category: "object",
  },
  {
    word: "LAMPS",
    hint: "At midnight the cry rang out: 'Here's the bridegroom! Come out to meet him!' Then all the virgins woke up and trimmed their _____.",
    ref: "Matthew 25:6–7",
    category: "object",
  },
  {
    word: "RIVER",
    hint: "Then the angel showed me the _____ of the water of life, as clear as crystal, flowing from the throne of God.",
    ref: "Revelation 22:1",
    category: "object",
  },
  {
    word: "CLOUD",
    hint: "By day the LORD went ahead of them in a pillar of _____ to guide them on their way.",
    ref: "Exodus 13:21",
    category: "object",
  },
  {
    word: "TRIBE",
    hint: "After this I looked, and there before me was a great multitude that no one could count, from every nation, _____, people and language.",
    ref: "Revelation 7:9",
    category: "object",
  },
  {
    word: "MANNA",
    hint: "He rained down _____ for the people to eat, he gave them the grain of heaven.",
    ref: "Psalm 78:24",
    category: "object",
  },
  {
    word: "VINES",
    hint: "I am the vine; you are the branches. The father is the gardener who tends the _____.",
    ref: "John 15:5",
    category: "object",
  },
];

// ── Daily word selection ──────────────────────────────────────────────────────
// The word rotates daily based on days elapsed since the epoch.
const EPOCH = new Date("2026-01-01T00:00:00Z").getTime();

export function getDailyWord(): WordleEntry {
  const now = new Date();
  // Use local midnight so the word changes at midnight for the user
  const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayIndex = Math.floor((localMidnight - EPOCH) / (1000 * 60 * 60 * 24));
  const idx = ((dayIndex % WORDLE_WORDS.length) + WORDLE_WORDS.length) % WORDLE_WORDS.length;
  return WORDLE_WORDS[idx];
}

// ── localStorage helpers ──────────────────────────────────────────────────────
export interface WordleState {
  date: string;          // "YYYY-MM-DD"
  guesses: string[];
  status: "playing" | "won" | "lost";
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function loadWordleState(): WordleState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("bibleWordle");
    if (!raw) return null;
    const parsed: WordleState = JSON.parse(raw);
    if (parsed.date !== todayKey()) return null; // stale — new day
    return parsed;
  } catch {
    return null;
  }
}

export function saveWordleState(state: WordleState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("bibleWordle", JSON.stringify({ ...state, date: todayKey() }));
  } catch {
    // ignore storage errors
  }
}
