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

  if (keyValue === "NO_KEY_AVAILABLE") {
    return (
      <div className="bg-(--bg-dark) border border-yellow-500/10 rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mx-auto mb-4">
          <Lock size={24} className="opacity-50" />
        </div>
        <p className="text-yellow-500 font-bold text-sm uppercase tracking-widest mb-2">
          Your Order is confirmed,
        </p>
        <p className="text-yellow-500 font-bold text-sm uppercase tracking-widest mb-2">
          Key Not Assigned Yet
        </p>
        {/* <p className="text-gray-500 text-[10px] leading-relaxed max-w-[200px] mx-auto">
          We're currently restocking this product. You'll be notified as soon as your key is ready.
        </p> */}
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="bg-(--bg-dark) border border-(--bg-less-dark) rounded-2xl p-4 flex items-center justify-between">
        <div className="flex-1 font-mono text-sm tracking-wider">
          {revealed ? (
            <span className="text-(--accent) select-all animate-in fade-in duration-300">
              {keyValue}
            </span>
          ) : (
            <div className="flex items-center opacity-20">
              XXXXX-XXXXX-XXXXX-XXXXX
            </div>
          )}
        </div>
        <button
          onClick={() => setRevealed(!revealed)}
          className="p-2 cursor-pointer hover:bg-(--text-main)/5 rounded-lg transition-colors text-gray-500 hover:text-(--text-main)"
        >
          {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <button
        onClick={copyToClipboard}
        className={`w-full cursor-pointer py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${copied
          ? "bg-green-500/20 text-(--accent) border border-green-500/30"
          : "bg-(--accent) text-(--bg-dark) hover:bg-(--accent)"
          }`}
      >
        {copied ? (
          <>
            <Check size={16} />
            Copied
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
