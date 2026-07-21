"use client";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

interface ColoringPage {
  title:    string;
  imageSrc: string; // path under /public, e.g. "/coloring/standalone/page-1.jpg"
}

interface ColoringBookSectionProps {
  pages: ColoringPage[];
}

function handlePrint(src: string, title: string) {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`
    <html><head><title>${title}</title>
    <style>
      body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: white; }
      img  { max-width: 100%; max-height: 100vh; }
      @media print { body { margin: 0; } }
    </style></head>
    <body><img src="${window.location.origin}${src}" onload="window.print()"/></body></html>
  `);
  win.document.close();
}

function handleDownload(src: string, title: string) {
  const link = document.createElement("a");
  link.href     = src;
  link.download = title.replace(/\s+/g, "-").toLowerCase() + ".jpg";
  link.click();
}

export default function ColoringBookSection({ pages }: ColoringBookSectionProps) {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
      {pages.map((p) => (
        <div
          key={p.imageSrc}
          className="flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: "white",
            boxShadow:  "0 4px 16px rgba(0,0,0,0.10)",
            border:     "1px solid rgba(201,149,42,0.15)",
          }}
        >
          {/* Preview */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.imageSrc}
            alt={p.title}
            className="w-full object-cover"
            style={{ aspectRatio: "3/4", objectPosition: "top" }}
          />

          {/* Footer */}
          <div className="px-3 py-3 flex flex-col gap-2">
            <p className="text-sm font-bold leading-snug" style={{ color: NAVY }}>{p.title}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePrint(p.imageSrc, p.title)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-80"
                style={{ background: GOLD, color: NAVY }}
              >
                🖨 Print
              </button>
              <button
                onClick={() => handleDownload(p.imageSrc, p.title)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-80"
                style={{ background: "rgba(26,38,64,0.08)", color: NAVY }}
              >
                💾 Download
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
