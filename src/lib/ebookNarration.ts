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
