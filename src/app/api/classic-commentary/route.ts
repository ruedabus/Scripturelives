/**
 * POST /api/classic-commentary
 * Returns AI-interpreted commentary for a passage in the voice/theology
 * of a chosen classic teacher, drawn from their public-domain writings.
 *
 * Body: { passage: string, teacher: string, lang?: "en" | "es" }
 */
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const MAX_PASSAGE = 80;

export type ClassicTeacher = {
  id: string;
  name: string;
  years: string;
  tradition: string;
  source: string;
  sourceUrl: string;
  color: string;
};

export const CLASSIC_TEACHERS: ClassicTeacher[] = [
  {
    id: "matthew_henry",
    name: "Matthew Henry",
    years: "1662–1714",
    tradition: "Puritan / Presbyterian",
    source: "Commentary on the Whole Bible (1706)",
    sourceUrl: "https://www.ccel.org/h/henry/mhc2/MHC00000.HTM",
    color: "#7c3aed",
  },
  {
    id: "spurgeon",
    name: "C.H. Spurgeon",
    years: "1834–1892",
    tradition: "Reformed Baptist",
    source: "Metropolitan Tabernacle Pulpit (63 vols.)",
    sourceUrl: "https://www.spurgeongems.org/spurgeon-sermons/",
    color: "#b45309",
  },
  {
    id: "john_calvin",
    name: "John Calvin",
    years: "1509–1564",
    tradition: "Reformed / Calvinist",
    source: "Calvin's Commentaries (1546–1563)",
    sourceUrl: "https://www.ccel.org/ccel/calvin/commentaries.i.html",
    color: "#1d4ed8",
  },
  {
    id: "john_wesley",
    name: "John Wesley",
    years: "1703–1791",
    tradition: "Methodist / Arminian",
    source: "Explanatory Notes Upon the NT (1754)",
    sourceUrl: "https://www.ccel.org/ccel/wesley/notes.html",
    color: "#065f46",
  },
  {
    id: "dwl_moody",
    name: "D.L. Moody",
    years: "1837–1899",
    tradition: "Evangelical / Revivalist",
    source: "Sermons and Bible Studies",
    sourceUrl: "https://biblenotes.online/resources/contents.htm",
    color: "#9f1239",
  },
];

const TEACHER_PROFILES: Record<string, string> = {
  matthew_henry: `Matthew Henry (1662–1714) was a Welsh Nonconformist minister known for his six-volume
Commentary on the Whole Bible (1706–1714). His style is warm, devotional, and practical — always drawing
spiritual application from the text. He writes in a rich, reverent 18th-century prose, often structured
as: (1) who is speaking and why, (2) what the text means in context, (3) what we should observe and learn,
(4) a devotional application. He frequently uses phrases like "observe," "note," "here we have," and
"we may learn." His tone is pastoral and encouraging, treating Scripture as living and directly applicable
to the believer's daily walk.`,

  spurgeon: `Charles Haddon Spurgeon (1834–1892) was the "Prince of Preachers," pastor of Metropolitan
Tabernacle in London. His commentary style is vivid, passionate, and evangelistic — often including
personal illustrations, striking metaphors, and urgent gospel appeals. He preached Reformed theology with
a warm Calvinist heart. His writing style is direct and colloquial for his era, with dramatic flourishes
and rhetorical questions. He frequently quotes other Scripture passages to illuminate the text, and he
never ends without pointing to Christ as the answer. Phrases like "beloved," "mark well," and "the
sinner" are characteristic of his voice.`,

  john_calvin: `John Calvin (1509–1564) was a French theologian and Reformer in Geneva. His commentaries
are scholarly, precise, and rigorously exegetical — he was one of the first to apply humanist literary
analysis to Scripture. His style is clear and economical; he avoids allegory and speculation, always
asking what the author intended. He is strong on the sovereignty of God, human depravity, and the
covenant. He frequently engages with the original Greek and Hebrew meaning, addresses common
misinterpretations, and insists on the literal-grammatical sense of the text. His tone is measured,
authoritative, and scholastic.`,

  john_wesley: `John Wesley (1703–1791) was the founder of Methodism and a tireless revivalist preacher.
His Notes Upon the New Testament (1754) are concise, practical, and Arminian in theology — emphasizing
free will, prevenient grace, the universal offer of salvation, and the call to holiness. His style is
brief and direct, written for ordinary people rather than scholars. He often explains difficult words,
connects the passage to Christian living, and emphasizes "entire sanctification" — the possibility of
being perfected in love. He quotes the Church Fathers and the Greek text, but translates insights into
plain language.`,

  dwl_moody: `D.L. Moody (1837–1899) was an American evangelist and founder of the Moody Church in Chicago.
His Bible studies are simple, direct, and urgently evangelistic. He had little formal education but
deep practical wisdom. His approach is story-driven — he frequently uses personal anecdotes and real-life
illustrations to illuminate Scripture. He emphasizes conversion, the love of God, repentance, and the
urgency of salvation. His style is accessible and conversational, aimed at ordinary working-class people.
He often asks the reader directly: "Have you trusted Christ? Have you made this promise your own?"`,
};

function truncate(val: unknown, max: number): string {
  if (typeof val !== "string") return "";
  return val.slice(0, max).replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request: NextRequest) {
  const ip     = getClientIp(request);
  const result = rateLimit(ip, { limit: 6, windowMs: 60_000 });
  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((result.resetMs - Date.now()) / 1000)) } }
    );
  }

  try {
    const body    = await request.json();
    const passage = truncate(body?.passage,  MAX_PASSAGE);
    const teacherId = typeof body?.teacher === "string" ? body.teacher : "matthew_henry";
    const lang    = body?.lang === "es" ? "es" : "en";

    if (!passage) {
      return NextResponse.json({ error: "Missing passage." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const teacher = CLASSIC_TEACHERS.find((t) => t.id === teacherId);
    const profile = TEACHER_PROFILES[teacherId];
    if (!teacher || !profile) {
      return NextResponse.json({ error: "Unknown teacher." }, { status: 400 });
    }

    const isSpanish = lang === "es";

    const systemMessage = isSpanish
      ? `Eres un experto en la historia del cristianismo y en los escritos de ${teacher.name}.
Tu tarea es escribir un comentario bíblico sobre el pasaje dado, EN ESPAÑOL,
escrito completamente en la voz, estilo teológico y perspectiva de ${teacher.name}.

Aquí está el perfil de ${teacher.name}:
${profile}

Reglas importantes:
- Escribe TODO en español, pero mantén el estilo, la teología y las perspectivas de ${teacher.name}
- El comentario debe tener entre 150 y 250 palabras
- Escribe directamente como el comentario (sin decir "Matthew Henry diría...")
- Sé fiel a su teología y perspectiva documentadas
- Incluye al menos una aplicación práctica
- Sin markdown ni formato especial`
      : `You are an expert in Christian history and the writings of ${teacher.name}.
Your task is to write a Bible commentary on the given passage, written entirely
in the voice, theological style, and perspective of ${teacher.name}.

Here is the profile of ${teacher.name}:
${profile}

Important rules:
- Write the commentary directly as ${teacher.name} would write it (do NOT say "Matthew Henry would say...")
- Length: 150–250 words
- Stay faithful to their documented theology and perspective
- Include at least one practical application
- Use period-appropriate language and style
- No markdown formatting`;

    const userMessage = `Write a commentary on ${passage} in the voice and style of ${teacher.name}.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user",   content: userMessage   },
        ],
        max_tokens: 500,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      console.error("[classic-commentary] OpenAI error:", response.status);
      return NextResponse.json({ error: "AI service temporarily unavailable." }, { status: 502 });
    }

    const data = await response.json();
    const commentary: string = data.choices?.[0]?.message?.content ?? "";
    if (!commentary) {
      return NextResponse.json({ error: "No response from AI." }, { status: 500 });
    }

    return NextResponse.json({ commentary, teacher: teacher.name, source: teacher.source, sourceUrl: teacher.sourceUrl });
  } catch (error) {
    console.error("[classic-commentary] Unhandled error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
