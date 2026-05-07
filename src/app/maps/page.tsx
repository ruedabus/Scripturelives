import Link from "next/link";

export const metadata = { title: "Bible Maps – ScriptureLives" };

export default function MapsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4"
      style={{ background: "#faf8f3" }}>
      <span className="text-6xl">🗺️</span>
      <h1 className="text-3xl font-bold" style={{ color: "#1a2640" }}>Bible Maps</h1>
      <p className="text-gray-500 text-center max-w-sm">
        Interactive maps of biblical lands, journeys, and historical locations. Coming soon!
      </p>
      <Link href="/" className="rounded-md px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
        style={{ background: "#C9952A" }}>← Back to Home</Link>
    </div>
  );
}
