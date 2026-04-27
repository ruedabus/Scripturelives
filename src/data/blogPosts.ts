// ── Devotional Articles ────────────────────────────────────────────────────
// Original content for Scripture Lives — scripture-alive.vercel.app
// Each article is 400+ words of original devotional writing.

export type BlogCategory =
  | "Devotional"
  | "Bible Study"
  | "Prayer"
  | "Faith & Trust"
  | "Grace & Forgiveness"
  | "Purpose & Calling";

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  category: BlogCategory;
  author: string;
  publishedAt: string; // ISO date string
  readingTimeMin: number;
  coverEmoji: string;
  excerpt: string;
  content: string; // HTML string rendered inside article page
  tags: string[];
  keyVerse: string;
  keyVerseRef: string;
}

export const blogPosts: BlogPost[] = [
  // ── 1 ──────────────────────────────────────────────────────────────────────
  {
    slug: "john-3-16-love-that-changes-everything",
    title: "For God So Loved: The Verse That Changes Everything",
    subtitle: "Unpacking the most quoted verse in the Bible — and why it still has the power to transform lives",
    category: "Devotional",
    author: "Scripture Lives",
    publishedAt: "2025-11-01",
    readingTimeMin: 6,
    coverEmoji: "✝️",
    keyVerse: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    keyVerseRef: "John 3:16 (NIV)",
    excerpt:
      "John 3:16 is perhaps the most quoted sentence in human history. Yet familiarity can dull its edge. Let's read it slowly — word by word — and let its radical claims land with fresh force.",
    tags: ["John 3:16", "salvation", "God's love", "eternal life", "gospel"],
    content: `
<p>There is a verse so well-known that it appears on hand-painted signs at sporting events, on coffee mugs, on bumper stickers, and in the margins of millions of Bibles worn soft with use. <em>John 3:16.</em> Twenty-six words in English. And yet — perhaps because we have heard it so many times — we sometimes let it slide past us like background music we no longer hear.</p>

<p>Let's stop. Let's read it slowly, word by deliberate word, and let its ancient weight settle on us again.</p>

<h2>For God So Loved <em>the World</em></h2>

<p>Notice what John does not say. He does not say "for God so loved the righteous" or "the churchgoers" or "those who had their lives together." He says <em>the world</em> — the whole messy, broken, wandering world. Every tribe and language. Every person who has ever looked up at the stars and wondered. Every person who has ever felt ashamed of themselves in the dark. Every person who has ever doubted, raged, grieved, or given up.</p>

<p>The Greek word used here is <em>kosmos</em> — the entire created order of humanity. This love is embarrassingly wide. It cannot be earned by religious performance or narrowed to a favored few. It is poured out like rain on the just and unjust alike (Matthew 5:45).</p>

<h2>That He <em>Gave</em></h2>

<p>Love is not merely a feeling in God's economy — it is an action, a sacrifice, an expense. The Father did not send a letter or a representative or a moral code. He gave His <em>one and only Son</em>. The Greek word is <em>monogenes</em> — uniquely born, one of a kind. There is nothing held back here. This is the fullness of heaven laid down for the poverty of earth.</p>

<p>Gift-giving tells us about the giver. What does it cost someone to give? A God who gives His only Son has nothing left to withhold. That is what Paul echoes decades later: "He who did not spare his own Son, but gave him up for us all — how will he not also, along with him, graciously give us all things?" (Romans 8:32). The cross is both the proof and the promise of everything else.</p>

<h2>That <em>Whoever</em> Believes</h2>

<p>Here is the threshold — not a narrow gate of achievement, but a single swing of faith. <em>Whoever.</em> Not "whoever is morally qualified." Not "whoever has prayed the right prayer with the right tone of voice." The invitation is startlingly open. The only requirement is belief — trusting that Jesus is who He says He is, and that what He did on the cross is sufficient.</p>

<p>This is not intellectual assent alone. Biblical belief involves the whole person: the mind that accepts, the heart that trusts, the will that turns. But the starting line is accessible to anyone. The thief on the cross managed it in his last hours (Luke 23:43). Zacchaeus managed it up a tree (Luke 19:5-9). A Samaritan woman managed it beside a well with a scandalous past behind her (John 4:29). The door is wide.</p>

<h2>Shall Not Perish, But Have <em>Eternal Life</em></h2>

<p>The verse ends not with death but with life — and not just longer life, but life of a different <em>quality</em>. The Greek <em>zōē aiōnios</em> — eternal life — is not merely a timeline that never ends. It is a kind of existence: rich, connected, whole, in communion with the God who made us. Jesus says in John 17:3 that this eternal life <em>is</em> knowing God and Jesus Christ whom He sent. Eternal life begins now, in this knowing, and extends past every horizon.</p>

<p>To perish, by contrast, is not simply to cease existing — it is to remain forever separated from the only source of real life, love, and meaning. The stakes of John 3:16 are ultimate. But so is the offer.</p>

<h2>Reading It Again, for the First Time</h2>

<p>The next time you see John 3:16 on a church sign or in a sports crowd, resist the urge to skim past it. Whisper it quietly as a prayer. Let each phrase do its work:</p>

<p><em>God loves</em> — not in theory but in action.<br>
<em>He gave</em> — at enormous personal cost.<br>
<em>Whoever</em> — that includes me, and you, and the person you are most tempted to exclude.<br>
<em>Eternal life</em> — not as a future reward only, but as a present reality beginning the moment we trust.</p>

<p>Twenty-six words. A whole gospel. Come back to them often. They never stop being new.</p>
    `.trim(),
  },

  // ── 2 ──────────────────────────────────────────────────────────────────────
  {
    slug: "psalm-23-the-lord-is-my-shepherd",
    title: "The Lord Is My Shepherd: Walking Through Psalm 23",
    subtitle: "One of the most beloved poems in human history — and what it means to trust a God who leads us through dark valleys",
    category: "Devotional",
    author: "Scripture Lives",
    publishedAt: "2025-11-08",
    readingTimeMin: 7,
    coverEmoji: "🌿",
    keyVerse: "The Lord is my shepherd; I shall not want.",
    keyVerseRef: "Psalm 23:1 (KJV)",
    excerpt:
      "Written by a shepherd who became a king, Psalm 23 traces the full arc of a human life — from green pastures to dark valleys to the table of grace. Here's what David saw when he looked at sheep.",
    tags: ["Psalm 23", "shepherd", "trust", "comfort", "David", "fear"],
    content: `
<p>David knew sheep. Before he was Israel's greatest king, he was a shepherd boy in the Judean hills, spending long days watching over animals that were notoriously helpless — unable to find water on their own, prone to wander, defenseless against predators. He knew exactly what a flock needed from its shepherd. And so when he reached for a metaphor to describe his relationship with God, he reached for this one.</p>

<h2>"The Lord Is My Shepherd" — A Bold Claim</h2>

<p>The psalm opens with one of the most intimate declarations in all of Scripture. Not "the Lord is <em>a</em> shepherd" — abstract, theological, safely general. But "the Lord is <em>my</em> shepherd." Personal. Possessive. Specific.</p>

<p>This is the claim at the heart of biblical faith: that the God who hung the stars and parted the Red Sea is not indifferent to the details of your life. He is actively shepherding — guiding, protecting, providing — you. Not the crowd. You.</p>

<p>And the immediate consequence? "I shall not want." Not "I shall have everything I desire." But I will not lack what I truly need. The shepherd sees to it.</p>

<h2>Green Pastures and Still Waters</h2>

<p>Verses 2–3 paint a picture of provision and rest. "He makes me lie down in green pastures." A shepherd had to know where grass was lush and water was safe. In the semi-arid landscape of ancient Israel, this was no small thing. Finding a green pasture required leading the flock to the right places at the right times.</p>

<p>Notice the phrase "he <em>makes</em> me lie down." Sheep, it turns out, won't lie down unless four conditions are met: they must be free from fear, free from friction with other sheep, free from flies and parasites, and — crucially — not hungry. A sheep lying peacefully in a green field is evidence of a shepherd who has met all those needs.</p>

<p>"Still waters" matter too. Sheep can drown in fast-moving streams. They will not drink from turbulent water. So the shepherd finds the quiet pools, the calm places beside the current. God meets us where we can actually receive from Him.</p>

<h2>The Valley of the Shadow</h2>

<p>The psalm shifts in verse 4. Suddenly we are not in green pastures but in "the valley of the shadow of death" — a phrase that describes the deep ravines in Palestinian hill country where predators lurked and darkness came early. This was not metaphor for David; he had literally fought lions and bears to protect his flock (1 Samuel 17:34-36).</p>

<p>"I will fear no evil, for you are with me." The logic of this verse is not that evil doesn't exist — clearly it does. The logic is that the presence of the shepherd changes everything about passing through it. His rod (for defense) and his staff (for guidance) are comfort, not threat.</p>

<p>Dark valleys are not evidence that the shepherd has abandoned us. Often they are the very places where His presence becomes most real.</p>

<h2>A Table Before My Enemies</h2>

<p>Verse 5 takes us from the pastoral to the royal: "You prepare a table before me in the presence of my enemies." This image is startling. Not "you whisk me away from my enemies" but "you seat me at a feast while they watch." It is a declaration of divine hospitality that no enemy can interrupt. God's provision and honor are not conditional on circumstances being favorable first.</p>

<p>The anointing of the head with oil was both medicinal (healing wounds) and honorific (marking a guest as specially welcomed). The overflowing cup suggests abundance beyond what was asked.</p>

<h2>"Surely Goodness and Mercy Shall Follow Me"</h2>

<p>The Hebrew word for "follow" here is <em>radaph</em> — which actually means to pursue, to chase. Goodness and mercy are not passive companions trailing behind us. They are active, relentless, hunting us down through all the days of our lives.</p>

<p>David ends where he longs to end: in the house of the Lord, forever. The shepherd who guided him through every terrain — green and dark, feast and famine — will bring him home at last.</p>

<p>Whatever valley you are walking through today, the shepherd has been there before you. His rod and staff are in your company. Goodness and mercy are at your heels. And ahead — a table, a cup that runs over, and home.</p>
    `.trim(),
  },

  // ── 3 ──────────────────────────────────────────────────────────────────────
  {
    slug: "philippians-4-6-7-anxiety-and-the-peace-of-god",
    title: "Do Not Be Anxious: Paul's Counter-Intuitive Peace",
    subtitle: "Philippians 4:6-7 was written from a prison cell — and that is exactly why it carries such authority",
    category: "Prayer",
    author: "Scripture Lives",
    publishedAt: "2025-11-15",
    readingTimeMin: 6,
    coverEmoji: "🕊️",
    keyVerse: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    keyVerseRef: "Philippians 4:6 (NIV)",
    excerpt:
      "Paul wrote 'do not be anxious about anything' from a Roman prison, facing possible execution. That context changes everything about how we receive these words.",
    tags: ["anxiety", "prayer", "peace", "Philippians", "thanksgiving", "mental health"],
    content: `
<p>Before we read Paul's famous words about anxiety, we need to know where he was sitting when he wrote them. He was in a Roman prison. He had been imprisoned multiple times, flogged, shipwrecked, stoned, and left for dead (2 Corinthians 11:23-27). At the time of writing Philippians, he was awaiting trial before Caesar — a trial that might end in execution. He had every human reason to be anxious.</p>

<p>That context doesn't make his words easier to follow. It makes them more believable.</p>

<h2>"Do Not Be Anxious About Anything"</h2>

<p>The Greek word for anxious here is <em>merimnaō</em> — from a root meaning to be divided, to pull in different directions. Anxiety fractures us. It splits our attention between the present moment and every imagined future disaster simultaneously. Paul is not dismissing the reality of hard circumstances. He is pointing to a practice that holds a divided heart together.</p>

<p>"About anything" is sweeping. Not "don't be anxious about the big things" — as if health crises and job losses are fair game for worry. About <em>anything.</em> This is either naive optimism from someone who hasn't suffered, or it's the testimony of someone who has found something that genuinely works. Given Paul's résumé, it is clearly the latter.</p>

<h2>The Prescription: Prayer With Thanksgiving</h2>

<p>Paul doesn't say "stop worrying" and leave us there with an empty command. He provides the replacement: "by prayer and petition, with thanksgiving, present your requests to God."</p>

<p>There are three components:</p>

<p><strong>Prayer</strong> — general communication with God, the orientation of the heart toward the Father.</p>

<p><strong>Petition</strong> — specific requests. The word carries the sense of a formal appeal, someone bringing a case before a higher authority. We are not just vaguely hoping — we are specifically asking. God invites concrete prayer. "What do you want me to do for you?" Jesus asked a blind man (Mark 10:51). Heaven responds to specificity.</p>

<p><strong>Thanksgiving</strong> — this is the element most easily skipped, and possibly the most important. Anxiety lives entirely in the gap between what is and what we fear might be. Gratitude pulls us back into what <em>has</em> been — the history of God's faithfulness. When we rehearse what He has already done, our grip on what He might fail to do begins to loosen.</p>

<h2>The Peace That Passes Understanding</h2>

<p>The result Paul describes is not the removal of circumstances but the arrival of something inexplicable: "the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."</p>

<p>The Greek military term used for "guard" is <em>phrourēsei</em> — a garrison standing watch. This peace is not passive. It is an active presence stationed at the gate of your heart, screening what is allowed in. And it "transcends understanding" — meaning it doesn't depend on circumstances being resolved. You can have this peace while still in the prison. While still in the hospital. While still in the uncertainty.</p>

<p>Paul knew this peace personally. Two verses later he writes, "I have learned, in whatever state I am, to be content" (Philippians 4:11). This contentment was learned — practiced over years of choosing prayer over anxiety, gratitude over grievance, the presence of God over the rehearsal of fears.</p>

<h2>A Practical Path</h2>

<p>What does this look like in daily life? One approach: when anxiety rises, treat it as an invitation to prayer rather than a trigger for rumination. Write down the specific thing you are afraid of. Bring it by name to God. Then deliberately name three things you are thankful for — not to manipulate your feelings, but to tell the truth about God's faithfulness. This is not positive thinking. It is reorienting to reality.</p>

<p>The peace that results will often make no rational sense given your circumstances. That is the point. It comes from a source outside circumstances, and no circumstance can take it away.</p>

<p>Paul wrote these words in chains. They are not the advice of someone who has avoided suffering. They are a battle report from someone who found that prayer really does guard the heart — even from inside a prison cell, even with Caesar waiting.</p>
    `.trim(),
  },

  // ── 4 ──────────────────────────────────────────────────────────────────────
  {
    slug: "david-and-goliath-faith-over-fear",
    title: "David and Goliath: When Faith Sees What Fear Cannot",
    subtitle: "The famous battle in 1 Samuel 17 is not really about courage — it's about a completely different way of seeing the situation",
    category: "Faith & Trust",
    author: "Scripture Lives",
    publishedAt: "2025-11-22",
    readingTimeMin: 7,
    coverEmoji: "🪨",
    keyVerse: "You come against me with sword and spear and javelin, but I come against you in the name of the Lord Almighty.",
    keyVerseRef: "1 Samuel 17:45 (NIV)",
    excerpt:
      "Every Israelite soldier saw a nine-foot giant and calculated their odds. David saw the same giant and asked a completely different question — and that difference is everything.",
    tags: ["David", "Goliath", "faith", "fear", "1 Samuel", "courage", "giants"],
    content: `
<p>The story begins with a standoff. For forty days, a nine-foot Philistine warrior named Goliath strode out each morning and each evening, bellowing his challenge across the Valley of Elah. The Israelite army heard him, saw his bronze helmet and armor coat, measured the iron tip of his spear, and did exactly what you might expect trained soldiers to do with perfectly good survival instincts: they ran.</p>

<p>1 Samuel 17:24 records it plainly: "When the Israelites saw the man, they all fled from him and were greatly afraid."</p>

<p>This went on for forty days. An entire army, including King Saul — who himself stood head and shoulders above every other Israelite (1 Samuel 9:2) — paralyzed by a man across a valley.</p>

<h2>The Shepherd Who Came for Lunch</h2>

<p>David arrives on the scene not as a soldier but as an errand boy. His father Jesse has sent him with food for his older brothers. He is young enough that Saul will later describe him as "little more than a boy" (1 Samuel 17:33). He has no military training, no armor, no sword.</p>

<p>What he does have is a question that no one else is asking.</p>

<p>While the seasoned warriors are calculating the odds and feeling their fear, David asks: "Who is this uncircumcised Philistine that he should defy the armies of the <em>living God?</em>" (1 Samuel 17:26).</p>

<p>Everyone else is doing the same math: Goliath versus soldier. David is doing different math: Goliath versus God. Same giant. Same battlefield. Completely different equation.</p>

<h2>The History David Carries</h2>

<p>When Saul objects that David is unqualified for the fight, David doesn't argue from future potential. He argues from past experience. "Your servant has killed both the lion and the bear... The Lord who rescued me from the paw of the lion and the paw of the bear will rescue me from the hand of this Philistine" (1 Samuel 17:36-37).</p>

<p>Faith, for David, is not a feeling — it is a pattern recognition. He has watched God show up in smaller crises. He trusts that the same God will show up in this larger one. His confidence is not in himself; it is in the track record of the God who has already proven faithful.</p>

<p>This is a pattern we see throughout Scripture and throughout life. The people who face the biggest challenges with the most peace are almost always people who have cultivated a habit of remembering what God has already done. Gratitude is not just good manners — it is the fuel of faith.</p>

<h2>Five Smooth Stones</h2>

<p>David chooses five stones from the brook. Scholars have noted this is not lack of confidence but practical wisdom — Goliath had four brothers (2 Samuel 21:15-22), and David was prepared if the fight extended. He was brave, not reckless.</p>

<p>He runs toward Goliath — the only person in the narrative to move <em>toward</em> the threat. And as he runs, he speaks one of the most remarkable declarations of faith in the Old Testament: "You come against me with sword and spear and javelin, but I come against you in the name of the Lord Almighty, the God of the armies of Israel, whom you have defied" (1 Samuel 17:45).</p>

<p>He names his weapon before he throws a stone. He names it as the name — the reputation, the authority, the very character — of the Lord.</p>

<h2>Your Giant and Your Sling</h2>

<p>We all have Goliaths. They stand in the valley of our lives and shout their numbers at us: the diagnosis, the debt, the broken relationship, the besetting sin that has kept us paralyzed for years, forty days worth of failure. They are real. They are large. They are loud.</p>

<p>The question David asks is available to us too: Who is this thing, that it should defy the armies of the living God? Not because the problem is smaller than it looks. It may be exactly as large as it appears. But the God in whose name we approach it is infinitely larger.</p>

<p>Pick up your five smooth stones. Run toward it. The outcome of the valley depends less on the size of the giant than on the size of the God you are trusting.</p>
    `.trim(),
  },

  // ── 5 ──────────────────────────────────────────────────────────────────────
  {
    slug: "prodigal-son-the-running-father",
    title: "The Prodigal Son: It's Really About the Running Father",
    subtitle: "Jesus' most famous parable is usually told from the son's perspective — but the heart of the story is the father who sees him 'while he was still a long way off'",
    category: "Grace & Forgiveness",
    author: "Scripture Lives",
    publishedAt: "2025-11-29",
    readingTimeMin: 8,
    coverEmoji: "🏃",
    keyVerse: "But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him.",
    keyVerseRef: "Luke 15:20 (NIV)",
    excerpt:
      "In first-century Jewish culture, a father running — robes hitched up, in public — was scandalous. Jesus put that scandalous image at the center of his most famous story on purpose.",
    tags: ["prodigal son", "grace", "forgiveness", "Luke 15", "father", "repentance", "return"],
    content: `
<p>Jesus told this parable in Luke 15 to an audience that included Pharisees who were grumbling about the company He kept. "This man welcomes sinners and eats with them," they said (Luke 15:2). The three parables that follow — the lost sheep, the lost coin, and the lost son — are all Jesus' answer to that accusation. They are not primarily about sin. They are primarily about the nature of the God who seeks.</p>

<h2>The Request That Should Have Been Refused</h2>

<p>The younger son's request — "Father, give me my share of the estate" — was, in first-century Jewish culture, roughly equivalent to saying "I wish you were dead." Inheritance was distributed at death. To demand it early was a devastating insult. A first-century Jewish father in this position would have been entirely within his cultural rights — and perhaps expected — to refuse, or even to disown the son publicly.</p>

<p>Instead, the father divides the property and gives it to him. Grace appears before the son has repented, before he has even left the house. The giving itself is an act of love that the son doesn't deserve.</p>

<h2>The Far Country</h2>

<p>The son goes to "a distant country" — in Greek, <em>chōran makran</em>. The distance is both geographic and spiritual. He burns through his inheritance in "wild living" and ends up feeding pigs — for a Jewish boy, the ultimate humiliation. He is as far as it is possible to be from home, from dignity, from his father.</p>

<p>Then comes the pivot: "he came to his senses" (Luke 15:17). The Greek is more vivid: <em>eis heauton de elthōn</em> — "coming to himself," as if he had been lost outside himself and finally found his way back in. He rehearses a speech. He will return not as a son but as a hired servant. He no longer feels worthy of sonship.</p>

<p>This is the posture of genuine repentance: not bargaining, not explaining, not minimizing, but honest acknowledgment — "I have sinned against heaven and against you" (Luke 15:18). He expects nothing but work. What he is about to receive will stagger him.</p>

<h2>The Running Father</h2>

<p>Here is the detail that first-century listeners would have found shocking, and that we often pass over too quickly: "while he was still a long way off, his father saw him."</p>

<p>The father was watching. He had not forgotten. He had not moved on. He was at the edge of his vision every day, looking down the road.</p>

<p>And when he sees his son — the son who took his money, wished him dead, and squandered everything — he doesn't wait for the rehearsed apology. He <em>runs.</em></p>

<p>In first-century Middle Eastern culture, a man of standing never ran. Running meant hitching up your robes and exposing your legs — deeply undignified for an elder. To run in public was to lose face completely. And yet this father runs, throws his arms around the filthy, pig-reeking young man, and kisses him.</p>

<p>Jesus put this image at the center of his story deliberately. This is what God looks like toward the returning sinner. Not waiting in judgment. Not holding the offense over them for a time to prove His point. Running — with the abandon of a parent who has been watching and waiting and who cannot contain themselves when the beloved comes back into view.</p>

<h2>The Robe, the Ring, the Party</h2>

<p>The son begins his speech. Before he finishes it, the father is already giving orders. The best robe — his own robe, a mark of honor and status. A ring — restoring authority and identity. Sandals — slaves went barefoot; only sons wore shoes. And a feast, a killing of the fattened calf, because "this son of mine was dead and is alive again; he was lost and is found" (Luke 15:24).</p>

<p>The restoration is total. The father doesn't restore him to servant status. He restores him to sonship — full, unqualified, celebrated sonship. This is the economy of grace: not the minimum required to cover the offense, but extravagant restoration to something even better than what was lost.</p>

<h2>The Elder Son's Question</h2>

<p>The parable doesn't end at the party. The elder son arrives, hears the music, refuses to go in, and voices what many in Jesus' audience were feeling: "I've been here all along. I've followed the rules. And you never threw a party for me."</p>

<p>The father answers with infinite tenderness: "You are always with me, and everything I have is yours." The elder son has had constant access to the father's resources — he simply hasn't realized it. The self-righteous are not excluded from grace; they are simply the ones most likely to stand outside it in resentment while the party goes on without them.</p>

<p>Jesus leaves the parable open-ended. We never learn whether the elder son goes in. The question hangs in the air, aimed directly at the Pharisees, aimed at any of us who have been "following the rules" and have confused rule-following with relationship.</p>

<h2>What Kind of Father?</h2>

<p>This story is not primarily about prodigal sons, though it has something to say to everyone who has run. It is primarily about the father — His watching, His running, His embrace before the apology is complete, His restoration beyond what was asked.</p>

<p>If you have been in the far country, He has been watching the road. If you have been the faithful older sibling who has never quite understood why grace feels so unfair — you are always with Him, and everything He has is yours.</p>

<p>The party has already been planned. The question is only whether we will go in.</p>
    `.trim(),
  },

  // ── 6 ──────────────────────────────────────────────────────────────────────
  {
    slug: "romans-8-28-all-things-work-together",
    title: "All Things Work Together: Romans 8:28 and the God Who Weaves",
    subtitle: "This verse is often quoted to comfort people in hard times — but its actual claim is far more specific and far more daring than we realize",
    category: "Faith & Trust",
    author: "Scripture Lives",
    publishedAt: "2025-12-06",
    readingTimeMin: 6,
    coverEmoji: "🧵",
    keyVerse: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    keyVerseRef: "Romans 8:28 (NIV)",
    excerpt:
      "Romans 8:28 does not say 'everything happens for a reason.' It makes a far more specific — and more comforting — promise than that.",
    tags: ["Romans 8:28", "suffering", "purpose", "providence", "God's plan", "hope"],
    content: `
<p>Romans 8:28 may be the most quoted verse of comfort in difficult times — and also one of the most misquoted. It is often paraphrased as "everything happens for a reason," a sentiment that sounds similar but is actually quite different in meaning and origin. Let's look at what Paul actually claims, because the real verse is both more specific and more breathtaking than its popular paraphrase.</p>

<h2>What It Does Not Say</h2>

<p>"Everything happens for a reason" is a philosophical claim — vague, untethered to any particular God or any specific purpose. It can comfort anyone regardless of their beliefs, but it can also be used to justify anything and point the sufferer nowhere in particular.</p>

<p>Paul says something entirely different. He doesn't say "all things happen for a reason." He says "God <em>works</em> in all things" — and He works them toward a specific end, for a specific group of people, according to a specific purpose.</p>

<h2>The Weaving God</h2>

<p>The word translated "works together" is the Greek <em>synergei</em> — from which we get our word "synergy." It means working together in coordination, not merely coexisting. The image is of a God who is actively weaving the threads of our lives — not just watching them fall, but taking even the dark threads and incorporating them into something coherent.</p>

<p>This is not the claim that bad things are secretly good things in disguise. The hard things Paul has in mind are genuinely hard — he has listed them a few verses earlier: "trouble, hardship, persecution, famine, nakedness, danger, sword" (Romans 8:35). He is not minimizing suffering. He is claiming that no suffering falls outside the scope of God's redemptive work.</p>

<h2>"For Good" — But What Kind?</h2>

<p>The verse promises that God works all things "for good" — but the very next verse tells us what that good looks like: "to be conformed to the image of his Son" (Romans 8:29). The good that God is working toward is not primarily our comfort, our career success, or the pleasant resolution of our circumstances. It is our becoming more fully human in the way Jesus was human — fully loving, fully present, fully alive to God and others.</p>

<p>This reframes the question from "why is this happening to me?" to "what is God forming in me through this?" Not every circumstance is equally easy to hold with that question. There are losses that feel like nothing but loss, griefs that seem to resist meaning. Paul doesn't rush past that. He sits in chapter 8 with groaning creation and groaning believers and a Spirit who intercedes when words fail (Romans 8:26). The road to the good of verse 28 passes through the groaning of verse 26. That is honest.</p>

<h2>For Those Who Love Him</h2>

<p>The promise is anchored to a relationship. "For those who love him, who have been called according to his purpose." This is not a blanket assurance to everyone regardless of orientation toward God. It is a covenant promise — specific to those who are in a real, ongoing relationship with the God who is doing the working.</p>

<p>This is not gatekeeping. It is context. A skilled doctor's care does not benefit a patient who refuses all treatment. God's providential weaving operates most fully in the life of someone who is actively trusting, actively turning toward Him, actively saying — even in the dark — "I believe you are good."</p>

<h2>"We Know"</h2>

<p>Paul begins the verse with "we know" — a declaration of settled conviction, not wishful thinking. This knowing is not the naive optimism of someone who hasn't suffered. By the time Paul wrote Romans, he had been beaten, imprisoned, shipwrecked, and driven from cities by mobs. He knew what it was to be in circumstances that looked, from the outside, like comprehensive failure.</p>

<p>And from inside that experience, he says: we know. We have enough history with this God to say with confidence — not certainty about outcomes, but certainty about the Weaver — that He is working. Even now. Even here. Even in this.</p>

<p>What thread in your life today feels like it doesn't belong? Lay it in the hands of the One who makes tapestries from tangles. The whole picture isn't visible yet. But the Weaver is working.</p>
    `.trim(),
  },

  // ── 7 ──────────────────────────────────────────────────────────────────────
  {
    slug: "lords-prayer-learning-to-pray",
    title: "How to Pray: A Line-by-Line Walk Through the Lord's Prayer",
    subtitle: "Jesus didn't give the Lord's Prayer as words to recite — he gave it as a structure to inhabit. Here's what each phrase teaches us about prayer.",
    category: "Prayer",
    author: "Scripture Lives",
    publishedAt: "2025-12-13",
    readingTimeMin: 8,
    coverEmoji: "🙏",
    keyVerse: "Our Father in heaven, hallowed be your name, your kingdom come, your will be done, on earth as it is in heaven.",
    keyVerseRef: "Matthew 6:9-10 (NIV)",
    excerpt:
      "The disciples didn't ask Jesus to explain theology — they asked him to teach them to pray. What he gave them was a skeleton, not a script.",
    tags: ["Lord's Prayer", "prayer", "Matthew 6", "Our Father", "how to pray", "kingdom"],
    content: `
<p>The disciples watched Jesus pray. They watched him rise before dawn to be alone with God (Mark 1:35). They watched him pray before major decisions (Luke 6:12), after miracles (Mark 6:46), and in the garden when death was hours away (Luke 22:41-44). Whatever power they saw in Jesus' life and ministry, they connected it to those hours of prayer. And so they asked him, with what must have been genuine longing: "Lord, teach us to pray" (Luke 11:1).</p>

<p>He gave them what we call the Lord's Prayer. But it's important to notice how he introduced it in Matthew 6: "This, then, is how you should pray" — not "these are the words you should say." He gave them a pattern, not a script. A skeleton to fill out with their own words and concerns. Here is what that skeleton teaches.</p>

<h2>"Our Father in Heaven"</h2>

<p>Jesus teaches us to begin not with our needs but with relationship. "Our Father" — <em>Abba</em> in the Aramaic Jesus likely used, a term of intimacy, the kind of word a young child would call their dad. To pray "Our Father" is to remember before anything else: I am approaching Someone who is <em>for</em> me. Not a distant judge. Not a cosmic vending machine. A Father.</p>

<p>"In heaven" anchors this intimacy in transcendence. This Father is also infinite, holy, all-knowing. The combination — intimate and infinite — is unique to Christian prayer. We are not just venting to a therapist, and we are not petitioning a bureaucrat. We are speaking to Someone who is both close enough to call Abba and vast enough to run the universe.</p>

<h2>"Hallowed Be Your Name"</h2>

<p>Before the first request, there is worship. "Hallowed" means regarded as holy — treated as set apart, given its full weight. We are praying that God's name — His reputation, His character — would be honored: in the world, in our community, and specifically in us. This line keeps prayer from becoming merely therapeutic. We are here for something bigger than our comfort.</p>

<h2>"Your Kingdom Come, Your Will Be Done"</h2>

<p>These two lines say the same thing twice in the Hebrew poetic tradition of parallelism: we are inviting God's agenda to override ours. "Your kingdom come" is a prayer for the reign of God — His justice, His healing, His reconciling love — to advance on earth. "Your will be done, on earth as it is in heaven" pictures heaven as the standard: in heaven, God's will is executed immediately and completely. We are praying for that to happen here too.</p>

<p>This is radical submission before we have named a single request. It is the shape of Gethsemane: "Not my will, but yours be done" (Luke 22:42). It is the posture that keeps prayer honest — we are not bending God to our agenda, but aligning ourselves to His.</p>

<h2>"Give Us This Day Our Daily Bread"</h2>

<p>Now the requests begin — and they begin with physical, practical need. "Daily bread" is not a spiritual metaphor here. It is food for today. Jesus is teaching us that it is entirely appropriate to bring our material needs to God. We are not too small or too mundane for His attention.</p>

<p>"Daily" is significant. Not a year's worth of bread, not a lifetime supply. Today's bread. This builds in dependence — we return tomorrow, and the day after. Provision becomes an ongoing relationship, not a one-time transaction.</p>

<h2>"Forgive Us Our Debts, as We Also Have Forgiven"</h2>

<p>The relational integrity of prayer: we cannot receive what we are unwilling to extend. This is the only line Jesus comments on after the prayer concludes (Matthew 6:14-15). Unforgiveness doesn't block God from forgiving us — His forgiveness is freely given through Christ. But it does block us from receiving and experiencing that forgiveness, because unforgiveness is incompatible with the posture of a person who knows how much they have been forgiven.</p>

<h2>"Lead Us Not Into Temptation, Deliver Us From Evil"</h2>

<p>We close with honest acknowledgment of our vulnerability. We are not self-sufficient. We need guidance past the places we might fall. We need deliverance from forces larger than ourselves. This is the humility that healthy prayer cultivates: I am weak, the world is dangerous, and I need You.</p>

<h2>Using the Lord's Prayer as a Map</h2>

<p>Try using each section as a doorway into your own words. Begin with "Our Father" — and then talk for a moment about who He is to you. Move to "hallowed be your name" and let that become genuine worship. Work through the kingdom petition by naming specific places in the world or your life where you want His reign to come. Then name your concrete needs, your specific areas where you need forgiveness, and your real points of vulnerability.</p>

<p>The Lord's Prayer takes about thirty seconds to recite. It can take a lifetime to inhabit. That is the point.</p>
    `.trim(),
  },

  // ── 8 ──────────────────────────────────────────────────────────────────────
  {
    slug: "ruth-and-naomi-loyalty-that-looks-like-love",
    title: "Ruth and Naomi: The Loyalty That Looks Like Love",
    subtitle: "The Book of Ruth is a short story about a Moabite widow — and one of the Old Testament's most beautiful portraits of covenant faithfulness",
    category: "Bible Study",
    author: "Scripture Lives",
    publishedAt: "2025-12-20",
    readingTimeMin: 7,
    coverEmoji: "🌾",
    keyVerse: "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.",
    keyVerseRef: "Ruth 1:16 (NIV)",
    excerpt:
      "Ruth's famous words to Naomi are often read at weddings — but their original context is a grieving refugee committing herself to a bitter old woman who told her to leave. That makes them even more remarkable.",
    tags: ["Ruth", "Naomi", "loyalty", "hesed", "redemption", "Boaz", "Old Testament"],
    content: `
<p>The Book of Ruth is one of only two books in the Hebrew Bible named after a woman. It is also one of the shortest — only four chapters. Yet it contains one of the most psychologically rich and theologically dense narratives in the entire Old Testament. It is a story about loyalty, grief, risk, and redemption — and at its center is a relationship between two women who had no legal or cultural obligation to each other, and chose commitment anyway.</p>

<h2>The Setup: Everything Lost</h2>

<p>Naomi leaves Bethlehem with her husband Elimelech and their two sons during a famine. They settle in Moab — a foreign, often hostile nation from Israel's perspective. Both sons marry Moabite women: Orpah and Ruth. Then, over the course of roughly ten years, all three men die. Naomi is left with two daughters-in-law and no means of support, in a country not her own.</p>

<p>When she hears that the famine in Israel has ended, she decides to return home. She releases both daughters-in-law to return to their own families — a genuinely self-sacrificial act, since having them with her in Bethlehem would be of limited practical use and might hinder their chances of remarrying. "Return home, my daughters," she says. "May the Lord grant that each of you will find rest in the home of another husband" (Ruth 1:8-9).</p>

<p>Orpah kisses her mother-in-law goodbye and turns back. Ruth refuses to go.</p>

<h2>The Famous Words in Their Real Context</h2>

<p>Ruth's declaration in 1:16-17 — "Where you go I will go" — is regularly quoted at weddings. Read in that context, it sounds like romantic vow-language, beautiful but somewhat idealized. Read in its actual context, it is something far more striking.</p>

<p>Ruth is committing herself to a bitter old widow (Naomi will shortly tell the people of Bethlehem to call her "Mara" — bitterness — rather than her name, which means "pleasant"). She is leaving her own country, her own family, her own gods, her own culture. She will arrive in Israel as a Moabite — a member of a group that many Israelites regarded with suspicion. She has no guarantees of remarriage, no economic security, no social standing. She is walking into an uncertain future holding only Naomi's hand.</p>

<p>And she chooses this freely. "Where you go I will go." This is not romantic infatuation. This is covenant — the Hebrew concept of <em>hesed</em>, which appears throughout the book and is sometimes translated "lovingkindness," "steadfast love," or "loyalty." It is the love that shows up not because feelings demand it, but because the relationship demands it. It is love as a verb.</p>

<h2>Hesed in Action: The Field of Boaz</h2>

<p>Ruth arrives in Bethlehem and, to provide for herself and Naomi, goes to glean in the fields — a practice permitted under Israelite law to provide for the poor (Leviticus 23:22). She "happens" to end up in the field of Boaz, a relative of Naomi's — though the Hebrew narrative makes clear with winking understatement that this "happening" is not random.</p>

<p>Boaz has already heard about Ruth before she arrives. He has heard what she did for Naomi. And in a beautiful moment, he extends extraordinary hospitality and protection to her — making sure she has food, water, and safety, and instructing his workers to leave extra grain for her to find. When Ruth asks why he is so kind to a foreigner, he says: "The Lord repay you for what you have done... May you be richly rewarded by the Lord, the God of Israel, under whose wings you have come to take refuge" (Ruth 2:12).</p>

<p>The word Boaz uses for what Ruth has done for Naomi? <em>Hesed.</em> Covenant loyalty. The same quality Ruth embodied is being named and honored by the man who will himself embody it as her kinsman-redeemer.</p>

<h2>Redemption and Its Ripples</h2>

<p>The book culminates in Boaz acting as a "kinsman-redeemer" — a family member with the right and responsibility to restore what a deceased relative had lost. He marries Ruth, redeems Naomi's family property, and restores both women's futures. The child born to Ruth and Boaz — Obed — becomes the grandfather of King David.</p>

<p>The lineage continues. Matthew 1:5 includes Ruth in the genealogy of Jesus. A Moabite refugee widow, an outsider by every cultural measure, is woven into the family line of the Messiah. This is one of Scripture's most deliberate signals that God's story is always bigger than our categories of insider and outsider, worthy and unworthy.</p>

<h2>What Ruth Teaches Us</h2>

<p>The Book of Ruth is a case study in what love looks like when feelings aren't enough to sustain it — when grief and poverty and cultural displacement are the context, and love has to become a decision. Ruth's choice is costly, specific, and faithful. Boaz's response mirrors and extends that same faithfulness. And God, who is never mentioned as directly acting in the book, is woven through every "coincidence" and every act of human loyalty — quietly orchestrating a redemption that the characters can barely see.</p>

<p><em>Hesed</em> is the thread. It runs from Ruth to Naomi, from Boaz to Ruth, from God to all of them, from all of them down through the genealogy to a manger in Bethlehem. The lovingkindness that would not go back — that clung when it had every excuse to leave — is the same lovingkindness at the heart of the gospel.</p>
    `.trim(),
  },

  // ── 9 ──────────────────────────────────────────────────────────────────────
  {
    slug: "sermon-on-the-mount-blessed-are-the",
    title: "The Beatitudes: An Upside-Down Kingdom",
    subtitle: "Jesus opens the Sermon on the Mount by declaring the wrong people happy — and in doing so, turns the world's value system completely upside down",
    category: "Bible Study",
    author: "Scripture Lives",
    publishedAt: "2025-12-27",
    readingTimeMin: 7,
    coverEmoji: "⛰️",
    keyVerse: "Blessed are the poor in spirit, for theirs is the kingdom of heaven.",
    keyVerseRef: "Matthew 5:3 (NIV)",
    excerpt:
      "The crowd expected the Messiah to bless the powerful, the pure-blooded, and the religiously accomplished. Jesus blessed the poor, the grieving, and the persecuted. This was a provocation — a deliberate announcement that God's kingdom operates by completely different rules.",
    tags: ["Beatitudes", "Sermon on the Mount", "Matthew 5", "kingdom of God", "blessed", "poverty of spirit"],
    content: `
<p>Imagine you have walked miles to hear a teacher who has been healing the sick, casting out demons, and drawing crowds that make the religious authorities nervous. You sit down on a hillside in Galilee. And the first thing this teacher says is: <em>Blessed are the poor in spirit.</em></p>

<p>This was not what anyone expected. The poor were not considered blessed — they were considered unfortunate, possibly under God's judgment. The religiously powerful, the ritually pure, the well-connected — those were the blessed. And here is this teacher opening His manifesto of the kingdom with a list that includes the grieving, the meek, the persecuted, and the pure in heart (a category that probably excluded most of the audience by their own reckoning).</p>

<p>The Beatitudes are eight short declarations. Together, they form a portrait of the kingdom citizen — and a direct challenge to every worldly definition of the good life.</p>

<h2>"Blessed Are the Poor in Spirit"</h2>

<p>The Greek word <em>makarios</em>, translated "blessed," can also be rendered "happy" or "flourishing." Jesus is not offering a future consolation prize to the miserable. He is making a present-tense declaration: these people are, right now, flourishing in the deepest sense.</p>

<p>The "poor in spirit" are those who know they are spiritually bankrupt — who have no illusions about their own righteousness, no religious achievements to fall back on. The opposite would be the self-sufficient, the spiritually comfortable, those who feel they have enough of God already. Poverty of spirit is the prerequisite for everything else Jesus offers. You cannot receive from a full hand.</p>

<h2>"Those Who Mourn"</h2>

<p>The second beatitude blesses those who mourn. This is not a promise that sadness will be immediately reversed (though comfort does come). It is a declaration that grief — honest, face-to-the-ground grief over loss and sin and the brokenness of the world — is not a sign of faithlessness. It is, in fact, a sign of clear vision. The person who does not mourn anything is the person who is not paying attention.</p>

<p>Jesus himself wept at the tomb of Lazarus (John 11:35). He mourned over Jerusalem (Luke 19:41). Grief in the Bible is not weakness — it is the love that has encountered loss. And the one who truly grieves, Jesus says, will be comforted.</p>

<h2>"The Meek"</h2>

<p>Meekness is perhaps the most misunderstood of the Beatitudes. It is not timidity or passivity. The Greek <em>praus</em> describes a horse that has been broken — powerful but under control. It is strength surrendered to a higher authority. Moses was described as "the meekest man on earth" (Numbers 12:3) — the same Moses who confronted Pharaoh, led a nation, and burned with righteous anger at Israel's idolatry. His meekness was not weakness. It was submission to God.</p>

<p>The meek will "inherit the earth" — a direct quotation of Psalm 37:11, a contrast to the domineering who seem to possess it now. The kingdom's inheritance goes not to the loudest or the most powerful, but to those who have learned where real power comes from.</p>

<h2>Hunger, Mercy, Purity, Peace</h2>

<p>The middle beatitudes trace four more marks of the kingdom citizen: those who hunger and thirst for righteousness (not satisfaction with the status quo), the merciful (who have received and now extend), the pure in heart (whose inner life matches their outer presentation — the opposite of the hypocrisy Jesus will address later in the sermon), and the peacemakers (not peacekeepers, but active creators of shalom).</p>

<p>Each of these cuts against something the world tends to reward. We reward the satisfied, the tough, the strategically advantageous, the conflict-avoiders. Jesus blesses the hungry, the generous, the undivided, and those who make costly peace.</p>

<h2>The Persecuted</h2>

<p>The final beatitude is the longest, and the one Jesus elaborates most: "Blessed are those who are persecuted because of righteousness, for theirs is the kingdom of heaven" (Matthew 5:10). He expands: "Blessed are you when people insult you, persecute you and falsely say all kinds of evil against you because of me. Rejoice and be glad, because great is your reward in heaven" (Matthew 5:11-12).</p>

<p>This is a pre-warning. Alignment with the kingdom of heaven will put you at odds with other kingdoms. The sermon that begins with these blessings will go on to make extraordinary demands — love your enemies, forgive those who hurt you, go the extra mile for people who have power over you. A life shaped by these values will not be universally popular.</p>

<h2>The Portrait as a Whole</h2>

<p>Read together, the Beatitudes describe a person who knows their own emptiness, grieves honestly, holds power gently, hungers for something more than they have, extends to others what they have received, lives without duplicity, makes peace at personal cost, and persists when the cost is high. This person, Jesus says, is flourishing. This person has the kingdom.</p>

<p>It is worth reading the list slowly and asking: where am I in this portrait? Not to perform these qualities, but to receive them — to let them reveal the gaps between how we actually live and the life Jesus invites us into. The Beatitudes are not a morality checklist. They are a description of the person who has encountered the grace of God and been changed by it, from the inside out.</p>
    `.trim(),
  },

  // ── 10 ─────────────────────────────────────────────────────────────────────
  {
    slug: "isaiah-40-31-those-who-hope-in-the-lord",
    title: "Mounting Up on Wings: Isaiah 40:31 and the Renewal of Strength",
    subtitle: "Isaiah 40 was written to people who were exhausted — exiled, forgotten, and convinced that God had stopped paying attention. Its promises are as fresh as the day they were given.",
    category: "Faith & Trust",
    author: "Scripture Lives",
    publishedAt: "2026-01-03",
    readingTimeMin: 6,
    coverEmoji: "🦅",
    keyVerse: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    keyVerseRef: "Isaiah 40:31 (NIV)",
    excerpt:
      "Isaiah 40 opens with 'Comfort, comfort my people' — which tells you immediately that the people need comforting. What follows is one of the most majestic passages in the Old Testament, building to a promise for the genuinely exhausted.",
    tags: ["Isaiah 40", "strength", "hope", "eagles", "exhaustion", "waiting", "renewal"],
    content: `
<p>Isaiah 40 begins in the middle of a crisis. The people of Israel are in exile — or soon will be — torn from their homeland, their temple in ruins, their national identity shattered. More than that, they feel forgotten. They articulate this feeling in verse 27: "My way is hidden from the Lord; my cause is disregarded by my God."</p>

<p>This is the deep wound the chapter is written to address: not just the practical suffering of exile, but the theological despair beneath it. The feeling that God has looked away. That the suffering is proof of abandonment. That heaven has gone silent.</p>

<p>The answer God gives through Isaiah is not a quick fix. It is a sustained argument — and it builds to one of the most beloved promises in the Old Testament.</p>

<h2>Who Has Measured the Waters?</h2>

<p>Before offering comfort, God establishes credentials. "Who has measured the waters in the hollow of his hand, or with the breadth of his hand marked off the heavens?" (Isaiah 40:12). The questions continue for several verses — a kind of divine interrogation designed to recalibrate the listener's sense of who they are dealing with.</p>

<p>This is not intimidation. It is perspective. A God of this magnitude — who stretches out the heavens like a canopy, who regards the nations as a drop in a bucket (40:15) — is not a God who has simply failed to notice Israel's suffering. He is a God who is entirely capable of acting, which means the delay has a purpose, even if that purpose is not yet visible.</p>

<p>"He gives strength to the weary," verse 29 announces, "and increases the power of the weak." The God who made everything can surely make strength for people who have run out of it. The logic is simple and the promise is direct.</p>

<h2>"Those Who Hope in the Lord"</h2>

<p>Verse 31 opens with a conditional: "those who hope in the Lord." The Hebrew word here is <em>qavah</em> — to wait, to expect, to look toward with anticipation. It is the posture of someone who has not given up but is still oriented toward the source of their expectation. Not passive resignation. Not frantic effort. Active, attentive waiting.</p>

<p>This kind of hope is the hardest thing to maintain in exile. When the temple is gone, when the homeland is a memory, when the suffering has gone on so long that it starts to feel like the permanent state of things — <em>qavah</em> is the discipline of still looking. Of saying, even in the valley, "I believe something is coming."</p>

<h2>Eagles, Running, Walking</h2>

<p>The promise moves through three levels — and notably, it moves from the dramatic to the ordinary. First, "they will soar on wings like eagles" — the high, exhilarating moments of spiritual lift, when God feels close and prayer feels powerful and the whole horizon is visible. These happen. But they are not constant.</p>

<p>Then "they will run and not grow weary" — the seasons of active, demanding service where energy is required and sustaining it is no small feat. God promises renewal here too: the ability to keep going without burning out.</p>

<p>Finally, "they will walk and not be faint." This is the least dramatic and perhaps the most profound. Walking. The daily showing up. The ordinary Tuesday. The grief that is still there on a Monday morning. The faithful continuation in circumstances that have not changed. This, God promises, is also sustained. Not just the eagle moments. Not just the running seasons. But the long, slow, faithful walk through ordinary time.</p>

<h2>For the Genuinely Exhausted</h2>

<p>This passage was written for people who were tired in ways that sleep couldn't fix. The exile was not just a practical hardship — it was an attack on everything that had given their lives meaning. Their identity as God's people, their experience of His presence, their sense that history was moving toward something — all of it called into question by the circumstances.</p>

<p>If you are in a season like that — not just physically tired, but weary in soul, wondering if God has gone quiet, wondering if the story is going somewhere — Isaiah 40:31 is addressed to you specifically. Not to people who have it together. Not to people who are soaring. To the weary. To the faint.</p>

<p>Hope in the Lord. Look toward Him. Not because looking makes your circumstances change immediately, but because He is the only source of strength that is truly renewable. Everything else runs out. He does not grow tired or weary (40:28). And He gives His inexhaustible strength to those who are running on empty.</p>

<p>The eagle moments will come. The running seasons will come. And on the days when all you can do is walk without fainting — that, too, will be sustained. Wait for it.</p>
    `.trim(),
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return blogPosts.slice(0, count);
  return blogPosts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aScore =
        (a.category === post.category ? 2 : 0) +
        a.tags.filter((t) => post.tags.includes(t)).length;
      const bScore =
        (b.category === post.category ? 2 : 0) +
        b.tags.filter((t) => post.tags.includes(t)).length;
      return bScore - aScore;
    })
    .slice(0, count);
}

export const CATEGORY_COLORS: Record<BlogCategory, { bg: string; text: string }> = {
  "Devotional":          { bg: "bg-amber-100",   text: "text-amber-800"   },
  "Bible Study":         { bg: "bg-sky-100",     text: "text-sky-800"     },
  "Prayer":              { bg: "bg-violet-100",  text: "text-violet-800"  },
  "Faith & Trust":       { bg: "bg-emerald-100", text: "text-emerald-800" },
  "Grace & Forgiveness": { bg: "bg-rose-100",    text: "text-rose-800"    },
  "Purpose & Calling":   { bg: "bg-orange-100",  text: "text-orange-800"  },
};
