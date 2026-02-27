"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import DecryptedText from "@/components/DecryptedText";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <DecryptedText
        text="404"
        animateOn="view"
        speed={80}
        maxIterations={20}
        className="text-8xl md:text-9xl font-bold tracking-tighter text-black mb-4"
        encryptedClassName="text-8xl md:text-9xl font-bold tracking-tighter text-neutral-300 mb-4"
      />
      
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-neutral-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Button asChild className="rounded-xl bg-black text-white hover:bg-neutral-800 gap-2">
        <Link href="/">
          <MoveLeft size={16} />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
