"use client";

import React, { useState } from "react";
import { Trophy, Calendar, Bell, Play, Shield, Flame, Check } from "lucide-react";

interface Match {
  id: string;
  sport: string;
  league: string;
  teamA: string;
  teamB: string;
  teamALogo?: string;
  teamBLogo?: string;
  time: string;
  status: "LIVE" | "UPCOMING" | "FINISHED";
  scoreA?: number;
  scoreB?: number;
}

export function SportsCenter() {
  const [activeSport, setActiveSport] = useState("All");
  const [reminders, setReminders] = useState<string[]>([]);

  const matches: Match[] = [
    {
      id: "m1",
      sport: "Football",
      league: "NBC Premier League",
      teamA: "Simba SC",
      teamB: "Yanga SC",
      time: "LIVE 68'",
      status: "LIVE",
      scoreA: 1,
      scoreB: 1
    },
    {
      id: "m2",
      sport: "Football",
      league: "English Premier League",
      teamA: "Arsenal",
      teamB: "Chelsea",
      time: "Today 22:00",
      status: "UPCOMING"
    },
    {
      id: "m3",
      sport: "Basketball",
      league: "NBA Live",
      teamA: "Lakers",
      teamB: "Warriors",
      time: "Tomorrow 04:00",
      status: "UPCOMING"
    }
  ];

  const toggleReminder = (matchId: string) => {
    if (reminders.includes(matchId)) {
      setReminders(reminders.filter(id => id !== matchId));
    } else {
      setReminders([...reminders, matchId]);
      alert("Match reminder set successfully!");
    }
  };

  return (
    <div className="space-y-4 font-sans select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-black uppercase text-white tracking-wider">TechStream Sports Center</h2>
        </div>
        <span className="text-[10px] font-black uppercase bg-indigo-950 border border-indigo-800 text-indigo-400 px-2.5 py-0.5 rounded-full">
          LIVE MATCHES
        </span>
      </div>

      {/* Sports Filter */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar">
        {["All", "Football", "Basketball", "Tennis", "Motorsport"].map((sport) => (
          <button
            key={sport}
            onClick={() => setActiveSport(sport)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${activeSport === sport ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Match Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {matches.map((m) => {
          const isReminded = reminders.includes(m.id);

          return (
            <div key={m.id} className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 border-b border-zinc-800/80 pb-2">
                <span className="uppercase text-indigo-400 tracking-wider">{m.league}</span>
                <span className={`px-2 py-0.5 rounded-md font-black ${m.status === 'LIVE' ? 'bg-red-950 text-red-400 border border-red-800/60 animate-pulse' : 'bg-zinc-800 text-zinc-300'}`}>
                  {m.time}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center font-black text-xs text-white">
                    {m.teamA.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-white">{m.teamA}</span>
                </div>

                {m.status === 'LIVE' ? (
                  <div className="text-sm font-black text-amber-400 px-2">
                    {m.scoreA} - {m.scoreB}
                  </div>
                ) : (
                  <span className="text-[10px] font-extrabold text-zinc-500 uppercase">VS</span>
                )}

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-white">{m.teamB}</span>
                  <div className="w-8 h-8 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center font-black text-xs text-white">
                    {m.teamB.charAt(0)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {m.status === 'LIVE' ? (
                  <button className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs uppercase py-2.5 rounded-xl shadow-lg flex items-center justify-center space-x-2">
                    <Play className="w-3.5 h-3.5" />
                    <span>Watch Match Live</span>
                  </button>
                ) : (
                  <button
                    onClick={() => toggleReminder(m.id)}
                    className={`w-full font-bold text-xs py-2 rounded-xl border transition-all flex items-center justify-center space-x-2 ${isReminded ? 'bg-emerald-950 border-emerald-700 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'}`}
                  >
                    {isReminded ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                    <span>{isReminded ? "Reminder Set" : "Set Reminder"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
