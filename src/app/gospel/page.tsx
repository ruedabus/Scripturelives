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

      {/* ── 7-Day Getting Started Plan ─────────────────────────────────── */}
      <section className="w-full max-w-2xl px-6 pb-16">
        <div className="text-center mb-8">
          <span className="text-3xl">🗓️</span>
          <h3
            className="text-xl font-black mt-3 mb-2"
            style={{ color: NAVY }}
          >
            Your First 7 Days
          </h3>
          <p className="text-sm" style={{ color: "#7a6f60" }}>
            You just made the most important decision of your life. Here's a simple plan to get started.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              day: 1,
              icon: "📖",
              title: "Read John 1",
              desc: "Open the Gospel of John — it was written so you can know Jesus personally. Read just one chapter today.",
              href: "/bible",
              label: "Open the Bible",
            },
            {
              day: 2,
              icon: "🙏",
              title: "Talk to God",
              desc: "Prayer is just a conversation — no special words needed. Tell God what's on your heart. He's listening.",
              href: "/prayer",
              label: "Prayer Wall",
            },
            {
              day: 3,
              icon: "🌅",
              title: "Start a Devotional",
              desc: "Sign up for a short daily verse, reflection, and prayer delivered to your inbox every morning — free.",
              href: "/devotionals",
              label: "Get Daily Devotionals",
            },
            {
              day: 4,
              icon: "💬",
              title: "Tell Someone",
              desc: "Find one person you trust — a friend, family member, or coworker — and tell them what happened. Faith grows in community.",
              href: "/prayer",
              label: "Share on the Prayer Wall",
            },
            {
              day: 5,
              icon: "⛪",
              title: "Find a Church",
              desc: "You weren't meant to do this alone. Find a Bible-believing church near you — just search by zip code.",
              href: "/find-a-church",
              label: "Find a Church Near Me",
            },
            {
              day: 6,
              icon: "📚",
              title: "Share With Your Kids",
              desc: "If you have kids, Faith Tails has beautiful illustrated Bible stories they'll love — a great way to share your faith.",
              href: "/kids",
              label: "Explore Kids Stories",
            },
            {
              day: 7,
              icon: "🎉",
              title: "Celebrate & Keep Going",
              desc: "You've completed your first week. Heaven is cheering for you (Luke 15:7). Keep reading John — there are 21 chapters!",
              href: "/bible",
              label: "Keep Reading",
            },
          ].map(({ day, icon, title, desc, href, label }) => (
            <div
              key={day}
              className="flex items-start gap-4 rounded-2xl p-5 bg-white"
              style={{ border: "1px solid #ede8de", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
            >
              {/* Day circle */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                style={{ background: GOLD, color: NAVY }}
              >
                {day}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{icon}</span>
                  <h4 className="font-black text-sm" style={{ color: NAVY }}>{title}</h4>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#7a6f60" }}>{desc}</p>
                <Link
                  href={href}
                  className="inline-block text-xs font-black px-3 py-1.5 rounded-xl transition hover:opacity-80"
                  style={{ background: NAVY, color: "white" }}
                >
                  {label} →
                </Link>
              </div>
            </div>
          ))}
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
