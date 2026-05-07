import Link from "next/link";

export const metadata = { title: "Resources – ScriptureLives" };

const RESOURCES = [
  { icon: "🗺️", label: "Bible Maps",    href: "/maps",        desc: "Explore the lands of the Bible visually." },
  { icon: "📚", label: "Lexicon",        href: "/read",        desc: "Look up original Hebrew and Greek words." },
  { icon: "⏳", label: "Timeline",       href: "/read",        desc: "Navigate biblical history chronologically." },
  { icon: "🏆", label: "Bible Bowl",     href: "/tournament",  desc: "Test your Scripture knowledge in competition." },
  { icon: "🎯", label: "Solo Study",     href: "/solo",        desc: "Practice quizzes at your own pace." },
  { icon: "📖", label: "Read the Bible", href: "/read",        desc: "Full Bible reader with multiple translations." },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen px-4 py-20" style={{ background: "#faf8f3" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-3" style={{ color: "#1a2640" }}>Resources</h1>
          <p className="text-gray-500">Tools and guides for your faith journey.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {RESOURCES.map((r) => (
            <Link key={r.label} href={r.href}
              className="bg-white rounded-2xl p-6 flex flex-col gap-3 transition hover:-translate-y-1 hover:shadow-lg"
              style={{ border: "1px solid #ede8de", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <span className="text-3xl">{r.icon}</span>
              <div>
                <p className="font-bold text-base" style={{ color: "#1a2640" }}>{r.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{r.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/" className="text-sm font-semibold hover:opacity-70 transition" style={{ color: "#C9952A" }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
