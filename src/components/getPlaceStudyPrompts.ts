import type { VersePlace } from "@/data/verses";

export type StudyPrompt = {
  id: string;
  title: string;
  prompt: string;
  /** Additional question variations users can cycle through */
  variants?: string[];
};

export default function getPlaceStudyPrompts(
  place: VersePlace,
  verseReference?: string
): StudyPrompt[] {
  const ref = verseReference ?? "this passage";
  const name = place.name;

  return [
    {
      id: "historical",
      title: "Historical Lens",
      prompt: `What does ${name} reveal about the historical setting of ${ref}? How might geography, politics, worship, trade, or daily life shape how this place is understood?`,
      variants: [
        `What was daily life like in ${name} during the time of ${ref}? How might the culture, economy, or political climate have influenced the people and events described?`,
        `How did the geography of ${name} — its terrain, climate, or position along trade routes — play a role in the events of ${ref}?`,
        `What was happening in the broader ancient world at the time ${name} appears in ${ref}? How might surrounding empires, conflicts, or alliances provide context?`,
      ],
    },
    {
      id: "biblical-significance",
      title: "Biblical Significance",
      prompt: `Why is ${name} important in the broader biblical story? How does this place connect to covenant, prophecy, kingship, worship, mission, or redemption?`,
      variants: [
        `Does ${name} appear elsewhere in Scripture? If so, how do those other appearances add depth or meaning to what is happening in ${ref}?`,
        `What promises, warnings, or turning points in the biblical story are tied to ${name}? How does ${ref} fit into that larger arc?`,
        `How does ${name} function as a symbol or theme across Scripture — does it represent judgment, hope, encounter with God, or something else?`,
      ],
    },
    {
      id: "theological",
      title: "Theological Reflection",
      prompt: `What does the mention of ${name} teach about God's purposes in history? What themes stand out here — presence, promise, judgment, mercy, calling, or fulfillment?`,
      variants: [
        `How does God's character — his faithfulness, holiness, or compassion — show up in what happens at ${name} in ${ref}?`,
        `What does ${name} reveal about the relationship between place and divine encounter? Is there a pattern of God showing up in specific locations throughout Scripture?`,
        `If ${name} is a backdrop to ${ref}, what theological tension does it create — and how is that tension resolved or left open?`,
      ],
    },
    {
      id: "personal",
      title: "Personal Reflection",
      prompt: `As you reflect on ${name}, what stands out most to you personally? Is there a challenge, encouragement, warning, or invitation in this place's role within Scripture?`,
      variants: [
        `Is there a moment in your own life that resembles what the people in ${name} experienced in ${ref}? What did you learn or what are you still learning?`,
        `What emotion does ${name} stir in you as you read ${ref} — awe, grief, hope, conviction? Why do you think that is?`,
        `If God were speaking to you through ${name} today, what do you think He might be saying? What is one specific way you could respond?`,
      ],
    },
    {
      id: "teaching",
      title: "Teaching / Discussion",
      prompt: `If you were leading a Bible study on ${name}, what 2–3 questions would help others see why this place matters in ${ref}?`,
      variants: [
        `How would you explain the significance of ${name} to someone reading the Bible for the first time? What background would they need to appreciate ${ref}?`,
        `What misconceptions or assumptions might a modern reader bring to ${name}? How could a group discussion help correct or deepen their understanding?`,
        `What creative activity, map exercise, or visual aid might help a group connect with the real-world setting of ${name} in ${ref}?`,
      ],
    },
  ];
}
