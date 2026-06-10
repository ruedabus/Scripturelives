import type { Metadata } from "next";
import { getDownloadSummary, getRecentDownloads, getDailyTotals } from "@/lib/downloads";

export const metadata: Metadata = { title: "Download Stats | Admin" };
export const dynamic = "force-dynamic"; // always fresh data

const GOLD = "#C9952A";
const NAVY = "#1a2640";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

export default async function DownloadsAdminPage() {
  const [summary, recent, daily] = await Promise.all([
    getDownloadSummary(),
    getRecentDownloads(50),
    getDailyTotals(30),
  ]);

  const totalAll = summary.reduce((s, b) => s + b.total, 0);
  const last7Days = daily.slice(-7).reduce((s, d) => s + d.total, 0);
  const maxDaily  = Math.max(...daily.map(d => d.total), 1);

  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: NAVY, borderRadius: 12, padding: "1.5rem 2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ color: GOLD, margin: 0, fontSize: "1.5rem", fontWeight: 800 }}>📚 Ebook Downloads</h1>
            <p style={{ color: "#aaa", margin: "4px 0 0", fontSize: "0.85rem" }}>Faith Tails — scripturelives.com</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: GOLD, fontSize: "2rem", fontWeight: 800 }}>{totalAll}</div>
            <div style={{ color: "#aaa", fontSize: "0.8rem" }}>total downloads</div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Last 7 days",    value: last7Days },
            { label: "Books tracked",  value: summary.length },
            { label: "This month",     value: daily.reduce((s, d) => s + d.total, 0) },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 10, padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: NAVY }}>{value}</div>
              <div style={{ fontSize: "0.8rem", color: "#888", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Per-book totals */}
        <div style={{ background: "#fff", borderRadius: 10, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1rem", color: NAVY }}>Downloads by Book</h2>
          {summary.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.9rem" }}>No downloads recorded yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  {["Book", "Downloads", "Last Download"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#888", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary.map((b, i) => (
                  <tr key={b.slug} style={{ background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                    <td style={{ padding: "10px 8px", color: NAVY, fontWeight: 500 }}>{b.title}</td>
                    <td style={{ padding: "10px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ height: 8, width: `${Math.round((b.total / (summary[0]?.total || 1)) * 120)}px`, background: GOLD, borderRadius: 4 }} />
                        <span style={{ fontWeight: 700, color: NAVY }}>{b.total}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 8px", color: "#666", fontSize: "0.8rem" }}>
                      {b.last_download ? fmt(b.last_download) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Daily bar chart (last 30 days) */}
        <div style={{ background: "#fff", borderRadius: 10, padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1rem", color: NAVY }}>Daily Activity — Last 30 Days</h2>
          {daily.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.9rem" }}>No data yet.</p>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 100 }}>
              {daily.map(d => (
                <div key={d.date} title={`${d.date}: ${d.total} downloads`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", background: GOLD, borderRadius: "3px 3px 0 0", height: `${Math.round((d.total / maxDaily) * 80)}px`, minHeight: 2 }} />
                  {daily.length <= 10 && (
                    <span style={{ fontSize: "0.6rem", color: "#999", transform: "rotate(-45deg)", whiteSpace: "nowrap" }}>{d.date.slice(5)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent downloads table */}
        <div style={{ background: "#fff", borderRadius: 10, padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1rem", color: NAVY }}>Recent Downloads</h2>
          {recent.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.9rem" }}>No downloads yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  {["Book", "When", "Country"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#888", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                    <td style={{ padding: "8px", color: NAVY }}>{r.book_title ?? r.book_slug}</td>
                    <td style={{ padding: "8px", color: "#555" }}>{fmt(r.downloaded_at)}</td>
                    <td style={{ padding: "8px", color: "#555" }}>{r.country ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p style={{ textAlign: "center", color: "#bbb", fontSize: "0.75rem", marginTop: "1.5rem" }}>
          scripturelives.com/admin/downloads — for internal use only
        </p>
      </div>
    </main>
  );
}
