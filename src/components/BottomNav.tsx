"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, Radio, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Mwanzo", path: "/", icon: Home },
    { name: "Movies", path: "/movies", icon: Film },
    { name: "Series", path: "/series", icon: Tv },
    { name: "Live TV", path: "#", icon: Radio }, // Link imetolewa, imebaki tupu (#)
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-3 left-3 right-3 max-w-md mx-auto bg-neutral-900/95 backdrop-blur-2xl border border-neutral-800/90 px-3 py-2.5 flex justify-around items-center z-[9999] rounded-2xl shadow-2xl pointer-events-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.path && item.path !== "#";
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.path}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 w-16 h-12 rounded-xl ${
              isActive
                ? "text-red-500 font-bold scale-105 bg-red-500/10 shadow-inner"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
            <span className="text-[9px]">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
