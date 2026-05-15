"use client";

import { useState, useRef, useEffect } from "react";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

type Message = { role: "user" | "assistant"; content: string; id?: string };

type View = "chat" | "pastor";

export default function BibleTeacherChat() {
  const [open, setOpen]         = useState(false);
  const [view, setView]         = useState<View>("chat");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your Scripture Lives Assistant 📖 Ask me anything about Scripture — verses on a topic, biblical history, facts, timelines, and more. For personal guidance, use the 'Ask a Pastor' button below." },
  ]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [flagged, setFlagged]   = useState<Record<number, boolean>>({});
  const [listening, setListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Pastor form
  const [pName,     setPName]     = useState("");
  const [pEmail,    setPEmail]    = useState("");
  const [pQuestion, setPQuestion] = useState("");
  const [pSending,  setPSending]  = useState(false);
  const [pSent,     setPSent]     = useState(false);
  const [pError,    setPError]    = useState("");

  const bottomRef  = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<string>("");

  // Generate sessionId on mount
  useEffect(() => {
    try {
      sessionRef.current = crypto.randomUUID();
    } catch {
      sessionRef.current = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    }
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: next, sessionId: sessionRef.current }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.reply ?? "Sorry, something went wrong. Please try again.",
        id: data.messageId ?? undefined,
      };
      setMessages([...next, assistantMsg]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Sorry, I couldn't connect. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  async function flagMessage(index: number, messageId?: string) {
    if (!messageId) return;
    setFlagged((prev) => ({ ...prev, [index]: true }));
    try {
      await fetch("/api/flag-message", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messageId, reason: "User flagged via chat UI" }),
      });
    } catch {
      // silent — UI already shows "Reported"
    }
  }

  function toggleListening() {
    const SR = (typeof window !== "undefined") &&
      ((window as unknown as { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
       (window as unknown as { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition);
    if (!SR) {
      alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.start();
    setListening(true);
  }

  async function sendPastorQuestion(e: React.FormEvent) {
    e.preventDefault();
    setPSending(true);
    setPError("");
    try {
      const res = await fetch("/api/ask-pastor", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: pName, email: pEmail, question: pQuestion }),
      });
      if (!res.ok) throw new Error();
      setPSent(true);
    } catch {
      setPError("Something went wrong. Please try again.");
    } finally {
      setPSending(false);
    }
  }

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Ask the Scripture Lives Assistant"
        className="fixed z-50 flex items-center justify-center shadow-xl transition hover:scale-105 active:scale-95"
        style={{
          bottom:       "76px",   // above mobile bottom nav
          right:        "16px",
          width:        "60px",
          height:       "60px",
          borderRadius: "50%",
          background:   NAVY,
          border:       `2px solid ${GOLD}`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Bible-teacher.png"
          alt="Scripture Lives Assistant"
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
            (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
          }}
        />
        <span
          className="text-2xl absolute inset-0 items-center justify-center rounded-full"
          style={{ display: "none", background: NAVY }}
        >
          📖
        </span>
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div
          className="fixed z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            bottom:      "148px",
            right:       "16px",
            width:       "min(380px, calc(100vw - 32px))",
            height:      "min(520px, calc(100vh - 180px))",
            background:  "#faf8f3",
            border:      `1px solid #ede8de`,
            boxShadow:   "0 8px 40px rgba(0,0,0,0.18)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.3)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Bible-teacher.png"
              alt=""
              className="w-9 h-9 rounded-full object-cover shrink-0"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-sm leading-tight">Scripture Lives Assistant</p>
              <p className="text-xs" style={{ color: GOLD }}>Scripture Lives</p>
            </div>
            {/* Tab switcher */}
            <div className="flex gap-1">
              <button
                onClick={() => setView("chat")}
                className="text-[10px] font-black px-2 py-1 rounded-full transition"
                style={view === "chat" ? { background: GOLD, color: NAVY } : { color: "rgba(255,255,255,0.6)" }}
              >
                Ask
              </button>
              <button
                onClick={() => setView("pastor")}
                className="text-[10px] font-black px-2 py-1 rounded-full transition"
                style={view === "pastor" ? { background: GOLD, color: NAVY } : { color: "rgba(255,255,255,0.6)" }}
              >
                Pastor
              </button>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white opacity-60 hover:opacity-100 transition text-lg leading-none ml-1"
            >
              ✕
            </button>
          </div>

          {/* ── Chat view ── */}
          {view === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "assistant" && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src="/Bible-teacher.png"
                        alt=""
                        className="w-7 h-7 rounded-full object-cover shrink-0 self-end"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <div className="flex flex-col gap-1 max-w-[85%]">
                      <div
                        className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                        style={
                          m.role === "user"
                            ? { background: NAVY, color: "white", borderBottomRightRadius: "4px" }
                            : { background: "white", color: "#3a3025", border: "1px solid #ede8de", borderBottomLeftRadius: "4px" }
                        }
                      >
                        {m.content}
                      </div>
                      {/* Flag button for assistant messages */}
                      {m.role === "assistant" && m.id && (
                        <div className="flex justify-start pl-1">
                          {flagged[i] ? (
                            <span className="text-[10px]" style={{ color: "#9ca3af" }}>Reported</span>
                          ) : (
                            <button
                              onClick={() => flagMessage(i, m.id)}
                              className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-100"
                              style={{ color: "#9ca3af" }}
                              title="Report this message"
                            >
                              🚩
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-7 h-7 rounded-full shrink-0" style={{ background: "#ede8de" }} />
                    <div className="rounded-2xl px-4 py-3 text-sm" style={{ background: "white", border: "1px solid #ede8de" }}>
                      <span className="flex gap-1 items-center" style={{ color: "#9ca3af" }}>
                        <span className="animate-bounce" style={{ animationDelay: "0ms" }}>•</span>
                        <span className="animate-bounce" style={{ animationDelay: "150ms" }}>•</span>
                        <span className="animate-bounce" style={{ animationDelay: "300ms" }}>•</span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="shrink-0 px-3 py-3" style={{ borderTop: "1px solid #ede8de", background: "white" }}>
                <p className="text-[10px] mb-2 text-center" style={{ color: "#9ca3af" }}>
                  Conversations are saved to improve our service and ensure safety.
                </p>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={toggleListening}
                    title={listening ? "Stop listening" : "Speak your question"}
                    className="px-2.5 py-2 rounded-xl text-sm transition shrink-0"
                    style={{
                      background: listening ? "#fee2e2" : "#f5f2ec",
                      color:      listening ? "#dc2626" : "#9ca3af",
                      border:     listening ? "1px solid #fca5a5" : "1px solid #ede8de",
                    }}
                  >
                    {listening ? "⏹" : "🎤"}
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={listening ? "Listening…" : "Ask about Scripture…"}
                    className="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
                    style={{ background: "#f5f2ec", color: "#3a3025", border: `1px solid ${listening ? GOLD : "#ede8de"}` }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    className="px-3 py-2 rounded-xl text-sm font-black transition hover:opacity-90 disabled:opacity-40"
                    style={{ background: GOLD, color: NAVY }}
                  >
                    →
                  </button>
                </div>
                <button
                  onClick={() => setView("pastor")}
                  className="w-full mt-2 text-center text-[11px] font-semibold transition hover:opacity-70"
                  style={{ color: "#9ca3af" }}
                >
                  Have a personal question? Ask a real Pastor →
                </button>
              </div>
            </>
          )}

          {/* ── Pastor view ── */}
          {view === "pastor" && (
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {pSent ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <span className="text-5xl">🙏</span>
                  <p className="font-black text-lg" style={{ color: NAVY }}>Question Sent!</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                    A pastor will reach out to you at <strong>{pEmail}</strong> personally.
                  </p>
                  <button
                    onClick={() => { setPSent(false); setPName(""); setPEmail(""); setPQuestion(""); setView("chat"); }}
                    className="px-5 py-2 rounded-xl text-sm font-black transition hover:opacity-90"
                    style={{ background: GOLD, color: NAVY }}
                  >
                    Back to Chat
                  </button>
                </div>
              ) : (
                <form onSubmit={sendPastorQuestion} className="flex flex-col gap-3">
                  <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: GOLD }}>
                    Ask a Real Pastor
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>
                    For personal questions, spiritual guidance, or anything you&apos;d rather discuss one-on-one — a real pastor will respond to you by email.
                  </p>

                  <input
                    required
                    type="text"
                    placeholder="Your name"
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="text-sm px-3 py-2.5 rounded-xl outline-none w-full"
                    style={{ background: "#f5f2ec", color: "#3a3025", border: "1px solid #ede8de" }}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Your email"
                    value={pEmail}
                    onChange={(e) => setPEmail(e.target.value)}
                    className="text-sm px-3 py-2.5 rounded-xl outline-none w-full"
                    style={{ background: "#f5f2ec", color: "#3a3025", border: "1px solid #ede8de" }}
                  />
                  <textarea
                    required
                    placeholder="What's on your heart?"
                    value={pQuestion}
                    onChange={(e) => setPQuestion(e.target.value)}
                    rows={4}
                    className="text-sm px-3 py-2.5 rounded-xl outline-none w-full resize-none"
                    style={{ background: "#f5f2ec", color: "#3a3025", border: "1px solid #ede8de" }}
                  />
                  {pError && <p className="text-xs text-red-500">{pError}</p>}
                  <button
                    type="submit"
                    disabled={pSending}
                    className="py-2.5 rounded-xl text-sm font-black transition hover:opacity-90 disabled:opacity-50"
                    style={{ background: NAVY, color: GOLD }}
                  >
                    {pSending ? "Sending…" : "Send to Pastor →"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
