export type Devotional = {
  /** Short theme title */
  title: string;
  /** Primary verse reference */
  reference: string;
  /** Book name (for navigation) */
  book: string;
  chapter: number;
  /** KJV verse text */
  verse: string;
  /** 2–3 sentence reflection */
  reflection: string;
  /** One-sentence closing prayer */
  prayer: string;
  /** Emoji icon representing the theme */
  icon: string;
};

export const DEVOTIONALS: Devotional[] = [
  {
    title: "The Good Shepherd",
    reference: "Psalm 23:1",
    book: "Psalms", chapter: 23,
    verse: "The LORD is my shepherd; I shall not want.",
    reflection: "David wrote this psalm from the hillsides where he had personally cared for sheep, and he knew that a good shepherd provides everything a flock needs. In the same way, God promises to be our shepherd — meeting our needs before we even voice them. When anxiety creeps in, we can return to this simple, anchor truth: we do not lack because the Lord leads.",
    prayer: "Lord, thank You for shepherding my life with such faithful care — help me rest in Your provision today.",
    icon: "🐑",
  },
  {
    title: "Strength in Weakness",
    reference: "Isaiah 40:31",
    book: "Isaiah", chapter: 40,
    verse: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.",
    reflection: "Isaiah wrote to a people worn down by exile and uncertainty, and yet he offered them one of Scripture's most soaring promises. Waiting on the Lord is not passive — it is active trust that positions us to receive what only God can give. The image of eagle's wings reminds us that His strength lifts us far above what our own effort could ever reach.",
    prayer: "Father, in my weariness I wait on You — renew my strength and lift me on eagle's wings today.",
    icon: "🦅",
  },
  {
    title: "Unfailing Love",
    reference: "Lamentations 3:22–23",
    book: "Lamentations", chapter: 3,
    verse: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
    reflection: "Jeremiah penned these words in the smoldering ruins of Jerusalem — one of history's darkest moments. Yet right in the middle of his lament he pivoted to praise, anchoring himself to a truth that circumstances could not erase: God's mercies reset every single morning. Each new day is a fresh page on which God writes His faithfulness over our failures.",
    prayer: "Thank You, Lord, that Your mercies are new this morning — let Your faithfulness be the foundation I stand on today.",
    icon: "🌅",
  },
  {
    title: "The God Who Works All Things",
    reference: "Romans 8:28",
    book: "Romans", chapter: 8,
    verse: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    reflection: "Paul does not say that all things are good, but that God works them together for good — like a master chef who turns raw, sometimes bitter ingredients into something nourishing. This promise is not a denial of pain; it is an assurance of sovereignty. Nothing that reaches you today has escaped His notice or His redemptive purpose.",
    prayer: "God, I trust that You are weaving even today's hardships into something good — give me eyes to see Your hand at work.",
    icon: "✨",
  },
  {
    title: "Be Still",
    reference: "Psalm 46:10",
    book: "Psalms", chapter: 46,
    verse: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.",
    reflection: "In a world that celebrates busyness, God's command to \"be still\" is almost countercultural. But stillness is not emptiness — it is the posture of a soul that has stopped striving to control what only God can manage. When we quiet our own noise, we create space to know Him more deeply, and that knowledge is itself a source of unshakeable peace.",
    prayer: "Lord, quiet the noise within me today so I can know You more fully and trust You more completely.",
    icon: "🕊️",
  },
  {
    title: "Faith That Moves Mountains",
    reference: "Matthew 17:20",
    book: "Matthew", chapter: 17,
    verse: "If ye have faith as a grain of mustard seed, ye shall say unto this mountain, Remove hence to yonder place; and it shall remove; and nothing shall be impossible unto you.",
    reflection: "Jesus did not demand great faith — He demanded real faith. A mustard seed is tiny, but it is alive and pointed in the right direction. The power is never in the size of our faith; it is in the size of the God our faith is aimed at. What mountain feels immovable in your life today? Plant your small, sincere trust in a limitless God.",
    prayer: "Jesus, my faith may feel small today, but I point it toward You — move what only You can move in my life.",
    icon: "⛰️",
  },
  {
    title: "Perfect Peace",
    reference: "Isaiah 26:3",
    book: "Isaiah", chapter: 26,
    verse: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.",
    reflection: "Isaiah's word for \"perfect peace\" in Hebrew is shalom shalom — a doubled word for emphasis, meaning wholeness, completeness, unbroken well-being. This peace is not the absence of trouble but the presence of God in the middle of it. The condition is a mind \"stayed\" on Him, like a ship's anchor dropped into the bedrock of God's character rather than drifting in circumstance.",
    prayer: "Lord, anchor my mind to You today so Your shalom guards my heart against every storm.",
    icon: "⚓",
  },
  {
    title: "Created for Good Works",
    reference: "Ephesians 2:10",
    book: "Ephesians", chapter: 2,
    verse: "For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them.",
    reflection: "The Greek word for \"workmanship\" is poiema — the root of our word poem. You are God's poem, written with intention and care. Before you were born, He had already scripted good works for you to step into. Your life is not accidental; it is authored. The question is not whether your days have purpose — they do — but whether you will walk in the path He prepared.",
    prayer: "Father, show me the good works You have prepared for me today and give me courage to walk in them.",
    icon: "📖",
  },
  {
    title: "Cast Your Anxiety",
    reference: "1 Peter 5:7",
    book: "1 Peter", chapter: 5,
    verse: "Casting all your care upon him; for he careth for you.",
    reflection: "Peter's word for \"casting\" is the same used when fishermen flung their nets — a decisive, deliberate throw. Anxiety is not released by willing it away; it is released by actively placing it in stronger hands. God does not ask you to feel carefree; He asks you to transfer your cares to One who has both the power and the love to carry them.",
    prayer: "Lord, I cast every worry before You now — thank You that You care for me with a love I cannot exhaust.",
    icon: "🙌",
  },
  {
    title: "The Light of the World",
    reference: "John 8:12",
    book: "John", chapter: 8,
    verse: "Then spake Jesus again unto them, saying, I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.",
    reflection: "Jesus made this declaration in the Temple treasury, not far from where the great menorahs blazed during the Feast of Tabernacles. His audience would have felt the weight of the image immediately: He was claiming to be the fulfillment of every lamp Israel had ever lit. Darkness cannot coexist with light — wherever Jesus is truly present and followed, confusion and fear have no permanent home.",
    prayer: "Jesus, be my light today — illuminate every decision and drive out every shadow of fear or confusion.",
    icon: "💡",
  },
  {
    title: "The Armor of God",
    reference: "Ephesians 6:10–11",
    book: "Ephesians", chapter: 6,
    verse: "Finally, my brethren, be strong in the Lord, and in the power of his might. Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.",
    reflection: "Paul wrote this from a Roman prison, chained to a soldier whose equipment he used as a spiritual object lesson. Every piece of Roman armor had a counterpart in God's provision: truth, righteousness, peace, faith, salvation, and the Word. The key phrase is \"be strong in the Lord\" — the strength is His, not ours. We wear His armor, fight in His power, and stand in His victory.",
    prayer: "Lord, clothe me in Your armor today — let me stand firm in Your strength, not my own.",
    icon: "🛡️",
  },
  {
    title: "Living Water",
    reference: "John 4:14",
    book: "John", chapter: 4,
    verse: "But whosoever drinketh of the water that I shall give him shall never thirst; but the water that I shall give him shall be in him a well of water springing up into everlasting life.",
    reflection: "Jesus offered living water to a Samaritan woman at midday — a person society had pushed to the margins. He did not begin with her failures; He began with her thirst. We all carry a deep longing that no achievement, relationship, or comfort can permanently fill. Jesus' offer stands today: come to the source, and the satisfaction He gives will spring up from within rather than needing to be sought again and again.",
    prayer: "Jesus, I come to You thirsty — fill me with the living water only You can give, and let it overflow to those around me.",
    icon: "💧",
  },
  {
    title: "Love One Another",
    reference: "John 13:34–35",
    book: "John", chapter: 13,
    verse: "A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another.",
    reflection: "Hours before the cross, Jesus distilled His entire teaching into a single command: love one another as I have loved you. The standard He set was His own self-giving love — not affection based on how people treat us, but a deliberate choice to seek another's good regardless. When the world looks at the church and sees that kind of love, Jesus says, they will know we belong to Him.",
    prayer: "Lord, let Your love for me overflow into how I treat every person I encounter today.",
    icon: "❤️",
  },
  {
    title: "Renewed Mind",
    reference: "Romans 12:2",
    book: "Romans", chapter: 12,
    verse: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.",
    reflection: "Transformation, Paul says, happens from the inside out — it begins in the mind, not the behaviour. The world constantly presses us into its mold through culture, media, and comparison. But when we saturate our thinking with God's Word, our desires gradually realign with His, and what once seemed like sacrifice begins to look like freedom. The renewed mind is the birthplace of a changed life.",
    prayer: "Lord, transform my mind today — let Your truth shape my thoughts before the world gets the chance to.",
    icon: "🧠",
  },
  {
    title: "Seek First the Kingdom",
    reference: "Matthew 6:33",
    book: "Matthew", chapter: 6,
    verse: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
    reflection: "Jesus gave this command in the middle of a sermon about anxiety over food, clothing, and tomorrow. His solution was not \"worry less\" but \"prioritize differently.\" When we orient our lives around God's kingdom first, everything else falls into its proper place — not because our problems disappear, but because our perspective expands to match His. Seek first, and the secondary things are cared for by the One who owns everything.",
    prayer: "Father, let Your kingdom be the first thing I seek this morning, and order everything else around that priority.",
    icon: "👑",
  },
  {
    title: "The Vine and the Branches",
    reference: "John 15:5",
    book: "John", chapter: 15,
    verse: "I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing.",
    reflection: "A branch detached from a vine does not struggle to bear fruit — it simply cannot. Jesus is not calling us to try harder; He is calling us to stay connected. Abiding is not a one-time event but a daily, moment-by-moment choice to remain in prayer, in His Word, and in obedience. From that place of connection, fruitfulness is not forced — it is natural.",
    prayer: "Lord Jesus, keep me close to You today — let every good thing in my life flow from that connection.",
    icon: "🌿",
  },
  {
    title: "God Is Our Refuge",
    reference: "Psalm 91:1–2",
    book: "Psalms", chapter: 91,
    verse: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.",
    reflection: "The psalmist describes a \"secret place\" — an intimate, sheltered position available only to those who actively draw near. It is not a hiding place from responsibility, but a sanctuary of security in the middle of life's storms. The shadow of the Almighty falls over those who choose to stay close. The farther we drift, the more exposed we feel; the nearer we draw, the more covered we are.",
    prayer: "Almighty God, I choose today to dwell in Your secret place — cover me with Your shadow and be my fortress.",
    icon: "🏰",
  },
  {
    title: "The Lord's Prayer",
    reference: "Matthew 6:9–10",
    book: "Matthew", chapter: 6,
    verse: "After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name. Thy kingdom come, Thy will be done in earth, as it is in heaven.",
    reflection: "Jesus opened the model prayer with worship, not petition. Before we bring our needs, we acknowledge who God is — Father, holy, sovereign. This order matters: when our prayers begin with God's greatness, our requests naturally become smaller and more surrendered. \"Thy will be done\" is the hinge of the whole prayer — it aligns our desires with His purposes rather than asking Him to bless our own agendas.",
    prayer: "Our Father, hallowed be Your name — let Your kingdom come and Your will be done in my life this day.",
    icon: "🙏",
  },
  {
    title: "Trust in the Lord",
    reference: "Proverbs 3:5–6",
    book: "Proverbs", chapter: 3,
    verse: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    reflection: "Solomon's wisdom here cuts against our deepest instinct, which is to figure things out ourselves before consulting God. \"All thine heart\" means no reserved compartments — no areas where we trust our own analysis more than His guidance. The promise is stunning: acknowledge Him in every part of life, and He personally directs the path. This is not a vague hope; it is a navigational promise.",
    prayer: "Lord, I trust You with every decision today — direct my path as I acknowledge You in each step.",
    icon: "🧭",
  },
  {
    title: "The Peace That Passes Understanding",
    reference: "Philippians 4:6–7",
    book: "Philippians", chapter: 4,
    verse: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
    reflection: "Paul wrote Philippians from prison, which makes his command \"be anxious for nothing\" all the more remarkable. He had discovered a peace that defied circumstances — not because his problems were solved, but because he had learned to transfer them to God in prayer with a spirit of thanksgiving. The peace that results is described as a garrison, a military guard, standing watch over heart and mind.",
    prayer: "Father, I bring every anxious thought to You now with thanksgiving — guard my heart with Your surpassing peace.",
    icon: "✌️",
  },
  {
    title: "Forgiven and Forgiving",
    reference: "Colossians 3:13",
    book: "Colossians", chapter: 3,
    verse: "Forbearing one another, and forgiving one another, if any man have a quarrel against any: even as Christ forgave you, so also do ye.",
    reflection: "Paul grounds the command to forgive in the reality of having been forgiven. We do not forgive because the other person deserves it; we forgive because Christ forgave us when we did not deserve it. Unforgiveness is a chain that locks the past into the present — forgiveness is the key that opens the door to freedom, for us as much as for the one we forgive.",
    prayer: "Lord, thank You for forgiving me completely — let that same grace flow through me to anyone I am struggling to forgive.",
    icon: "🕊️",
  },
  {
    title: "The Resurrection Hope",
    reference: "1 Corinthians 15:55–57",
    book: "1 Corinthians", chapter: 15,
    verse: "O death, where is thy sting? O grave, where is thy victory? The sting of death is sin; and the strength of sin is the law. But thanks be to God, which giveth us the victory through our Lord Jesus Christ.",
    reflection: "Paul taunts death as though it is already defeated — because it is. The resurrection of Jesus dismantled death's final authority, and that same victory is given to everyone who belongs to Him. Grief is real, loss is painful, but it is not the last word. Because He rose, we will rise. This hope does not minimize sorrow; it transforms it into something we can carry all the way through.",
    prayer: "Risen Lord, let the reality of the resurrection fill me with joy and courage today — death has no final claim on me.",
    icon: "✝️",
  },
  {
    title: "God's Plans for You",
    reference: "Jeremiah 29:11",
    book: "Jeremiah", chapter: 29,
    verse: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
    reflection: "God spoke these words to exiles in Babylon — people who felt forgotten and had no clear path home. Yet He assured them that His thoughts toward them were plans for a future full of hope. This promise was not given to people on the mountaintop but in the valley. Wherever you are today, God's thoughts toward you are not of harm but of wholeness, and His plans have not been cancelled.",
    prayer: "Lord, I trust Your plans for my future today — let hope rise in me because You know the way forward even when I cannot see it.",
    icon: "🌟",
  },
  {
    title: "Walk Humbly",
    reference: "Micah 6:8",
    book: "Micah", chapter: 6,
    verse: "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?",
    reflection: "Micah stripped Israel's religion down to its essentials when it had become cluttered with ritual and performance. God is not impressed by elaborate ceremonies performed by people living unjustly. What He is looking for is far simpler and far more demanding: lives marked by justice toward others, tenderness in every interaction, and a posture of humility before Him. This is both the summary of the law and the description of a transformed life.",
    prayer: "Lord, help me do justice, love mercy, and walk humbly with You today — not just in church, but in every ordinary moment.",
    icon: "🌾",
  },
  {
    title: "Abide in His Love",
    reference: "John 15:9",
    book: "John", chapter: 15,
    verse: "As the Father hath loved me, so have I loved you: continue ye in my love.",
    reflection: "Jesus measured His love for us against the love the Father has for Him — an infinite, eternal, unbreakable love. That is the standard. He is not saying He loves us \"a lot\"; He is saying He loves us the way God loves God. And His invitation is simply to remain in that love, to not drift from it through guilt, performance, or distraction. You are loved today with the very love of the Trinity.",
    prayer: "Jesus, let me rest fully in Your love today — remind me that it is not something I must earn but something I simply receive.",
    icon: "💛",
  },
  {
    title: "Salt and Light",
    reference: "Matthew 5:14–16",
    book: "Matthew", chapter: 5,
    verse: "Ye are the light of the world. A city that is set on an hill cannot be hid... Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.",
    reflection: "Jesus did not say \"become\" the light — He said \"you are\" the light. The identity precedes the action. When we truly know who we are in Christ, shining becomes natural rather than forced. A lamp does not strain to illuminate a room; it simply burns. Our call is not to perform goodness for applause, but to live so authentically that people look past us and see the Father.",
    prayer: "Father, let me shine today not for my own glory but so that those around me encounter You.",
    icon: "🕯️",
  },
  {
    title: "He Restores",
    reference: "Psalm 23:3",
    book: "Psalms", chapter: 23,
    verse: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
    reflection: "The Hebrew word for \"restoreth\" describes bringing something back from the edge — a wandering sheep retrieved, a broken vessel mended, a spirit worn thin by life brought back to wholeness. God does not discard what is damaged; He restores it. The path of righteousness He leads us into is not a burden but a gift — the route that leads to life, chosen by a Shepherd who knows every terrain.",
    prayer: "Good Shepherd, restore whatever is depleted in me today and lead me in the right path for Your glory.",
    icon: "🌱",
  },
  {
    title: "Chosen and Beloved",
    reference: "1 Peter 2:9",
    book: "1 Peter", chapter: 2,
    verse: "But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of him who hath called you out of darkness into his marvellous light.",
    reflection: "Peter wrote to scattered believers who felt marginalized and forgotten, and he reminded them of who they actually were: chosen, royal, holy, God's treasured possession. Identity shapes behavior — when we know we belong to the King, we stop living as orphans scrambling for approval. The purpose of this identity is outward-facing: to declare the praises of the One who brought us from darkness into His astonishing light.",
    prayer: "Lord, let me live today from the security of being chosen and beloved — let that identity overflow into praise.",
    icon: "👑",
  },
  {
    title: "Ask, Seek, Knock",
    reference: "Matthew 7:7–8",
    book: "Matthew", chapter: 7,
    verse: "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you: For every one that asketh receiveth; and he that seeketh findeth.",
    reflection: "Jesus used three escalating images — asking, seeking, knocking — each implying greater persistence and engagement. Prayer is not a vending machine but a relationship. The Father's answer is not always immediate, but His promise is that genuine, persistent seeking is never wasted. Every honest prayer is heard by a Father who loves to give good gifts to His children.",
    prayer: "Father, I come to You today asking, seeking, and knocking — thank You that You always hear and always respond in love.",
    icon: "🚪",
  },
  {
    title: "The Lord Is Near",
    reference: "Psalm 34:18",
    book: "Psalms", chapter: 34,
    verse: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
    reflection: "This psalm was written after David had hit a genuine low point — he feigned madness to escape a king who wanted him dead. Out of that desperate place he penned one of Scripture's most tender promises: God is not far from the brokenhearted; He is nearest to them. The world often withdraws from weakness, but God moves toward it. If your heart is broken today, you are not alone — you are in the place where He draws closest.",
    prayer: "Lord, draw near to every broken place in me today — be the healer only You can be.",
    icon: "💔",
  },
  {
    title: "Run the Race",
    reference: "Hebrews 12:1–2",
    book: "Hebrews", chapter: 12,
    verse: "Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight... and let us run with patience the race that is set before us, looking unto Jesus the author and finisher of our faith.",
    reflection: "The writer imagines a stadium filled with every faithful person who has gone before us — Abraham, Moses, Ruth, David, and thousands more — watching as we run our leg of the race. Their example is not a guilt trip but an encouragement: if they endured, so can we. And we run not by looking at the crowd but by fixing our gaze on Jesus, who both mapped the course and already crossed the finish line.",
    prayer: "Jesus, fix my eyes on You today as I run my race — let me lay down every weight and press forward in faith.",
    icon: "🏃",
  },
];

/** Returns today's devotional, rotating by day of year */
export function getTodaysDevotional(): Devotional {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (today.getTime() - start.getTime()) / 86_400_000
  );
  return DEVOTIONALS[dayOfYear % DEVOTIONALS.length];
}
