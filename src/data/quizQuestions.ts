// ── Bible Quiz Question Bank ───────────────────────────────────────────────────
// 80 questions across 4 categories, mixed difficulties and types.

export type QuizCategory = "Old Testament" | "New Testament" | "Bible Characters" | "Books & Prophecy";
export type QuizDifficulty = "easy" | "medium" | "hard";
export type QuizType = "mc" | "tf"; // multiple choice | true-false

export interface QuizQuestion {
  id: string;
  type: QuizType;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  question: string;
  options: string[];       // MC: 4 options; TF: ["True","False"]
  correctAnswer: string;   // Must exactly match one of options[]
  reference?: string;
  explanation: string;
}

// ── Old Testament (20) ────────────────────────────────────────────────────────
const OLD_TESTAMENT: QuizQuestion[] = [
  {
    id: "ot-01", type: "mc", category: "Old Testament", difficulty: "easy",
    question: "Who built an ark as commanded by God to survive a great flood?",
    options: ["Noah", "Abraham", "Moses", "Elijah"],
    correctAnswer: "Noah",
    reference: "Genesis 6–7",
    explanation: "God instructed Noah to build an ark to save his family and two of every animal from the coming flood (Genesis 6:14).",
  },
  {
    id: "ot-02", type: "tf", category: "Old Testament", difficulty: "easy",
    question: "God created the world in six days and rested on the seventh.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Genesis 1–2",
    explanation: "Genesis 1–2 describes God creating the heavens and earth in six days, then resting on the seventh day — the basis for the Sabbath.",
  },
  {
    id: "ot-03", type: "mc", category: "Old Testament", difficulty: "easy",
    question: "How many commandments did God give to Moses on Mount Sinai?",
    options: ["7", "10", "12", "5"],
    correctAnswer: "10",
    reference: "Exodus 20",
    explanation: "God gave Moses the Ten Commandments, written on two stone tablets, on Mount Sinai (Exodus 20:1–17).",
  },
  {
    id: "ot-04", type: "mc", category: "Old Testament", difficulty: "easy",
    question: "Which son of Jacob was sold into slavery by his jealous brothers?",
    options: ["Benjamin", "Reuben", "Joseph", "Judah"],
    correctAnswer: "Joseph",
    reference: "Genesis 37",
    explanation: "Joseph's brothers sold him to Ishmaelite traders for 20 pieces of silver because they were jealous of his coat and their father's favour (Genesis 37:28).",
  },
  {
    id: "ot-05", type: "mc", category: "Old Testament", difficulty: "easy",
    question: "What did God promise Noah He would never do again, sealed with a rainbow?",
    options: ["Flood the whole earth", "Send plagues on Egypt", "Scatter the nations", "Destroy Sodom"],
    correctAnswer: "Flood the whole earth",
    reference: "Genesis 9:13–15",
    explanation: "After the flood, God placed a rainbow in the clouds as a covenant sign, promising never again to destroy all life with a flood.",
  },
  {
    id: "ot-06", type: "mc", category: "Old Testament", difficulty: "medium",
    question: "What did God use to speak to Moses in the wilderness near Mount Horeb?",
    options: ["A burning bush", "A cloud of smoke", "An audible voice from heaven", "A pillar of fire"],
    correctAnswer: "A burning bush",
    reference: "Exodus 3:2–4",
    explanation: "The angel of the Lord appeared to Moses in flames of fire from within a bush that burned but was not consumed (Exodus 3:2).",
  },
  {
    id: "ot-07", type: "mc", category: "Old Testament", difficulty: "medium",
    question: "Which city's walls fell when Joshua and the Israelites marched around them seven times?",
    options: ["Jerusalem", "Jericho", "Bethlehem", "Hebron"],
    correctAnswer: "Jericho",
    reference: "Joshua 6",
    explanation: "After marching around Jericho for seven days and blowing their trumpets, the walls of Jericho collapsed (Joshua 6:20).",
  },
  {
    id: "ot-08", type: "mc", category: "Old Testament", difficulty: "medium",
    question: "Who was the first king of Israel, anointed by the prophet Samuel?",
    options: ["David", "Saul", "Solomon", "Rehoboam"],
    correctAnswer: "Saul",
    reference: "1 Samuel 10:1",
    explanation: "Samuel anointed Saul as the first king of Israel after the people demanded a king like the surrounding nations (1 Samuel 10:1).",
  },
  {
    id: "ot-09", type: "tf", category: "Old Testament", difficulty: "medium",
    question: "Elijah was taken up to heaven in a whirlwind, accompanied by a chariot of fire.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "2 Kings 2:11",
    explanation: "As Elijah and Elisha walked, a chariot of fire and horses of fire appeared and Elijah went up to heaven in a whirlwind (2 Kings 2:11).",
  },
  {
    id: "ot-10", type: "mc", category: "Old Testament", difficulty: "medium",
    question: "How many years did the Israelites wander in the wilderness before entering the Promised Land?",
    options: ["70 years", "400 years", "40 years", "7 years"],
    correctAnswer: "40 years",
    reference: "Numbers 14:33",
    explanation: "As a consequence of their unbelief at Kadesh Barnea, God decreed 40 years of wandering — one year for each day the spies explored the land.",
  },
  {
    id: "ot-11", type: "mc", category: "Old Testament", difficulty: "medium",
    question: "Which prophet was swallowed by a great fish after refusing God's command?",
    options: ["Amos", "Hosea", "Jonah", "Obadiah"],
    correctAnswer: "Jonah",
    reference: "Jonah 1:17",
    explanation: "Jonah fled by ship rather than go to Nineveh. God sent a great fish that swallowed him, and Jonah remained inside three days and three nights.",
  },
  {
    id: "ot-12", type: "tf", category: "Old Testament", difficulty: "medium",
    question: "Ruth, who remained loyal to her mother-in-law Naomi, was originally from the land of Moab.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Ruth 1:4",
    explanation: "Ruth was a Moabite woman who married one of Naomi's sons. After his death she famously chose to stay with Naomi and return to Bethlehem.",
  },
  {
    id: "ot-13", type: "mc", category: "Old Testament", difficulty: "hard",
    question: "Who interpreted the mysterious writing on the wall for King Belshazzar of Babylon?",
    options: ["Ezekiel", "Isaiah", "Daniel", "Jeremiah"],
    correctAnswer: "Daniel",
    reference: "Daniel 5",
    explanation: "Daniel interpreted the words 'MENE MENE TEKEL PARSIN' written by a mysterious hand, foretelling Belshazzar's doom (Daniel 5:25–28).",
  },
  {
    id: "ot-14", type: "tf", category: "Old Testament", difficulty: "hard",
    question: "Samson's supernatural strength was directly tied to his uncut hair as part of his Nazirite vow.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Judges 16:17",
    explanation: "Samson revealed to Delilah that no razor had touched his head. When she cut his hair, his strength left him and he was captured by the Philistines.",
  },
  {
    id: "ot-15", type: "mc", category: "Old Testament", difficulty: "hard",
    question: "How old was Methuselah, the oldest person recorded in the Bible?",
    options: ["900 years", "777 years", "950 years", "969 years"],
    correctAnswer: "969 years",
    reference: "Genesis 5:27",
    explanation: "Genesis records Methuselah lived 969 years — the longest recorded lifespan in Scripture.",
  },
  {
    id: "ot-16", type: "tf", category: "Old Testament", difficulty: "hard",
    question: "The Book of Esther is unique in the Bible because it never once mentions the name of God.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Book of Esther",
    explanation: "The Book of Esther is one of only two books in the Bible (along with Song of Solomon) that do not explicitly mention God's name, yet His providence is evident throughout.",
  },
  {
    id: "ot-17", type: "mc", category: "Old Testament", difficulty: "hard",
    question: "Which woman hid two Israelite spies and helped them escape from Jericho?",
    options: ["Deborah", "Bathsheba", "Rahab", "Miriam"],
    correctAnswer: "Rahab",
    reference: "Joshua 2",
    explanation: "Rahab, a resident of Jericho, hid the spies Joshua sent and helped them escape via a scarlet rope from her window. In return, her household was spared (Joshua 2:1–21).",
  },
  {
    id: "ot-18", type: "mc", category: "Old Testament", difficulty: "hard",
    question: "What was the name of Abraham's nephew whom God rescued from the destruction of Sodom?",
    options: ["Ishmael", "Haran", "Lot", "Eliezer"],
    correctAnswer: "Lot",
    reference: "Genesis 19",
    explanation: "Angels warned Lot to flee before God rained burning sulfur on Sodom and Gomorrah. Lot's wife looked back and became a pillar of salt (Genesis 19:16–26).",
  },
  {
    id: "ot-19", type: "mc", category: "Old Testament", difficulty: "medium",
    question: "What musical instrument was King David known for playing before King Saul?",
    options: ["Trumpet", "Flute", "Drum", "Harp (lyre)"],
    correctAnswer: "Harp (lyre)",
    reference: "1 Samuel 16:23",
    explanation: "David played the harp skillfully. Whenever an evil spirit troubled Saul, David would play and Saul would find relief and feel better (1 Samuel 16:23).",
  },
  {
    id: "ot-20", type: "mc", category: "Old Testament", difficulty: "medium",
    question: "Which judge of Israel had supernatural God-given strength and defeated many Philistines?",
    options: ["Gideon", "Deborah", "Jephthah", "Samson"],
    correctAnswer: "Samson",
    reference: "Judges 13–16",
    explanation: "Samson was set apart as a Nazirite from birth. God gave him extraordinary strength, which he used to fight against the Philistines.",
  },
];

// ── New Testament (20) ────────────────────────────────────────────────────────
const NEW_TESTAMENT: QuizQuestion[] = [
  {
    id: "nt-01", type: "mc", category: "New Testament", difficulty: "easy",
    question: "In which city was Jesus born?",
    options: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"],
    correctAnswer: "Bethlehem",
    reference: "Matthew 2:1",
    explanation: "Jesus was born in Bethlehem of Judea, fulfilling Micah's prophecy that a ruler of Israel would come from Bethlehem (Micah 5:2).",
  },
  {
    id: "nt-02", type: "mc", category: "New Testament", difficulty: "easy",
    question: "How many disciples did Jesus choose to be His closest followers?",
    options: ["7", "10", "70", "12"],
    correctAnswer: "12",
    reference: "Mark 3:14",
    explanation: "Jesus appointed twelve apostles to be with Him and to preach, mirroring the twelve tribes of Israel (Mark 3:14).",
  },
  {
    id: "nt-03", type: "tf", category: "New Testament", difficulty: "easy",
    question: "Jesus walked on the surface of the water to reach His disciples' boat.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Matthew 14:25",
    explanation: "During the fourth watch of the night, Jesus walked on the Sea of Galilee toward His disciples' boat. Peter also briefly walked on the water before sinking.",
  },
  {
    id: "nt-04", type: "mc", category: "New Testament", difficulty: "easy",
    question: "What was Jesus's first recorded miracle, performed at a wedding celebration?",
    options: ["Healing a blind man", "Feeding 5,000 people", "Raising Lazarus", "Turning water into wine"],
    correctAnswer: "Turning water into wine",
    reference: "John 2:1–11",
    explanation: "At a wedding in Cana of Galilee, Jesus turned six stone water jars of water into wine — His first miracle, which revealed His glory to His disciples (John 2:11).",
  },
  {
    id: "nt-05", type: "mc", category: "New Testament", difficulty: "easy",
    question: "In which city did the Holy Spirit descend on the disciples at Pentecost?",
    options: ["Galilee", "Bethlehem", "Jerusalem", "Antioch"],
    correctAnswer: "Jerusalem",
    reference: "Acts 2:1–4",
    explanation: "On the day of Pentecost, the disciples were gathered in Jerusalem when a sound like a rushing wind filled the house and tongues of fire appeared on each of them (Acts 2:1–4).",
  },
  {
    id: "nt-06", type: "mc", category: "New Testament", difficulty: "medium",
    question: "Who baptized Jesus in the Jordan River?",
    options: ["Andrew", "Peter", "Nicodemus", "John the Baptist"],
    correctAnswer: "John the Baptist",
    reference: "Matthew 3:13–17",
    explanation: "John the Baptist baptized Jesus in the Jordan River. At that moment the Spirit of God descended like a dove and a voice from heaven said, 'This is my Son, whom I love.'",
  },
  {
    id: "nt-07", type: "tf", category: "New Testament", difficulty: "medium",
    question: "Judas Iscariot betrayed Jesus to the chief priests for 30 pieces of silver.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Matthew 26:15",
    explanation: "Judas agreed to betray Jesus for 30 silver coins — the price of a slave under Mosaic law, fulfilling Zechariah's prophecy (Zechariah 11:12–13).",
  },
  {
    id: "nt-08", type: "mc", category: "New Testament", difficulty: "medium",
    question: "Who was the first Christian martyr, stoned to death for his faith in Jerusalem?",
    options: ["James", "Philip", "Barnabas", "Stephen"],
    correctAnswer: "Stephen",
    reference: "Acts 7:54–60",
    explanation: "Stephen was a deacon filled with the Holy Spirit. After boldly preaching about Jesus, the crowd stoned him to death. As he died, he saw Jesus standing at God's right hand.",
  },
  {
    id: "nt-09", type: "mc", category: "New Testament", difficulty: "medium",
    question: "How many loaves and fish did Jesus use to miraculously feed 5,000 men?",
    options: ["7 loaves and 2 fish", "2 loaves and 5 fish", "12 loaves and 1 fish", "5 loaves and 2 fish"],
    correctAnswer: "5 loaves and 2 fish",
    reference: "Matthew 14:17–21",
    explanation: "A young boy provided five barley loaves and two small fish. Jesus gave thanks, broke them, and the disciples distributed them until everyone had enough — with 12 baskets left over.",
  },
  {
    id: "nt-10", type: "tf", category: "New Testament", difficulty: "medium",
    question: "The Apostle Paul wrote the book of Acts.",
    options: ["True", "False"],
    correctAnswer: "False",
    reference: "Acts 1:1",
    explanation: "The book of Acts was written by Luke the physician, the same author as the Gospel of Luke. It addresses a man named Theophilus, just as Luke's Gospel does (Luke 1:3, Acts 1:1).",
  },
  {
    id: "nt-11", type: "mc", category: "New Testament", difficulty: "medium",
    question: "What was the Apostle Peter's original name before Jesus renamed him?",
    options: ["Andrew", "James", "Bartholomew", "Simon"],
    correctAnswer: "Simon",
    reference: "John 1:42",
    explanation: "Jesus changed Simon's name to Peter (meaning 'rock'), saying upon this rock He would build His church (Matthew 16:18).",
  },
  {
    id: "nt-12", type: "mc", category: "New Testament", difficulty: "medium",
    question: "Which apostle is famous for doubting the resurrection until he touched Jesus's wounds?",
    options: ["Philip", "James", "Thomas", "Bartholomew"],
    correctAnswer: "Thomas",
    reference: "John 20:24–29",
    explanation: "Thomas said he would not believe unless he saw and touched the nail marks and spear wound himself. Jesus appeared and invited him to touch — Thomas declared 'My Lord and my God!'",
  },
  {
    id: "nt-13", type: "mc", category: "New Testament", difficulty: "hard",
    question: "Which Roman governor sentenced Jesus to death by crucifixion?",
    options: ["Herod Antipas", "Herod the Great", "Caiaphas", "Pontius Pilate"],
    correctAnswer: "Pontius Pilate",
    reference: "Matthew 27:24–26",
    explanation: "Pontius Pilate, the Roman governor of Judea, washed his hands to declare his innocence, then handed Jesus over to be crucified despite finding no basis for a charge against Him.",
  },
  {
    id: "nt-14", type: "mc", category: "New Testament", difficulty: "hard",
    question: "Who was chosen to replace Judas Iscariot as the twelfth apostle?",
    options: ["Barnabas", "Stephen", "Philip", "Matthias"],
    correctAnswer: "Matthias",
    reference: "Acts 1:26",
    explanation: "After Judas's death, the remaining apostles cast lots to choose between Barsabbas and Matthias. The lot fell on Matthias, who was added to the eleven apostles.",
  },
  {
    id: "nt-15", type: "tf", category: "New Testament", difficulty: "hard",
    question: "The Great Commission — 'Go and make disciples of all nations' — is found in the Gospel of Matthew.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Matthew 28:19",
    explanation: "The Great Commission appears in Matthew 28:19–20, where Jesus commands His disciples to go and make disciples of all nations, baptizing and teaching them.",
  },
  {
    id: "nt-16", type: "mc", category: "New Testament", difficulty: "hard",
    question: "How many days was Lazarus in the tomb before Jesus raised him from the dead?",
    options: ["2 days", "3 days", "7 days", "4 days"],
    correctAnswer: "4 days",
    reference: "John 11:17",
    explanation: "When Jesus arrived in Bethany, Lazarus had already been in the tomb four days. Despite this, Jesus called out 'Lazarus, come out!' and he walked out alive.",
  },
  {
    id: "nt-17", type: "mc", category: "New Testament", difficulty: "hard",
    question: "Who was the first person to see Jesus alive after His resurrection?",
    options: ["Peter", "James", "John", "Mary Magdalene"],
    correctAnswer: "Mary Magdalene",
    reference: "John 20:11–18",
    explanation: "Mary Magdalene stayed at the empty tomb weeping. Jesus appeared to her and she initially mistook Him for the gardener. He called her name — 'Mary!' — and she recognized Him.",
  },
  {
    id: "nt-18", type: "tf", category: "New Testament", difficulty: "hard",
    question: "John the Baptist and Jesus were related — their mothers were relatives.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Luke 1:36",
    explanation: "The angel Gabriel told Mary that her relative Elizabeth — John the Baptist's mother — was also miraculously pregnant in her old age, confirming a family connection.",
  },
  {
    id: "nt-19", type: "mc", category: "New Testament", difficulty: "easy",
    question: "Where did Jesus deliver the famous Sermon on the Mount?",
    options: ["In the Temple in Jerusalem", "By the Sea of Galilee", "On a mountainside", "In the synagogue at Capernaum"],
    correctAnswer: "On a mountainside",
    reference: "Matthew 5:1",
    explanation: "Seeing the crowds, Jesus went up on a mountainside and sat down. His disciples came to Him, and He began to teach them — including the Beatitudes and the Lord's Prayer.",
  },
  {
    id: "nt-20", type: "tf", category: "New Testament", difficulty: "medium",
    question: "Jesus was baptized in the Sea of Galilee.",
    options: ["True", "False"],
    correctAnswer: "False",
    reference: "Matthew 3:13",
    explanation: "Jesus travelled from Galilee to the Jordan River to be baptized by John the Baptist — not the Sea of Galilee.",
  },
];

// ── Bible Characters (20) ─────────────────────────────────────────────────────
const BIBLE_CHARACTERS: QuizQuestion[] = [
  {
    id: "bc-01", type: "mc", category: "Bible Characters", difficulty: "easy",
    question: "Who was the mother of Jesus?",
    options: ["Martha", "Elizabeth", "Mary", "Salome"],
    correctAnswer: "Mary",
    reference: "Luke 1:30–31",
    explanation: "The angel Gabriel appeared to Mary, a young virgin from Nazareth, and announced that she would conceive and bear the Son of God (Luke 1:30–31).",
  },
  {
    id: "bc-02", type: "mc", category: "Bible Characters", difficulty: "easy",
    question: "Who killed the Philistine giant Goliath with a single stone from a sling?",
    options: ["Samson", "Jonathan", "Saul", "David"],
    correctAnswer: "David",
    reference: "1 Samuel 17",
    explanation: "Young David, armed with only a sling and five stones, struck Goliath on the forehead and killed him — then cut off his head with Goliath's own sword.",
  },
  {
    id: "bc-03", type: "tf", category: "Bible Characters", difficulty: "easy",
    question: "Moses led the Israelites out of slavery in Egypt.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Exodus 12–14",
    explanation: "God called Moses at the burning bush to lead His people out of Egypt. After ten plagues, Pharaoh released the Israelites, and Moses led them through the parted Red Sea.",
  },
  {
    id: "bc-04", type: "mc", category: "Bible Characters", difficulty: "easy",
    question: "Which son of David became renowned throughout the ancient world for his great wisdom?",
    options: ["Absalom", "Adonijah", "Rehoboam", "Solomon"],
    correctAnswer: "Solomon",
    reference: "1 Kings 4:29–34",
    explanation: "God gave Solomon wisdom surpassing all others. Kings from every nation sent envoys to hear his wisdom, and he authored thousands of proverbs and songs.",
  },
  {
    id: "bc-05", type: "mc", category: "Bible Characters", difficulty: "easy",
    question: "Who was the leader of the Israelites after Moses died?",
    options: ["Caleb", "Eleazar", "Phinehas", "Joshua"],
    correctAnswer: "Joshua",
    reference: "Joshua 1:1–2",
    explanation: "After Moses died, the Lord told Joshua son of Nun to lead the Israelites across the Jordan River into the Promised Land (Joshua 1:2).",
  },
  {
    id: "bc-06", type: "mc", category: "Bible Characters", difficulty: "medium",
    question: "Which apostle denied knowing Jesus three times before the rooster crowed?",
    options: ["John", "Thomas", "James", "Peter"],
    correctAnswer: "Peter",
    reference: "Matthew 26:69–75",
    explanation: "Despite Peter's bold declaration that he would never deny Jesus, he denied Him three times to bystanders in the high priest's courtyard. Afterward he wept bitterly.",
  },
  {
    id: "bc-07", type: "tf", category: "Bible Characters", difficulty: "medium",
    question: "Abraham's original name was Abram, changed by God to Abraham as part of His covenant.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Genesis 17:5",
    explanation: "God changed Abram's name to Abraham, meaning 'father of many nations,' as a sign of the covenant promising that nations and kings would come from him.",
  },
  {
    id: "bc-08", type: "mc", category: "Bible Characters", difficulty: "medium",
    question: "What was the occupation of Matthew (also called Levi) before Jesus called him?",
    options: ["Fisherman", "Carpenter", "Shepherd", "Tax collector"],
    correctAnswer: "Tax collector",
    reference: "Matthew 9:9",
    explanation: "Jesus saw Matthew sitting at his tax collector's booth and said, 'Follow me.' Matthew got up and followed Him — and then hosted a great banquet for Jesus at his house.",
  },
  {
    id: "bc-09", type: "mc", category: "Bible Characters", difficulty: "medium",
    question: "Who was the mother-in-law of Ruth, with whom she returned to Bethlehem?",
    options: ["Orpah", "Hannah", "Deborah", "Naomi"],
    correctAnswer: "Naomi",
    reference: "Ruth 1",
    explanation: "Ruth famously told Naomi: 'Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God' (Ruth 1:16).",
  },
  {
    id: "bc-10", type: "tf", category: "Bible Characters", difficulty: "medium",
    question: "Miriam was the sister of both Moses and Aaron.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Exodus 15:20",
    explanation: "Miriam is identified as a prophetess and the sister of Aaron. She led the women of Israel in song and dance after crossing the Red Sea (Exodus 15:20–21).",
  },
  {
    id: "bc-11", type: "mc", category: "Bible Characters", difficulty: "medium",
    question: "Which prophet received a dramatic vision of a valley full of dry bones returning to life?",
    options: ["Isaiah", "Jeremiah", "Daniel", "Ezekiel"],
    correctAnswer: "Ezekiel",
    reference: "Ezekiel 37",
    explanation: "God set Ezekiel in a valley full of dry bones and commanded him to prophesy over them. The bones came together with sinews and flesh, and breath entered them — a symbol of Israel's restoration.",
  },
  {
    id: "bc-12", type: "mc", category: "Bible Characters", difficulty: "medium",
    question: "Which woman from Jael drove a tent peg through the enemy commander Sisera's head?",
    options: ["Rahab", "Deborah", "Miriam", "Jael"],
    correctAnswer: "Jael",
    reference: "Judges 4:21",
    explanation: "Sisera fled after his army was defeated and hid in Jael's tent. While he slept, Jael took a tent peg and hammer and drove it through his temple, killing him (Judges 4:21).",
  },
  {
    id: "bc-13", type: "mc", category: "Bible Characters", difficulty: "hard",
    question: "What was the name of the angel who announced to Mary that she would bear the Son of God?",
    options: ["Michael", "Raphael", "Uriel", "Gabriel"],
    correctAnswer: "Gabriel",
    reference: "Luke 1:26–31",
    explanation: "God sent the angel Gabriel to Nazareth to tell Mary she would conceive a son by the Holy Spirit and name Him Jesus (Luke 1:26–31).",
  },
  {
    id: "bc-14", type: "tf", category: "Bible Characters", difficulty: "hard",
    question: "Barnabas served as a missionary companion of the Apostle Paul on his journeys.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Acts 13–15",
    explanation: "Barnabas and Paul were sent out together by the church at Antioch on Paul's first missionary journey. Barnabas's name means 'son of encouragement' (Acts 4:36).",
  },
  {
    id: "bc-15", type: "mc", category: "Bible Characters", difficulty: "hard",
    question: "Who was the twin brother of Jacob, who sold his birthright for a bowl of stew?",
    options: ["Laban", "Ishmael", "Reuben", "Esau"],
    correctAnswer: "Esau",
    reference: "Genesis 25:29–34",
    explanation: "Esau came home from hunting, famished, and sold his birthright as firstborn to his brother Jacob for a bowl of red lentil stew, despising his birthright.",
  },
  {
    id: "bc-16", type: "mc", category: "Bible Characters", difficulty: "hard",
    question: "Which Babylonian king saw a hand write mysterious words on the wall during a feast?",
    options: ["Nebuchadnezzar", "Darius", "Cyrus", "Belshazzar"],
    correctAnswer: "Belshazzar",
    reference: "Daniel 5",
    explanation: "During King Belshazzar's feast using the sacred vessels from Jerusalem, a hand appeared and wrote 'MENE MENE TEKEL PARSIN' on the wall — foretelling his downfall.",
  },
  {
    id: "bc-17", type: "mc", category: "Bible Characters", difficulty: "hard",
    question: "Who replaced Judas Iscariot as the twelfth apostle after Judas's death?",
    options: ["Barnabas", "Stephen", "Philip", "Matthias"],
    correctAnswer: "Matthias",
    reference: "Acts 1:26",
    explanation: "The remaining apostles prayed and cast lots between Barsabbas and Matthias. The lot fell on Matthias, who joined the eleven to restore the apostolic number to twelve.",
  },
  {
    id: "bc-18", type: "tf", category: "Bible Characters", difficulty: "hard",
    question: "Joseph, son of Jacob, became second-in-command over all of Egypt under Pharaoh.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Genesis 41:40–43",
    explanation: "After Joseph interpreted Pharaoh's dreams, Pharaoh said there was none wiser and placed him over his household — second only to Pharaoh himself in all of Egypt.",
  },
  {
    id: "bc-19", type: "mc", category: "Bible Characters", difficulty: "hard",
    question: "Which apostle among the twelve was called 'the Zealot' before following Jesus?",
    options: ["Matthew", "Bartholomew", "Thaddaeus", "Simon the Zealot"],
    correctAnswer: "Simon the Zealot",
    reference: "Luke 6:15",
    explanation: "Simon the Zealot is listed among the Twelve. The 'Zealot' designation likely refers to his membership in or sympathy with a Jewish nationalist movement before following Jesus.",
  },
  {
    id: "bc-20", type: "mc", category: "Bible Characters", difficulty: "medium",
    question: "Which Old Testament figure correctly interpreted the dreams of Pharaoh's baker and cupbearer while in prison?",
    options: ["Moses", "Daniel", "Elijah", "Joseph"],
    correctAnswer: "Joseph",
    reference: "Genesis 40",
    explanation: "Joseph interpreted the cupbearer's dream (restoration in three days) and the baker's dream (execution in three days) — both came true exactly as he said.",
  },
];

// ── Books & Prophecy (20) ─────────────────────────────────────────────────────
const BOOKS_AND_PROPHECY: QuizQuestion[] = [
  {
    id: "bp-01", type: "mc", category: "Books & Prophecy", difficulty: "easy",
    question: "What is the very first book of the Bible?",
    options: ["Exodus", "Psalms", "Numbers", "Genesis"],
    correctAnswer: "Genesis",
    explanation: "Genesis is the first book of the Bible and of the Torah. Its name means 'beginning' — it opens with 'In the beginning, God created the heavens and the earth.'",
  },
  {
    id: "bp-02", type: "mc", category: "Books & Prophecy", difficulty: "easy",
    question: "What is the very last book of the Bible?",
    options: ["Jude", "3 John", "Malachi", "Revelation"],
    correctAnswer: "Revelation",
    explanation: "The Book of Revelation, written by the apostle John on the island of Patmos, is the final book of the New Testament and of the entire Bible.",
  },
  {
    id: "bp-03", type: "tf", category: "Books & Prophecy", difficulty: "easy",
    question: "The Protestant Bible contains exactly 66 books — 39 in the Old Testament and 27 in the New Testament.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "The Protestant Bible has 66 books: 39 in the Old Testament (the Hebrew canon) and 27 in the New Testament, for a total of 66.",
  },
  {
    id: "bp-04", type: "mc", category: "Books & Prophecy", difficulty: "easy",
    question: "What is the shortest verse in the English Bible?",
    options: ["'God is love'", "'Pray without ceasing'", "'Rejoice always'", "'Jesus wept'"],
    correctAnswer: "'Jesus wept'",
    reference: "John 11:35",
    explanation: "'Jesus wept' (John 11:35) is the shortest verse in most English Bible translations. It captures Jesus's grief over the death of His friend Lazarus.",
  },
  {
    id: "bp-05", type: "mc", category: "Books & Prophecy", difficulty: "easy",
    question: "In which Old Testament book would you find the story of the Tower of Babel?",
    options: ["Exodus", "Judges", "Numbers", "Genesis"],
    correctAnswer: "Genesis",
    reference: "Genesis 11",
    explanation: "Genesis 11 describes humanity building a tower to reach the heavens. God confused their languages and scattered them — explaining the diversity of languages on earth.",
  },
  {
    id: "bp-06", type: "mc", category: "Books & Prophecy", difficulty: "medium",
    question: "How many books are in the Old Testament of the Protestant Bible?",
    options: ["27", "40", "46", "39"],
    correctAnswer: "39",
    explanation: "The Protestant Old Testament contains 39 books, from Genesis through Malachi. These correspond to the 24 books of the Hebrew Bible (some are split differently in Christian tradition).",
  },
  {
    id: "bp-07", type: "tf", category: "Books & Prophecy", difficulty: "medium",
    question: "The book of Job is found in the Old Testament.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "Job is one of the Old Testament wisdom books, along with Psalms, Proverbs, Ecclesiastes, and Song of Solomon. It explores the problem of suffering and God's sovereignty.",
  },
  {
    id: "bp-08", type: "mc", category: "Books & Prophecy", difficulty: "medium",
    question: "Who is the primary author of the Psalms?",
    options: ["Moses", "Solomon", "Asaph", "David"],
    correctAnswer: "David",
    reference: "Psalms",
    explanation: "David wrote approximately half of the 150 Psalms. Other contributors include Asaph, the sons of Korah, Solomon, Moses, and some anonymous authors.",
  },
  {
    id: "bp-09", type: "mc", category: "Books & Prophecy", difficulty: "medium",
    question: "Which prophet predicted that the Messiah would be born of a virgin?",
    options: ["Jeremiah", "Micah", "Daniel", "Isaiah"],
    correctAnswer: "Isaiah",
    reference: "Isaiah 7:14",
    explanation: "Isaiah 7:14 says 'The virgin will conceive and give birth to a son, and will call him Immanuel.' Matthew 1:23 quotes this prophecy to describe Jesus's birth.",
  },
  {
    id: "bp-10", type: "tf", category: "Books & Prophecy", difficulty: "medium",
    question: "The Gospel of Luke is the longest of the four Gospels in terms of word count.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "Luke's Gospel contains more words than Matthew, Mark, or John. Luke the physician wrote with careful attention to detail and addressed his work to Theophilus.",
  },
  {
    id: "bp-11", type: "mc", category: "Books & Prophecy", difficulty: "medium",
    question: "Which book of the Bible contains the Sermon on the Mount?",
    options: ["Luke", "Mark", "John", "Matthew"],
    correctAnswer: "Matthew",
    reference: "Matthew 5–7",
    explanation: "The Sermon on the Mount spans Matthew chapters 5–7 and contains the Beatitudes, the Lord's Prayer, and many of Jesus's core teachings on the kingdom of God.",
  },
  {
    id: "bp-12", type: "tf", category: "Books & Prophecy", difficulty: "medium",
    question: "The Apostle Paul wrote more books of the New Testament than any other author.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "Paul wrote 13 books of the New Testament (Romans through Philemon). If Hebrews is included, the count rises to 14 — making him the most prolific New Testament author.",
  },
  {
    id: "bp-13", type: "mc", category: "Books & Prophecy", difficulty: "medium",
    question: "What does the word 'Gospel' mean?",
    options: ["Sacred writing", "Holy scripture", "God's word", "Good news"],
    correctAnswer: "Good news",
    explanation: "The Greek word 'euangelion' (Gospel) means 'good news.' The four Gospels — Matthew, Mark, Luke, and John — present the good news of Jesus Christ.",
  },
  {
    id: "bp-14", type: "mc", category: "Books & Prophecy", difficulty: "hard",
    question: "Which prophet predicted that the Messiah would enter Jerusalem riding on a donkey?",
    options: ["Isaiah", "Micah", "Daniel", "Zechariah"],
    correctAnswer: "Zechariah",
    reference: "Zechariah 9:9",
    explanation: "Zechariah 9:9 says 'See, your king comes to you, righteous and victorious, lowly and riding on a donkey.' Jesus fulfilled this on Palm Sunday (Matthew 21:5).",
  },
  {
    id: "bp-15", type: "mc", category: "Books & Prophecy", difficulty: "hard",
    question: "In what language was most of the Old Testament originally written?",
    options: ["Greek", "Latin", "Aramaic", "Hebrew"],
    correctAnswer: "Hebrew",
    explanation: "The vast majority of the Old Testament was written in Biblical Hebrew. Small portions — parts of Daniel and Ezra — were written in Aramaic.",
  },
  {
    id: "bp-16", type: "tf", category: "Books & Prophecy", difficulty: "hard",
    question: "The prophet Micah predicted that the Messiah would be born in Bethlehem.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Micah 5:2",
    explanation: "Micah 5:2 says 'But you, Bethlehem Ephrathah... out of you will come for me one who will be ruler over Israel, whose origins are from of old.' Matthew 2:6 cites this prophecy.",
  },
  {
    id: "bp-17", type: "mc", category: "Books & Prophecy", difficulty: "hard",
    question: "How many letters (epistles) did the Apostle John write in the New Testament?",
    options: ["4", "2", "1", "3"],
    correctAnswer: "3",
    explanation: "John wrote three letters: 1 John, 2 John, and 3 John. He also wrote the Gospel of John and the Book of Revelation, but the question specifies letters/epistles.",
  },
  {
    id: "bp-18", type: "mc", category: "Books & Prophecy", difficulty: "hard",
    question: "Which Old Testament prophet's writings are quoted more often in the New Testament than any other prophet?",
    options: ["Zechariah", "Micah", "Jeremiah", "Isaiah"],
    correctAnswer: "Isaiah",
    explanation: "Isaiah is quoted or alluded to over 50 times in the New Testament — more than any other Old Testament prophet. He is sometimes called the 'Fifth Evangelist.'",
  },
  {
    id: "bp-19", type: "tf", category: "Books & Prophecy", difficulty: "hard",
    question: "The Book of Revelation was written by John while he was exiled on the island of Patmos.",
    options: ["True", "False"],
    correctAnswer: "True",
    reference: "Revelation 1:9",
    explanation: "John identifies himself as being on the island of Patmos 'because of the word of God and the testimony of Jesus' — he was exiled there during Roman persecution.",
  },
  {
    id: "bp-20", type: "mc", category: "Books & Prophecy", difficulty: "hard",
    question: "Which Old Testament chapter contains the prophecy about a suffering servant 'pierced for our transgressions'?",
    options: ["Ezekiel 37", "Jeremiah 31", "Daniel 9", "Isaiah 53"],
    correctAnswer: "Isaiah 53",
    explanation: "Isaiah 53, written 700 years before Jesus, describes a servant who was pierced for our transgressions, crushed for our iniquities — one of the most striking Messianic prophecies in Scripture.",
  },
];

// ── Full pool ─────────────────────────────────────────────────────────────────
export const ALL_QUIZ_QUESTIONS: QuizQuestion[] = [
  ...OLD_TESTAMENT,
  ...NEW_TESTAMENT,
  ...BIBLE_CHARACTERS,
  ...BOOKS_AND_PROPHECY,
];

export const QUIZ_CATEGORIES: QuizCategory[] = [
  "Old Testament",
  "New Testament",
  "Bible Characters",
  "Books & Prophecy",
];

/** Return a shuffled subset of questions matching the given filters. */
export function buildQuiz({
  categories = QUIZ_CATEGORIES,
  difficulties = ["easy", "medium", "hard"] as QuizDifficulty[],
  count = 10,
}: {
  categories?: QuizCategory[];
  difficulties?: QuizDifficulty[];
  count?: number;
} = {}): QuizQuestion[] {
  const pool = ALL_QUIZ_QUESTIONS.filter(
    (q) => categories.includes(q.category) && difficulties.includes(q.difficulty)
  );
  // Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
