"use client";

import React, { useState } from "react";
import { AlertTriangle, X, CheckCircle } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  channelId: string;
  channelName: string;
  onClose: () => void;
}

export default function ReportModal({ isOpen, channelId, channelName, onClose }: ReportModalProps) {
  const [issueType, setIssueType] = useState<string>("NO_VIDEO");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId,
          issueType,
          comment,
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    } catch {
      // Error handling
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mb-2 animate-bounce" />
            <h3 className="text-sm font-bold text-white">Taarifa Imepokelewa!</h3>
            <p className="text-xs text-zinc-400 mt-1">Timu yetu inaifanyia kazi mara moja.</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-extrabold text-white">Ripoti Tatizo la Stream</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Chaneli: <span className="text-white font-semibold">{channelName}</span>
            </p>

            <div className="space-y-2 mb-4">
              {[
                { id: "NO_VIDEO", label: "Picha haionekani / Screen Nyeusi" },
                { id: "NO_AUDIO", label: "Sauti haitoki" },
                { id: "BUFFERING", label: "Inakwama-kwama (Buffering)" },
                { id: "WRONG_CHANNEL", label: "Chaneli hailingani na Jina" },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    issueType === item.id
                      ? "bg-red-950/40 border-red-600 text-white font-bold"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="issue"
                    checked={issueType === item.id}
                    onChange={() => setIssueType(item.id)}
                    className="accent-red-600"
                  />
                  {item.label}
                </label>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Maelezo ya ziada (Hiari)..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 mb-4 focus:outline-none focus:border-red-600 resize-none h-20"
            />

            <button
              onClick={handleSubmit}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Tuma Taarifa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
