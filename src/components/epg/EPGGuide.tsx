"use client";

import React from "react";
import { EPGProgram } from "@/types/techstream";

interface EPGGuideProps {
  programs?: EPGProgram[];
}

export default function EPGGuide({ programs = [] }: EPGGuideProps) {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-4 text-white">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <span>📅</span> Ratiba ya Vipindi (EPG)
      </h3>
      {programs.length === 0 ? (
        <p className="text-sm text-slate-400">Hakuna taarifa za ratiba kwa sasa.</p>
      ) : (
        <div className="space-y-2">
          {programs.map((prog, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div>
                <p className="font-semibold text-sm">{prog.title}</p>
                <p className="text-xs text-slate-400">{prog.description}</p>
              </div>
              <span className="text-xs bg-red-600 px-2 py-1 rounded">
                {prog.startTime} - {prog.endTime}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
