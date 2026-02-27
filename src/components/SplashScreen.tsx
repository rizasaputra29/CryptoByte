"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import DecryptedText from "./DecryptedText";

export function SplashScreen() {
  const [showSplash, setShowSplash] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (!hasSeenSplash) {
      const startTimer = setTimeout(() => {
        setShowSplash(true);
        setIsFirstLoad(true);
      }, 0);
      
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("hasSeenSplash", "true");
      }, 2500);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(timer);
      };
    }
  }, []);

  if (!isFirstLoad) return null;

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center">
              <DecryptedText
                text="Welcome to Crypto"
                animateOn="view"
                speed={70}
                maxIterations={25}
                sequential={true}
                revealDirection="center"
                className="text-4xl md:text-5xl font-bold tracking-tight text-black"
                encryptedClassName="text-4xl md:text-5xl font-bold tracking-tight text-black"
              />
              <DecryptedText
                text="Byte"
                animateOn="view"
                speed={70}
                maxIterations={25}
                sequential={true}
                revealDirection="center"
                className="text-4xl md:text-5xl font-bold tracking-tight text-black font-doto"
                encryptedClassName="text-4xl md:text-5xl font-bold tracking-tight text-black font-doto"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="h-1 w-12 rounded-full bg-black mt-2"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
