import { redirect } from "next/navigation";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

type ChatLog = {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  flagged: boolean;
  flag_reason: string | null;
  created_at: string;
};

async function fetchChatLogs(): Promise<ChatLog[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return [];

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/chat_logs?order=created_at.desc&limit=200`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function groupBySession(logs: ChatLog[]): Map<string, ChatLog[]> {
  const map = new Map<string, ChatLog[]>();
  // logs are already ordered desc; we want sessions in order of most recent activity
  for (const log of logs) {
    if (!map.has(log.session_id)) {
      map.set(log.session_id, []);
    }
    map.get(log.session_id)!.push(log);
  }
  return map;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ChatLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const params = await searchParams;
  const adminKey = process.env.ADMIN_KEY;

  // Password protection
  if (!adminKey || params.key !== adminKey) {
    redirect("/");
  }

  const logs = await fetchChatLogs();
  const sessions = groupBySession(logs);
  const totalFlagged = logs.filter((l) => l.flagged).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f6f1", fontFamily: "sans-serif" }}>
      {/* Nav bar */}
      <header style={{ background: NAVY, borderBottom: `2px solid ${GOLD}` }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <a
            href="/"
            style={{ color: GOLD, fontWeight: 900, fontSize: "14px", textDecoration: "none", letterSpacing: "0.05em" }}
          >
            ← Home
          </a>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>|</span>
          <span style={{ color: "white", fontWeight: 900, fontSize: "14px" }}>Chat Logs Admin</span>
          <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
            {logs.length} messages · {sessions.size} sessions
            {totalFlagged > 0 && (
              <span style={{ marginLeft: "8px", background: "#ef4444", color: "white", borderRadius: "9999px", padding: "1px 8px", fontSize: "11px", fontWeight: 700 }}>
                {totalFlagged} flagged
              </span>
            )}
          </span>
        </div>
      </header>

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "24px 20px" }}>
        {sessions.size === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>📭</p>
            <p style={{ fontSize: "16px" }}>No chat logs yet.</p>
          </div>
        ) : (
          Array.from(sessions.entries()).map(([sessionId, sessionLogs]) => {
            const hasFlagged = sessionLogs.some((l) => l.flagged);
            const earliest = sessionLogs[sessionLogs.length - 1]?.created_at;
            const latest = sessionLogs[0]?.created_at;
            const truncatedId = sessionId.slice(0, 8) + "…" + sessionId.slice(-4);

            return (
              <details
                key={sessionId}
                style={{
                  marginBottom: "12px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: hasFlagged ? "2px solid #ef4444" : "1px solid #ede8de",
                  background: "white",
                }}
              >
                <summary
                  style={{
                    padding: "14px 18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: hasFlagged ? "#fef2f2" : "#faf8f3",
                    listStyle: "none",
                    userSelect: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: NAVY,
                      background: hasFlagged ? "#fee2e2" : "#f0ece2",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    {truncatedId}
                  </span>
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                    {formatDate(earliest)} – {latest !== earliest ? formatDate(latest) : ""}
                  </span>
                  <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "auto" }}>
                    {sessionLogs.length} msg{sessionLogs.length !== 1 ? "s" : ""}
                  </span>
                  {hasFlagged && (
                    <span
                      style={{
                        background: "#ef4444",
                        color: "white",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "9999px",
                      }}
                    >
                      FLAGGED
                    </span>
                  )}
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>▼</span>
                </summary>

                <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {/* Show messages in chronological order (reversed from desc) */}
                  {[...sessionLogs].reverse().map((log) => (
                    <div
                      key={log.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: log.flagged
                          ? "#fef2f2"
                          : log.role === "user"
                          ? "#f0f4ff"
                          : "#f8f6f0",
                        border: log.flagged
                          ? "1px solid #fca5a5"
                          : log.role === "user"
                          ? "1px solid #c7d2fe"
                          : "1px solid #ede8de",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: log.role === "user" ? "#4f46e5" : GOLD,
                            background: log.role === "user" ? "#e0e7ff" : "#fef3c7",
                            padding: "1px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {log.role}
                        </span>
                        <span style={{ fontSize: "10px", color: "#9ca3af" }}>{formatDate(log.created_at)}</span>
                        {log.flagged && (
                          <span style={{ fontSize: "10px", color: "#ef4444", fontWeight: 700 }}>
                            🚩 {log.flag_reason ?? "Flagged"}
                          </span>
                        )}
                        <span
                          style={{
                            marginLeft: "auto",
                            fontFamily: "monospace",
                            fontSize: "9px",
                            color: "#d1d5db",
                          }}
                        >
                          {log.id.slice(0, 8)}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "13px", color: "#3a3025", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                        {log.content}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            );
          })
        )}
      </main>
    </div>
  );
}
