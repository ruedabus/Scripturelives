import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Scripture Lives",
  description: "Our mission, story, and the heart behind Scripture Lives.",
};

export default function AboutPage() {
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
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hand-painted cross_logo.png"
            alt="Scripture Lives"
            className="h-24 w-24 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold text-amber-400 mb-4">Scripture Lives</h1>
          <p className="text-lg text-stone-300 leading-8">
            A free Bible study platform built on the conviction that God&apos;s Word is alive,
            active, and deeply relevant to every person on earth — today.
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* Mission */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">✝️</span>
            <h2 className="text-2xl font-bold text-stone-900">Our Mission</h2>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-8 py-8">
            <p className="text-lg font-semibold text-amber-900 italic leading-9 text-center">
              &ldquo;To make the Word of God accessible, understandable, and shareable
              for every believer — and every seeker — wherever they are in the world.&rdquo;
            </p>
          </div>
          <p className="mt-6 text-stone-600 leading-8">
            Scripture Lives was built on a simple belief: the Bible should not be locked behind
            complicated software, expensive subscriptions, or academic jargon. Whether you are a
            lifelong student of Scripture, a new believer finding your footing, or someone who has
            simply felt curious about what the Bible actually says — this platform is for you.
            Everything here is free, and we intend to keep it that way.
          </p>
        </section>

        {/* Who We Are */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">🤝</span>
            <h2 className="text-2xl font-bold text-stone-900">Who We Are</h2>
          </div>
          <p className="text-stone-600 leading-8 mb-4">
            Scripture Lives is an independent ministry project started by a follower of Christ
            with a passion for technology and a deep love for the Word of God. We are not a
            church, a denomination, or a theological institution — we are simply believers
            who want to use modern tools to put Scripture in more hands, minds, and hearts.
          </p>
          <p className="text-stone-600 leading-8 mb-4">
            We hold to the authority and sufficiency of Scripture, the lordship of Jesus Christ,
            and the power of the Holy Spirit to illuminate God&apos;s Word to every person who
            sincerely seeks Him. While Scripture Lives is non-denominational and welcomes
            Christians from all traditions, every feature of this platform is designed to point
            people back to the Bible itself — not to any particular doctrinal system.
          </p>
          <p className="text-stone-600 leading-8">
            We are a small team with a big vision: that one day people in every nation would
            open Scripture Lives on their phone and find the living Word waiting for them in a
            language and format they can engage with deeply.
          </p>
        </section>

        {/* What We Believe */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">📖</span>
            <h2 className="text-2xl font-bold text-stone-900">What We Believe</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "✝️", title: "The Scripture", body: "We believe the Bible is the inspired, authoritative Word of God — fully sufficient for salvation and the life of faith." },
              { icon: "🙏", title: "Prayer", body: "We believe every session with God's Word should begin with prayer, and we built daily devotionals and study prompts with that rhythm in mind." },
              { icon: "🌍", title: "Accessibility", body: "God's Word belongs to everyone. We will always offer a free tier and work to make Scripture Lives available across devices and connections." },
              { icon: "🤝", title: "Community", body: "Faith grows in community. Our sharing features are designed to help you bring others into what you are discovering in Scripture." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-stone-200 bg-white p-6">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <h3 className="font-semibold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-6">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Support */}
        <section className="rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 px-8 py-10 text-center text-white">
          <h2 className="text-2xl font-bold text-amber-400 mb-3">Support the Mission</h2>
          <p className="text-stone-300 leading-7 mb-6 max-w-xl mx-auto">
            Scripture Lives is free to use and always will be. If this platform has blessed you,
            consider making a small donation to help cover server costs, development, and our
            goal of reaching more people around the world.
          </p>
          <Link
            href="/donate"
            className="inline-block rounded-xl bg-amber-500 px-8 py-3 font-semibold text-stone-900 hover:bg-amber-400 transition"
          >
            Give a Donation →
          </Link>
        </section>

        {/* Contact */}
        <section className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">✉️</span>
            <h2 className="text-2xl font-bold text-stone-900">Contact Us</h2>
          </div>
          <p className="text-stone-600 leading-8">
            Have a question, a testimonial, or just want to say hello? We&apos;d love to hear from you.
            Reach out to us at{" "}
            <a href="mailto:info@scripturelives.com" className="text-amber-600 font-semibold hover:underline">
              info@scripturelives.com
            </a>{" "}
            and we will do our best to respond promptly.
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
