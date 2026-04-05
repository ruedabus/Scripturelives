import type { Metadata } from "next";
import Link from "next/link";

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

          <form action="https://www.paypal.com/donate" method="post" target="_blank">
            <input type="hidden" name="business" value="info@scripturelives.com" />
            <input type="hidden" name="item_name" value="Scripture Lives Ministry Support" />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="hidden" name="no_recurring" value="0" />
            <button
              type="submit"
              className="inline-flex items-center gap-3 rounded-xl bg-[#0070BA] px-8 py-3.5 text-base font-bold text-white hover:bg-[#005ea6] transition"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c1.379 3.443-.517 6.964-5.14 6.964h-3.532L10.3 21.337h3.836c.524 0 .97-.382 1.051-.9l.043-.258 1.005-6.37.065-.351c.081-.518.527-.9 1.051-.9h.66c4.3 0 7.663-1.747 8.647-6.797.407-2.087.024-3.83-1.436-4.844z"/>
              </svg>
              Donate with PayPal
            </button>
          </form>

          <p className="mt-4 text-xs text-stone-400">
            You will be redirected to PayPal&apos;s secure site to complete your gift.
          </p>
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
