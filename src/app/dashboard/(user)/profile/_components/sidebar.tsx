"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProfileNavItem = {
  label: string;
  href: string;
  // A rendered icon element (e.g. `<Home className="h-5 w-5 shrink-0" />`),
  // not a component reference — this sidebar is a client component and
  // receives `items` from an async server component (layout.tsx), which
  // can only pass serializable data / React elements across that boundary,
  // not raw function/component references.
  icon: React.ReactNode;
  badge?: number;
};

export default function ProfileSidebar({ items }: { items: ProfileNavItem[] }) {
  // Start expanded on desktop, but collapse to icon-only width on mobile
  // (< 640px) once mounted so the sidebar doesn't eat the whole screen.
  // The initial server render always uses `open=true`, so this flips
  // client-side right after mount on narrow viewports — suppressHydrationWarning
  // on the <aside> below silences the resulting (expected) mismatch warning.
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.innerWidth < 640) setOpen(false);
  }, []);

  return (
    <aside
      suppressHydrationWarning
      className={cn(
        "flex flex-col border-r bg-[oklch(0.96_0.0025_228.78)] dark:bg-[#221F1F] transition-all duration-200 ",
        open ? "w-60" : "w-14",
      )}
    >
      <div
        className={cn(
          "flex h-12 items-center px-2",
          open ? "justify-end" : "justify-center",
        )}
      >
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle sidebar"
          className="rounded-md p-2 text-primary dark:text-background dark:bg-[#F49F1D] hover:bg-muted hover:text-foreground"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        {items.map(({ label, href, icon, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={!open ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-150 text-primary dark:text-[#F49F1D] hover:scale-105 hover:font-semibold origin-left",
                open ? "justify-start" : "justify-center",
                active ? "bg-muted font-medium" : "hover:bg-muted",
              )}
            >
              {icon}
              {open && (
                <span className="flex flex-1 items-center justify-between truncate">
                  <span className="truncate">{label}</span>
                  {badge !== undefined && badge > 0 && (
                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold leading-none text-primary-foreground tabular-nums">
                      {badge}
                    </span>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
