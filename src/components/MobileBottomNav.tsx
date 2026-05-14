"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

const NAV_ITEMS = [
  { href: "/bible",       icon: "📖", label: "Bible"       },
  { href: "/devotionals", icon: "🌅", label: "Devotionals" },
  { href: "/prayer",      icon: "🙏", label: "Prayer"      },
  { href: "/kids",        icon: "📚", label: "Kids"        },
  { href: "/games",       icon: "🎮", label: "Games"       },
];

const MORE_ITEMS = [
  { href: "/",             icon: "🏠", label: "Home"          },
  { href: "/gospel",       icon: "✝️",  label: "The Gospel"    },
  { href: "/find-a-church",icon: "⛪", label: "Find a Church"  },
  { href: "/shop",         icon: "🛍️", label: "Shop"          },
  { href: "/es/gospel",    icon: "🇪🇸", label: "En Español"    },
  { href: "/about",        icon: "ℹ️",  label: "About"         },
  { href: "/contact",      icon: "✉️",  label: "Contact"       },
  { href: "/donate",       icon: "❤️",  label: "Donate"        },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Drawer overlay ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Slide-up drawer ── */}
      <div
        className="fixed left-0 right-0 z-50 md:hidden transition-transform duration-300"
        style={{
          bottom: open ? "56px" : "-100%",
          background: NAVY,
          borderTop: `2px solid ${GOLD}`,
          borderRadius: "20px 20px 0 0",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: GOLD }}>
            More
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-white opacity-60 hover:opacity-100 text-lg leading-none"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1 px-3 pb-5">
          {MORE_ITEMS.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-opacity hover:opacity-80"
              style={{
                background: "rgba(255,255,255,0.07)",
                opacity: pathname === href ? 1 : 0.8,
              }}
            >
              <span className="text-2xl leading-none">{icon}</span>
              <span className="text-[9px] font-black uppercase tracking-wide text-center leading-tight" style={{ color: pathname === href ? GOLD : "white" }}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom nav bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: NAVY,
          borderTop: `1px solid rgba(201,149,42,0.25)`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex items-stretch justify-around">
          {NAV_ITEMS.map(({ href, icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 transition-opacity relative"
                style={{ opacity: active ? 1 : 0.55 }}
              >
                <span className="text-xl leading-none">{icon}</span>
                <span
                  className="text-[9px] font-black uppercase tracking-wide leading-none"
                  style={{ color: active ? GOLD : "white" }}
                >
                  {label}
                </span>
                {active && (
                  <span
                    className="absolute bottom-0 w-8 h-0.5 rounded-full"
                    style={{ background: GOLD }}
                  />
                )}
              </Link>
            );
          })}

          {/* Hamburger — More */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 transition-opacity relative"
            style={{ opacity: open ? 1 : 0.55 }}
          >
            {/* Hamburger icon */}
            <span className="flex flex-col gap-[3px] items-center justify-center w-5 h-5">
              <span className="block w-4 h-[2px] rounded-full" style={{ background: "white" }} />
              <span className="block w-4 h-[2px] rounded-full" style={{ background: "white" }} />
              <span className="block w-4 h-[2px] rounded-full" style={{ background: "white" }} />
            </span>
            <span
              className="text-[9px] font-black uppercase tracking-wide leading-none"
              style={{ color: open ? GOLD : "white" }}
            >
              More
            </span>
            {open && (
              <span
                className="absolute bottom-0 w-8 h-0.5 rounded-full"
                style={{ background: GOLD }}
              />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
