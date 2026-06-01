"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Database,
  Home,
  Map,
  Radar,
  Search,
  Settings,
  ShieldAlert,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Map",
    href: "/map",
    icon: Map,
  },
  {
    label: "Feed",
    href: "/feed",
    icon: Activity,
  },
  {
    label: "Signals",
    href: "/signals",
    icon: Radar,
  },
  {
    label: "Sources",
    href: "/sources",
    icon: Database,
  },
  {
    label: "Search",
    href: "/search",
    icon: Search,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppNavbar() {
  const pathname = usePathname();

  const isMapRoute = pathname === "/map" || pathname.startsWith("/map/");

  return (
    <header
      className={[
        "fixed left-0 right-0 top-0 z-[900]",
        "border-b border-[rgba(212,175,55,0.18)]",
        "bg-[rgba(6,6,12,0.82)] backdrop-blur-xl",
        "supports-[backdrop-filter]:bg-[rgba(6,6,12,0.72)]",
      ].join(" ")}
    >
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-primary)]"
          aria-label="OSIRIS home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.08)] shadow-[0_0_24px_rgba(212,175,55,0.08)]">
            <ShieldAlert
              aria-hidden="true"
              className="h-5 w-5 text-[var(--gold-primary)]"
            />
          </div>

          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-bold tracking-[0.32em] text-[var(--gold-primary)]">
              OSIRIS
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[rgba(245,245,245,0.55)]">
              Local Intelligence
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "group flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-primary)]",
                  active
                    ? "bg-[rgba(212,175,55,0.14)] text-[var(--gold-primary)] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.18)]"
                    : "text-[rgba(245,245,245,0.68)] hover:bg-white/[0.06] hover:text-white",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[rgba(0,255,170,0.22)] bg-[rgba(0,255,170,0.06)] px-3 py-1.5 text-xs text-[rgba(245,245,245,0.72)] md:flex">
            <span className="h-2 w-2 rounded-full bg-[var(--alert-green)] shadow-[0_0_10px_var(--alert-green)]" />
            <span className="uppercase tracking-[0.18em]">Local</span>
          </div>

          {isMapRoute ? (
            <span className="hidden rounded-full border border-[rgba(0,224,255,0.24)] bg-[rgba(0,224,255,0.08)] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[var(--cyan-primary)] md:inline-flex">
              Map Runtime
            </span>
          ) : null}
        </div>
      </nav>

      <div className="flex gap-1 overflow-x-auto border-t border-white/[0.06] px-3 py-2 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActiveRoute(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs transition",
                active
                  ? "bg-[rgba(212,175,55,0.14)] text-[var(--gold-primary)]"
                  : "text-[rgba(245,245,245,0.65)] hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}