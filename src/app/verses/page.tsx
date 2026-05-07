import Link from "next/link";

export const metadata = { title: "Encouragement Verses – ScriptureLives" };

const VERSES = [
  { ref: "Philippians 4:13",  text: "I can do all things through Christ who strengthens me." },
  { ref: "Jeremiah 29:11",    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future." },
  { ref: "Isaiah 40:31",      text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles." },
  { ref: "Romans 8:28",       text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose." },
  { ref: "Joshua 1:9",        text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." },
  { ref: "Psalm 46:1",        text: "God is our refuge and strength, an ever-present help in trouble." },
  { ref: "Proverbs 3:5–6",    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight." },
  { ref: "Matthew 11:28",     text: "Come to me, all you who are weary and burdened, and I will give you rest." },
  { ref: "2 Corinthians 5:7", text: "For we live by faith, not by sight." },
  { ref: "Psalm 23:1",        text: "The Lord is my shepherd; I shall not want." },
  { ref: "John 3:16",         text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
  { ref: "Romans 15:13",      text: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit." },
];

export default function VersesPage() {
  return (
    <div className="min-h-screen px-4 py-20" style={{ background: "#faf8f3" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-5xl block mb-3">❤️</span>
          <h1 className="text-4xl font-black mb-3" style={{ color: "#1a2640" }}>Encouragement Verses</h1>
          <p className="text-gray-500">Uplifting Scripture to carry you through every day.</p>
        </div>
        <div className="flex flex-col gap-4">
          {VERSES.map((v) => (
            <div key={v.ref} className="bg-white rounded-2xl p-6"
              style={{ border: "1px solid #ede8de", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <p className="text-base leading-relaxed italic mb-3" style={{ color: "#374151" }}>&ldquo;{v.text}&rdquo;</p>
              <p className="text-sm font-bold" style={{ color: "#C9952A" }}>— {v.ref}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/" className="text-sm font-semibold hover:opacity-70 transition" style={{ color: "#C9952A" }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
