/**
 * Narration text for each Faith Tails ebook.
 * Used by /api/narrate to feed text to ElevenLabs TTS.
 *
 * To add a new book: add an entry matching the book's slug from kids/page.tsx.
 * Each page entry has a title (read first) and body text (read after title).
 */

export type NarrationPage = {
  title: string;
  text:  string;
};

export type BookNarration = {
  /** Human-readable title for display */
  title: string;
  /** Base path for page images, e.g. "/episode8/page-{n}.jpg" */
  imageBase: string;
  /** Cover image shown while reader opens */
  coverImage: string;
  pages: NarrationPage[];
};

export const EBOOK_NARRATION: Record<string, BookNarration> = {

  // ── Episode 1: Mission Moonrock (moon-adventure) ───────────────────────────
  "moon-adventure": {
    title:      "Mission Moonrock",
    imageBase:  "/episode1/page-{n}.jpg",
    coverImage: "/ebook1-thumbnail.png",
    pages: [
      {
        title: "Launch Day",
        text:  `Captain Dave had launched rockets before, but standing on the pad with Mav and Moony in matching space suits, he knew this might be his strangest mission yet. "Ready?" he asked. "READY DOESN'T BEGIN TO COVER IT!" boomed Mav. Moony checked his helmet seal and said, "Ready."`,
      },
      {
        title: "Through Space",
        text:  `Space was mostly silent. "ARE WE THERE YET?" Mav shouted after only four minutes. Moony sighed. Captain Dave turned up the radio as Earth drifted smaller in the window. For a moment, all three grew quiet. "Huh," said Mav softly. "Yeah," said Moony.`,
      },
      {
        title: "Moon Landing",
        text:  `Captain Dave landed them safely on the moon. Outside, the world was silver, still, and beautiful. Mav bounded through the air and floated six feet high. "IT'S FLOATY!" he yelled. Soon the three explorers were leaping across craters — until Captain Dave did one very slow somersault. "We didn't see that," said Moony.`,
      },
      {
        title: "Giant Footprints",
        text:  `Moony stopped first. Huge footprints were pressed deep into the moon dust, each one bigger than their rocket. Captain Dave knelt beside one and said, "Something very large lives here." Then the ground began to shake. "Something that is still here," whispered Moony.`,
      },
      {
        title: "The Moon Giant Appears",
        text:  `He rose from behind the crater rim like a mountain deciding to walk. Zargon, the Moon Giant, towered above them with glowing blue eyes. "YOU ARE TRESPASSING ON THE MOON OF ZARGON," he thundered. Mav's tail went still. "Everyone back to the ship. Now," said Captain Dave.`,
      },
      {
        title: "First Battle Attempts",
        text:  `Captain Dave bravely told Zargon to stand down. Zargon answered by flicking a boulder the size of a minivan past Dave's helmet. Then Mav charged — and bounced off the giant's boot like a tennis ball. "NEW PLAN!" Mav shouted while floating backward through the sky.`,
      },
      {
        title: "Moony's Plan",
        text:  `Inside the rocket, they regrouped. "We can't match his strength," said Captain Dave. "We don't need to," said Moony. He remembered a boy named David, who faced a giant with only a sling, five smooth stones, and faith. "I know Who is with me," he said.`,
      },
      {
        title: "The Shot",
        text:  `Moony walked out alone with one smooth moon rock in his paw. Zargon stared down at him. "Little dog, you come to face Zargon alone?" he boomed. "Just us," said Moony. Then he threw the stone with everything he had — and it flew in a perfect arc straight between his glowing blue eyes.`,
      },
      {
        title: "Victory",
        text:  `Zargon sat down with a mighty moonquake, then hurried to a giant black ship hidden in the crater. In moments, he blasted off into the stars. Captain Dave scooped up Moony in delight while Mav bounced around them. "That's all courage ever really is," Moony said. "Being more determined than scared — and never facing it alone."`,
      },
    ],
  },

  // ── Episode 2: The Lion's Den (lions-den) ─────────────────────────────────
  "lions-den": {
    title:      "Mav, Moony & the Lion's Den",
    imageBase:  "/episode2/page-{n}.jpg",
    coverImage: "/ebook2-thumbnail.png",
    pages: [
      {
        title: "Welcome to Persia!",
        text:  `Mav and Moony had visited a lot of places with Grandpa Martinez. But ancient Persia? That was new. The marketplace smelled of spices, the streets were paved in gold tile, and somewhere nearby, something smelled AMAZING. "Is that lamb?" said Mav. "Focus," said Moony.`,
      },
      {
        title: "The King's Favorite",
        text:  `Grandpa Martinez served King Darius faithfully. He was honest, hardworking, and trustworthy — so the king loved him most of all. "You deserve the top job in my kingdom," the king announced. "WHAT ABOUT ME?" said Mav. "You ate the royal cushion," said Moony.`,
      },
      {
        title: "The Sneaky Advisors",
        text:  `Not everyone was happy about Grandpa Martinez's promotion. Two royal advisors — Slink and Sneer — watched from the shadows with jealous eyes and crooked smiles. "We must get rid of him," Slink hissed. Mav spotted them whispering in the corner. "I don't like those guys," he said. "Neither do I," said Moony.`,
      },
      {
        title: "The King's New Law",
        text:  `Slink and Sneer had a plan. They flattered the king until he agreed to sign a royal decree: for thirty days, anyone caught praying to anyone but the king would be thrown into the lion's den. The king signed it with a golden quill — not knowing it was a trap. "Oh no," whispered Moony.`,
      },
      {
        title: "The New Law",
        text:  `A royal herald nailed the new law to every wall in Persia. Mav stopped in front of one and read it out loud. His eyes got bigger. And bigger. His jaw dropped to the floor. "LIONS?!" he yelped. Moony read it calmly. "Lions," he confirmed. "There has to be a mistake," said Mav. "There isn't," said Moony.`,
      },
      {
        title: "Still Praying",
        text:  `That evening, Mav watched as Grandpa Martinez knelt down and prayed — just like he did every single day, three times a day. No law was going to change that. "Grandpa!" Mav hissed. "Did you not READ the sign?!" Grandpa smiled, eyes still closed. "I read it. But I trust God more than I fear any law."`,
      },
      {
        title: "Caught!",
        text:  `Slink and Sneer had been watching. The moment they saw Grandpa Martinez praying, they ran straight to the king — tripping over each other in excitement. "We caught him! We caught him!" they sang. The king's face fell. He had never wanted this. But the law of Persia could not be changed.`,
      },
      {
        title: "Before the King",
        text:  `Grandpa Martinez stood before King Darius. The king looked miserable. "I tried to find a way out," the king said, his voice cracking. "I know," said Grandpa. "It's okay." Mav stepped forward. "It is NOT okay, actually —" Moony grabbed his collar. "Not helpful," he whispered.`,
      },
      {
        title: "Into the Den",
        text:  `The guards lowered Grandpa Martinez into the great dark pit. The king whispered, "May your God save you." Mav crawled to the edge on his belly and looked down into the blackness. He could hear the lions below. He could smell them too. "I'll pray for you, Grandpa," he whispered. "That's a great start," said Moony.`,
      },
      {
        title: "A Long Night",
        text:  `The king sealed the den and went back to his palace. But he couldn't eat. He couldn't sleep. He paced back and forth all night. Mav paced too. He tried counting sheep. He tried counting lions. That made things worse. "Just pray," said Moony quietly. So Mav did — for the very first time.`,
      },
      {
        title: "The Angel",
        text:  `Down in the den, something incredible happened. A bright and mighty angel appeared — and the lions went still. They sniffed at Grandpa Martinez curiously, then lay down around him like giant kittens. One rested its enormous head in his lap and let out a long rumbling purr. Martinez laughed softly and patted its mane. "Thank You, Lord," he whispered.`,
      },
      {
        title: "Run!",
        text:  `Before the sun had fully risen, King Darius was already sprinting toward the lion's den — robes flying, crown bouncing. Mav ran beside him at full speed. For a big dog, Mav could really move when lions were involved. Moony somehow kept up. "GRANDPA!" they all shouted as they reached the sealed stone.`,
      },
      {
        title: "He's Alive!",
        text:  `When the stone was rolled away, Grandpa Martinez walked out — calm, unhurt, not a scratch on him. His fedora still perfectly on his head. Behind him, the lions sat like puppies wagging their tails. Mav stared. Then fainted. The king laughed and cried at the same time. Moony looked at the reader and nodded. "God keeps His promises," he said.`,
      },
      {
        title: "The King's Declaration",
        text:  `King Darius sent a message to every nation in the world: "The God of Grandpa Martinez is the living God! He rescues and saves. He performs signs and wonders. He saved my friend from the power of the lions!" Mav stood up straight when he heard it read aloud. Something had changed inside him.`,
      },
      {
        title: "Standing Firm",
        text:  `That evening, the three friends walked through the golden streets of Persia together. "Were you ever scared, Grandpa?" Mav asked. "Every second," said Grandpa Martinez with a smile. "Then how did you do it?" "I didn't," said Grandpa, adjusting his fedora. "I just trusted the One who did." Mav was quiet for a long time. "I want to trust like that." "You already started," said Moony.`,
      },
    ],
  },

  // ── Episode 3: Riders of the Ark (riders-of-the-ark) ─────────────────────
  "riders-of-the-ark": {
    title:      "Mav and Moony: Riders of the Ark",
    imageBase:  "/episode3/page-{n}.jpg",
    coverImage: "/ebook3-thumbnail.png",
    pages: [
      {
        title: "One Second…",
        text:  `One second Mav was chewing his favorite sock. The next second — he wasn't. A swirl of golden light. A sound like a thousand trumpets. THUD. "WHERE ARE WE?!" Mav yelped. "More importantly," said Moony, "WHEN are we?"`,
      },
      {
        title: "Ancient Lands",
        text:  `They landed somewhere hot. And dry. Very, very dry. The sky was deep blue. The trees looked ancient. And from somewhere nearby came the sound of hammering. Lots and lots of hammering. "Follow the noise?" said Moony. "That is always your worst idea," said Mav. They followed the noise.`,
      },
      {
        title: "That's a BIG Boat",
        text:  `The hammering was coming from the biggest boat anyone had ever seen. Four stories tall. As long as a football field. Being built in the middle of the DESERT. Mav stared for a very long time. "There's no ocean here," he said. "There will be," said a voice behind them.`,
      },
      {
        title: "Meet Noah",
        text:  `An old man walked toward them. Long white beard. Strong hands. Kind eyes. He had sawdust in his hair and a hammer the size of Moony. He knelt right down to their level. "I'm Noah," he said. "God told me you were coming." "God knew about US?" said Mav. "God knows about everyone," said Noah.`,
      },
      {
        title: "Why the Boat?",
        text:  `"So why are you building it?" asked Mav. Noah sat on a log. He looked serious. "Because a great flood is coming," he said. "Waters that will cover the whole earth." Mav blinked. "ALL of it?" "Every drop," said Noah. "But… WHY?" said Moony. Noah looked at them both. "Because the world is full of sin."`,
      },
      {
        title: "What Is Sin?",
        text:  `"What's sin?" asked Mav. Noah thought for a moment. "Sin is when people choose what THEY want instead of what GOD says is right. Lying. Stealing. Hurting others. Pretending God doesn't exist." "Oh," said Mav. He was quiet. "…Does eating someone else's food count?" Noah looked at him. "Yes. Exactly like that."`,
      },
      {
        title: "Why Judgment?",
        text:  `"But why can't God just ignore sin?" asked Moony. Noah picked up a piece of rotten wood. "If I leave rot in this boat," he said, "it spreads until the whole boat sinks. Sin is like rot. Left alone — it destroys everything and everyone." Mav sniffed the rotten wood. He sneezed so hard he fell over. "Okay," he said from the ground. "I understand now."`,
      },
      {
        title: "One Hundred Years?!",
        text:  `"How long have you been building?" asked Moony. "One hundred years," said Noah. Mav fell down. Just — fell right over. Every day for a hundred years, the neighbors had laughed at Noah. But Noah just kept building. Because when God speaks — you build the boat. No matter what anyone says.`,
      },
      {
        title: "The Mockers",
        text:  `A crowd stood nearby, pointing and laughing. "Still building, old man?!" "There's no rain coming! You're CRAZY!" Mav growled low. "Shouldn't someone warn them?" he said. "Noah did," said Moony quietly. "For a hundred years he warned them." "Did anyone listen?" Moony looked at the crowd. "No," he said. Mav went very quiet.`,
      },
      {
        title: "The Big Parade",
        text:  `Then the animals came. Two by two. From every direction. Lions. Elephants. Giraffes. Penguins. Beetles. Butterflies. Every creature God had made. Mav's jaw hit the ground. "ALL of these are getting on the boat?!" "Yes," said Noah. Mav looked at Moony. Moony looked at Mav. "…Can WE come?" they said at the same time.`,
      },
      {
        title: "All Aboard!",
        text:  `Noah looked at them for a long, quiet moment. Then he smiled wide. "God told me someone special was joining us," he said. "I believe He meant you two." Mav puffed up so big his collar dug in. "I KNEW it," he said. "He was talking about both of us," said Moony. "I KNOW THAT," said Mav.`,
      },
      {
        title: "One More Question",
        text:  `As they walked up the ramp, Mav had one more question. "Noah — if God is loving, why does He judge?" Noah stopped. He turned around. "Because He IS loving," he said. "A good father doesn't let his children destroy each other forever. He steps in. He makes things right. Judgment isn't the opposite of love. Sometimes — it IS love." Mav walked the rest of the way in silence.`,
      },
      {
        title: "Dark Clouds",
        text:  `When the last animal was aboard, the sky changed. In every direction — dark clouds. The air went heavy and still. Even the mockers went silent. Noah looked up, then looked back at his sons. No words were needed. "Is this it?" Mav whispered. Noah placed his hand gently on Mav's head. "This is it," he said.`,
      },
      {
        title: "It's Raining!",
        text:  `One drop hit Mav on the nose. He crossed his eyes looking at it. Then another. And another. Then the SKY OPENED. Thunder cracked like the earth splitting in two. Rain came down in walls of solid water. "INTO THE ARK!" Noah shouted. They ran.`,
      },
      {
        title: "God Closes the Door",
        text:  `Everyone was inside. The animals. Noah. His sons. His family. Mav. Moony. Then — the massive door began to close. No one pushed it. No one pulled it. God closed it Himself. Mav and Moony stood completely still. "Did you see that?" Mav whispered. "I saw it," said Moony. Neither of them moved for a long time.`,
      },
      {
        title: "Safe Inside",
        text:  `The ark lifted on the water and began to float. But inside — it was warm. Dry. Peaceful. Mav looked around at every creature. All safe. Because one man trusted God. "Noah," Mav said quietly, "were you ever scared?" Noah smiled. "Every single day," he said. "But scared just means you're trusting something bigger than yourself."`,
      },
      {
        title: "Forty Days",
        text:  `Rain for forty days. Forty nights. Exactly as God had said. The whole earth — covered. But inside the ark, every heart beat safely. Every paw. Every wing. Every fin. On Day Thirty-Nine, Mav asked one last question. "What if it doesn't stop?" Noah looked at him with steady eyes. "God said it would stop. That's enough."`,
      },
      {
        title: "The Rainbow",
        text:  `The rain stopped. The ark landed on solid ground with a mighty CREAK. Noah walked outside and knelt on fresh green earth. He gave thanks to God. Then — a rainbow. From one end of the sky to the other. Every color. All at once. "What does it mean?" Mav breathed. "It's God's promise," said Noah softly. "He will never forget us. Not ever."`,
      },
      {
        title: "See You Next Time",
        text:  `The golden light came back. Time to go home. Mav pressed his nose gently into Noah's open hand. Moony bowed his long little head. "Why did God let US come?" Mav asked. Noah leaned close. "Same reason He let me build the boat," he said. "Because He wanted to. And when God wants something done — it gets done."`,
      },
    ],
  },

  // ── Episode 4: The Great Camping Adventure (camping-adventure) ────────────
  "camping-adventure": {
    title:      "Mav, Moony & Goliath: The Great Camping Adventure",
    imageBase:  "/episode4/page-{n}.jpg",
    coverImage: "/ebook4-thumbnail.png",
    pages: [
      {
        title: "Camping Day!",
        text:  `It was the most beautiful summer morning you could imagine! Mav could not stop barking with excitement. "We're going CAMPING!" he woofed, spinning in happy circles.`,
      },
      {
        title: "Best Summer Ever",
        text:  `When they arrived, Mav's best friend Moony was already there — his little dachshund tail wagging like crazy. He had tied a welcome banner between two tall pine trees. It read: "BEST SUMMER EVER — STARTS HERE."`,
      },
      {
        title: "A New Friend Arrives",
        text:  `Then came a thundering... BOOM, BOOM, BOOM. The whole ground shook. Dishes rattled. A bird flew off a branch. Everyone looked up. And up. And UP. It was the biggest dog they had ever seen.`,
      },
      {
        title: "Meet Goliath!",
        text:  `"Hi! I'm Goliath!" the giant dog boomed, his tail wagging like a helicopter. Mav burst out laughing. "You sure are!" Moony tried to shake his enormous paw. He had to stand on his very tippy-toes just to reach it — his short dachshund legs stretched as far as they could go. Goliath grinned his biggest, goofiest grin. This was going to be the best camping trip EVER.`,
      },
      {
        title: "Should We... Explore?",
        text:  `After lunch — hot dogs for everyone, and three for Goliath — the families settled in for afternoon naps. "Should we explore?" Mav whispered, nodding toward the dark edge of the woods. Moony's eyes lit up. Goliath's tail began to wag. "Let's GO," he rumbled.`,
      },
      {
        title: "Chester the Squirrel",
        text:  `Deep in the woods they met their first new friend — a tiny red squirrel named Chester, busy stacking acorns into perfect rows. "In the summer?" laughed Moony. "I'm very organized," Chester said proudly, adjusting his tiny acorn tower.`,
      },
      {
        title: "The Hidden Pond",
        text:  `Deeper in the woods they found a hidden pond glittering between the trees. "I've always wanted to swim!" said Mav. Moony — with his very short dachshund legs — took one careful step in. The water was cold. VERY cold. "YIKES!" he yelped, leaping back onto dry ground.`,
      },
      {
        title: "SPLASH!!!",
        text:  `But Goliath didn't hesitate. He backed up, took a running start, and leaped. SPLASH! Water exploded everywhere. Chester — who had followed them — was completely soaked. Everyone was completely soaked. "GOLIATH!!" they yelled. Then they burst out laughing.`,
      },
      {
        title: "Deeper and Deeper...",
        text:  `They played until their fur was dry again — and most of Chester's acorns were recovered. Then Goliath spotted a butterfly. Then a frog. Then a rabbit! "This way!" he kept bounding forward. And the forest around them grew thicker... and quieter... and darker.`,
      },
      {
        title: "We're Lost!",
        text:  `Mav stopped walking. He looked left. He looked right. He turned in a full circle. Every single tree looked exactly the same. "Um... which way is camp?" he asked quietly. Moony's ears drooped all the way to the ground. Goliath sat down — and the ground shook. They were lost.`,
      },
      {
        title: "Going in Circles...",
        text:  `They tried going left. Dead end — thick brambles. They tried going right. Goliath got wedged between two trees. Mav pushed from behind. Moony pulled from the front, his little paws digging hard into the dirt. Chester pulled the tail. They tried going straight. MORE trees. "I think we're going in circles," Moony sighed.`,
      },
      {
        title: "Stars in the Dark",
        text:  `The sky turned pink, then orange, then deep purple. The first stars appeared. Crickets began their evening song. Fireflies blinked through the shadows. It was the most beautiful thing Mav had ever seen. And also the scariest.`,
      },
      {
        title: "Even Big Dogs Get Scared",
        text:  `"What if... no one finds us?" Goliath whispered. Everyone looked up in surprise. He was so very big. But sometimes even big dogs get scared. Moony walked over on his short legs and rested his long head on Goliath's enormous paw. "I'm scared too," he said softly. "But we're together."`,
      },
      {
        title: "Mav Has an Idea",
        text:  `Mav sat very still. He remembered something his grandma always said: "When you don't know what to do — talk to God. He always knows exactly where you are." Mav looked up at the stars through the branches. "I have an idea," he said softly.`,
      },
      {
        title: "Let's Pray",
        text:  `"Let's pray," said Mav. All four friends bowed their heads right there in the dark woods. "Dear God," Mav prayed, "we're lost and a little scared. But we know You always know where we are. Please help our families find us. Amen." "Amen," said Moony, Goliath, and Chester. And then they waited.`,
      },
      {
        title: "Those Are Our Families!",
        text:  `And then — "MAVERICK! MOONY! GOLIATH!" Flashlights blinked through the trees. Voices floated through the darkness. Goliath's huge head shot up. His tail began to wag. "Do you hear that?" Moony breathed. "THOSE ARE OUR FAMILIES!"`,
      },
      {
        title: "GOLIATH!!!",
        text:  `They ran toward the lights, barking their loudest, most joyful barks. There were their families — flashlights in hand, huge smiles on their faces. There was so much hugging. And happy tears. Goliath was SO excited that he accidentally knocked over two grown-ups like bowling pins. "GOLIATH!!" everyone laughed.`,
      },
      {
        title: "S'mores by the Fire",
        text:  `Back at camp, they all gathered around the warm crackling campfire. Someone gave Goliath one s'more. He ate it in one bite. So they gave him five more. Mav leaned on Moony. Moony leaned on Goliath. Chester sat on top of Goliath's great grey head, nibbling a tiny marshmallow. The stars were brilliant. The lake was still. The night was warm and perfect.`,
      },
      {
        title: "Same Time Next Summer?",
        text:  `"I wasn't scared," said Goliath. "Well... maybe a little." Mav smiled his big bullmastiff smile. "God always knows where we are — even in the darkest woods." Moony yawned and snuggled into Goliath's warm grey fur. "Same time next summer?" "DEFINITELY," said all three at once.`,
      },
    ],
  },

  // ── Episode 5: The Big Fish Adventure (big-fish-adventure) ───────────────
  "big-fish-adventure": {
    title:      "Mav & Moony: The Big Fish Adventure",
    imageBase:  "/episode5/page-{n}.jpg",
    coverImage: "/ebook5-titlecard.png",
    pages: [
      {
        title: "The Compass Glows",
        text:  `Mav and Moony were lounging on the back porch when the old brass compass on the shelf started glowing — deep gold, like a little sun had taken up residence inside it. Mav sat up so fast he knocked over his water bowl. "The compass! It's glowing AGAIN! Strap in, buddy!" "Can't we just once let it glow and then... not go?" said Moony. "ADVENTURE AWAITS!" Mav was already sprinting. Moony sighed and waddled after him at maximum dachshund speed.`,
      },
      {
        title: "The Whirlwind",
        text:  `WHOOOOSH! The compass spun like a top and the whole world folded up like a piece of paper. Blue, purple, gold — light streaked past as Mav and Moony tumbled through time. When the spinning stopped, they landed with a THUMP on a sandy dock beside a great blue sea. The wind smelled like fish and salt, and somewhere nearby — a man was running. "Why do people in these adventures ALWAYS run?" said Moony. "Can't we land somewhere with naps?"`,
      },
      {
        title: "Meeting Jonah",
        text:  `The running man skidded to a stop when he nearly tripped over Moony. He stared at the two animals. They stared back. "What... WHAT are you?" he gasped. "I'm Mav. That's Moony. We travel through time." "I have no time for talking animals. I'm going to Tarshish." "Wait — are you Jonah? The prophet Jonah?" The man froze. "...How do you know my name?"`,
      },
      {
        title: "The City of Nineveh",
        text:  `Mav explained that God had called Jonah to go to Nineveh and tell the people to turn from their wicked ways. Jonah went quiet. He kicked at a pebble. He looked at the ship. "Nineveh is the other direction, Jonah." "I... I know." "Is Nineveh the city where everyone is really mean and scary?" asked Moony. "The most powerful empire in the world," said Jonah. "And God wants ME to walk in and tell them they've been very, very bad." "Sounds like an adventure!" "It sounds like a DISASTER." "I'm with Jonah on this one," said Moony.`,
      },
      {
        title: "All Aboard (The Wrong Ship)",
        text:  `Jonah bought a ticket to Tarshish — the farthest port in the OPPOSITE direction from Nineveh. Mav and Moony scrambled up the gangplank behind him. The sailors gave them very strange looks but said nothing — because who argues with a time-traveling bullmastiff? "Jonah, are you SURE about this?" Mav whispered. "I'm sure about everything except going to Nineveh. Now please stop talking." Moony looked at the dark water below. "I do not like this boat."`,
      },
      {
        title: "The Storm Comes",
        text:  `The ship had barely left the harbor when the sky turned an ominous dark gray. Then the wind howled. Then the waves rose — taller than the mast. The sailors screamed and grabbed ropes. Mav braced himself on all four paws. Moony went airborne twice. "MAAAAAAV!" "I've got you!" Mav caught Moony's tail. "YOU GOT MY TAIL, not all of me!" The captain shouted: "Pray to your gods! Throw the cargo overboard!" Mav looked around frantically. "Where IS Jonah?"`,
      },
      {
        title: "Asleep in the Storm",
        text:  `They found Jonah in the bottom of the ship, fast asleep. Not pretend-asleep. DEEPLY, completely, totally asleep — while a monster storm tried to tear the ship apart above him. "How is he SLEEPING?!" the captain cried. "Okay, I kind of respect that," said Moony. "Jonah! JONAH! Wake up!" Jonah slowly sat up, eyes wide. "...Oh no. Oh no, no, no. This is my fault."`,
      },
      {
        title: "Jonah Confesses",
        text:  `The sailors cast lots — and the lot fell on Jonah. He stood up, took a deep breath, and told them the truth. He was a Hebrew. He worshipped the Lord God who made the sea and the dry land. And he was running away from God. "You told them the truth. That took courage," said Mav. "The storm is getting worse because of me. I can feel it." "Can we talk about solutions?" cried Moony. "The water is coming over the railing!"`,
      },
      {
        title: "Throw Me Overboard",
        text:  `Jonah looked at the sailors — good men who had done nothing wrong and were going to drown because of him. "Pick me up," he said, "and throw me into the sea." "JONAH, NO —" "It's the only way. The storm is because of me." "There HAS to be another option!" "The Lord is just. This is my choice." Mav's voice shook. "We'll find you. I don't know how, but we'll find you." Jonah smiled sadly. "God will not waste a stubborn old prophet. Not today."`,
      },
      {
        title: "Into the Deep",
        text:  `The sailors tried everything. They rowed with all their strength. But the sea only grew worse. Finally, with heavy hearts, they called out to God and threw Jonah into the churning sea. The moment Jonah hit the water... the storm stopped. Completely. Instantly. "The storm is gone," Mav whispered. "Mav... where is Jonah?" said Moony. The captain knelt in awe. "Surely the Lord is God..." "He's down there," said Mav. "But it's not over."`,
      },
      {
        title: "The Great Fish",
        text:  `Deep beneath the surface, where the light gave out and the dark went on forever, something enormous moved through the water. God had prepared a great fish — not to end Jonah's story, but to save it. The fish opened its mouth wide, and Jonah was swallowed whole. "Mav. Something big is under the water." "I know." "Something REALLY big." "I know, Moony." "Is Jonah going to be okay?" Mav looked up at the now-clear sky. "God didn't bring him this far to lose him. He never does."`,
      },
      {
        title: "Three Days in the Fish",
        text:  `Inside the belly of the great fish, Jonah did not panic. He did not give up. He prayed. For three days and three nights, in the darkness and the deep, Jonah called out to God. "From deep in the realm of the dead I called for help, and You listened." He did not argue or explain. He just cried out and trusted. "Salvation belongs to the Lord," he prayed. And God heard every word.`,
      },
      {
        title: "Spit Out!",
        text:  `On the third day — WHOOOMP! God commanded the fish, and the great fish swam to shore and spit Jonah out onto dry land. It was not graceful. It was not dignified. But Jonah was ALIVE, standing on solid ground in the morning sun. Mav came skidding to a sandy stop, tail wagging furiously. "THREE DAYS! We were so worried!" Jonah lay smiling in the sand. "I was talking to God." "For THREE DAYS?!" "I had a LOT to say. And even more to listen to."`,
      },
      {
        title: "The Second Call",
        text:  `God spoke to Jonah again. The same message. The same call. Go to Nineveh. This time, Jonah stood up, brushed the sand off his robes, and walked toward the east. No detour. No ticket to Tarshish. "I'm going to Nineveh." "Just like that?" "God gave me a second chance. I'm not wasting it." "What changed?" "I learned something in the dark. Running from God doesn't work. But His mercy? That does." Mav grinned. "Now THAT'S an adventure. Let's go."`,
      },
      {
        title: "Nineveh the Great",
        text:  `Nineveh was BIG. Not just big — enormous. It took three days just to walk across it. The streets were loud, crowded, and full of people who, to put it kindly, had not been making great choices. Jonah stood at the city gate, took one very deep breath, and walked in. "And Jonah has to talk to ALL of them?" said Moony. "Every single person." Moony whispered to Mav: "He got braver in the fish." "That's what prayer does."`,
      },
      {
        title: "The Message",
        text:  `Jonah walked into the heart of Nineveh and preached. His voice rang out over the markets and the rooftops. "Forty more days, and Nineveh will be overthrown!" People stopped. They stared. Something in his voice — or maybe something in his eyes, still full of deep-sea wonder — made them listen. "He's not from here. He smells like... fish?" Moony whispered to Mav: "He does still smell a little like fish." "Shh. They're listening."`,
      },
      {
        title: "A City Repents",
        text:  `Something extraordinary happened. The people of Nineveh believed God. They declared a fast. They put on rough sackcloth as a sign of mourning and humility. Even the king came down from his throne, set aside his royal robes, and sat in the dust. Mav watched in awe as thousands of people bowed their heads. "The whole city. The WHOLE city." "Jonah walked in here smelling like fish and turned around an entire empire." "God worked through a man who ran away, got swallowed by a fish, and came back anyway." "...That is the best story I have ever heard."`,
      },
      {
        title: "God's Mercy",
        text:  `God saw what the people of Nineveh did — how they truly turned from their evil ways — and He had compassion. He did not bring the destruction He had threatened. Every man, woman, and child in that great city was given a second chance. Just like Jonah had been given one. "God relented. He forgave them." "You sound surprised." "I'm not surprised. I KNEW He would. That's actually why I ran. I knew God was gracious, slow to anger, full of mercy." "And yet God loves them too." Jonah was silent a long time. "...Yes. He does."`,
      },
      {
        title: "The Lesson of the Vine",
        text:  `Jonah was still grumbling — so God grew a vine to shade him, and then let the vine wither. Jonah was furious. And God, with the patience of someone who loves even stubborn prophets, asked: If YOU cared about that vine you didn't plant... should I not care about 120,000 people in Nineveh? "You cared about the vine after one day. God has known the people of Nineveh their whole lives," said Moony. Jonah stared at the dead vine. "He loves them." "He loves everybody. Even the ones we think don't deserve it. Even us." "Even me," said Jonah, "when I was at the bottom of the sea." "Especially then."`,
      },
      {
        title: "Home Again",
        text:  `The compass glowed gold. Time to go. Mav and Moony stood with Jonah one last moment in the long afternoon shadows. They didn't say much. Some lessons are too big for words. But Moony put a tiny paw on Jonah's ankle, and Jonah put a hand on Mav's broad head, and they all understood. "We have to go now." "Thank you. For not letting me run alone." "You were never really alone. Even in the fish." Jonah smiled. "No. I wasn't. I know that now." The golden light swallowed them — and the adventure ended the way all the best ones do: with a new understanding of just how wide God's mercy really goes.`,
      },
    ],
  },

  // ── Episode 6: The Great American Road Trip (great-american-road-trip) ────
  "great-american-road-trip": {
    title:      "Mav & Moony: The Great American Road Trip",
    imageBase:  "/episode6/page-{n}.jpg",
    coverImage: "/FT-TGART-titlecard.png",
    pages: [
      {
        title: "The Big Announcement",
        text:  `It was a Saturday morning, and Dad had that look on his face — the one that meant something big was coming. He stood in the living room holding a rolled-up map the size of a small tablecloth and grinned so wide his ears nearly touched. "Family meeting! We're going on a ROAD TRIP. Texas! The Grand Canyon! California! Three weeks, one minivan, the whole family!" Mav immediately knocked his water bowl off the coffee table. Moony slowly opened one eye from his pillow. He had a bad feeling about this.`,
      },
      {
        title: "Packing the Car",
        text:  `Packing was an event. Dad tried to fit three suitcases, a cooler, two sleeping bags, a guitar, a boogie board, and a bag of dog food into the back of a minivan that was already full of optimism. Mav helpfully carried things to the car — mostly things that were not supposed to go, like a throw pillow and the TV remote. "I helped!" said Mav, dropping the remote at Dad's feet. Moony watched from the driveway with the calm dignity of a small dog who knew exactly what was going to happen to him. Ten minutes later, he was wedged between the cooler and a sleeping bag. "I called it."`,
      },
      {
        title: "Mile One — Texas or Bust",
        text:  `They pulled out of the driveway at 7 a.m. sharp, which actually meant 8:15 a.m. because Theo forgot his water bottle and then Dad forgot his sunglasses. But finally — FINALLY — the minivan rolled onto the open road. Mav had his head out the window, ears flapping like two flags. "How long until Texas?" asked Moony. "About six hours." "How long have we been driving?" "Four minutes." Moony paused. "I see."`,
      },
      {
        title: "Deep in the Heart of Texas",
        text:  `Texas was big. Really, really big. They drove for hours and it was still Texas. They stopped at a roadside BBQ stand called Big Earl's — a weathered red barn with smoke curling up into the afternoon sky. The smell hit them like a warm, delicious wall. Theo immediately declared it the best place he'd ever been. Mav stood outside with his nose raised in bliss. Moony tumbled out and stood tall. The owner waved from the porch: "Got a bone the size of your head, little fella!" Moony stood up straighter. "I rescind my earlier skepticism. Texas gets all the points."`,
      },
      {
        title: "Brisket the Longhorn",
        text:  `Behind Big Earl's BBQ, in a wide pasture that went on forever, stood the most impressive animal any of them had ever seen — a Texas Longhorn named Brisket. His horns stretched wider than Dad's arms could reach. He watched them with calm, ancient eyes. "Road trip, I take it? Where you headed?" "Grand Canyon. Then California." "Long road," said Brisket slowly. "You'll see things that scare you and things that take your breath away. Usually the same thing." "That is not reassuring," said Moony. "Wasn't meant to be. Best things rarely are."`,
      },
      {
        title: "The Flat Tire",
        text:  `They were deep in West Texas when it happened. WHUMP-WHUMP-WHUMP. The van lurched. Dad pulled over to a gravel shoulder where they sat looking at a completely flat rear tire. Around them: nothing. No gas station. No town. No signal. Just scrubby desert, hot wind, and a family standing around a flat tire trying not to panic. "Are we going to live here now?" asked Theo. "Theo, stop." Mav sat down firmly. "Let's think. Let's pray. Then let's fix the tire." "In that order?" said Moony. "Always in that order."`,
      },
      {
        title: "The Stranger on the Road",
        text:  `They prayed — right there on the side of the highway, heads bowed, Mav sitting with his eyes closed. And fifteen minutes later, a dusty pickup truck pulled off behind them. Out stepped an older woman named Rosa, who had a spare tire, a floor jack, and the practiced calm of someone who had fixed fifty flat tires. "Don't thank me. Thank the Lord for putting me on this road at this exact minute," she said with a wink. Mav looked at Moony. "See?" Moony was quiet. "...Yeah. I see."`,
      },
      {
        title: "Into New Mexico",
        text:  `Crossing into New Mexico felt like driving onto another planet. The landscape shifted from flat scrub to dramatic red rock formations that glowed like embers in the setting sun. Even Moony climbed halfway up onto the armrest to look out the window. "It looks like Mars," said Lily. "Is it beautiful?" said Mav, pressing his nose to the glass. "Look at those colors. Look at this place. God made ALL of this." Moony stared out, genuinely moved. "...It's actually really beautiful." "There it is," Mav smiled. "Don't make it weird," said Moony.`,
      },
      {
        title: "Meet Dusty the Roadrunner",
        text:  `At a rest stop in New Mexico, a streak of brown and white shot across the parking lot at impossible speed, looped around a trash can, skidded under their van, and then stopped and stared at them. A roadrunner. He introduced himself — extremely fast. "HeyHowyadoingNicevanWhereyouheadedGrandCanyonCoolI can show you a shortcut wanna see it it's GREAT —" Mav told him to slow down. "CAN'T. Literally. Physiologically incapable." Moony looked at Mav: "He exhausts me and I've known him forty seconds." "I like him," said Mav.`,
      },
      {
        title: "Lost (A Little Bit)",
        text:  `Dusty's shortcut turned out to be a scenic tour of every dirt road in northern Arizona. The GPS gave up somewhere around mile thirty. They were in the middle of absolutely nowhere, the sun was getting low, and everyone was hungry. Theo had asked 'are we there yet' eleven times. Moony had counted. "We're fine. We're just... finding our way," said Dad. "Steven, we're lost." "We're adventurously misplaced." Mav stayed calm. "Let's stop. Let's breathe. We know where we're going. We just don't know exactly how." "Is that wisdom or are you just hungry?" said Moony. "Both. But mostly wisdom."`,
      },
      {
        title: "The Prayer on the Dirt Road",
        text:  `Dad turned off the engine. The desert went quiet — a big, wide, surprisingly peaceful quiet. Dad suggested they pray. "Lord, we don't know the way. But You do. Guide us. Keep us safe. We trust You." Two minutes after they said amen, Lily spotted a small green highway sign half-hidden by a bush: GRAND CANYON SOUTH RIM — 22 MILES. Theo stared. "...Okay that was fast." Mav grinned. "He always knows where we are." Moony admitted: "I've never been so happy to see a road sign in my life."`,
      },
      {
        title: "First Sight of the Grand Canyon",
        text:  `Nothing prepares you for the Grand Canyon. You walk up to the rim and then suddenly — it's THERE. A mile deep and ten miles wide and so impossibly big that your brain takes a moment to agree that it's real. The family stood at the rim in a row, completely silent. Even Theo didn't say anything for a full forty-five seconds. Mav sat down slowly, looking out at the layers of red and orange and purple rock descending into the blue haze below. His tail wasn't even wagging. He was just... still. "God made all of this," he said quietly. "Every layer. Every color. Millions of years of 'I love you.'"`,
      },
      {
        title: "Moony and the Rim",
        text:  `The next morning they hiked the rim trail — gorgeous and terrifying in places because the path got very close to a drop that went down approximately forever. Everyone was told to stay back from the edge. Moony, being exactly the height of a small rock, decided to investigate a gap in the barrier. "MOONY —" Mav grabbed Moony's tail. "NOPE." "I HAD IT." "You had NOTHING. You were about to become a dachshund canyon." "I was LEANING. There's a difference between leaning and falling." "We are telling this story forever," said Lily.`,
      },
      {
        title: "Canyon the Condor",
        text:  `The shadow came first — enormous, sliding over the trail. Then the California condor landed on a rock twenty feet away and folded its wings with the dignified care of someone setting down something expensive. The biggest bird any of them had ever seen. "Good morning," it said in a gravelly, unhurried voice. "Most people run." Mav looked up honestly. "You're magnificent." The condor tilted his bald head. "I've spent a lot of years being misunderstood." Moony surprised himself by speaking up. "You scared us. But I don't think you mean to." The condor said quietly: "A lot of God's creatures have been misunderstood."`,
      },
      {
        title: "Canyon's Secret",
        text:  `Canyon had been born with feathers slightly different from the others in his flock, and he'd spent years keeping to himself. But one day a storm came — a big one — and Canyon spread his wings and rose on the wind instead of fighting it. That was the day he learned that what made him different was exactly what made him soar. "Isaiah 40:31 — 'they will soar on wings like eagles.' I'm not an eagle. But the same God made me. Same wind carries me." Mav whispered: "Same God. Same wind." Moony looked at his own stubby legs, thoughtfully.`,
      },
      {
        title: "Stargazing at the Canyon",
        text:  `That night they set up camp just outside the park. No city lights for a hundred miles. When the sun went down, the stars came out — not a few stars, but a whole universe of them, wall to wall across the sky. Theo sat down hard in the grass because his legs stopped working from the beauty of it. Mav lay on his back in the dirt, paws in the air, staring straight up. "He made every one of those. Named them all," said Dad. "And He knows us too. By name. Every one of us," said Mav. Moony stared up quietly: "That's the part I can never fully understand." "Me neither," said Mav. "But I believe it." "Yeah. Me too."`,
      },
      {
        title: "The Long Drive Through Nevada",
        text:  `Nevada, it turns out, is a very long state. And hot. And flat. For three hundred miles it was essentially a frying pan with a road painted on it. The general mood could be described as 'alive, but only technically.' Theo had invented a game called 'Count the Identical Shrubs' and was currently at 847. Mav tried: "I SPY something brown!" Everyone looked out at brown desert in every direction. "Is it the desert?" "...Yes." Moony lay flat in the back, the picture of despair. "We're in the Void."`,
      },
      {
        title: "Meet Neon the Jackrabbit",
        text:  `They stopped at a lonely rest area when Mav noticed a jackrabbit behind the trash cans — enormous ears, a slightly bewildered expression, sitting completely alone in the shade, spinning a bottle cap in circles with his paw. "Hey. You okay?" "What? Yeah. Totally. Just hanging out. In this parking lot. By myself. In the desert." "You're lost," said Moony. "I'm not LOST, I'm just... directionally uncertain." "That's lost." The jackrabbit's ears drooped slightly. "...A little bit lost." "Then we'll help you find your family," said Mav.`,
      },
      {
        title: "Finding Neon's Family",
        text:  `Neon the jackrabbit hopped into the minivan — briefly causing a crisis when Theo screamed — and they drove slowly along the desert road, Neon's huge ears rotating like radar dishes. At mile marker 14, they heard it: three jackrabbits yelling their brother's name across a flat stretch of desert. Neon leaped out and then stopped. "Why did you help me? You didn't have to stop." "Every creature matters. You matter. God put us on that road at the right time." Neon looked at Mav for a long moment. "...Thank you. Really." And he sprinted across the desert toward home.`,
      },
      {
        title: "Lights of Las Vegas",
        text:  `They weren't stopping in Las Vegas — just passing through — but the highway went right past the Strip, and at dusk the lights came on all at once. Enormous hotels. Cascading LED signs. Colors in every direction. Moony looked at it and immediately stared at the floor. "How do people live here?" "Noise isn't the same as joy," said Mav. "Bright isn't the same as beautiful." "That's deep for a dog looking at a casino." "I had a moment." Mom smiled. "I think Mav's right."`,
      },
      {
        title: "Crossing into California",
        text:  `The mountains appeared gradually — first as shapes on the horizon, then as real walls of stone rising up to meet the highway. Crossing into California through the Cajon Pass, cool mountain air rushed in and pine trees appeared for the first time in days. Everybody sat up straighter. Mav's nose went crazy with new smells. "Pine trees. Cool air. Mountains. Do you SMELL that, Moony?" Moony's nose twitched, then slowly he smiled. "...I do." "We're almost there." "We're almost there."`,
      },
      {
        title: "The Pacific Ocean",
        text:  `Nobody was ready. You can know the ocean is big and still not be ready for the moment you come over a hill on the Pacific Coast Highway and there it is: infinite blue, horizon to horizon, the sun making a road of light straight across the water toward you. Doors flew open. Shoes came off before feet hit the pavement. Theo ran so hard toward the water that he fell twice and didn't stop. Mav stood at the water's edge, waves washing over his big paws, eyes wide with wonder. "Look at all of it. Look at what God made." Moony stood in the dry sand staring out. "Bigger than any problem we've ever had."`,
      },
      {
        title: "Moony and the Wave",
        text:  `Moony was having a perfectly dignified time observing the ocean from the dry sand when a rogue wave — bigger than the others, sneaky — got him. The wave won. When it receded, Moony was sitting in an inch of water looking like a very small, very soggy, very undignified dog. He turned slowly to look at Mav. "The water was RUDE." "You look like a tiny wet mop, buddy." "Thank you, Mav. Very helpful." Lily was doubled over laughing. "MOONY! You're SOAKED!" "I shall not be commenting further," said Moony with enormous dignity.`,
      },
      {
        title: "Meet Paloma the Sea Lion",
        text:  `A sea lion hauled herself up onto the beach near their towels late in the afternoon — big, glossy, brown, with whiskers like a distinguished professor. She introduced herself as Paloma and looked at the family with calm, intelligent eyes. "Long trip?" "Three weeks. Texas to here." "You look like people who needed the ocean." "The ocean has a way of making everything feel the right size again. Your problems feel big? Come to the ocean. See how big the ocean is. See how small the problems are." Theo raised his hand. "What if the ocean is the problem?" Paloma looked at him patiently. "That's just waves being waves."`,
      },
      {
        title: "Paloma's Lesson",
        text:  `Paloma had been swimming since before sunrise — fifty miles out and back, riding currents, diving deep. But every afternoon she came to this same beach and just rested. "Be still, and know that I am God," she said, quoting Psalm 46:10 like it was the most natural thing in the world. "The rest is part of the work. God rested on the seventh day — not because He was tired, but to show us how." Moony slowly lay down on the warm sand. "...I've been fighting rest this whole trip." "Most do. Until they stop fighting." And Moony closed his eyes in the warm afternoon sun.`,
      },
      {
        title: "The Beach Bonfire",
        text:  `That evening Dad built a fire in a beach fire ring while the sky turned pink and orange and the stars began to appear over the water. They cooked hot dogs on sticks and sat around the fire talking about the trip. Brisket. Dusty. Canyon. Neon. Paloma. Rosa. Each one had given them something. A word. A lesson. A new way of seeing. The fire crackled. The waves rolled. Theo said from inside the firelight: "Best trip ever." And everyone said it together. "Best trip ever."`,
      },
      {
        title: "The Long Road Home",
        text:  `Leaving California felt different from leaving home. Quieter. Fuller. Like a backpack packed with everything they'd learned. They got back on the highway heading east, the ocean shrinking in the rearview mirror. Theo, who had been counting shrubs just a few days ago, was now writing things down in a small notebook. Mav noticed. He didn't say anything. He just smiled. "What are you writing?" "Stuff. Things people said. Things I want to remember. 'Every person matters to God.' Brisket: don't be scared of the hard road. Canyon: what makes you different makes you fly. Neon: I want to be the person who stops." "You just summed up the whole trip."`,
      },
      {
        title: "What Mav Learned",
        text:  `Miles rolled by. States came and went. And Mav thought about everything — all the animals, all the moments, all the people like Rosa who showed up exactly when they were needed. Every single one of them was different. Different sizes, different shapes, different ways of living. But all made by the same hands. "Do you know what's been in every single state we drove through?" Mav asked Moony. "Bad GPS signal?" "God." Moony opened one eye. "Different places. Different faces. But the same love everywhere — waiting in every rest stop and every parking lot with a lost jackrabbit." "He's hard to miss once you start looking," said Moony.`,
      },
      {
        title: "Almost Home",
        text:  `The familiar exit ramp. The familiar neighborhood streets. The familiar smell of home. Theo fell asleep twenty minutes from the house — his notebook still open on his lap. Dad carried him inside. Mom stood in the driveway for a moment just breathing. Mav and Moony stood in the grass side by side, taking it in. "We're home." "I missed this pillow. Genuinely." "I know you did." "I'm not saying the trip wasn't worth it. It was. Every mile." "But this pillow didn't come up once. And I think that's God's design too." Mav laughed. "He made you a homebody, Moony." "He made me a homebody who goes on adventures. There's a difference."`,
      },
      {
        title: "The Note on the Pillow",
        text:  `Mav found it the next morning on Moony's pillow — a small folded piece of paper that Theo had clearly torn from his notebook and placed there during the night. Mav read it, then smiled so wide his whole face crinkled. He left it where Theo had put it, so Moony would find it when he woke up. It said: "Every person matters to God. Even dogs. — Theo." Moony called out: "MAV!" "Yeah?" "Theo left me a note." "What's it say?" Moony read it again slowly. Then he set it back down very carefully. And for a long time, he didn't say anything at all.`,
      },
    ],
  },

  // ── Episode 7: Miracle at the Tomb (miracle-at-the-tomb) ─────────────────
  "miracle-at-the-tomb": {
    title:      "Mav, Moony & the Miracle at the Tomb",
    imageBase:  "/episode7/page-{n}.jpg",
    coverImage: "/Episode7-titlecard.png",
    pages: [
      {
        title: "The Time Portal",
        text:  `Mav was chewing on a stick in the backyard. Moony was balanced on the fence, watching a butterfly. Then — a shimmer. A hum. A swirl of golden light that spun up from the ground like a tiny tornado. The time portal. Mav dropped his stick. Moony jumped off the fence. "Here we go again," Moony said. "YES!" barked Mav — and he leaped straight in.`,
      },
      {
        title: "Ancient Judea",
        text:  `They tumbled out onto a dry, dusty road lined with olive trees. The sky above was a deep blue. Rocky golden hills stretched in every direction. In the distance, the white walls of a city shone in the sun. A group of men in robes were walking ahead, speaking in hushed, worried voices.`,
      },
      {
        title: "Sad News",
        text:  `"Lazarus is dead," one man said, shaking his head. "He was our friend." "Four days. He has been in the tomb four days now." Mav and Moony hid low in the grass nearby, listening carefully.`,
      },
      {
        title: "Jesus",
        text:  `He walked at the center of the group, calm and unhurried. The other men were worried. But He was steady — the way a mountain is steady when the wind blows. Jesus said: "Our friend Lazarus sleepeth. But I go, that I may awake him out of sleep."`,
      },
      {
        title: "The Journey Begins",
        text:  `"Let us go to him," Jesus said simply. Moony tugged on Mav's ear. "Are we going too?" Mav took one look at Jesus, already walking down the road. "We're going," Mav said. And they followed.`,
      },
      {
        title: "The Road to Bethany",
        text:  `"Jesus doesn't seem worried," Mav whispered. "No," Moony said. "He seems like He already knows how the story ends." Is that what faith is? The village of Bethany appeared ahead — a small cluster of flat-roofed homes tucked into the hills.`,
      },
      {
        title: "Martha Comes Running",
        text:  `A woman came running down the road toward them. Her eyes were red from crying. But when she saw Jesus, hope and heartbreak lit up in her at once. "Lord, if thou hadst been here, my brother had not died. But I know that even now, whatsoever thou wilt ask of God, God will give it thee."`,
      },
      {
        title: "I AM the Resurrection",
        text:  `Jesus said: "I am the resurrection, and the life. He that believeth in me, though he were dead, yet shall he live. Believest thou this?" Martha looked back at Him — and through her tears, she said yes.`,
      },
      {
        title: "Mary Weeps",
        text:  `Mary fell at Jesus' feet, weeping. "Lord, if thou hadst been here, my brother had not died." A crowd of mourners followed and wept too. The whole hillside filled with grief. Mav had seen sadness before. But not like this.`,
      },
      {
        title: "Jesus Wept",
        text:  `Jesus felt the weight of their grief. His eyes filled with tears. Jesus wept. "Look how he loved him," someone said softly. Moony whispered, "He's... crying." Mav said quietly, "Yeah. He is."`,
      },
      {
        title: "The Tomb",
        text:  `There it was — a cave carved into the rock, sealed shut by a massive round stone. Heavy. Final. Cold. Moony pressed against Mav's side. "Mav... what is He going to do?" "I don't know," Mav said. "But I think we're about to find out."`,
      },
      {
        title: "Roll Away the Stone",
        text:  `"Take ye away the stone," Jesus said. Martha stepped forward. "Lord, by this time he stinketh: for he hath been dead four days." Jesus said: "Said I not unto thee, that, if thou wouldest believe, thou shouldest see the glory of God?" And the men moved toward the stone.`,
      },
      {
        title: "Jesus Prays",
        text:  `The stone rolled. The tomb entrance yawned open. The crowd went completely silent. Jesus lifted His face to the sky. "Father, I thank thee that thou hast heard me." He was praying for the crowd — for Martha, for Mary, for everyone who would ever need to believe.`,
      },
      {
        title: "The Loudest Voice",
        text:  `Jesus turned toward the tomb. He planted His feet. He pulled in a breath. And in a voice that seemed to fill the entire valley: "LAZARUS — COME FORTH!" The words rang off the rocky hillside. It was not desperation. It was a command.`,
      },
      {
        title: "He Comes Out",
        text:  `From the darkness, a figure appeared — wrapped head to toe in white linen, moving in small careful steps toward the light. Lazarus. The crowd erupted. Mav let out a bark so loud that three disciples jumped. Moony stood completely frozen, mouth open.`,
      },
      {
        title: "Loose Him and Let Him Go",
        text:  `"Loose him," Jesus said, smiling. "And let him go." Lazarus stood blinking in the bright sun — confused and alive and perfectly whole. Martha and Mary threw their arms around their brother, laughing and crying at the same time. Many fell to their knees and believed right there on that hillside.`,
      },
      {
        title: "Mav Couldn't Stop Wagging",
        text:  `Mav's tail had not stopped moving for five full minutes. He ran in a circle. He barked at the sky. He jumped on Moony's shoulders — which Moony did not appreciate at all. Even Moony — calm, cool Moony — had tears streaming down his face. They had never seen death reversed. They knew they would never forget it.`,
      },
      {
        title: "Only Believe",
        text:  `Jesus stood beside them, looking down at them with a warm smile. "You were afraid," He said. Mav admitted: "Yes. When I saw the tomb, I thought it was over." Jesus said: "Fear looks at what is seen. Faith looks at what is promised. The glory of God is found in the believing — before the stone is rolled away."`,
      },
      {
        title: "Nothing Is Too Hard",
        text:  `Moony asked: "But what about the people who don't see a miracle?" Jesus said: "I wept with them too. I entered their grief." He placed a hand gently on Moony's head. "There are miracles you will see and miracles you will not see yet. But in both: I am with you. Trust Me. Even before the stone moves."`,
      },
      {
        title: "Back Home — Changed",
        text:  `The golden portal hummed open. Mav looked back at Bethany one more time — at Lazarus standing in the sunlight with his family. Then he looked at Jesus. Jesus raised His hand. A simple goodbye. They stepped through. Back in the backyard. Same fence. Same butterfly. Same afternoon. But something inside them had shifted. Nothing is too hard for God. If you believe — you will see the glory of God.`,
      },
    ],
  },

  // ── Episode 8: Giant Storm (giant-storm) ──────────────────────────────────
  "giant-storm": {
    title:      "Mav and Moony and the Giant Storm",
    imageBase:  "/episode8/page-{n}.jpg",
    coverImage: "/Episode8-cover.png",
    pages: [
      {
        title: "A Perfect Morning",
        text:  `Mav stretched his big tan paws and took a deep sniff of the morning air.
"Today feels like an adventure day," he said with a rumbling happy bark.
Across the yard, his best friend Moony was already spinning in excited circles.
"Adventure! Adventure!" squeaked the little dapple dachshund.`,
      },
      {
        title: "The Plan",
        text:  `"Let's go to Lake Shimmer!" said Mav, his big brown eyes sparkling.
"We can paddle out on the old rowboat and explore!"
Moony's long floppy ears perked straight up. He was only thirteen pounds, but his excitement was a hundred times bigger.
"Yes! YES! Let's GO!" he yipped, bouncing off all four tiny paws at once.`,
      },
      {
        title: "Off They Go!",
        text:  `The two friends trotted down a winding path through a sunny meadow.
Mav's heavy paws thudded steadily with every step, while Moony's short little legs moved like a tiny blur beside him.
Butterflies danced around them. Birds sang from the treetops. A rabbit paused to watch them pass.
It was the kind of morning that made you feel like anything was possible.`,
      },
      {
        title: "Lake Shimmer",
        text:  `"Oh!" gasped Moony when they arrived.
Lake Shimmer sparkled like a million diamonds in the morning sun. A little wooden rowboat bobbed gently at the end of an old mossy dock.
"It's beautiful," whispered Mav.
Even a big, tough Bullmastiff can appreciate a beautiful lake.`,
      },
      {
        title: "All Aboard!",
        text:  `Getting into the boat was an adventure all its own.
When Mav stepped in, the whole boat tipped and swayed. "WOAH!" he cried, arms flailing.
The entire lake seemed to take notice.
Moony leaped in easily and sat up proudly at the front of the boat. He tilted his little chin up. "Ready," he announced, like a very small and very serious captain.`,
      },
      {
        title: "Smooth Sailing",
        text:  `Mav rowed while Moony called out directions.
"Left! Now right! Straight ahead — there's a dragonfly!"
The oars splashed happily as they glided across the glittering water. Fish leaped in shining arcs. The sun warmed their fur.
This was the best day ever — or at least, it sure felt that way.`,
      },
      {
        title: "A Shadow in the Sky",
        text:  `Moony was busy making faces at a frog when Mav looked up.
"Hmm," he said quietly.
Far away, past the pine trees on the far shore, the sky was changing. Tall gray clouds were piling up — dark as smoke, wide as mountains.
"Moony," said Mav carefully, "do you see those clouds?"`,
      },
      {
        title: "The Wind Picks Up",
        text:  `Before they could even turn the boat around, the wind arrived.
It swept across the lake in one great WHOOOOSH, sending ripples racing toward them.
Moony's long floppy ears flew straight out behind him like furry flags.
"Whoa!" he squeaked.
The little boat began to rock.`,
      },
      {
        title: "Thunder Rumbles",
        text:  `BOOOOM!
Thunder shook the whole sky.
Moony dove under Mav's big front leg and peered out with one tiny eye.
"Was that... what I think it was?" he squeaked.
Mav swallowed hard. The clouds had swallowed the sun. The lake had turned gray. The boat rocked harder and harder.`,
      },
      {
        title: "The Storm Arrives",
        text:  `Then came the rain — not gentle raindrops, but great roaring sheets of water pounding down all around them.
Lightning cracked! Thunder roared!
The little wooden boat tossed and turned on waves that had grown as tall as Mav's ears.
"Hold on, Moony!" Mav barked over the noise of the storm.`,
      },
      {
        title: "Moony is Scared",
        text:  `"MAV!" cried Moony over the roaring wind. "I'M SCARED!"
The little dachshund was shaking from his wet nose all the way to the tip of his tail.
He had never seen waves this big. He had never heard thunder this loud.
He was only thirteen pounds, and the storm felt like it was a million pounds.`,
      },
      {
        title: "Mav is Scared Too",
        text:  `Mav looked at the waves. Then he looked at his tiny, shaking best friend. Then he looked at the waves again.
His big heart was pounding fast. He was scared too — and he knew it was okay to say so.
Big dogs get scared too.
But then something floated up from deep in his memory — something his grandpa had told him long, long ago.`,
      },
      {
        title: "The Story Mav Remembered",
        text:  `"Once," Mav said loudly over the wind, "some friends were in a boat on a stormy lake — just like us."
"The waves were crashing and they were terrified. But someone was in that boat with them. Someone who wasn't afraid of the storm at all."
Moony stopped trembling for just a moment.
"Who?" he whispered.`,
      },
      {
        title: "Be Still!",
        text:  `"Jesus stood up in that little boat," said Mav, his voice strong and steady even in the pounding rain.
"And He spoke to the wind. And He spoke to the waves. And He said — BE STILL."
"And do you know what happened, Moony?"
Moony shook his tiny wet head.
"They stopped," said Mav quietly. "Just like that. They stopped."`,
      },
      {
        title: "Let's Pray",
        text:  `"Mav," Moony said quietly. "Do you think... He's still here? In our boat? Right now?"
Mav smiled. A big, warm, certain Bullmastiff smile.
"I know He is," he said gently.
"Want to talk to Him?"
Moony sat up as straight as a thirteen-pound dachshund possibly could.
"Yes," he said. "Let's pray."`,
      },
      {
        title: "The Prayer",
        text:  `"God," said Mav, eyes closed tight, one huge paw resting gently on Moony's tiny back,
"we're pretty scared right now. But we know You're here with us. We trust You. Please help us be brave."
Moony opened one tiny eye, then closed it again.
"And please calm the storm," he added. "If that's okay."`,
      },
      {
        title: "Something Changes",
        text:  `Something happened.
It started small — just a tiny patch of pale blue sky between two clouds.
The rain came softer. The waves rocked gentler. The thunder grew quieter.
Moony opened one eye. Then both eyes.
"Mav..." he whispered. "Is the wind... is it slowing down?"`,
      },
      {
        title: "The Storm Breaks",
        text:  `Then, like a curtain being pulled back, the clouds parted.
The rain stopped. The wind became a whisper. The waves melted into gentle ripples.
And there — stretching from one side of the lake to the other — was the most magnificent rainbow either of them had ever seen.`,
      },
      {
        title: "Safe on Shore",
        text:  `Mav rowed them gently back to shore.
When the boat bumped softly against the dock, Moony leaped out and did three magnificent spins in a row.
"WE'RE OKAY!" he shouted. "WE'RE OKAY AND THERE'S A RAINBOW!"
Mav pulled him into the biggest, warmest Bullmastiff hug in the history of hugs, and laughed a deep rumbling laugh that shook his whole enormous body.`,
      },
      {
        title: "What We Learned",
        text:  `That night, curled up together under a warm patchwork blanket, Mav and Moony watched the stars come out one by one.
"Mav?" said Moony sleepily.
"Mm?" said Mav.
"I'm not scared of storms anymore," said Moony.
Mav smiled and pulled him a little closer.
"That's because now you know Who's in the boat with you," he said softly.
And Moony closed his eyes, smiled the tiniest smile, and drifted off to sleep.`,
      },
    ],
  },
};

/** Returns the page image URL for a given book + 1-based page number */
export function getPageImageUrl(book: BookNarration, pageIndex: number): string {
  return book.imageBase.replace("{n}", String(pageIndex));
}
