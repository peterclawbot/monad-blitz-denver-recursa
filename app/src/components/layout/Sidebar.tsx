"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Repeat,
  Vault,
  PieChart,
  BarChart3,
  BookOpen,
  Settings,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/loop", label: "Loop", icon: Repeat },
  { href: "/vaults", label: "Vaults", icon: Vault },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const bottomItems = [
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <aside className="w-64 bg-surface border-r border-border flex flex-col shrink-0 h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onMobileClose}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Repeat className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Recursa<span className="text-primary">AI</span>
          </span>
        </Link>
        {/* Mobile close button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-surface-light text-text-muted hover:text-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative block"
              onClick={onMobileClose}
            >
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-text bg-surface-light"
                    : "text-text-secondary hover:text-text hover:bg-surface-light/50"
                }`}
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <item.icon className="w-5 h-5 shrink-0" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "text-text bg-surface-light"
                  : "text-text-secondary hover:text-text hover:bg-surface-light/50"
              }`}
              onClick={onMobileClose}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Protocol stats */}
      <div className="px-4 py-4 border-t border-border">
        <div className="bg-surface-light rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">TVL</span>
            <span className="text-text font-mono">$12.4M</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Users</span>
            <span className="text-text font-mono">1,248</span>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile sidebar — drawer with backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
