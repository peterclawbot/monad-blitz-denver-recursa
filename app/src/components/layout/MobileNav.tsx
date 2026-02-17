"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Repeat, Vault, PieChart, BarChart3 } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/loop", label: "Loop", icon: Repeat },
  { href: "/vaults", label: "Vaults", icon: Vault },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/analytics", label: "Stats", icon: BarChart3 },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-text-muted active:text-text"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
