"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

const NAV_ITEMS = [
  { href: "/bible",        icon: "📖", label: "Bible"       },
  { href: "/devotionals",  icon: "🌅", label: "Devotionals" },
  { href: "/prayer",       icon: "🙏", label: "Prayer"      },
  { href: "/kids",         icon: "📚", label: "Kids"        },
  { href: "/games",        icon: "🎮", label: "Games"       },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on the welcome page itself so it doesn't clutter the landing
  if (pathname === "/") return null;

  return (
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
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 transition-opacity"
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
      </div>
    </nav>
  );
}
