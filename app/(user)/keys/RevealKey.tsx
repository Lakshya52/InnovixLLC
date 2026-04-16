"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, Copy, Check } from "lucide-react";

export default function RevealKey({ keyValue }: { keyValue: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(keyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="bg-(--bg-dark) border border-(--bg-less-dark) rounded-2xl p-4 flex items-center justify-between">
        <div className="flex-1 font-mono text-sm tracking-wider">
          {revealed ? (
            <span className="text-(--accent) select-all animate-in fade-in duration-300">
              {keyValue}
            </span>
          ) : (
            <div className="flex items-center gap-1 opacity-20">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  {i < 3 && <span className="mx-1 mt-[-2px]">,</span>}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setRevealed(!revealed)}
          className="p-2 hover:bg-(--text-main)/5 rounded-lg transition-colors text-gray-500 hover:text-(--text-main)"
        >
          {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <button
        onClick={copyToClipboard}
        className={`w-full py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
          copied 
            ? "bg-green-500/20 text-(--accent) border border-green-500/30" 
            : "bg-(--accent) text-(--bg-dark) hover:bg-(--accent)"
        }`}
      >
        {copied ? (
          <>
            <Check size={16} />
            Copied to Clipboard
          </>
        ) : (
          <>
            <Lock size={16} />
            {revealed ? "Copy License Key" : "Reveal & Copy Key"}
          </>
        )}
      </button>
    </div>
  );
}
