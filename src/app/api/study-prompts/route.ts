import { NextRequest, NextResponse } from "next/server";

type StudyPrompt = {
  id: string;
  title: string;
  prompt: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      placeName,
      era,
      description,
      ancientDescription,
      biblicalSignificance,
      verseReference,
      verseText,
    } = body ?? {};

    if (!placeName || !verseReference || !verseText) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment." },
        { status: 500 }
      );
    }

    const prompt = `
You are helping build a Bible study app called Scripture Lives.

Generate exactly 4 thoughtful study prompts in JSON format for a selected biblical place.

Return ONLY valid JSON in this shape:
{
  "prompts": [
    { "id": "string", "title": "string", "prompt": "string" }
  ]
}

Requirements:
- Each prompt should be practical, readable, and spiritually thoughtful.
- Make them distinct from each other.
- Focus on historical context, biblical theology, reflection, and teaching/application.
- Do not include markdown.
- Keep each title short.
- Keep each prompt between 1 and 3 sentences.

Selected place context:
Place: ${placeName}
Era: ${era ?? ""}
Description: ${description ?? ""}
Ancient Description: ${ancientDescription ?? ""}
Biblical Significance: ${biblicalSignificance ?? ""}
Verse Reference: ${verseReference}
Verse Text: ${verseText}
`.trim();

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: prompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `OpenAI request failed: ${errorText}` },
        { status: 500 }
      );
    }

    const data = await response.json();

    const text =
      data.output_text ||
      data.output?.map((item: any) => item?.content?.map((c: any) => c?.text).join("")).join("") ||
      "";

    if (!text) {
      return NextResponse.json(
        { error: "No text returned from model." },
        { status: 500 }
      );
    }

    let parsed: { prompts: StudyPrompt[] };

    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Model returned non-JSON output.", raw: text },
        { status: 500 }
      );
    }

    if (!parsed.prompts || !Array.isArray(parsed.prompts)) {
      return NextResponse.json(
        { error: "Model returned invalid prompt structure.", raw: parsed },
        { status: 500 }
      );
    }

    return NextResponse.json({ prompts: parsed.prompts });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}