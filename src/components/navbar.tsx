"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Home", link: "/" },
  { label: "Documentation", link: "/documentation" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile: Standard header */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.header
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:hidden bg-white/80 backdrop-blur-md border-b border-black/5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/">
              <span className="font-sans text-2xl font-semibold tracking-tight text-black">
                Crypto<span className="font-doto">Byte</span>
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-12 h-12 bg-neutral-100 rounded-xl flex flex-col items-center justify-center gap-1.5 shadow-sm hover:bg-neutral-200 transition-colors"
              aria-label="Toggle Menu"
            >
              <div className="w-5 h-[1.5px] bg-black"></div>
              <div className="w-5 h-[1.5px] bg-black"></div>
            </button>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile: Floating pill */}
      <AnimatePresence>
        {isScrolled && (
          <motion.header
            className="fixed top-4 left-0 right-0 z-50 flex justify-center md:hidden pointer-events-none"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-neutral-200/50 px-4 py-2.5 rounded-full shadow-lg flex items-center gap-4">
              <Link href="/">
                <span className="font-sans text-lg font-semibold tracking-tight text-black">
                  Crypto<span className="font-doto">Byte</span>
                </span>
              </Link>
              <div className="w-px h-5 bg-neutral-300"></div>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="w-9 h-9 bg-neutral-100 rounded-full flex flex-col items-center justify-center gap-1 hover:bg-neutral-200 transition-colors"
                aria-label="Toggle Menu"
              >
                <div className="w-4 h-[1.5px] bg-black"></div>
                <div className="w-4 h-[1.5px] bg-black"></div>
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Desktop: Standard header */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.header
            className="fixed top-0 left-0 right-0 z-40 hidden md:flex items-center justify-between px-12 md:px-24 lg:px-32 py-6 bg-white border-b border-black/5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/" className="font-sans text-2xl font-semibold tracking-tight text-black">
              Crypto<span className="font-doto">Byte</span>
            </Link>
            <Link
              href="/documentation"
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === "/documentation"
                  ? "text-black"
                  : "text-neutral-500 hover:text-black"
              )}
            >
              See Documentation
            </Link>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Desktop: Floating pill */}
      <AnimatePresence>
        {isScrolled && (
          <motion.header
            className="fixed top-6 left-0 right-0 z-50 hidden md:flex justify-center pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="pointer-events-auto bg-neutral-100/80 backdrop-blur-xl border border-white/20 p-1.5 rounded-full shadow-sm flex items-center gap-1">
              <Link href="/" className="flex items-center gap-2 pl-4 pr-4">
                <div className="font-semibold tracking-tight text-lg text-black">Crypto<span className="font-doto">Byte</span></div>
              </Link>

              <div className="w-px h-4 bg-neutral-300 mx-2"></div>

              {menuItems.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <Link
                    key={item.label}
                    href={item.link}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-white text-black shadow-sm"
                        : "text-neutral-600 hover:text-black"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={menuItems}
      />
    </>
  );
}
