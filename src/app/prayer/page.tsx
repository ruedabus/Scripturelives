import Link from "next/link";

export const metadata = { title: "Prayer Wall – ScriptureLives" };

export default function PrayerPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4"
      style={{ background: "#faf8f3" }}>
      <span className="text-6xl">🙏</span>
      <h1 className="text-3xl font-bold" style={{ color: "#1a2640" }}>Prayer Wall</h1>
      <p className="text-gray-500 text-center max-w-sm">
        A place to share prayer requests and lift one another up. Coming soon!
      </p>
      <Link href="/" className="rounded-md px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
        style={{ background: "#C9952A" }}>← Back to Home</Link>
    </div>
  );
}
