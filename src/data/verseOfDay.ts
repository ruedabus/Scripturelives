// Daily verse pool — deterministic selection by day of year
export interface DailyVerse {
  reference: string;
  text: string;
  theme: string; // short thematic keyword for UI display
}

export const VERSE_POOL: DailyVerse[] = [
  { reference: "John 3:16",          text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",                                       theme: "Love" },
  { reference: "Psalm 23:1",         text: "The Lord is my shepherd; I shall not want.",                                                                                                                              theme: "Trust" },
  { reference: "Romans 8:28",        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",                                              theme: "Hope" },
  { reference: "Philippians 4:13",   text: "I can do all this through him who gives me strength.",                                                                                                                    theme: "Strength" },
  { reference: "Proverbs 3:5-6",     text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",                    theme: "Trust" },
  { reference: "Joshua 1:9",         text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",                   theme: "Courage" },
  { reference: "Jeremiah 29:11",     text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",                                 theme: "Purpose" },
  { reference: "Isaiah 40:31",       text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",      theme: "Strength" },
  { reference: "Matthew 11:28",      text: "Come to me, all you who are weary and burdened, and I will give you rest.",                                                                                               theme: "Rest" },
  { reference: "Psalm 46:1",         text: "God is our refuge and strength, an ever-present help in trouble.",                                                                                                        theme: "Refuge" },
  { reference: "Romans 8:38-39",     text: "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.", theme: "Love" },
  { reference: "2 Corinthians 5:17", text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",                                                                        theme: "Renewal" },
  { reference: "Galatians 2:20",     text: "I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.", theme: "Faith" },
  { reference: "Ephesians 2:8-9",    text: "For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God — not by works, so that no one can boast.",               theme: "Grace" },
  { reference: "Philippians 4:6-7",  text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.", theme: "Peace" },
  { reference: "Romans 12:2",        text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is — his good, pleasing and perfect will.", theme: "Renewal" },
  { reference: "2 Timothy 1:7",      text: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",                                                                         theme: "Courage" },
  { reference: "1 John 4:8",         text: "Whoever does not love does not know God, because God is love.",                                                                                                           theme: "Love" },
  { reference: "Matthew 6:33",       text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",                                                                     theme: "Faith" },
  { reference: "Psalm 119:105",      text: "Your word is a lamp for my feet, a light on my path.",                                                                                                                    theme: "Scripture" },
  { reference: "Isaiah 41:10",       text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",           theme: "Courage" },
  { reference: "Lamentations 3:22-23", text: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.",                        theme: "Mercy" },
  { reference: "Hebrews 11:1",       text: "Now faith is confidence in what we hope for and assurance about what we do not see.",                                                                                      theme: "Faith" },
  { reference: "James 1:2-3",        text: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance.",            theme: "Perseverance" },
  { reference: "1 Peter 5:7",        text: "Cast all your anxiety on him because he cares for you.",                                                                                                                  theme: "Peace" },
  { reference: "Psalm 34:8",         text: "Taste and see that the Lord is good; blessed is the one who takes refuge in him.",                                                                                         theme: "Joy" },
  { reference: "John 14:6",          text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'",                                                                theme: "Salvation" },
  { reference: "Matthew 5:3",        text: "Blessed are the poor in spirit, for theirs is the kingdom of heaven.",                                                                                                    theme: "Kingdom" },
  { reference: "Romans 5:8",         text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.",                                                                       theme: "Love" },
  { reference: "Psalm 27:1",         text: "The Lord is my light and my salvation — whom shall I fear? The Lord is the stronghold of my life — of whom shall I be afraid?",                                           theme: "Courage" },
  { reference: "John 15:5",          text: "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.",                                      theme: "Abiding" },
  { reference: "Romans 15:13",       text: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",                            theme: "Hope" },
  { reference: "Psalm 91:1",         text: "Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.",                                                                                  theme: "Refuge" },
  { reference: "Matthew 28:19-20",   text: "Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.", theme: "Mission" },
  { reference: "2 Chronicles 7:14",  text: "If my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways, then I will hear from heaven, and I will forgive their sin and will heal their land.", theme: "Prayer" },
  { reference: "Proverbs 31:25",     text: "She is clothed with strength and dignity; she can laugh at the days to come.",                                                                                             theme: "Strength" },
  { reference: "John 8:32",          text: "Then you will know the truth, and the truth will set you free.",                                                                                                           theme: "Freedom" },
  { reference: "Isaiah 26:3",        text: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",                                                                               theme: "Peace" },
  { reference: "Psalm 37:4",         text: "Take delight in the Lord, and he will give you the desires of your heart.",                                                                                                theme: "Joy" },
  { reference: "Colossians 3:23",    text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",                                                                         theme: "Purpose" },
  { reference: "2 Corinthians 12:9", text: "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.' Therefore I will boast all the more gladly about my weaknesses, so that Christ's power may rest on me.", theme: "Grace" },
  { reference: "Micah 6:8",          text: "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.",                     theme: "Justice" },
  { reference: "Nahum 1:7",          text: "The Lord is good, a refuge in times of trouble. He cares for those who trust in him.",                                                                                     theme: "Refuge" },
  { reference: "John 10:10",         text: "The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full.",                                                        theme: "Life" },
  { reference: "Psalm 16:11",        text: "You make known to me the path of life; you will fill me with joy in your presence, with eternal pleasures at your right hand.",                                            theme: "Joy" },
  { reference: "Isaiah 43:2",        text: "When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you.",                                               theme: "Comfort" },
  { reference: "1 Corinthians 13:4-5", text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking.",                           theme: "Love" },
  { reference: "Hebrews 12:1",       text: "Therefore, since we are surrounded by such a great cloud of witnesses, let us throw off everything that hinders and the sin that so easily entangles.",                   theme: "Perseverance" },
  { reference: "Psalm 51:10",        text: "Create in me a pure heart, O God, and renew a steadfast spirit within me.",                                                                                               theme: "Renewal" },
  { reference: "Matthew 5:16",       text: "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.",                                               theme: "Mission" },
  { reference: "Romans 1:16",        text: "For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes.",                                                       theme: "Salvation" },
  { reference: "Zephaniah 3:17",     text: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.", theme: "Love" },
  { reference: "Psalm 103:12",       text: "As far as the east is from the west, so far has he removed our transgressions from us.",                                                                                   theme: "Forgiveness" },
  { reference: "John 16:33",         text: "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.",                          theme: "Peace" },
  { reference: "Ephesians 3:20",     text: "Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us.",                                            theme: "Hope" },
  { reference: "Luke 1:37",          text: "For no word from God will ever fail.",                                                                                                                                    theme: "Faith" },
  { reference: "Psalm 139:14",       text: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.",                                                               theme: "Identity" },
  { reference: "Isaiah 40:8",        text: "The grass withers and the flowers fall, but the word of our God endures forever.",                                                                                         theme: "Scripture" },
  { reference: "Romans 8:1",         text: "Therefore, there is now no condemnation for those who are in Christ Jesus.",                                                                                               theme: "Grace" },
  { reference: "1 Thessalonians 5:16-18", text: "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.",                                              theme: "Joy" },
  { reference: "Psalm 23:4",         text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",                                      theme: "Comfort" },
  { reference: "Matthew 6:34",       text: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.",                                                     theme: "Peace" },
  { reference: "Galatians 5:22-23",  text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.",                                           theme: "Spirit" },
  { reference: "Psalm 46:10",        text: "He says, 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.'",                                                       theme: "Rest" },
  { reference: "1 John 1:9",         text: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.",                                                    theme: "Forgiveness" },
  { reference: "Deuteronomy 31:6",   text: "Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you.",                 theme: "Courage" },
  { reference: "John 13:34",         text: "A new command I give you: Love one another. As I have loved you, so you must love one another.",                                                                           theme: "Love" },
  { reference: "Psalm 56:3",         text: "When I am afraid, I put my trust in you.",                                                                                                                                theme: "Trust" },
  { reference: "Isaiah 55:8-9",      text: "'For my thoughts are not your thoughts, neither are your ways my ways,' declares the Lord. 'As the heavens are higher than the earth, so are my ways higher than your ways.'", theme: "Sovereignty" },
  { reference: "Hebrews 4:16",       text: "Let us then approach God's throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need.",                                 theme: "Grace" },
  { reference: "Acts 1:8",           text: "But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.",   theme: "Mission" },
  { reference: "Revelation 21:4",    text: "He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.",                        theme: "Hope" },
];

// Returns a deterministic verse for the current calendar date
export function getVerseOfDay(date: Date = new Date()): DailyVerse {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return VERSE_POOL[dayOfYear % VERSE_POOL.length];
}

export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}
