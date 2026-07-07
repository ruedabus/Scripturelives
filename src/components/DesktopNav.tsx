"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

const NAV_LINKS = [
  { href: "/bible",       label: "Bible"       },
  { href: "/devotionals", label: "Devotionals" },
  { href: "/prayer",      label: "Prayer"      },
  { href: "/community",   label: "Community"   },
  { href: "/kids",        label: "Kids"        },
  { href: "/games",       label: "Games"       },
];

const MORE_LINKS = [
  { href: "/music",         label: "🎵 Worship Music"  },
  { href: "/gospel",        label: "✝️ The Gospel"      },
  { href: "/find-a-church", label: "⛪ Find a Church"  },
  { href: "/tournament",    label: "🏆 Bible Bowl"      },
  { href: "/leaderboard",   label: "📊 Leaderboard"     },
  { href: "/shop",          label: "🛍️ Shop"            },
  { href: "/donate",        label: "❤️ Donate"          },
  { href: "/about",         label: "ℹ️ About"           },
  { href: "/contact",       label: "✉️ Contact"         },
  { href: "/es/gospel",     label: "🇪🇸 En Español"     },
];

export default function DesktopNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header
      className="hidden md:flex items-center justify-between sticky top-0 z-50"
      style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.2)`, padding: "0 1.5rem", height: 56 }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Hand-painted cross_logo.png" alt="Scripture Lives" style={{ width: 32, height: 32, objectFit: "contain" }} />
        <span style={{ color: GOLD, fontWeight: 900, fontSize: "0.95rem", letterSpacing: "0.02em" }}>
          Scripture Lives
        </span>
      </Link>

      {/* Primary nav links */}
      <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href || (pathname.startsWith(href) && href !== "/");
          return (
            <Link key={href} href={href}
              style={{
                padding: "0.35rem 0.85rem", borderRadius: 20, textDecoration: "none",
                fontWeight: active ? 800 : 500, fontSize: "0.875rem",
                color: active ? NAVY : "rgba(255,255,255,0.85)",
                background: active ? GOLD : "transparent",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
            >
              {label}
            </Link>
          );
        })}

        {/* More dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMoreOpen(o => !o)}
            style={{ padding: "0.35rem 0.85rem", borderRadius: 20, border: "none", cursor: "pointer",
              fontWeight: 500, fontSize: "0.875rem", color: "rgba(255,255,255,0.85)",
              background: moreOpen ? "rgba(255,255,255,0.1)" : "transparent" }}>
            More ▾
          </button>
          {moreOpen && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 40 }}
                onClick={() => setMoreOpen(false)}
              />
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50,
                background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                minWidth: 200, overflow: "hidden", border: "1px solid #eee" }}>
                {MORE_LINKS.map(({ href, label }) => (
                  <Link key={href} href={href} onClick={() => setMoreOpen(false)}
                    style={{ display: "block", padding: "0.6rem 1rem", textDecoration: "none",
                      color: "#333", fontSize: "0.875rem", fontWeight: 500 }}
                    onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = "#f5f0e8")}
                    onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = "transparent")}>
                    {label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
