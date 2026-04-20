import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

// ──────────────────────────────────────────────────────────────
// POST /api/export
// Body: { format: "docx", bookmarks, notes, sessions }
// Returns: binary DOCX download
// ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { format, bookmarks, notes, sessions } = body as {
    format: string;
    bookmarks: unknown[];
    notes: Record<string, string>;
    sessions: unknown[];
  };

  if (format !== "docx") {
    return NextResponse.json({ error: "Only format=docx is supported" }, { status: 400 });
  }

  // ── Input validation ────────────────────────────────────────────────
  // Guard against oversized payloads being passed to the Python subprocess
  if (!Array.isArray(bookmarks) || bookmarks.length > 500) {
    return NextResponse.json({ error: "Invalid or oversized bookmarks" }, { status: 400 });
  }
  if (!Array.isArray(sessions) || sessions.length > 500) {
    return NextResponse.json({ error: "Invalid or oversized sessions" }, { status: 400 });
  }
  if (typeof notes !== "object" || notes === null || Array.isArray(notes)) {
    return NextResponse.json({ error: "Invalid notes payload" }, { status: 400 });
  }
  // Guard against objects with too many keys
  if (Object.keys(notes).length > 1000) {
    return NextResponse.json({ error: "Too many notes entries" }, { status: 400 });
  }
  // Ensure all note values are strings (prevent arbitrary object injection)
  for (const [k, v] of Object.entries(notes)) {
    if (typeof k !== "string" || typeof v !== "string") {
      return NextResponse.json({ error: "Invalid notes entry type" }, { status: 400 });
    }
  }
  // Rough total size check — reject payloads larger than 2 MB serialised
  const rawPayloadSize = JSON.stringify({ bookmarks, notes, sessions }).length;
  if (rawPayloadSize > 2_000_000) {
    return NextResponse.json({ error: "Export payload too large" }, { status: 413 });
  }

  // Path to the Python script (relative to project root at runtime)
  const scriptPath = path.join(process.cwd(), "scripts", "generate_docx.py");

  const payload = JSON.stringify({ bookmarks, notes, sessions });

  const docxBytes = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const errChunks: Buffer[] = [];

    const py = spawn("python3", [scriptPath], { stdio: ["pipe", "pipe", "pipe"] });

    py.stdout.on("data", (chunk: Buffer) => chunks.push(chunk));
    py.stderr.on("data", (chunk: Buffer) => errChunks.push(chunk));

    py.on("close", (code) => {
      if (code !== 0) {
        const stderr = Buffer.concat(errChunks).toString();
        reject(new Error(`Python exited with code ${code}: ${stderr}`));
      } else {
        resolve(Buffer.concat(chunks));
      }
    });

    py.on("error", (err) => reject(err));

    // Send JSON payload to Python stdin
    py.stdin.write(payload);
    py.stdin.end();
  }).catch((err) => {
    console.error("[export/docx] Python error:", err);
    return null;
  });

  if (!docxBytes) {
    return NextResponse.json(
      { error: "Failed to generate document. Make sure python3 and python-docx are installed." },
      { status: 500 }
    );
  }

  const filename = `scripture-lives-study-${new Date().toISOString().slice(0, 10)}.docx`;

  // Convert Buffer → ArrayBuffer (universally valid BodyInit across all TS versions)
  const arrayBuffer = docxBytes.buffer.slice(
    docxBytes.byteOffset,
    docxBytes.byteOffset + docxBytes.byteLength
  ) as ArrayBuffer;

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": docxBytes.byteLength.toString(),
    },
  });
}
