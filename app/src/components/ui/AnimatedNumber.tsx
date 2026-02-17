"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  className = "",
  duration = 1.5,
}: AnimatedNumberProps) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) =>
    `${prefix}${v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`
  );
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => setText(v));
    return unsubscribe;
  }, [display]);

  return (
    <motion.span
      ref={ref}
      className={`font-mono tabular-nums ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {text}
    </motion.span>
  );
}
