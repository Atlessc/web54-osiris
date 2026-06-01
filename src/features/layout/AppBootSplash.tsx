"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPLASH_STORAGE_KEY = "osiris:boot-splash-complete";
const SPLASH_DURATION_MS = 3000;

export default function AppBootSplash() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const hasCompletedSplash =
      window.sessionStorage.getItem(SPLASH_STORAGE_KEY) === "true";

    if (hasCompletedSplash) {
      setShouldShow(false);
      return;
    }

    setShouldShow(true);

    const splashTimer = window.setTimeout(() => {
      setShouldShow(false);
      window.sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(splashTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at center, #0a0a14 0%, var(--bg-void) 70%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(212,175,55,0.015) 2px, rgba(212,175,55,0.015) 4px)",
              animation: "splashScanDrift 8s linear infinite",
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute top-6 left-6 z-[2] font-mono text-[10px] tracking-[0.3em] text-[var(--gold-primary)]"
          >
            V4.2
          </motion.div>

          <div className="relative z-[2] mb-8 flex h-40 w-40 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 0.8, ease: "easeOut" },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              }}
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(212,175,55,0.2)" }}
            >
              <div
                className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: "var(--gold-primary)",
                  boxShadow:
                    "0 0 12px var(--gold-primary), 0 0 24px rgba(212,175,55,0.3)",
                }}
              />

              <div
                className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full"
                style={{
                  background: "rgba(212,175,55,0.5)",
                  boxShadow: "0 0 6px rgba(212,175,55,0.3)",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.4, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: -360 }}
              transition={{
                opacity: { duration: 0.6, delay: 0.15 },
                scale: { duration: 0.8, delay: 0.15, ease: "easeOut" },
                rotate: { duration: 12, repeat: Infinity, ease: "linear" },
              }}
              className="absolute rounded-full"
              style={{
                inset: "18px",
                border: "1px solid rgba(0,229,255,0.15)",
              }}
            >
              <div
                className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full"
                style={{
                  background: "var(--cyan-primary)",
                  boxShadow:
                    "0 0 10px var(--cyan-primary), 0 0 20px rgba(0,229,255,0.2)",
                }}
              />

              <div
                className="absolute bottom-0 left-1/4 h-1 w-1 translate-y-1/2 rounded-full"
                style={{ background: "rgba(0,229,255,0.4)" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{
                opacity: { duration: 0.6, delay: 0.3 },
                scale: { duration: 0.8, delay: 0.3, ease: "easeOut" },
                rotate: { duration: 7, repeat: Infinity, ease: "linear" },
              }}
              className="absolute rounded-full"
              style={{
                inset: "40px",
                border: "1px solid rgba(212,175,55,0.25)",
              }}
            >
              <div
                className="absolute left-1/4 top-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
                style={{
                  background: "var(--gold-primary)",
                  boxShadow: "0 0 8px var(--gold-primary)",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.4,
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="relative flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                border: "2px solid var(--gold-primary)",
                boxShadow:
                  "0 0 20px rgba(212,175,55,0.15), inset 0 0 20px rgba(212,175,55,0.05)",
              }}
            >
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="h-5 w-5 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0.05) 70%)",
                }}
              />

              <div
                className="absolute h-full w-px"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(212,175,55,0.3), transparent)",
                }}
              />

              <div
                className="absolute h-px w-full"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0], rotate: [0, 360] }}
              transition={{
                opacity: { duration: 3, repeat: Infinity },
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                delay: 0.6,
              }}
              className="absolute inset-[10px] rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(212,175,55,0.15) 40deg, transparent 80deg)",
              }}
            />
          </div>

          <div className="z-[2] mb-3 flex items-center gap-[2px]">
            {"OSIRIS".split("").map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 0.5 + index * 0.08,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="font-mono text-4xl font-bold tracking-[0.5em] md:text-5xl"
                style={{
                  color: "var(--text-heading)",
                  textShadow: "0 0 30px rgba(212,175,55,0.2)",
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <div className="z-[2] mb-8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeInOut" }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p
                className="font-mono text-[10px] tracking-[0.5em] text-[var(--gold-primary)] md:text-[11px]"
                style={{ opacity: 0.8 }}
              >
                LOCAL INTELLIGENCE WORKSPACE
              </p>
            </motion.div>
          </div>

          <div className="z-[2] w-64 md:w-80">
            <div
              className="relative h-[2px] w-full overflow-hidden rounded-full"
              style={{ background: "rgba(212,175,55,0.1)" }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: ["0%", "25%", "50%", "78%", "100%"] }}
                transition={{
                  duration: 2.2,
                  delay: 0.5,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: "easeInOut",
                }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--gold-primary), var(--cyan-primary), var(--gold-primary))",
                  boxShadow: "0 0 12px rgba(212,175,55,0.4)",
                }}
              />
            </div>

            <div className="mt-3 flex h-4 items-center justify-center">
              {[
                { text: "BOOTING LOCAL RUNTIME...", delay: 0.5 },
                { text: "INITIALIZING WORKSPACE...", delay: 1.1 },
                { text: "CHECKING SOURCES...", delay: 1.7 },
                { text: "SYSTEM READY", delay: 2.2 },
              ].map((stage, index) => (
                <motion.span
                  key={stage.text}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    delay: stage.delay,
                    duration: 0.6,
                    times: [0, 0.1, 0.7, 1],
                  }}
                  className="absolute font-mono text-[9px] tracking-[0.25em]"
                  style={{
                    color:
                      index === 3
                        ? "var(--cyan-primary)"
                        : "var(--text-muted)",
                  }}
                >
                  {stage.text}
                </motion.span>
              ))}
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-[0]"
            style={{ opacity: 0.03 }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          {[
            { t: "10px", l: "10px", bw: "2px 0 0 2px" },
            { t: "10px", r: "10px", bw: "2px 2px 0 0" },
            { b: "10px", l: "10px", bw: "0 0 2px 2px" },
            { b: "10px", r: "10px", bw: "0 2px 2px 0" },
          ].map((pos, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              className="absolute z-[2] h-8 w-8"
              style={{
                top: pos.t,
                bottom: pos.b,
                left: pos.l,
                right: pos.r,
                borderWidth: pos.bw,
                borderStyle: "solid",
                borderColor: "var(--gold-primary)",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}