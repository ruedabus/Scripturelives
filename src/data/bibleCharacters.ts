export type Testament = "OT" | "NT" | "Both";
export type CharacterCategory =
  | "Patriarch"
  | "Prophet"
  | "King"
  | "Apostle"
  | "Judge"
  | "Priest"
  | "Warrior"
  | "Matriarch"
  | "Disciple"
  | "Messiah";

export interface KeyVerse {
  reference: string;
  text: string;
}

export interface LifeEvent {
  title: string;
  description: string;
  reference?: string;
}

export interface BibleCharacter {
  id: string;
  name: string;
  testament: Testament;
  category: CharacterCategory;
  emoji: string;
  tagline: string;
  bio: string;
  born?: string;
  era: string;
  keyVerses: KeyVerse[];
  lifeEvents: LifeEvent[];
  lessons: string[];
  relatedCharacters: string[]; // character ids
  books: string[]; // Books where they appear prominently
}

export const BIBLE_CHARACTERS: BibleCharacter[] = [
  // ── OLD TESTAMENT ─────────────────────────────────────────────────────────
  {
    id: "adam",
    name: "Adam",
    testament: "OT",
    category: "Patriarch",
    emoji: "🌿",
    tagline: "The first man — formed from dust, breathed into life",
    bio: "Adam was the first human being, created by God from the dust of the ground and given the breath of life. He lived in the Garden of Eden, named all the animals, and was given a companion in Eve. His disobedience brought sin into the world, but God's promise of redemption echoed through all of Scripture from that moment forward.",
    era: "Creation",
    keyVerses: [
      { reference: "Genesis 1:27", text: "So God created mankind in his own image, in the image of God he created them; male and female he created them." },
      { reference: "Genesis 2:7", text: "Then the Lord God formed a man from the dust of the ground and breathed into his nostrils the breath of life, and the man became a living being." },
      { reference: "Romans 5:14", text: "Nevertheless, death reigned from the time of Adam to the time of Moses, even over those who did not sin by breaking a command, as did Adam, who is a pattern of the one to come." },
    ],
    lifeEvents: [
      { title: "Created in God's Image", description: "God formed Adam from the dust and breathed life into him, placing him in the Garden of Eden.", reference: "Genesis 2:7" },
      { title: "Names the Animals", description: "Adam was given authority to name every creature, demonstrating his God-given dominion.", reference: "Genesis 2:19-20" },
      { title: "Eve Created", description: "God created Eve from Adam's rib as a partner and companion.", reference: "Genesis 2:21-22" },
      { title: "The Fall", description: "Adam and Eve disobeyed God by eating the forbidden fruit, introducing sin and death.", reference: "Genesis 3:6" },
      { title: "Expelled from Eden", description: "God banished Adam and Eve from the garden, but promised a coming redeemer.", reference: "Genesis 3:23-24" },
    ],
    lessons: [
      "We are made in the image of God — our lives have inherent dignity and purpose",
      "Disobedience has consequences, but God's redemptive plan is already in motion",
      "We are designed for relationship — with God and with others",
    ],
    relatedCharacters: ["eve", "abel", "cain"],
    books: ["Genesis", "Romans", "1 Corinthians"],
  },
  {
    id: "eve",
    name: "Eve",
    testament: "OT",
    category: "Matriarch",
    emoji: "🌸",
    tagline: "The mother of all the living",
    bio: "Eve was the first woman, created by God from Adam's rib as his equal partner and companion. She is the mother of all humanity. Deceived by the serpent, she ate the forbidden fruit and offered it to Adam. Despite this fall, she trusted in God's promise — naming her son Seth as one appointed in place of Abel, looking forward to the seed who would crush the serpent's head.",
    era: "Creation",
    keyVerses: [
      { reference: "Genesis 3:20", text: "Adam named his wife Eve, because she would become the mother of all the living." },
      { reference: "Genesis 2:23", text: "The man said, 'This is now bone of my bones and flesh of my flesh; she shall be called woman, for she was taken out of man.'" },
    ],
    lifeEvents: [
      { title: "Created as Adam's Partner", description: "God created Eve from Adam's rib — the first woman and equal partner to man.", reference: "Genesis 2:21-22" },
      { title: "Tempted in the Garden", description: "The serpent deceived Eve into doubting God's word and eating the forbidden fruit.", reference: "Genesis 3:1-6" },
      { title: "The Promise Given", description: "God promised that Eve's offspring would crush the serpent's head — a first glimpse of the gospel.", reference: "Genesis 3:15" },
      { title: "Mother of Cain and Abel", description: "Eve bore the first children, including Cain and Abel, whose conflict became the first murder.", reference: "Genesis 4:1-2" },
    ],
    lessons: [
      "Doubt about God's goodness opens the door to temptation",
      "Even in failure, God's redemptive promise holds — the seed of the woman points to Christ",
      "Motherhood and the nurturing of life is a sacred calling",
    ],
    relatedCharacters: ["adam", "cain", "abel"],
    books: ["Genesis", "2 Corinthians", "1 Timothy"],
  },
  {
    id: "noah",
    name: "Noah",
    testament: "OT",
    category: "Patriarch",
    emoji: "⛵",
    tagline: "A righteous man who found favor in God's eyes",
    bio: "Noah lived in an age of unprecedented wickedness. Yet Scripture says he was 'a righteous man, blameless among the people of his time.' God called him to build an ark and preserve life through a global flood. His obedience — building a massive ark over decades with no rain in sight — stands as one of the greatest acts of faith in all of Scripture.",
    era: "Pre-Flood",
    keyVerses: [
      { reference: "Genesis 6:9", text: "Noah was a righteous man, blameless among the people of his time, and he walked faithfully with God." },
      { reference: "Hebrews 11:7", text: "By faith Noah, when warned about things not yet seen, in holy fear built an ark to save his family." },
      { reference: "Genesis 9:13", text: "I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth." },
    ],
    lifeEvents: [
      { title: "Called by God", description: "God warned Noah of the coming flood and commissioned him to build the ark.", reference: "Genesis 6:13-14" },
      { title: "Building the Ark", description: "Noah obeyed God and built an enormous ark over many years, preaching righteousness to those around him.", reference: "Genesis 6:22" },
      { title: "The Flood", description: "Rain fell for 40 days and 40 nights. All life on earth was destroyed except those in the ark.", reference: "Genesis 7:12" },
      { title: "The Rainbow Covenant", description: "God made a covenant with Noah and all creation, promising never to destroy the earth by flood again.", reference: "Genesis 9:11-13" },
    ],
    lessons: [
      "Faith obeys even when the command seems impossible or foolish to the world",
      "God preserves the righteous through judgment",
      "Grace is available even in the darkest generation",
    ],
    relatedCharacters: ["adam", "abraham"],
    books: ["Genesis", "Hebrews", "1 Peter", "2 Peter"],
  },
  {
    id: "abraham",
    name: "Abraham",
    testament: "OT",
    category: "Patriarch",
    emoji: "⭐",
    tagline: "The father of faith — called out of Ur into the unknown",
    bio: "Abraham was a man called by God to leave everything familiar and journey to a land he had never seen. His life is the story of learning to trust God through impossible circumstances — a promised son in old age, a test of sacrifice on Mount Moriah, and a covenant that would bless all nations. Paul calls him the 'father of all who believe.'",
    era: "Patriarchal Period (~2000 BC)",
    keyVerses: [
      { reference: "Genesis 15:6", text: "Abram believed the Lord, and he credited it to him as righteousness." },
      { reference: "Hebrews 11:8", text: "By faith Abraham obeyed when he was called to go out to a place that he was to receive as an inheritance. And he went out, not knowing where he was going." },
      { reference: "Romans 4:3", text: "Abraham believed God, and it was credited to him as righteousness." },
    ],
    lifeEvents: [
      { title: "The Call from Ur", description: "God called Abram to leave his homeland and go to a new land, promising to make him a great nation.", reference: "Genesis 12:1-3" },
      { title: "Covenant with God", description: "God made a formal covenant with Abram, promising him countless descendants and the land of Canaan.", reference: "Genesis 15:1-21" },
      { title: "Name Changed to Abraham", description: "God renamed Abram 'Abraham' (father of many nations) and instituted the sign of circumcision.", reference: "Genesis 17:5" },
      { title: "Isaac Is Born", description: "At age 100, Abraham and Sarah received the promised son Isaac — the impossible made possible.", reference: "Genesis 21:1-3" },
      { title: "The Test on Mount Moriah", description: "God tested Abraham by asking him to sacrifice Isaac. Abraham obeyed, and God provided a ram instead.", reference: "Genesis 22:1-14" },
    ],
    lessons: [
      "Faith means trusting God's promises even when circumstances make them seem impossible",
      "Obedience often requires leaving what is comfortable for what is unknown",
      "God tests faith not to destroy it, but to deepen it",
    ],
    relatedCharacters: ["sarah", "isaac", "lot", "ishmael"],
    books: ["Genesis", "Romans", "Galatians", "Hebrews", "James"],
  },
  {
    id: "sarah",
    name: "Sarah",
    testament: "OT",
    category: "Matriarch",
    emoji: "👑",
    tagline: "She laughed — then held the promise in her arms",
    bio: "Sarah was the wife of Abraham and the first of the great matriarchs of Israel. Her story is marked by a long and painful wait — decades of barrenness and hope deferred. When angels announced she would bear a son at ninety, she laughed. But God had the last word, and she became the mother of Isaac and the ancestral mother of the Jewish people.",
    era: "Patriarchal Period (~2000 BC)",
    keyVerses: [
      { reference: "Genesis 18:14", text: "Is anything too hard for the Lord? I will return to you at the appointed time next year, and Sarah will have a son." },
      { reference: "Hebrews 11:11", text: "And by faith even Sarah, who was past childbearing age, was enabled to bear children because she considered him faithful who had made the promise." },
    ],
    lifeEvents: [
      { title: "Journeys to Canaan", description: "Sarah left her home in Ur with Abraham in faith, following God's call to an unknown land.", reference: "Genesis 12:5" },
      { title: "The Promise Announced", description: "God promised Abraham that Sarah would bear a son. Sarah, overhearing, laughed in disbelief.", reference: "Genesis 18:10-12" },
      { title: "Isaac Is Born", description: "At ninety years old, Sarah gave birth to Isaac — the child of promise.", reference: "Genesis 21:2" },
    ],
    lessons: [
      "God's promises are not limited by human biology or logic",
      "Doubt does not disqualify us from receiving God's grace",
      "The most impossible promises are often the ones God delights to fulfill",
    ],
    relatedCharacters: ["abraham", "isaac", "hagar"],
    books: ["Genesis", "Romans", "Galatians", "Hebrews", "1 Peter"],
  },
  {
    id: "moses",
    name: "Moses",
    testament: "OT",
    category: "Prophet",
    emoji: "🔥",
    tagline: "Deliverer, lawgiver, and friend of God",
    bio: "Moses is one of the towering figures of the Old Testament — a man born under a death sentence who became the deliverer of a nation. Raised in Pharaoh's palace, he fled to the wilderness, encountered God in a burning bush, and returned to lead the Israelites out of Egypt. He received the Law on Sinai and spoke with God face to face, as a man speaks with his friend.",
    era: "Exodus Period (~1446 BC)",
    keyVerses: [
      { reference: "Deuteronomy 34:10", text: "Since then, no prophet has risen in Israel like Moses, whom the Lord knew face to face." },
      { reference: "Exodus 3:14", text: "God said to Moses, 'I AM WHO I AM. This is what you are to say to the Israelites: I AM has sent me to you.'" },
      { reference: "Hebrews 11:24-25", text: "By faith Moses, when he had grown up, refused to be known as the son of Pharaoh's daughter. He chose to be mistreated along with the people of God." },
    ],
    lifeEvents: [
      { title: "Born and Hidden", description: "Moses was born during Pharaoh's genocide of Hebrew boys and hidden in a basket in the Nile.", reference: "Exodus 2:1-3" },
      { title: "Adopted by Pharaoh's Daughter", description: "Found by Pharaoh's daughter, Moses was raised in the Egyptian royal court.", reference: "Exodus 2:5-10" },
      { title: "The Burning Bush", description: "God appeared to Moses in a burning bush and commissioned him to lead Israel out of Egypt.", reference: "Exodus 3:2-10" },
      { title: "The Ten Plagues", description: "God sent ten plagues on Egypt through Moses, culminating in the Passover and the death of the firstborn.", reference: "Exodus 7-12" },
      { title: "Crossing the Red Sea", description: "God parted the Red Sea, allowing Israel to cross on dry ground and escape Pharaoh's army.", reference: "Exodus 14:21-22" },
      { title: "The Ten Commandments", description: "Moses received the Law from God on Mount Sinai, establishing the covenant with Israel.", reference: "Exodus 20:1-17" },
    ],
    lessons: [
      "God can use the most unlikely people — even a reluctant shepherd or a man with a speech problem",
      "Intercession on behalf of others is a powerful and sacred calling",
      "Intimacy with God is available to those who seek His presence",
    ],
    relatedCharacters: ["aaron", "pharaoh", "joshua", "miriam"],
    books: ["Exodus", "Leviticus", "Numbers", "Deuteronomy", "Hebrews"],
  },
  {
    id: "david",
    name: "David",
    testament: "OT",
    category: "King",
    emoji: "🎵",
    tagline: "A man after God's own heart — shepherd, warrior, and king",
    bio: "David was the youngest son of a shepherd who became the greatest king in Israel's history. He killed Goliath as a teenager, spent years as a fugitive under King Saul, and eventually united the twelve tribes under one crown. He was a warrior, a poet, a worshipper, and also an adulterer and an accessory to murder — yet he repented deeply and was called a man after God's own heart.",
    era: "United Monarchy (~1000 BC)",
    keyVerses: [
      { reference: "1 Samuel 13:14", text: "The Lord has sought out a man after his own heart and appointed him ruler of his people." },
      { reference: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want." },
      { reference: "Acts 13:22", text: "I have found David son of Jesse, a man after my own heart; he will do everything I want him to do." },
    ],
    lifeEvents: [
      { title: "Anointed by Samuel", description: "God sent Samuel to anoint the youngest of Jesse's sons as the future king of Israel.", reference: "1 Samuel 16:13" },
      { title: "Defeats Goliath", description: "As a young man, David killed the Philistine giant Goliath with a single stone, trusting in God's strength.", reference: "1 Samuel 17:49-50" },
      { title: "Flees from Saul", description: "Years of exile followed as King Saul pursued David, yet David refused to harm God's anointed.", reference: "1 Samuel 18-26" },
      { title: "Crowned King of Israel", description: "After Saul's death, David was crowned king and reigned for 40 years.", reference: "2 Samuel 5:3-4" },
      { title: "Bathsheba and Nathan's Rebuke", description: "David's sin with Bathsheba and the murder of Uriah led to deep consequences and humble repentance.", reference: "2 Samuel 11-12" },
      { title: "Psalm 51", description: "David's profound psalm of repentance — a model for all who have fallen and return to God.", reference: "Psalm 51:1-17" },
    ],
    lessons: [
      "God looks at the heart, not the outward appearance",
      "Genuine repentance restores our standing with God even after serious sin",
      "Worship is a weapon — David's psalms shaped the spiritual life of a nation",
    ],
    relatedCharacters: ["saul", "solomon", "jonathan", "bathsheba", "goliath"],
    books: ["1 Samuel", "2 Samuel", "Psalms", "Acts", "Romans"],
  },
  {
    id: "solomon",
    name: "Solomon",
    testament: "OT",
    category: "King",
    emoji: "💎",
    tagline: "The wisest man who ever lived — and the cautionary tale of a divided heart",
    bio: "Solomon was the son of David and Bathsheba, chosen by God to succeed his father and build the Temple. He asked for wisdom above all else and received it — along with unsurpassed wealth, peace, and renown. He wrote much of Proverbs, Ecclesiastes, and the Song of Songs. But his heart was eventually turned from God by his many foreign wives, and the kingdom was divided after his death.",
    era: "United Monarchy (~970 BC)",
    keyVerses: [
      { reference: "1 Kings 3:12", text: "I will do what you have asked. I will give you a wise and discerning heart, so that there will never have been anyone like you, nor will there ever be." },
      { reference: "Proverbs 3:5-6", text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight." },
      { reference: "Ecclesiastes 12:13", text: "Fear God and keep his commandments, for this is the duty of all mankind." },
    ],
    lifeEvents: [
      { title: "Asks for Wisdom", description: "When God offered Solomon anything he wanted, he asked for wisdom to govern well — and God granted it abundantly.", reference: "1 Kings 3:5-12" },
      { title: "Builds the Temple", description: "Solomon fulfilled his father David's dream by building the magnificent Temple in Jerusalem.", reference: "1 Kings 6-8" },
      { title: "The Queen of Sheba Visits", description: "The Queen of Sheba traveled from afar to test Solomon's wisdom, and left in awe of his kingdom.", reference: "1 Kings 10:1-10" },
      { title: "Solomon's Heart Turns Away", description: "His many foreign wives led Solomon to worship other gods in his old age, fracturing his legacy.", reference: "1 Kings 11:1-6" },
    ],
    lessons: [
      "Wisdom is the foundation of great leadership — ask God for it above all else",
      "Even the greatest gifts can be squandered through a divided heart",
      "Earthly achievements are ultimately meaningless apart from fearing God",
    ],
    relatedCharacters: ["david", "bathsheba"],
    books: ["1 Kings", "2 Chronicles", "Proverbs", "Ecclesiastes", "Song of Solomon"],
  },
  {
    id: "elijah",
    name: "Elijah",
    testament: "OT",
    category: "Prophet",
    emoji: "⚡",
    tagline: "The bold prophet of fire — and the burned-out man under the broom tree",
    bio: "Elijah was one of the most dramatic prophets in the Old Testament. He called down fire from heaven, raised the dead, and confronted 450 prophets of Baal on Mount Carmel in one of Scripture's most spectacular showdowns. Yet immediately after his greatest victory, he fled in fear and asked God to take his life. His story is a profound portrait of both prophetic fire and human vulnerability.",
    era: "Divided Kingdom (~875 BC)",
    keyVerses: [
      { reference: "1 Kings 18:21", text: "How long will you waver between two opinions? If the Lord is God, follow him; but if Baal is God, follow him." },
      { reference: "1 Kings 19:12", text: "After the earthquake came a fire, but the Lord was not in the fire. And after the fire came a gentle whisper." },
      { reference: "James 5:17", text: "Elijah was a human being, even as we are. He prayed earnestly that it would not rain, and it did not rain on the land for three and a half years." },
    ],
    lifeEvents: [
      { title: "Declares a Drought", description: "Elijah boldly announced to King Ahab that there would be no rain except at his word.", reference: "1 Kings 17:1" },
      { title: "Fed by Ravens at Kerith", description: "God miraculously provided food and water for Elijah through ravens during the drought.", reference: "1 Kings 17:4-6" },
      { title: "Mount Carmel Showdown", description: "Elijah challenged 450 prophets of Baal — calling down fire from heaven in a stunning display of God's power.", reference: "1 Kings 18:36-38" },
      { title: "Burned Out Under the Broom Tree", description: "After his victory, Elijah fled and collapsed in exhaustion, asking God to let him die.", reference: "1 Kings 19:4" },
      { title: "The Still Small Voice", description: "God met Elijah not in wind, earthquake, or fire — but in a gentle whisper.", reference: "1 Kings 19:12" },
      { title: "Taken Up in a Chariot of Fire", description: "Elijah did not die but was taken up to heaven in a whirlwind — one of only two people in Scripture.", reference: "2 Kings 2:11" },
    ],
    lessons: [
      "God's work does not require us to have it all together — even the greatest prophets burned out",
      "After great spiritual victories, we may be most vulnerable to discouragement",
      "God often speaks in the quiet and gentle, not the dramatic and spectacular",
    ],
    relatedCharacters: ["elisha", "ahab", "jezebel"],
    books: ["1 Kings", "2 Kings", "Malachi", "Luke", "James", "Revelation"],
  },
  {
    id: "daniel",
    name: "Daniel",
    testament: "OT",
    category: "Prophet",
    emoji: "🦁",
    tagline: "Faithful in exile — purpose in a foreign land",
    bio: "Daniel was carried off to Babylon as a young man when Jerusalem fell. Rather than blending in, he resolved not to defile himself with the king's food and became one of the most distinguished officials in the Babylonian and later Persian courts. Through dreams, visions, and a night in a lion's den, he demonstrated that God's sovereignty extends over every empire and every era.",
    era: "Babylonian Exile (~605 BC)",
    keyVerses: [
      { reference: "Daniel 1:8", text: "But Daniel resolved not to defile himself with the royal food and wine, and he asked the chief official for permission not to defile himself this way." },
      { reference: "Daniel 6:10", text: "Now when Daniel learned that the decree had been published, he went home to his upstairs room where the windows opened toward Jerusalem. Three times a day he got down on his knees and prayed." },
      { reference: "Daniel 2:20", text: "Praise be to the name of God for ever and ever; wisdom and power are his." },
    ],
    lifeEvents: [
      { title: "Taken to Babylon", description: "As a young man of noble birth, Daniel was selected to serve in King Nebuchadnezzar's court.", reference: "Daniel 1:1-6" },
      { title: "Interprets the King's Dream", description: "God revealed to Daniel Nebuchadnezzar's dream about a great statue — a vision of world empires.", reference: "Daniel 2:27-28" },
      { title: "The Fiery Furnace", description: "Daniel's three friends Shadrach, Meshach, and Abednego were thrown into a furnace for refusing to bow — and emerged unharmed.", reference: "Daniel 3:23-25" },
      { title: "The Writing on the Wall", description: "Daniel interpreted mysterious handwriting that announced the fall of Babylon to King Belshazzar.", reference: "Daniel 5:25-28" },
      { title: "The Lion's Den", description: "Thrown into a lions' den for praying to God, Daniel emerged unharmed the next morning.", reference: "Daniel 6:22" },
    ],
    lessons: [
      "Small acts of faithfulness — like refusing the king's food — shape a life of integrity",
      "Prayer is worth protecting even at great personal cost",
      "God is sovereign over every empire, every king, and every era of history",
    ],
    relatedCharacters: ["nebuchadnezzar", "ezekiel", "ezra"],
    books: ["Daniel", "Matthew", "Hebrews", "Revelation"],
  },
  {
    id: "esther",
    name: "Esther",
    testament: "OT",
    category: "Matriarch",
    emoji: "👸",
    tagline: "Born for such a time as this",
    bio: "Esther was a Jewish orphan raised by her cousin Mordecai who became queen of Persia through an unlikely series of events. When a genocidal plot against the Jewish people was set in motion, she faced an impossible choice — remain silent and survive, or risk her life to save her people. Mordecai's challenge to her became one of Scripture's most stirring calls to courageous purpose.",
    era: "Persian Period (~480 BC)",
    keyVerses: [
      { reference: "Esther 4:14", text: "And who knows but that you have come to your royal position for such a time as this?" },
      { reference: "Esther 4:16", text: "I will go to the king, even though it is against the law. And if I perish, I perish." },
    ],
    lifeEvents: [
      { title: "Raised by Mordecai", description: "Orphaned young, Esther was raised by her older cousin Mordecai in exile in Persia.", reference: "Esther 2:7" },
      { title: "Chosen as Queen", description: "Esther was chosen from among many women to become Queen of Persia, but concealed her Jewish identity.", reference: "Esther 2:17" },
      { title: "Haman's Plot Revealed", description: "Mordecai uncovered Haman's plan to exterminate all Jews and urged Esther to intervene.", reference: "Esther 3-4" },
      { title: "Three Days of Fasting", description: "Esther called all the Jews to fast for three days before she approached the king uninvited.", reference: "Esther 4:16" },
      { title: "Saves Her People", description: "Esther revealed Haman's plot to the king and saved the Jewish people from genocide.", reference: "Esther 7:3-4" },
    ],
    lessons: [
      "God often places people in strategic positions for purposes greater than personal comfort",
      "Courage in crisis requires preparation, prayer, and community",
      "Providence works through ordinary people in extraordinary moments",
    ],
    relatedCharacters: ["mordecai"],
    books: ["Esther"],
  },

  // ── NEW TESTAMENT ─────────────────────────────────────────────────────────
  {
    id: "mary",
    name: "Mary, Mother of Jesus",
    testament: "NT",
    category: "Matriarch",
    emoji: "✨",
    tagline: "Blessed among women — treasuring all things in her heart",
    bio: "Mary was a young woman from Nazareth chosen by God to be the mother of Jesus. Her yes to Gabriel's announcement changed the course of history. She witnessed the full arc of her Son's life — from the manger to the cross — and was present with the disciples in the upper room at Pentecost. Her song, the Magnificat, is one of the most beautiful pieces of Scripture.",
    era: "New Testament (~5 BC)",
    keyVerses: [
      { reference: "Luke 1:38", text: "I am the Lord's servant. May your word to me be fulfilled." },
      { reference: "Luke 1:46-47", text: "My soul glorifies the Lord and my spirit rejoices in God my Savior." },
      { reference: "Luke 2:19", text: "But Mary treasured up all these things and pondered them in her heart." },
    ],
    lifeEvents: [
      { title: "The Annunciation", description: "The angel Gabriel appeared to Mary and announced she would conceive the Son of God by the Holy Spirit.", reference: "Luke 1:26-33" },
      { title: "The Magnificat", description: "Mary visited Elizabeth and burst into a song of praise celebrating God's faithfulness.", reference: "Luke 1:46-55" },
      { title: "Birth of Jesus in Bethlehem", description: "Mary gave birth to Jesus in a stable in Bethlehem, wrapping him in cloths and laying him in a manger.", reference: "Luke 2:7" },
      { title: "At the Cross", description: "Mary stood at the foot of the cross as Jesus was crucified. Jesus entrusted her care to the Apostle John.", reference: "John 19:25-27" },
      { title: "At Pentecost", description: "Mary was among the disciples gathered in the upper room when the Holy Spirit was poured out.", reference: "Acts 1:14" },
    ],
    lessons: [
      "True faith says yes to God even when the cost is enormous",
      "Obedience often means being misunderstood by the world around you",
      "A heart that treasures God's word will be shaped by it over time",
    ],
    relatedCharacters: ["joseph", "jesus", "elizabeth", "gabriel"],
    books: ["Matthew", "Luke", "John", "Acts"],
  },
  {
    id: "peter",
    name: "Peter (Simon Peter)",
    testament: "NT",
    category: "Apostle",
    emoji: "🪨",
    tagline: "The rock who stumbled — and became the foundation",
    bio: "Peter was a fisherman from Galilee who became the most prominent of Jesus's twelve apostles. He was impulsive, passionate, and deeply flawed — the same man who walked on water and confessed Jesus as the Messiah also denied him three times before a rooster crowed. His restoration after the resurrection is one of Scripture's most moving scenes of grace. He became a pillar of the early church.",
    era: "New Testament (~26 AD)",
    keyVerses: [
      { reference: "Matthew 16:16", text: "Simon Peter answered, 'You are the Messiah, the Son of the living God.'" },
      { reference: "John 21:17", text: "The third time he said to him, 'Simon son of John, do you love me?' Peter was hurt because Jesus asked him the third time, 'Do you love me?' He said, 'Lord, you know all things; you know that I love you.'" },
      { reference: "1 Peter 5:7", text: "Cast all your anxiety on him because he cares for you." },
    ],
    lifeEvents: [
      { title: "Called by Jesus", description: "Jesus called Peter from his fishing nets with the invitation: 'Follow me, and I will make you fishers of men.'", reference: "Matthew 4:19" },
      { title: "Walks on Water", description: "Peter stepped out of the boat onto the sea in faith, then sank when his eyes left Jesus.", reference: "Matthew 14:28-30" },
      { title: "The Great Confession", description: "Peter declared Jesus to be 'the Messiah, the Son of the living God' — a revelation from the Father.", reference: "Matthew 16:16" },
      { title: "The Denial", description: "Three times Peter denied knowing Jesus on the night of his arrest, just as Jesus had predicted.", reference: "Luke 22:60-61" },
      { title: "Restored by Jesus", description: "After the resurrection, Jesus restored Peter three times by the Sea of Galilee — one question for each denial.", reference: "John 21:15-17" },
      { title: "Pentecost Sermon", description: "Filled with the Holy Spirit, Peter preached to the crowd and 3,000 people were saved in one day.", reference: "Acts 2:41" },
    ],
    lessons: [
      "Jesus doesn't call the qualified — he qualifies the called",
      "Failure doesn't disqualify us from God's purposes; Peter's greatest ministry came after his greatest failure",
      "Restoration is more powerful than perfection",
    ],
    relatedCharacters: ["jesus", "james", "john", "paul", "andrew"],
    books: ["Matthew", "Mark", "Luke", "John", "Acts", "1 Peter", "2 Peter"],
  },
  {
    id: "paul",
    name: "Paul (Saul of Tarsus)",
    testament: "NT",
    category: "Apostle",
    emoji: "✉️",
    tagline: "The persecutor who became the greatest missionary",
    bio: "Paul was a Pharisee of Pharisees — educated under Gamaliel, zealous for the Law, and actively persecuting the early church. Then Jesus met him on the road to Damascus and everything changed. He became the apostle to the Gentiles, planting churches across the Roman world and writing nearly half of the New Testament. His theology shaped Christianity for two thousand years.",
    era: "New Testament (~35 AD)",
    keyVerses: [
      { reference: "Galatians 2:20", text: "I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me." },
      { reference: "Philippians 4:13", text: "I can do all this through him who gives me strength." },
      { reference: "Romans 8:38-39", text: "For I am convinced that neither death nor life, neither angels nor demons... will be able to separate us from the love of God that is in Christ Jesus our Lord." },
    ],
    lifeEvents: [
      { title: "Persecutes the Church", description: "Saul held the coats of those who stoned Stephen and went house to house dragging Christians to prison.", reference: "Acts 8:3" },
      { title: "The Damascus Road", description: "Jesus appeared to Saul in blinding light, stopping him cold and commissioning him as an apostle.", reference: "Acts 9:3-6" },
      { title: "Three Missionary Journeys", description: "Paul traveled across the Roman Empire preaching the gospel, planting churches, and suffering for Christ.", reference: "Acts 13-21" },
      { title: "Imprisoned in Rome", description: "Paul was imprisoned multiple times and ultimately martyred for the faith, writing many of his letters from prison.", reference: "Acts 28:16" },
      { title: "Thorn in the Flesh", description: "Despite a mysterious weakness, Paul learned contentment through Christ's sufficient grace.", reference: "2 Corinthians 12:7-9" },
    ],
    lessons: [
      "No one is beyond the reach of God's grace — if Paul could be transformed, anyone can",
      "Suffering and ministry are not contradictions — they often go hand in hand",
      "Contentment is learned, not inherited",
    ],
    relatedCharacters: ["barnabas", "timothy", "silas", "peter", "stephen"],
    books: ["Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians"],
  },
  {
    id: "john",
    name: "John the Apostle",
    testament: "NT",
    category: "Apostle",
    emoji: "💙",
    tagline: "The beloved disciple — resting on the heart of Jesus",
    bio: "John was one of the sons of Zebedee, a fisherman who became one of the three closest disciples of Jesus. He and his brother James were called 'Sons of Thunder' for their fiery temperament — but John became known as the apostle of love. He wrote the Gospel of John, three letters, and the book of Revelation. He was the only apostle to die of old age rather than martyrdom.",
    era: "New Testament (~26 AD)",
    keyVerses: [
      { reference: "John 13:34", text: "A new command I give you: Love one another. As I have loved you, so you must love one another." },
      { reference: "1 John 4:8", text: "Whoever does not love does not know God, because God is love." },
      { reference: "John 3:16", text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
    ],
    lifeEvents: [
      { title: "Called from His Fishing Nets", description: "Jesus called John and his brother James while they were mending nets with their father Zebedee.", reference: "Matthew 4:21-22" },
      { title: "At the Transfiguration", description: "John was one of three disciples who witnessed Jesus transfigured in glory on the mountain.", reference: "Matthew 17:1-2" },
      { title: "The Last Supper", description: "John reclined next to Jesus at the Last Supper — the 'beloved disciple' who leaned against his Lord.", reference: "John 13:23" },
      { title: "At the Cross and Tomb", description: "John was the only male disciple at the cross. He ran with Peter to the empty tomb.", reference: "John 19:26, 20:4" },
      { title: "Writes the Book of Revelation", description: "Exiled to the island of Patmos, John received the great vision of the end times and Christ's return.", reference: "Revelation 1:9" },
    ],
    lessons: [
      "Love is not a feeling but a command — and it is the defining mark of a disciple",
      "Those who are closest to Jesus are most transformed into people of love",
      "The same fire that seeks to destroy can, when surrendered, become a passion for God",
    ],
    relatedCharacters: ["jesus", "peter", "james", "mary"],
    books: ["John", "1 John", "2 John", "3 John", "Revelation"],
  },
  {
    id: "jesus",
    name: "Jesus Christ",
    testament: "Both",
    category: "Messiah",
    emoji: "✝️",
    tagline: "The Word made flesh — the way, the truth, and the life",
    bio: "Jesus of Nazareth is the central figure of all of Scripture — the promised Messiah of the Old Testament and the fulfillment of every covenant and prophecy. Born of a virgin in Bethlehem, he lived a sinless life, taught with unparalleled authority, performed miracles, died on the cross as the atoning sacrifice for the sins of the world, and rose from the dead on the third day. He ascended to the Father and will return in glory.",
    era: "~4 BC – ~30 AD",
    keyVerses: [
      { reference: "John 1:14", text: "The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth." },
      { reference: "John 14:6", text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'" },
      { reference: "Philippians 2:8", text: "And being found in appearance as a man, he humbled himself by becoming obedient to death — even death on a cross!" },
    ],
    lifeEvents: [
      { title: "Born in Bethlehem", description: "Jesus was born of the Virgin Mary in Bethlehem, fulfilling prophecy. Angels announced his birth to shepherds.", reference: "Luke 2:7" },
      { title: "Baptism and Temptation", description: "Jesus was baptized by John and immediately led into the wilderness where he was tempted for 40 days.", reference: "Matthew 3:16-4:11" },
      { title: "The Sermon on the Mount", description: "Jesus delivered the foundational teaching of the Kingdom of God on a mountainside in Galilee.", reference: "Matthew 5-7" },
      { title: "The Transfiguration", description: "Jesus was transfigured before Peter, James, and John — his appearance shining like the sun.", reference: "Matthew 17:2" },
      { title: "The Last Supper", description: "On the night before his death, Jesus instituted the Lord's Supper with his disciples.", reference: "Luke 22:19-20" },
      { title: "The Crucifixion", description: "Jesus was crucified at Golgotha, bearing the sin of the world as the ultimate sacrifice.", reference: "John 19:30" },
      { title: "The Resurrection", description: "On the third day Jesus rose from the dead, victorious over sin and death.", reference: "Luke 24:6" },
      { title: "The Great Commission", description: "Before ascending, Jesus commissioned his disciples to make disciples of all nations.", reference: "Matthew 28:18-20" },
    ],
    lessons: [
      "Salvation comes through faith in Christ alone — his life, death, and resurrection",
      "Jesus is not merely a teacher or example — he is Lord and Savior",
      "The love of God was most clearly displayed at the cross",
    ],
    relatedCharacters: ["mary", "peter", "john", "paul", "judas", "joseph"],
    books: ["Matthew", "Mark", "Luke", "John", "Acts", "Hebrews", "Revelation"],
  },
];

export const ALL_CATEGORIES: CharacterCategory[] = [
  "Patriarch", "Matriarch", "Prophet", "King", "Apostle", "Judge", "Priest", "Warrior", "Disciple", "Messiah",
];

export function getCharacterById(id: string): BibleCharacter | undefined {
  return BIBLE_CHARACTERS.find((c) => c.id === id);
}

export function getRelatedCharacters(character: BibleCharacter): BibleCharacter[] {
  return character.relatedCharacters
    .map((id) => getCharacterById(id))
    .filter((c): c is BibleCharacter => c !== undefined);
}
