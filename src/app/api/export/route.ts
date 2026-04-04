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
