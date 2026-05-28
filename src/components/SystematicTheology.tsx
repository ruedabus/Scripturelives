"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, ChevronRight, ExternalLink, Loader2, Search } from "lucide-react";

// ── Theopedia article panel ───────────────────────────────────────────────────
type TheopediaResult = { found: boolean; term?: string; body?: string; sourceUrl?: string; source?: string };

function TheopediaPanel({ term, onClose }: { term: string; onClose: () => void }) {
  const [result, setResult]   = useState<TheopediaResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setResult(null);
    setLoading(true);
    fetch(`/api/theopedia?term=${encodeURIComponent(term)}`)
      .then(r => r.json())
      .then((d: TheopediaResult) => setResult(d))
      .catch(() => setResult({ found: false }))
      .finally(() => setLoading(false));
  }, [term]);

  function renderBody(text: string) {
    return text.split("\n\n").map((para, i) => {
      const t = para.trim();
      if (/^__(.+)__$/.test(t)) {
        return (
          <h4 key={i} className="text-xs font-black uppercase tracking-wide mt-4 mb-1.5 pb-1" style={{ color: NAVY, borderBottom: `1px solid rgba(201,149,42,0.2)` }}>
            {t.replace(/^__/, "").replace(/__$/, "")}
          </h4>
        );
      }
      return <p key={i} className="text-xs leading-6 mb-3" style={{ color: "#374151" }}>{t}</p>;
    });
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #ede8de", background: "white" }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#faf8f3", borderBottom: "1px solid #ede8de" }}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: GOLD }}>
            {result?.source ?? "Wikipedia"}
          </p>
          <p className="text-sm font-black" style={{ color: NAVY }}>{result?.term ?? term}</p>
        </div>
        <div className="flex items-center gap-2">
          {result?.found && result.sourceUrl && (
            <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg transition hover:opacity-70"
              style={{ background: "#e8e0d4", color: NAVY }}>
              <ExternalLink size={10} /> Full article
            </a>
          )}
          <button onClick={onClose} className="text-xs font-bold px-2 py-1 rounded-lg transition hover:opacity-70" style={{ color: NAVY, background: "#e8e0d4" }}>✕</button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 max-h-96 overflow-y-auto">
        {loading && (
          <div className="flex items-center gap-2 py-4 text-xs text-gray-400">
            <Loader2 size={14} className="animate-spin" /> Loading from Theopedia…
          </div>
        )}
        {!loading && result && !result.found && (
          <p className="text-xs text-gray-400 py-4">No article found for &ldquo;{term}&rdquo;.</p>
        )}
        {!loading && result?.found && result.body && renderBody(result.body)}
        {result?.found && (
          <p className="text-[9px] mt-4 pt-2" style={{ borderTop: "1px solid #f0ece3", color: "#9ca3af" }}>
            {result.source} · <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">View full article</a>
          </p>
        )}
      </div>
    </div>
  );
}

const GOLD = "#C9952A";
const NAVY = "#1a2640";

// ── Branch data ───────────────────────────────────────────────────────────────
export type TheologyBranch = {
  id: string;
  name: string;
  emoji: string;
  subtitle: string;
  etymology: string;
  coreQuestion: string;
  overview: string;
  keyPassages: { ref: string; preview: string }[];
  subTopics: string[];
  keyTerms: string[];
  encyclopediaTerms: string[];
};

const BRANCHES: TheologyBranch[] = [
  {
    id: "prolegomena",
    name: "Prolegomena",
    emoji: "📖",
    subtitle: "Introduction to Theology",
    etymology: "Greek: pro (before) + legomena (things said)",
    coreQuestion: "How do we know God, and how is theology conducted?",
    overview:
      "Prolegomena lays the groundwork for all theological inquiry. It examines the nature and sources of religious knowledge, the relationship between faith and reason, and the methods used to study God. It establishes why theology is possible and on what authority it stands.",
    keyPassages: [
      { ref: "Romans 1:19-20", preview: "What may be known about God is plain — his invisible qualities clearly seen in creation." },
      { ref: "2 Timothy 3:16-17", preview: "All Scripture is God-breathed and useful for teaching, rebuking, correcting, and training." },
      { ref: "Proverbs 1:7", preview: "The fear of the LORD is the beginning of knowledge." },
      { ref: "John 17:17", preview: "Sanctify them by the truth; your word is truth." },
    ],
    subTopics: ["General Revelation", "Special Revelation", "Faith & Reason", "Theological Method", "The Nature of Theology"],
    keyTerms: ["Revelation", "Inspiration", "Inerrancy", "Hermeneutics", "Exegesis", "Epistemology"],
    encyclopediaTerms: ["Revelation", "Inspiration", "Hermeneutics"],
  },
  {
    id: "bibliology",
    name: "Bibliology",
    emoji: "📜",
    subtitle: "The Study of Scripture",
    etymology: "Greek: biblios (book) + logos (study)",
    coreQuestion: "What is the Bible, and how is it the Word of God?",
    overview:
      "Bibliology examines the nature, origin, and authority of the Bible. It addresses how God communicated through human authors (inspiration), the reliability and accuracy of the text (inerrancy and infallibility), the process by which the biblical books were recognized as Scripture (canonization), and how the Bible should be interpreted.",
    keyPassages: [
      { ref: "2 Timothy 3:16-17", preview: "All Scripture is God-breathed and is useful for teaching, rebuking, correcting, and training in righteousness." },
      { ref: "2 Peter 1:20-21", preview: "No prophecy came by human will, but people spoke from God as they were carried along by the Holy Spirit." },
      { ref: "Psalm 119:105", preview: "Your word is a lamp for my feet, a light on my path." },
      { ref: "Isaiah 40:8", preview: "The grass withers and the flowers fall, but the word of our God endures forever." },
    ],
    subTopics: ["Inspiration of Scripture", "Inerrancy & Infallibility", "Canonization", "Transmission & Translation", "Illumination", "Interpretation (Hermeneutics)"],
    keyTerms: ["Inspiration", "Inerrancy", "Infallibility", "Canon", "Illumination", "Autographs", "Manuscript"],
    encyclopediaTerms: ["Canon of Scripture", "Inspiration", "Masoretic Text", "Septuagint"],
  },
  {
    id: "theology_proper",
    name: "Theology Proper",
    emoji: "✝️",
    subtitle: "The Study of God the Father",
    etymology: "Greek: theos (God) + logos (study) — in the strict sense",
    coreQuestion: "Who is God, and what is He like?",
    overview:
      "Theology Proper focuses specifically on the nature and attributes of God the Father. It investigates His existence, essence, and the communicable and incommunicable attributes that define who He is. Topics include God's sovereignty, omniscience, omnipotence, omnipresence, holiness, love, and wrath, as well as the doctrine of the Trinity.",
    keyPassages: [
      { ref: "Exodus 3:14", preview: "God said to Moses, 'I AM WHO I AM.' This is my name forever." },
      { ref: "Isaiah 6:3", preview: "Holy, holy, holy is the LORD Almighty; the whole earth is full of his glory." },
      { ref: "John 4:24", preview: "God is spirit, and his worshipers must worship in the Spirit and in truth." },
      { ref: "1 John 4:8", preview: "Whoever does not love does not know God, because God is love." },
      { ref: "Deuteronomy 6:4", preview: "Hear, O Israel: The LORD our God, the LORD is one." },
    ],
    subTopics: ["Existence of God", "Attributes of God", "The Trinity", "God's Sovereignty", "God's Holiness", "Providence"],
    keyTerms: ["Omniscience", "Omnipotence", "Omnipresence", "Immanence", "Transcendence", "Trinity", "Sovereignty", "Immutability"],
    encyclopediaTerms: ["Trinity", "Grace", "Holiness", "Word of God"],
  },
  {
    id: "christology",
    name: "Christology",
    emoji: "🌟",
    subtitle: "The Study of Jesus Christ",
    etymology: "Greek: Christos (anointed one) + logos (study)",
    coreQuestion: "Who is Jesus Christ, and what has He done?",
    overview:
      "Christology examines the person and work of Jesus Christ. It explores His divine and human natures (the hypostatic union), His pre-existence and incarnation, His sinless life, His atoning death, bodily resurrection, ascension, and present ministry. It also addresses His offices as Prophet, Priest, and King, and His return.",
    keyPassages: [
      { ref: "John 1:1,14", preview: "In the beginning was the Word... The Word became flesh and dwelt among us." },
      { ref: "Colossians 2:9", preview: "In Christ all the fullness of the Deity lives in bodily form." },
      { ref: "Philippians 2:6-8", preview: "Who, being in very nature God, did not consider equality with God something to be used to his own advantage." },
      { ref: "Hebrews 4:15", preview: "We have a high priest who has been tempted in every way, just as we are — yet he did not sin." },
      { ref: "Acts 2:32", preview: "God has raised this Jesus to life, and we are all witnesses of it." },
    ],
    subTopics: ["Deity of Christ", "Humanity of Christ", "Hypostatic Union", "Incarnation", "Virgin Birth", "Offices of Christ", "Resurrection & Ascension", "Second Coming"],
    keyTerms: ["Incarnation", "Hypostatic Union", "Kenosis", "Messiah", "Atonement", "Resurrection", "Ascension", "Parousia"],
    encyclopediaTerms: ["Incarnation", "Messiah", "Resurrection", "Atonement"],
  },
  {
    id: "pneumatology",
    name: "Pneumatology",
    emoji: "🕊️",
    subtitle: "The Study of the Holy Spirit",
    etymology: "Greek: pneuma (spirit/breath) + logos (study)",
    coreQuestion: "Who is the Holy Spirit, and what is His role?",
    overview:
      "Pneumatology studies the person and work of the Holy Spirit. It examines His deity and personhood (as part of the Trinity), His roles in creation, conviction, regeneration, indwelling, sealing, filling, and gifting of believers. It also addresses Spirit baptism, the gifts of the Spirit, and the fruit of the Spirit.",
    keyPassages: [
      { ref: "John 14:16-17", preview: "I will ask the Father, and he will give you another advocate to help you and be with you forever." },
      { ref: "Acts 2:1-4", preview: "All of them were filled with the Holy Spirit and began to speak in other tongues." },
      { ref: "Romans 8:26", preview: "The Spirit himself intercedes for us through wordless groans." },
      { ref: "1 Corinthians 12:4-7", preview: "There are different kinds of gifts, but the same Spirit distributes them all." },
      { ref: "Galatians 5:22-23", preview: "The fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness..." },
    ],
    subTopics: ["Deity of the Spirit", "Regeneration", "Indwelling", "Filling of the Spirit", "Gifts of the Spirit", "Fruit of the Spirit", "Sealing & Assurance"],
    keyTerms: ["Regeneration", "Sanctification", "Indwelling", "Baptism of the Spirit", "Gifts", "Filling", "Sealing", "Conviction"],
    encyclopediaTerms: ["Holy Spirit", "Baptism", "Sanctification", "Pentecost"],
  },
  {
    id: "anthropology",
    name: "Anthropology",
    emoji: "👤",
    subtitle: "The Study of Humanity",
    etymology: "Greek: anthropos (human being) + logos (study)",
    coreQuestion: "What is the nature of human beings as created by God?",
    overview:
      "Theological Anthropology examines humanity as God's special creation. It studies what it means to be made in the image of God (imago Dei), the nature of the soul and body, the origin of the human race, gender, the family, the purpose of human existence, and what constitutes human dignity. It provides the foundation for understanding sin and redemption.",
    keyPassages: [
      { ref: "Genesis 1:26-27", preview: "Let us make mankind in our image, in our likeness... So God created mankind in his own image." },
      { ref: "Genesis 2:7", preview: "The LORD God formed a man from the dust of the ground and breathed into his nostrils the breath of life." },
      { ref: "Psalm 8:4-6", preview: "What is mankind that you are mindful of them? You made them rulers over the works of your hands." },
      { ref: "1 Thessalonians 5:23", preview: "May your whole spirit, soul and body be kept blameless at the coming of our Lord Jesus Christ." },
    ],
    subTopics: ["Image of God (Imago Dei)", "Body & Soul", "Trichotomy vs. Dichotomy", "Origin of the Soul", "Human Dignity", "Gender & Marriage"],
    keyTerms: ["Imago Dei", "Dichotomy", "Trichotomy", "Soul", "Spirit", "Free Will", "Conscience"],
    encyclopediaTerms: ["Creation", "Marriage", "Faith"],
  },
  {
    id: "hamartiology",
    name: "Hamartiology",
    emoji: "⚖️",
    subtitle: "The Study of Sin",
    etymology: "Greek: hamartia (sin/missing the mark) + logos (study)",
    coreQuestion: "What is sin, and what are its origins and effects?",
    overview:
      "Hamartiology examines the nature, origin, and consequences of sin. It traces sin from its origin in Satan's rebellion through the Fall of Adam and Eve to its universal effects on humanity (total depravity) and all creation. It addresses original sin, actual sin, the degrees and categories of sin, and how sin separates humanity from God — making redemption necessary.",
    keyPassages: [
      { ref: "Genesis 3:1-7", preview: "The woman saw that the fruit was good for food and pleasing to the eye... she took some and ate it." },
      { ref: "Romans 3:23", preview: "For all have sinned and fall short of the glory of God." },
      { ref: "Romans 5:12", preview: "Sin entered the world through one man, and death through sin, and in this way death came to all people." },
      { ref: "Isaiah 59:2", preview: "Your iniquities have separated you from your God; your sins have hidden his face from you." },
      { ref: "1 John 1:8", preview: "If we claim to be without sin, we deceive ourselves and the truth is not in us." },
    ],
    subTopics: ["The Fall", "Original Sin", "Total Depravity", "Types of Sin", "Consequences of Sin", "The Sin Nature", "Satan and Demons"],
    keyTerms: ["Original Sin", "Total Depravity", "Imputation", "Guilt", "The Fall", "Concupiscence", "Actual Sin"],
    encyclopediaTerms: ["The Fall", "Sin", "Repentance", "Reconciliation"],
  },
  {
    id: "soteriology",
    name: "Soteriology",
    emoji: "🕊️",
    subtitle: "The Study of Salvation",
    etymology: "Greek: soteria (salvation/deliverance) + logos (study)",
    coreQuestion: "How are sinners made right with God?",
    overview:
      "Soteriology is the study of salvation — how God rescues humanity from sin and its consequences. It examines the basis of salvation in Christ's atonement, the application of salvation through the Spirit, and the order of salvation (ordo salutis): calling, regeneration, faith, repentance, justification, adoption, sanctification, and glorification.",
    keyPassages: [
      { ref: "John 3:16-17", preview: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish." },
      { ref: "Ephesians 2:8-9", preview: "For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God." },
      { ref: "Romans 10:9", preview: "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved." },
      { ref: "Titus 3:5", preview: "He saved us through the washing of rebirth and renewing by the Holy Spirit." },
      { ref: "Romans 8:30", preview: "Those he predestined, he also called; those he called, he also justified; those he justified, he also glorified." },
    ],
    subTopics: ["Atonement", "Justification by Faith", "Regeneration", "Repentance", "Sanctification", "Election & Predestination", "Assurance of Salvation", "Glorification"],
    keyTerms: ["Justification", "Sanctification", "Glorification", "Grace", "Faith", "Repentance", "Atonement", "Propitiation", "Redemption", "Election"],
    encyclopediaTerms: ["Salvation", "Atonement", "Justification", "Grace", "Faith", "Redemption"],
  },
  {
    id: "ecclesiology",
    name: "Ecclesiology",
    emoji: "⛪",
    subtitle: "The Study of the Church",
    etymology: "Greek: ekklesia (assembly/called out ones) + logos (study)",
    coreQuestion: "What is the church, and how does it function?",
    overview:
      "Ecclesiology examines the nature, purpose, and structure of the church — the body of Christ. It addresses the church's founding, its marks (true vs. false church), its ordinances or sacraments (baptism and the Lord's Supper), its governance and leadership structures, the universal and local church, and the church's mission in the world.",
    keyPassages: [
      { ref: "Matthew 16:18", preview: "On this rock I will build my church, and the gates of Hades will not overcome it." },
      { ref: "Ephesians 1:22-23", preview: "God placed all things under his feet and appointed him to be head over everything for the church, which is his body." },
      { ref: "Acts 2:42-47", preview: "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer." },
      { ref: "1 Corinthians 12:12-13", preview: "Just as a body, though one, has many parts... so it is with Christ." },
      { ref: "Hebrews 10:25", preview: "Not giving up meeting together, as some are in the habit of doing." },
    ],
    subTopics: ["Nature of the Church", "Church Leadership", "Ordinances (Baptism & Lord's Supper)", "Spiritual Gifts in the Church", "Church Discipline", "The Universal Church", "The Local Church", "Church & Israel"],
    keyTerms: ["Ekklesia", "Sacraments", "Ordinances", "Eldership", "Deacon", "Baptism", "Lord's Supper", "Congregation"],
    encyclopediaTerms: ["Baptism", "Lord's Supper", "Priesthood", "Synagogue"],
  },
  {
    id: "eschatology",
    name: "Eschatology",
    emoji: "🌅",
    subtitle: "The Study of Last Things",
    etymology: "Greek: eschatos (last) + logos (study)",
    coreQuestion: "What does the Bible teach about the end of history?",
    overview:
      "Eschatology studies the biblical teachings about the end of history and the ultimate destiny of humanity. It covers death and the afterlife, the resurrection of the dead, final judgment, heaven and hell, and the events surrounding the return of Christ — including the tribulation, the millennium, and the new creation. Various millennial views (premillennialism, amillennialism, postmillennialism) are examined.",
    keyPassages: [
      { ref: "Revelation 21:1-4", preview: "Then I saw a new heaven and a new earth... God himself will be with them and be their God." },
      { ref: "1 Thessalonians 4:16-17", preview: "The Lord himself will come down from heaven... the dead in Christ will rise first." },
      { ref: "John 5:28-29", preview: "A time is coming when all who are in their graves will hear his voice and come out." },
      { ref: "Matthew 25:31-34", preview: "When the Son of Man comes in his glory... He will separate the people one from another." },
      { ref: "Romans 8:18-21", preview: "The creation waits in eager expectation for the children of God to be revealed." },
    ],
    subTopics: ["Death & Intermediate State", "Resurrection", "Second Coming", "The Rapture", "Tribulation", "The Millennium", "Final Judgment", "Heaven & Hell", "New Creation"],
    keyTerms: ["Parousia", "Rapture", "Tribulation", "Millennium", "Premillennialism", "Amillennialism", "Resurrection", "Judgment", "New Jerusalem"],
    encyclopediaTerms: ["Resurrection", "Kingdom of God", "Prophecy", "Judgment"],
  },
  {
    id: "angelology",
    name: "Angelology",
    emoji: "👼",
    subtitle: "The Study of Angels & Demons",
    etymology: "Greek: angelos (messenger) + logos (study)",
    coreQuestion: "What does Scripture reveal about spiritual beings?",
    overview:
      "Angelology studies the entire spectrum of spiritual beings — both holy angels and fallen ones. It examines the origin, nature, and ministry of angels; the ranks and orders of angelic beings; the fall of Satan; the nature and activity of demons; and the cosmic spiritual warfare that forms the backdrop of human history. It grounds the believer's confidence in God's sovereign rule over all spiritual powers.",
    keyPassages: [
      { ref: "Hebrews 1:14", preview: "Are not all angels ministering spirits sent to serve those who will inherit salvation?" },
      { ref: "Colossians 1:16", preview: "All things were created... whether thrones or powers or rulers or authorities; all things have been created through him." },
      { ref: "Isaiah 14:12-15", preview: "How you have fallen from heaven, morning star, son of the dawn!" },
      { ref: "Ephesians 6:12", preview: "Our struggle is not against flesh and blood, but against the rulers, powers, and spiritual forces of evil." },
      { ref: "Revelation 12:9", preview: "The great dragon was hurled down — that ancient serpent called the devil, or Satan." },
    ],
    subTopics: ["Nature of Angels", "Ranks of Angels", "Ministry of Angels", "The Fall of Satan", "Demons & Spiritual Warfare", "The Restrainer", "Michael & Gabriel"],
    keyTerms: ["Angel", "Cherubim", "Seraphim", "Satan", "Demon", "Principalities", "Spiritual Warfare", "Exorcism"],
    encyclopediaTerms: ["Cherubim", "Seraphim", "Satan", "Miracles"],
  },
  {
    id: "missiology",
    name: "Missiology",
    emoji: "🌍",
    subtitle: "The Study of Missions",
    etymology: "Latin: missio (sending) + Greek: logos (study)",
    coreQuestion: "What is the church's mandate to proclaim the gospel to all nations?",
    overview:
      "Missiology examines the theological foundations and practice of Christian mission. Rooted in the Great Commission, it studies the nature of the missio Dei (God's own mission), cross-cultural evangelism, church planting, the relationship between the church and world cultures, the unreached peoples of the world, and the eschatological significance of global mission.",
    keyPassages: [
      { ref: "Matthew 28:18-20", preview: "Go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit." },
      { ref: "Acts 1:8", preview: "You will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem... and to the ends of the earth." },
      { ref: "Romans 10:14-15", preview: "How can they believe in the one of whom they have not heard? And how can they hear without someone preaching to them?" },
      { ref: "Revelation 7:9", preview: "A great multitude that no one could count, from every nation, tribe, people and language, standing before the throne." },
      { ref: "Isaiah 49:6", preview: "I will also make you a light for the Gentiles, that my salvation may reach to the ends of the earth." },
    ],
    subTopics: ["The Great Commission", "Missio Dei", "Cross-Cultural Evangelism", "Church Planting", "Unreached People Groups", "The Gospel & Culture", "Contextualization"],
    keyTerms: ["Great Commission", "Missio Dei", "Evangelism", "Church Planting", "Contextualization", "Unreached Peoples", "Apostle"],
    encyclopediaTerms: ["Gentiles", "Israel", "Worship", "Prayer"],
  },
];

// ── Color themes per branch ───────────────────────────────────────────────────
const BRANCH_COLOR: Record<string, { bg: string; text: string; ring: string }> = {
  prolegomena:    { bg: "#e8e0d4", text: NAVY, ring: "#c5b99a" },
  bibliology:     { bg: "#fef3c7", text: "#92400e", ring: "#fbbf24" },
  theology_proper:{ bg: "#dbeafe", text: "#1e40af", ring: "#93c5fd" },
  christology:    { bg: "#fee2e2", text: "#991b1b", ring: "#fca5a5" },
  pneumatology:   { bg: "#d1fae5", text: "#065f46", ring: "#6ee7b7" },
  anthropology:   { bg: "#fce7f3", text: "#9d174d", ring: "#f9a8d4" },
  hamartiology:   { bg: "#e5e7eb", text: "#374151", ring: "#9ca3af" },
  soteriology:    { bg: "#fef9c3", text: "#713f12", ring: "#fde047" },
  ecclesiology:   { bg: "#ede9fe", text: "#4c1d95", ring: "#c4b5fd" },
  eschatology:    { bg: "#ffedd5", text: "#7c2d12", ring: "#fdba74" },
  angelology:     { bg: "#e0f2fe", text: "#075985", ring: "#7dd3fc" },
  missiology:     { bg: "#dcfce7", text: "#14532d", ring: "#86efac" },
};

// ── Main component ─────────────────────────────────────────────────────────────
export default function SystematicTheology({
  onLookupEncyclopedia,
  onOpenVerse,
}: {
  onLookupEncyclopedia?: (term: string) => void;
  onOpenVerse?: (ref: string) => void;
}) {
  const [selected,    setSelected]    = useState<TheologyBranch | null>(null);
  const [activeTab,   setActiveTab]   = useState<"overview" | "passages" | "topics">("overview");
  const [theopediaTerm, setTheopediaTerm] = useState<string | null>(null);

  if (selected) {
    const color = BRANCH_COLOR[selected.id] ?? { bg: "#e8e0d4", text: NAVY, ring: "#c5b99a" };
    return (
      <div>
        {/* Branch header */}
        <div
          className="rounded-2xl p-5 mb-5"
          style={{ background: color.bg, border: `1px solid ${color.ring}` }}
        >
          <button
            onClick={() => { setSelected(null); setActiveTab("overview"); }}
            className="flex items-center gap-1 text-xs font-semibold mb-3 opacity-60 hover:opacity-100 transition"
            style={{ color: color.text }}
          >
            <ArrowLeft size={13} />
            All Branches
          </button>

          <div className="flex items-start gap-3">
            <span className="text-3xl">{selected.emoji}</span>
            <div>
              <h2 className="text-lg font-black leading-tight" style={{ color: color.text }}>
                {selected.name}
              </h2>
              <p className="text-xs font-semibold mt-0.5" style={{ color: color.text, opacity: 0.7 }}>
                {selected.subtitle}
              </p>
              <p className="text-[10px] mt-1 italic" style={{ color: color.text, opacity: 0.55 }}>
                {selected.etymology}
              </p>
            </div>
          </div>

          <div
            className="mt-3 rounded-xl px-3 py-2 text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.55)", color: color.text }}
          >
            <span className="opacity-50">Core Question: </span>
            {selected.coreQuestion}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl border mb-5 overflow-hidden" style={{ borderColor: "#e5e7eb" }}>
          {(["overview", "passages", "topics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 text-xs font-semibold capitalize transition"
              style={
                activeTab === tab
                  ? { background: NAVY, color: "white" }
                  : { background: "white", color: "#6b7280" }
              }
            >
              {tab === "overview" ? "Overview" : tab === "passages" ? "Key Verses" : "Topics & Terms"}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <p className="text-sm leading-7" style={{ color: "#374151" }}>{selected.overview}</p>

            {/* Encyclopedia quick-lookup */}
            {onLookupEncyclopedia && selected.encyclopediaTerms.length > 0 && (
              <div className="rounded-xl p-4" style={{ background: "#faf8f3", border: "1px solid #ede8de" }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2.5" style={{ color: GOLD }}>
                  🏛️ Study in the Encyclopedia
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.encyclopediaTerms.map((term) => (
                    <button
                      key={term}
                      onClick={() => onLookupEncyclopedia(term)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition hover:shadow-md"
                      style={{ background: "white", color: NAVY, border: "1px solid #e5e7eb" }}
                    >
                      <Search size={10} className="opacity-40" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Key Verses tab */}
        {activeTab === "passages" && (
          <div className="space-y-3">
            {selected.keyPassages.map((p) => (
              <div
                key={p.ref}
                className="rounded-xl px-4 py-3"
                style={{ background: "white", border: "1px solid #ede8de" }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black" style={{ color: NAVY }}>{p.ref}</span>
                  {onOpenVerse && (
                    <button
                      onClick={() => onOpenVerse(p.ref)}
                      className="text-[10px] font-semibold flex items-center gap-0.5 transition hover:opacity-70"
                      style={{ color: GOLD }}
                    >
                      <BookOpen size={10} />
                      Read
                    </button>
                  )}
                </div>
                <p className="text-xs leading-relaxed italic" style={{ color: "#6b7280" }}>
                  &ldquo;{p.preview}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Topics & Terms tab */}
        {activeTab === "topics" && (
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: GOLD }}>
                Sub-Topics
              </p>
              <div className="space-y-1.5">
                {selected.subTopics.map((t) => (
                  <div key={t}>
                    <button
                      onClick={() => setTheopediaTerm(theopediaTerm === t ? null : t)}
                      className="w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-left transition hover:shadow-sm group"
                      style={theopediaTerm === t
                        ? { background: NAVY, color: "white", border: `1px solid ${NAVY}` }
                        : { background: "white", color: NAVY, border: "1px solid #ede8de" }}
                    >
                      <span className="flex items-center gap-2">
                        <ChevronRight size={11} className="opacity-30 shrink-0 group-hover:opacity-60 transition" />
                        {t}
                      </span>
                      <span className="text-[9px] font-bold opacity-0 group-hover:opacity-50 transition shrink-0"
                        style={{ color: theopediaTerm === t ? "rgba(255,255,255,0.6)" : GOLD }}>
                        Theopedia →
                      </span>
                    </button>
                    {theopediaTerm === t && (
                      <div className="mt-1.5 mb-1">
                        <TheopediaPanel term={t} onClose={() => setTheopediaTerm(null)} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: GOLD }}>
                Key Terms
              </p>
              <div className="flex flex-wrap gap-2">
                {selected.keyTerms.map((term) => (
                  <button
                    key={term}
                    onClick={() => setTheopediaTerm(theopediaTerm === term ? null : term)}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold transition hover:opacity-75 hover:shadow-sm"
                    style={theopediaTerm === term
                      ? { background: NAVY, color: "white", border: `1px solid ${NAVY}` }
                      : { background: BRANCH_COLOR[selected.id]?.bg ?? "#e8e0d4", color: BRANCH_COLOR[selected.id]?.text ?? NAVY, border: `1px solid ${BRANCH_COLOR[selected.id]?.ring ?? "#c5b99a"}` }}
                    title={`Look up "${term}" on Theopedia`}
                  >
                    {term}
                  </button>
                ))}
                {/* Theopedia panel for selected key term */}
                {theopediaTerm && selected.keyTerms.includes(theopediaTerm) && (
                  <div className="w-full mt-2">
                    <TheopediaPanel term={theopediaTerm} onClose={() => setTheopediaTerm(null)} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Browse view ─────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Section header */}
      <div className="mb-5">
        <h2 className="text-lg font-black" style={{ color: NAVY }}>Systematic Theology</h2>
        <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
          The ordered study of Christian doctrine — from Scripture to the last things
        </p>
      </div>

      {/* Branch grid */}
      <div className="space-y-2">
        {BRANCHES.map((branch) => {
          const color = BRANCH_COLOR[branch.id] ?? { bg: "#e8e0d4", text: NAVY, ring: "#c5b99a" };
          return (
            <button
              key={branch.id}
              onClick={() => { setSelected(branch); setActiveTab("overview"); }}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:shadow-md group"
              style={{ background: "white", border: "1px solid #ede8de" }}
            >
              {/* Emoji + color accent */}
              <div
                className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                style={{ background: color.bg, border: `1px solid ${color.ring}` }}
              >
                {branch.emoji}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black leading-tight" style={{ color: NAVY }}>
                  {branch.name}
                </p>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: "#9ca3af" }}>
                  {branch.subtitle}
                </p>
              </div>

              <ChevronRight size={14} className="shrink-0 opacity-25 group-hover:opacity-60 transition" style={{ color: NAVY }} />
            </button>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-6 rounded-xl p-4 text-xs leading-relaxed" style={{ background: "#faf8f3", border: "1px solid #ede8de", color: "#6b7280" }}>
        <p className="font-semibold mb-1" style={{ color: NAVY }}>About Systematic Theology</p>
        <p>
          Systematic theology organizes the teachings of Scripture into logical categories to give a
          comprehensive understanding of Christian doctrine. Each branch builds on the others — from
          the study of God Himself to His purposes for humanity, salvation, the church, and eternity.
        </p>
      </div>
    </div>
  );
}
