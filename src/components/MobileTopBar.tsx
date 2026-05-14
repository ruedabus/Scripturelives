"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const GOLD  = "#C9952A";
const NAVY  = "#1a2640";

// ── Page title map ─────────────────────────────────────────────────────────
const TITLES: Record<string, string> = {
  "/":                 "Scripture Lives",
  "/bible":            "Bible Reader",
  "/devotionals":      "Devotionals",
  "/prayer":           "Prayer Wall",
  "/kids":             "Kids Stories",
  "/games":            "Bible Games",
  "/gospel":           "The Gospel",
  "/shop":             "Shop",
  "/find-a-church":    "Find a Church",
  "/about":            "About",
  "/contact":          "Contact",
  "/donate":           "Donate",
  "/tournament":       "Bible Bowl",
  "/leaderboard":      "Leaderboard",
  "/es/gospel":        "El Evangelio",
  "/es/devotionals":   "Devocionales",
  "/es/prayer":        "Muro de Oración",
  "/es/kids":          "Para Niños",
  "/es/find-a-church": "Encontrar Iglesia",
};

function getTitle(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/devotionals/")) return "Devotional";
  if (pathname.startsWith("/es/devotionals/")) return "Devocional";
  return "Scripture Lives";
}

// ── Back destination map ───────────────────────────────────────────────────
function getBack(pathname: string): string | null {
  if (pathname === "/") return null;
  if (pathname.startsWith("/devotionals/")) return "/devotionals";
  if (pathname.startsWith("/es/devotionals/")) return "/es/devotionals";
  if (pathname.startsWith("/es/")) return "/";
  return "/";
}

// ── Menu items ─────────────────────────────────────────────────────────────
const MENU = [
  { href: "/",              icon: "🏠", label: "Home"           },
  { href: "/bible",         icon: "📖", label: "Bible Reader"   },
  { href: "/devotionals",   icon: "🌅", label: "Devotionals"    },
  { href: "/prayer",        icon: "🙏", label: "Prayer Wall"    },
  { href: "/kids",          icon: "📚", label: "Kids Stories"   },
  { href: "/games",         icon: "🎮", label: "Bible Games"    },
  { href: "/gospel",        icon: "✝️",  label: "The Gospel"     },
  { href: "/find-a-church", icon: "⛪", label: "Find a Church"  },
  { href: "/shop",          icon: "🛍️", label: "Shop"           },
  { href: "/donate",        icon: "❤️",  label: "Donate"         },
  { href: "/about",         icon: "ℹ️",  label: "About"          },
  { href: "/contact",       icon: "✉️",  label: "Contact"        },
  { href: "/es/gospel",     icon: "🇪🇸", label: "En Español"     },
];

export default function MobileTopBar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen]   = useState(false);

  const backHref = getBack(pathname);
  const title    = getTitle(pathname);
  const isHome   = pathname === "/";

  return (
    <>
      {/* ── Full-screen menu overlay ── */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[60] md:hidden"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed top-0 right-0 bottom-0 z-[70] md:hidden flex flex-col overflow-y-auto"
            style={{ width: "78vw", maxWidth: 300, background: NAVY, boxShadow: "-4px 0 24px rgba(0,0,0,0.4)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: `1px solid rgba(201,149,42,0.25)` }}>
              <span className="font-black text-sm" style={{ color: GOLD }}>Menu</span>
              <button onClick={() => setOpen(false)} className="text-white text-xl opacity-70 hover:opacity-100">✕</button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col py-3">
              {MENU.map(({ href, icon, label }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 px-5 py-3.5 transition-opacity hover:opacity-80"
                    style={{
                      background: active ? "rgba(201,149,42,0.12)" : "transparent",
                      borderLeft: active ? `3px solid ${GOLD}` : "3px solid transparent",
                    }}
                  >
                    <span className="text-xl w-7 text-center">{icon}</span>
                    <span className="text-sm font-bold" style={{ color: active ? GOLD : "white" }}>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}

      {/* ── Top bar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between md:hidden"
        style={{
          height: 52,
          background: NAVY,
          borderBottom: `1px solid rgba(201,149,42,0.25)`,
          paddingLeft: 4,
          paddingRight: 12,
        }}
      >
        {/* Left — back button or home spacer */}
        <div style={{ width: 52 }}>
          {backHref ? (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-12 h-12 transition-opacity hover:opacity-70"
              aria-label="Go back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          ) : (
            // On home, show a small cross logo
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/Hand-painted cross_logo.png" alt="" className="w-9 h-9 ml-2 object-contain select-none" />
          )}
        </div>

        {/* Center — page title */}
        <span className="text-sm font-black tracking-wide" style={{ color: isHome ? GOLD : "white" }}>
          {title}
        </span>

        {/* Right — hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col gap-[5px] items-center justify-center w-10 h-10 transition-opacity hover:opacity-70"
          aria-label="Open menu"
        >
          <span className="block w-5 h-[2px] rounded-full bg-white" />
          <span className="block w-5 h-[2px] rounded-full bg-white" />
          <span className="block w-5 h-[2px] rounded-full bg-white" />
        </button>
      </header>

      {/* Spacer so content doesn't hide under fixed bar */}
      <div className="h-[52px] md:hidden" />
    </>
  );
}
