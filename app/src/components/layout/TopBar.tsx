"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ChevronDown, Bell, Zap, LogOut, Copy, Check, AlertTriangle, Menu } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { isConnected, isConnecting, isCorrectChain, isSwitching, shortAddress, address, balance, connectWallet, switchToMonad, disconnect } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
    {/* Wrong chain banner */}
    {isConnected && !isCorrectChain && (
      <div className="bg-warning/10 border-b border-warning/30 px-4 sm:px-6 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-warning min-w-0">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="truncate">Wrong network — switch to Monad</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={switchToMonad}
          disabled={isSwitching}
          className="px-3 py-1 rounded-lg text-xs font-semibold bg-warning text-black hover:bg-warning/90 transition-colors disabled:opacity-50 shrink-0"
        >
          {isSwitching ? "Switching..." : "Switch"}
        </motion.button>
      </div>
    )}
    <header className="h-14 sm:h-16 bg-surface border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 gap-2">
      {/* Left: Hamburger (mobile) + Network */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-surface-light text-text-secondary hover:text-text transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-light text-sm">
          <div className={`w-2 h-2 rounded-full ${isConnected && !isCorrectChain ? 'bg-warning' : 'bg-accent'} pulse-dot`} />
          <span className="text-text-secondary">{isConnected && !isCorrectChain ? 'Wrong Network' : 'Monad'}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Gas indicator — hide on small mobile */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light text-sm text-text-secondary">
          <Zap className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-xs">0.001</span>
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg bg-surface-light text-text-secondary hover:text-text transition-colors"
        >
          <Bell className="w-4 h-4" />
        </motion.button>

        {/* Connect Wallet */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (isConnected) {
                setShowDropdown(!showDropdown);
              } else {
                connectWallet();
              }
            }}
            disabled={isConnecting}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isConnected
                ? "bg-surface-light text-text border border-border hover:border-border-light"
                : isConnecting
                ? "bg-surface-light text-text-muted"
                : "bg-primary text-white hover:bg-primary-dark glow-primary"
            }`}
          >
            <Wallet className="w-4 h-4" />
            {isConnected ? (
              <>
                <span className="font-mono">{shortAddress}</span>
                {balance && (
                  <span className="hidden sm:inline text-text-muted text-xs font-mono">
                    {(Number(balance.value) / 10 ** balance.decimals).toFixed(3)} {balance.symbol}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            ) : isConnecting ? (
              "Connecting..."
            ) : (
              <span className="hidden xs:inline">Connect</span>
            )}
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {showDropdown && isConnected && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl overflow-hidden z-50"
              >
                <button
                  onClick={() => {
                    copyAddress();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-surface-light transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy Address"}
                </button>
                <button
                  onClick={() => {
                    disconnect();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-surface-light transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Disconnect
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
    </>
  );
}
