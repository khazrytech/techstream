import Link from "next/link";
import { Home, Film, Tv, Radio, User } from "lucide-react";

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 border-t border-zinc-800 backdrop-blur-md py-2 px-4 flex justify-around items-center z-50">
      <Link href="/" className="flex flex-col items-center text-red-500 space-y-1">
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Mwanzo</span>
      </Link>
      <Link href="/movies" className="flex flex-col items-center text-zinc-400 hover:text-white space-y-1">
        <Film className="w-5 h-5" />
        <span className="text-[10px]">Movies</span>
      </Link>
      <Link href="/series" className="flex flex-col items-center text-zinc-400 hover:text-white space-y-1">
        <Tv className="w-5 h-5" />
        <span className="text-[10px]">Series</span>
      </Link>
      <Link href="/iptv" className="flex flex-col items-center text-zinc-400 hover:text-white space-y-1">
        <Radio className="w-5 h-5" />
        <span className="text-[10px]">Live TV</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center text-zinc-400 hover:text-white space-y-1">
        <User className="w-5 h-5" />
        <span className="text-[10px]">Profile</span>
      </Link>
    </div>
  );
}
