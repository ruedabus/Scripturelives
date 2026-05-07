"use client";

import { useState } from "react";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

const STEPS = [
  {
    number: "1",
    heading: "God loves you — unconditionally",
    body: "God created you and desires a personal relationship with you. His love for you is not based on what you do, but simply because you are His.",
    verse: '"For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life."',
    ref: "John 3:16",
  },
  {
    number: "2",
    heading: "We have all sinned and fallen short",
    body: "Sin is simply going our own way instead of God's way. Every person — no matter how good — has sinned. And sin separates us from God.",
    verse: '"For all have sinned and fall short of the glory of God."',
    ref: "Romans 3:23",
  },
  {
    number: "3",
    heading: "The consequence — and the gift",
    body: "Sin leads to spiritual death and eternal separation from God. But God did not leave us there. He offered the free gift of eternal life.",
    verse: '"For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord."',
    ref: "Romans 6:23",
  },
  {
    number: "4",
    heading: "Jesus died for you — while you were still a sinner",
    body: "Jesus Christ, God's Son, took your place. He bore the penalty for every sin you have ever committed — or ever will commit — on the cross.",
    verse: '"But God demonstrates His own love toward us, in that while we were still sinners, Christ died for us."',
    ref: "Romans 5:8",
  },
  {
    number: "5",
    heading: "Salvation is a gift — receive it by faith",
    body: "You cannot earn salvation by being good, going to church, or doing religious things. It is received by believing in Jesus and confessing Him as Lord.",
    verse: '"If you confess with your mouth the Lord Jesus and believe in your heart that God has raised Him from the dead, you will be saved."',
    ref: "Romans 10:9",
  },
];

const PRAYER = `Heavenly Father,

I come to You just as I am. I admit that I am a sinner and that I need You. I believe that Jesus Christ is Your Son, that He died on the cross for my sins, and that You raised Him from the dead.

Right now, I turn from my sins and I put my trust in Jesus alone as my Lord and Savior. I receive Your free gift of eternal life.

Thank You for forgiving me, for loving me, and for never letting me go.

In Jesus' name, Amen.`;

const NEXT_STEPS = [
  { icon: "📖", title: "Read the Bible daily", desc: "Start with the Gospel of John — it tells the story of Jesus from beginning to end." },
  { icon: "🙏", title: "Talk to God in prayer", desc: "Prayer is simply an honest conversation with God. He always listens." },
  { icon: "⛪", title: "Find a local church", desc: "Connect with other believers who can encourage and walk alongside you." },
  { icon: "💬", title: "Tell someone", desc: "Share what happened with a trusted friend or family member. Faith grows when shared." },
];

export default function GospelCard() {
  const [expanded, setExpanded] = useState(false);
  const [prayed,   setPrayed]   = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e8d5b0", boxShadow: "0 4px 24px rgba(201,149,42,0.12)" }}>

      {/* ── Hero banner ── */}
      <div className="relative px-6 py-8 text-center overflow-hidden" style={{ background: NAVY }}>
        {/* Hand-cross photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hand-cross.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.55, objectPosition: "center 30%" }}
        />
        {/* Dark gradient overlay so text stays readable */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,38,64,0.55) 0%, rgba(26,38,64,0.65) 100%)" }} />

        <div className="relative z-10">
          {/* Gold rule + label */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>Scripture Lives</span>
            <div className="h-px w-8" style={{ background: GOLD }} />
          </div>

          <h2 className="text-3xl font-black text-white leading-tight mb-3">
            Do You Know<br />
            <span style={{ color: GOLD }}>Jesus?</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            If you have ever wondered about God, about life&apos;s meaning, or what happens after we die — this message is for you.
          </p>

          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white transition hover:brightness-110"
              style={{ background: GOLD, boxShadow: "0 4px 16px rgba(201,149,42,0.5)" }}
            >
              Read the Gospel Story
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Expanded gospel content ── */}
      {expanded && (
        <div className="bg-white">

          {/* Intro */}
          <div className="px-6 pt-7 pb-5" style={{ borderBottom: "1px solid #f0ece3" }}>
            <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>
              The most important question you will ever answer is this: <strong style={{ color: NAVY }}>What will you do with Jesus Christ?</strong> The following five truths from the Bible explain who Jesus is, why He came, and how you can know Him personally — today.
            </p>
          </div>

          {/* 5 Steps */}
          <div className="divide-y" style={{ borderColor: "#f0ece3" }}>
            {STEPS.map((step) => (
              <div key={step.number} className="px-6 py-6">
                <div className="flex items-start gap-4">
                  {/* Number badge */}
                  <div
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white mt-0.5"
                    style={{ background: GOLD }}
                  >
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-sm leading-snug mb-2" style={{ color: NAVY }}>
                      {step.heading}
                    </h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "#4b5563" }}>
                      {step.body}
                    </p>
                    {/* Scripture quote */}
                    <div className="rounded-xl px-4 py-3" style={{ background: "#faf8f3", border: "1px solid #f0e6cc" }}>
                      <p className="text-sm italic leading-relaxed" style={{ color: NAVY }}>
                        {step.verse}
                      </p>
                      <p className="text-[11px] font-black uppercase tracking-widest mt-2" style={{ color: GOLD }}>
                        {step.ref}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prayer of salvation */}
          <div className="px-6 py-7" style={{ background: "#fdf8ee", borderTop: "2px solid #f0e6cc", borderBottom: "2px solid #f0e6cc" }}>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px flex-1" style={{ background: "#e8d5b0" }} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] shrink-0" style={{ color: GOLD }}>
                🙏 Prayer of Salvation
              </p>
              <div className="h-px flex-1" style={{ background: "#e8d5b0" }} />
            </div>

            <p className="text-sm leading-relaxed mb-4" style={{ color: "#4b5563" }}>
              If you believe what you have just read and want to receive Jesus Christ as your Lord and Savior, you can pray this prayer right now. God hears every sincere heart.
            </p>

            {/* Prayer box */}
            <div className="rounded-2xl px-5 py-5" style={{ background: "white", border: "1px solid #e8d5b0", boxShadow: "0 2px 12px rgba(201,149,42,0.08)" }}>
              <pre className="text-sm leading-loose whitespace-pre-wrap font-sans italic" style={{ color: NAVY }}>
                {PRAYER}
              </pre>
            </div>

            {/* "I prayed this" button */}
            {!prayed ? (
              <button
                onClick={() => setPrayed(true)}
                className="mt-5 w-full py-4 rounded-2xl font-black text-base text-white transition hover:brightness-110"
                style={{ background: GOLD, boxShadow: "0 4px 20px rgba(201,149,42,0.4)" }}
              >
                ✝️ I prayed this prayer
              </button>
            ) : (
              <div className="mt-5 rounded-2xl px-5 py-5 text-center" style={{ background: NAVY }}>
                <p className="text-2xl mb-2">🎉</p>
                <p className="font-black text-white text-base mb-1">Welcome to the family of God!</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  If you sincerely prayed that prayer, the Bible promises you are now a child of God. Heaven is rejoicing right now over you.
                </p>
                <p className="text-xs mt-3 italic" style={{ color: "rgba(255,255,255,0.45)" }}>
                  &ldquo;There is joy in the presence of the angels of God over one sinner who repents.&rdquo; — Luke 15:10
                </p>
              </div>
            )}
          </div>

          {/* What's next */}
          <div className="px-6 py-7">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px flex-1" style={{ background: "#f0ece3" }} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] shrink-0" style={{ color: GOLD }}>What&apos;s Next?</p>
              <div className="h-px flex-1" style={{ background: "#f0ece3" }} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {NEXT_STEPS.map((step) => (
                <div key={step.title} className="rounded-xl px-4 py-4" style={{ background: "#faf8f3", border: "1px solid #ede8de" }}>
                  <div className="text-xl mb-2">{step.icon}</div>
                  <p className="font-black text-sm mb-1" style={{ color: NAVY }}>{step.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Closing encouragement */}
            <div className="mt-5 rounded-xl px-5 py-4 text-center" style={{ background: "#faf8f3", border: "1px solid #f0e6cc" }}>
              <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>
                Have questions? We&apos;d love to hear from you.{" "}
                <a href="/contact" className="font-bold transition hover:opacity-70" style={{ color: GOLD }}>
                  Reach out to us →
                </a>
              </p>
            </div>

            {/* Collapse */}
            <button
              onClick={() => setExpanded(false)}
              className="mt-4 w-full text-xs font-semibold transition hover:opacity-70 py-2"
              style={{ color: "#9ca3af" }}
            >
              ↑ Collapse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
