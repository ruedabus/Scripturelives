"use client";

import { useState } from "react";
import Link from "next/link";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

export default function GospelPage() {
  const [prayed, setPrayed] = useState(false);

  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{ background: "#f9f7f2", fontFamily: "Georgia, serif" }}
    >
      {/* ── Language bar ──────────────────────────────────────────────────── */}
      <div
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold"
        style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.3)` }}
      >
        <span style={{ color: "rgba(255,255,255,0.6)" }}>🌐 Select Language:</span>
        <span
          className="px-3 py-1 rounded-full text-xs font-black"
          style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
        >
          🇺🇸 English
        </span>
        <Link
          href="/es/gospel"
          className="px-3 py-1 rounded-full text-xs font-black transition hover:opacity-80"
          style={{ background: GOLD, color: NAVY }}
        >
          🇪🇸 Español
        </Link>
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="w-full flex flex-col items-center justify-center px-6 py-16 text-center"
        style={{
          background: `linear-gradient(160deg, ${NAVY} 0%, #2d1f3d 60%, #1a2640 100%)`,
        }}
      >
        {/* Cross icon */}
        <div className="mb-6 text-6xl select-none">✝</div>

        <h1
          className="text-4xl sm:text-5xl font-black leading-tight mb-4"
          style={{ color: "white", textShadow: `0 2px 20px rgba(201,149,42,0.4)` }}
        >
          The Best News<br />
          <span style={{ color: GOLD }}>You'll Ever Hear</span>
        </h1>

        <p className="text-base sm:text-lg max-w-xl leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.85)" }}>
          Someone wearing a shirt sent you here. That wasn't an accident.
        </p>
        <p className="text-sm max-w-md leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
          Take two minutes. This message has changed billions of lives — including the person you just met.
        </p>

        {/* Scroll cue */}
        <div className="mt-10 flex flex-col items-center gap-1" style={{ color: GOLD }}>
          <span className="text-xs uppercase tracking-widest font-bold">Keep Reading</span>
          <span className="text-2xl animate-bounce">↓</span>
        </div>
      </section>

      {/* ── The Gospel ────────────────────────────────────────────────────── */}
      <section className="w-full max-w-2xl px-6 py-14 flex flex-col gap-12">

        {/* Step 1 */}
        <GospelStep
          number="1"
          title="God created you and loves you."
          verse='"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."'
          reference="John 3:16"
          body="You weren't an accident. God made you on purpose, for a purpose. His love for you isn't based on what you've done — it's who He is."
        />

        {/* Step 2 */}
        <GospelStep
          number="2"
          title="We all have a problem — it's called sin."
          verse='"For all have sinned and fall short of the glory of God."'
          reference="Romans 3:23"
          body="Sin is simply choosing our own way over God's way. Every one of us has done it. And that separation from God is the root of everything broken in our lives."
        />

        {/* Step 3 */}
        <GospelStep
          number="3"
          title="The penalty for sin is death — but God paid it."
          verse='"But God demonstrates his own love for us in this: While we were still sinners, Christ died for us."'
          reference="Romans 5:8"
          body="Jesus — God's own Son — took the punishment we deserved. He died on the cross, was buried, and rose from the dead three days later. That's not mythology. That's history — and it changes everything."
        />

        {/* Step 4 */}
        <GospelStep
          number="4"
          title="You can receive His gift right now."
          verse={`"If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved."`}
          reference="Romans 10:9"
          body="You don't have to earn it. You don't have to clean yourself up first. You just have to believe — and receive."
        />
      </section>

      {/* ── Prayer ────────────────────────────────────────────────────────── */}
      <section
        className="w-full max-w-2xl mx-auto px-6 pb-16"
      >
        <div
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: NAVY,
            border: `1px solid rgba(201,149,42,0.3)`,
          }}
        >
          <div className="text-center mb-8">
            <span className="text-4xl">🙏</span>
            <h2 className="text-2xl font-black mt-4 text-white">Ready to Pray?</h2>
            <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.65)" }}>
              This is a simple prayer. God hears the heart, not perfect words.
            </p>
          </div>

          <div
            className="rounded-2xl p-6 mb-6 italic text-sm leading-relaxed"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.9)",
              borderLeft: `3px solid ${GOLD}`,
            }}
          >
            <p>
              "Lord Jesus, I believe You are the Son of God. I believe You died for my sins and rose from the dead. I turn away from my sin and I put my trust in You. Come into my life, forgive me, and make me new. I want to follow You from this day forward. Amen."
            </p>
          </div>

          {!prayed ? (
            <button
              onClick={() => setPrayed(true)}
              className="w-full py-4 rounded-2xl font-black text-base sm:text-lg transition hover:opacity-90 active:scale-95"
              style={{ background: GOLD, color: NAVY }}
            >
              I prayed this prayer ✝
            </button>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-xl font-black text-white mb-2">Welcome to the family.</p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                That decision just changed your eternity. Heaven is celebrating right now (Luke 15:7). Tell someone you trust — and keep reading below.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Next Steps ────────────────────────────────────────────────────── */}
      <section className="w-full max-w-2xl px-6 pb-16">
        <h3
          className="text-xl font-black text-center mb-8 uppercase tracking-widest"
          style={{ color: NAVY }}
        >
          What's Next
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NextStep
            icon="📖"
            title="Read the Bible"
            desc="Start in the Gospel of John. It's a perfect first read."
            href="/"
            label="Open the Bible"
          />
          <NextStep
            icon="🙏"
            title="Talk to God"
            desc="Prayer is just a conversation. Share what's on your heart."
            href="/prayer"
            label="Prayer Wall"
          />
          <NextStep
            icon="✉️"
            title="Get Devotionals"
            desc="Short daily encouragements delivered to your inbox."
            href="/devotionals"
            label="Sign Up Free"
          />
          <NextStep
            icon="⛪"
            title="Find a Church"
            desc="Enter your zip code to find a Bible-believing church near you."
            href="/find-a-church"
            label="Search by Zip"
          />
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        className="w-full py-8 px-6 text-center text-xs"
        style={{ color: "#9ca3af", borderTop: "1px solid #ede8de" }}
      >
        <p>
          This page is part of{" "}
          <Link href="/" className="underline hover:opacity-70" style={{ color: GOLD }}>
            Scripture Lives
          </Link>
          {" "}— a free Bible resource for everyone.
        </p>
        <p className="mt-2" style={{ color: "#c0b89a" }}>
          © 2026 Scripture Lives / Faith Tails &nbsp;·&nbsp; info@scripturelives.com
        </p>
      </footer>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GospelStep({
  number,
  title,
  verse,
  reference,
  body,
}: {
  number: string;
  title: string;
  verse: string;
  reference: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Number + Title */}
      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm"
          style={{ background: GOLD, color: NAVY }}
        >
          {number}
        </div>
        <h2 className="text-xl font-black leading-snug" style={{ color: NAVY }}>
          {title}
        </h2>
      </div>

      {/* Verse */}
      <blockquote
        className="rounded-2xl p-5 italic text-sm leading-relaxed"
        style={{
          background: "#fff",
          borderLeft: `4px solid ${GOLD}`,
          color: "#3a3025",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <p>{verse}</p>
        <cite
          className="block mt-2 not-italic text-xs font-bold uppercase tracking-widest"
          style={{ color: GOLD }}
        >
          {reference}
        </cite>
      </blockquote>

      {/* Body */}
      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#5a4f3e" }}>
        {body}
      </p>
    </div>
  );
}

function NextStep({
  icon,
  title,
  desc,
  href,
  label,
  external,
}: {
  icon: string;
  title: string;
  desc: string;
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 text-center"
      style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <span className="text-3xl">{icon}</span>
      <h4 className="font-black text-sm" style={{ color: NAVY }}>{title}</h4>
      <p className="text-xs leading-relaxed" style={{ color: "#7a6f60" }}>{desc}</p>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto py-2 px-4 rounded-xl text-xs font-bold transition hover:opacity-90"
          style={{ background: NAVY, color: "white" }}
        >
          {label}
        </a>
      ) : (
        <Link
          href={href}
          className="mt-auto py-2 px-4 rounded-xl text-xs font-bold transition hover:opacity-90"
          style={{ background: NAVY, color: "white" }}
        >
          {label}
        </Link>
      )}
    </div>
  );
}
