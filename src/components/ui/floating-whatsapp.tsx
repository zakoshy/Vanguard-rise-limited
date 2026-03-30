'use client';

import { Icons } from "@/components/icons";

/**
 * A floating WhatsApp contact button that appears in the bottom right corner.
 */
export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/254795472495"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[100] transition-all duration-300 hover:scale-110 active:scale-95 drop-shadow-2xl group"
      aria-label="Contact us on WhatsApp"
    >
      <div className="bg-[#25D366] text-white p-4 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/20">
        <Icons.whatsapp className="h-7 w-7" />
      </div>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
        Chat with us
      </span>
    </a>
  );
}
