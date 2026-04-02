import type { VersePlace } from "@/data/verses";

export type StudyPrompt = {
  id: string;
  title: string;
  prompt: string;
};

export default function getPlaceStudyPrompts(
  place: VersePlace,
  verseReference?: string
): StudyPrompt[] {
  return [
    {
      id: "historical",
      title: "Historical Lens",
      prompt: `What does ${place.name} reveal about the historical setting of ${verseReference ?? "this passage"}? How might geography, politics, worship, trade, or daily life shape how this place is understood?`,
    },
    {
      id: "biblical-significance",
      title: "Biblical Significance",
      prompt: `Why is ${place.name} important in the broader biblical story? How does this place connect to covenant, prophecy, kingship, worship, mission, or redemption?`,
    },
    {
      id: "theological",
      title: "Theological Reflection",
      prompt: `What does the mention of ${place.name} teach about God's purposes in history? What themes stand out here—presence, promise, judgment, mercy, calling, or fulfillment?`,
    },
    {
      id: "personal",
      title: "Personal Reflection",
      prompt: `As you reflect on ${place.name}, what stands out most to you personally? Is there a challenge, encouragement, warning, or invitation in this place's role within scripture?`,
    },
    {
      id: "teaching",
      title: "Teaching / Discussion",
      prompt: `If you were leading a Bible study on ${place.name}, what 2-3 questions would help others see why this place matters in ${verseReference ?? "this text"}?`,
    },
  ];
}