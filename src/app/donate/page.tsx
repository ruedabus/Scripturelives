import type { Metadata } from "next";
import Link from "next/link";
import PayPalButton from "@/components/PayPalButton";

export const metadata: Metadata = {
  title: "Support Scripture Lives — Donate",
  description: "Help keep Scripture Lives free for everyone. Your donation supports hosting, development, and our mission to make the Bible accessible worldwide.",
};

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top nav */}
      <header className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Hand-painted cross_logo.png" alt="Scripture Lives" className="h-10 w-10 object-contain" />
          <span className="text-lg font-bold text-amber-400">Scripture Lives</span>
        </Link>
        <Link href="/" className="text-sm text-stone-300 hover:text-white transition">← Back to App</Link>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white px-6 py-16 text-center">
        <div className="max-w-xl mx-auto">
          <span className="text-5xl mb-4 block">🙏</span>
          <h1 className="text-3xl font-bold text-amber-400 mb-3">Support Scripture Lives</h1>
          <p className="text-stone-300 leading-7">
            Scripture Lives is completely free to use and always will be.
            Your generous gift helps cover server costs, ongoing development,
            and our mission to put God&apos;s Word in more hands around the world.
          </p>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-6 py-14 space-y-10">

        {/* Verse */}
        <blockquote className="rounded-2xl border border-amber-200 bg-amber-50 px-8 py-6 text-center">
          <p className="text-base font-semibold text-amber-800 italic leading-8">
            &ldquo;Each of you should give what you have decided in your heart to give,
            not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
          </p>
          <p className="mt-2 text-sm text-amber-600">— 2 Corinthians 9:7</p>
        </blockquote>

        {/* Where your donation goes */}
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-4">Where your donation goes</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: "🖥️", label: "Hosting & Infrastructure", desc: "Keeping the servers running 24/7 for every visitor worldwide." },
              { icon: "⚙️", label: "Development", desc: "Adding new features like audio Bible, more translations, and study tools." },
              { icon: "🌍", label: "Global Reach", desc: "Expanding access so believers in every nation can study the Word." },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-stone-200 bg-white p-5 text-center">
                <span className="text-3xl mb-2 block">{item.icon}</span>
                <p className="text-sm font-semibold text-stone-800 mb-1">{item.label}</p>
                <p className="text-xs text-stone-500 leading-5">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PayPal Donate */}
        <section className="rounded-2xl border-2 border-[#0070BA]/30 bg-white px-8 py-8 text-center">
          <h2 className="text-xl font-bold text-stone-800 mb-2">Give via PayPal</h2>
          <p className="text-sm text-stone-500 mb-6">
            Secure, one-time or recurring donation. Any amount is deeply appreciated.
          </p>

          <PayPalButton />
        </section>

        {/* Thank you note */}
        <section className="text-center">
          <p className="text-stone-500 text-sm leading-7">
            Every gift — no matter the size — makes a real difference.
            Thank you for partnering with Scripture Lives in making God&apos;s Word
            accessible to the world. May the Lord bless you for your generosity.
          </p>
          <p className="mt-3 text-amber-600 font-semibold">— The Scripture Lives Team</p>
        </section>

        {/* Contact */}
        <section className="text-center border-t border-stone-200 pt-8">
          <p className="text-stone-500 text-sm">
            Questions about your donation? Contact us at{" "}
            <a href="mailto:info@scripturelives.com" className="text-amber-600 hover:underline font-medium">
              info@scripturelives.com
            </a>
          </p>
        </section>

      </main>

      <footer className="border-t border-stone-200 bg-white py-8 text-center text-sm text-stone-400">
        <p>&copy; {new Date().getFullYear()} Scripture Lives. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-6">
          <Link href="/about" className="hover:text-amber-600 transition">About Us</Link>
          <Link href="/terms" className="hover:text-amber-600 transition">Terms</Link>
          <Link href="/donate" className="hover:text-amber-600 transition">Donate</Link>
          <Link href="/" className="hover:text-amber-600 transition">App</Link>
        </div>
      </footer>
    </div>
  );
}
